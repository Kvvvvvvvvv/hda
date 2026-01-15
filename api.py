from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any
import uvicorn
import tempfile
import os
from inference import MedicalDetector
import json

app = FastAPI(title="HealVision Medical Imaging API", 
              description="YOLOv8-based lung opacity detection for chest X-rays",
              version="1.0.0")

# Global model instance
detector = MedicalDetector()

class PatientMetadata(BaseModel):
    patient_id: str
    age: Optional[int] = None
    gender: Optional[str] = None
    study_id: Optional[str] = None
    clinical_indication: Optional[str] = None

class AnalysisRequest(BaseModel):
    patient_metadata: PatientMetadata
    include_explanation: bool = True

@app.get("/")
async def root():
    return {"message": "HealVision Medical Imaging API", 
            "version": "1.0.0",
            "status": "active"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": True}

@app.post("/analyze")
async def analyze_xray(
    image: UploadFile = File(...),
    patient_id: str = Form(...),
    age: Optional[int] = Form(None),
    gender: Optional[str] = Form(None),
    study_id: Optional[str] = Form(None),
    clinical_indication: Optional[str] = Form(None),
    include_explanation: bool = Form(True)
):
    """
    Analyze a chest X-ray image for lung opacities
    
    Args:
        image: Uploaded chest X-ray image file
        patient_id: Unique patient identifier
        age: Patient age (optional)
        gender: Patient gender (optional)
        study_id: Study/Radiology order ID (optional)
        clinical_indication: Reason for exam (optional)
        include_explanation: Whether to include LLM-generated clinical explanation
    
    Returns:
        JSON with detections, metadata, and optional clinical explanation
    """
    try:
        # Validate image file
        if not image.content_type.startswith('image/'):
            return JSONResponse(
                status_code=400,
                content={"error": "Invalid file type. Please upload an image file."}
            )
        
        # Create temporary file for processing
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp_file:
            content = await image.read()
            tmp_file.write(content)
            tmp_file_path = tmp_file.name
        
        try:
            # Prepare patient metadata
            patient_metadata = {
                "patient_id": patient_id,
                "age": age,
                "gender": gender,
                "study_id": study_id,
                "clinical_indication": clinical_indication
            }
            
            # Run analysis
            if include_explanation:
                results = detector.analyze_with_explanation(tmp_file_path, patient_metadata)
            else:
                results = detector.predict(tmp_file_path, patient_metadata)
            
            return JSONResponse(content=results)
            
        finally:
            # Clean up temporary file
            os.unlink(tmp_file_path)
            
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Analysis failed: {str(e)}"}
        )

@app.post("/predict")
async def predict_xray(image: UploadFile = File(...)):
    """
    Simple prediction endpoint without patient metadata
    
    Args:
        image: Uploaded chest X-ray image file
    
    Returns:
        JSON with detections only
    """
    try:
        # Validate image file
        if not image.content_type.startswith('image/'):
            return JSONResponse(
                status_code=400,
                content={"error": "Invalid file type. Please upload an image file."}
            )
        
        # Create temporary file for processing
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp_file:
            content = await image.read()
            tmp_file.write(content)
            tmp_file_path = tmp_file.name
        
        try:
            # Run prediction
            results = detector.predict(tmp_file_path)
            return JSONResponse(content=results)
            
        finally:
            # Clean up temporary file
            os.unlink(tmp_file_path)
            
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Prediction failed: {str(e)}"}
        )

if __name__ == "__main__":
    print("Starting HealVision API server...")
    print("API Documentation available at: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)