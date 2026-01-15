from ultralytics import YOLO
import cv2
import os
import json
import hashlib
from datetime import datetime
from pathlib import Path

class MedicalDetector:
    def __init__(self, model_path='runs/train/lung_opacity_detection/weights/best.pt'):
        """
        Initialize the medical detector with trained YOLOv8 model
        """
        print(f"Loading model from: {model_path}")
        self.model = YOLO(model_path)
        self.model_path = model_path
    
    def predict(self, image_path, patient_metadata=None):
        """
        Run inference on a chest X-ray image and return standardized JSON
        """
        # Check if image exists
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image not found at {image_path}")
        
        print(f"Running inference on image: {image_path}")
        
        # Run inference
        results = self.model(image_path, save=False)
        result = results[0]
        
        # Process detections
        detections = []
        for det in result.boxes:
            class_id = int(det.cls[0])
            confidence = float(det.conf[0])
            bbox = det.xyxy[0].tolist()  # x1, y1, x2, y2
            
            detection = {
                "label": "lung_opacity",
                "confidence": round(confidence, 4),
                "bbox": [round(coord, 2) for coord in bbox]  # x1, y1, x2, y2
            }
            detections.append(detection)
        
        # Create standardized JSON output
        output = {
            "detections": detections,
            "image_metadata": {
                "filename": Path(image_path).name,
                "image_size": {
                    "width": result.orig_img.shape[1],
                    "height": result.orig_img.shape[0]
                }
            }
        }
        
        # Add patient metadata if provided
        if patient_metadata:
            output["patient_metadata"] = patient_metadata
            
            # Generate cryptographic hash for audit trail
            timestamp = datetime.utcnow().isoformat()
            output["timestamp"] = timestamp
            
            # Create hash input
            hash_input = f"{patient_metadata.get('patient_id', '')}_{len(detections)}_{timestamp}"
            output["audit_hash"] = hashlib.sha256(hash_input.encode()).hexdigest()
        
        return output
    
    def analyze_with_explanation(self, image_path, patient_metadata=None):
        """
        Enhanced analysis with LLM-generated clinical explanation
        """
        # Get standard detection results
        results = self.predict(image_path, patient_metadata)
        
        # Generate clinical explanation (mock LLM integration)
        detections = results["detections"]
        
        if not detections:
            explanation = "No lung opacities detected. Chest X-ray appears normal."
        else:
            count = len(detections)
            confidences = [d["confidence"] for d in detections]
            avg_confidence = sum(confidences) / len(confidences)
            
            explanation = f"Detected {count} lung opacity{"s" if count > 1 else ""} with average confidence of {avg_confidence:.1%}. "
            explanation += "Findings suggest possible pneumonia or other pulmonary pathology. Clinical correlation recommended."
        
        results["clinical_explanation"] = explanation
        return results

def run_inference(image_path, model_path='runs/train/lung_opacity_detection/weights/best.pt', output_path='output'):
    """
    Backward compatible function - now wraps the MedicalDetector class
    """
    detector = MedicalDetector(model_path)
    
    try:
        # Run prediction
        results = detector.predict(image_path)
        
        # Create output directory
        os.makedirs(output_path, exist_ok=True)
        
        # Save JSON results
        image_filename = Path(image_path).stem
        json_output_path = os.path.join(output_path, f"detection_results_{image_filename}.json")
        
        with open(json_output_path, 'w') as f:
            json.dump(results, f, indent=2)
        
        print(f"\nJSON results saved to: {json_output_path}")
        
        # Also save annotated image for visualization
        results_obj = detector.model(image_path, save=False)[0]
        annotated_img = results_obj.plot()
        output_image_path = os.path.join(output_path, f"inference_result_{image_filename}.jpg")
        cv2.imwrite(output_image_path, annotated_img)
        print(f"Annotated image saved to: {output_image_path}")
        
        # Print results
        print("\n=== DETECTION RESULTS ===")
        for i, det in enumerate(results["detections"]):
            print(f"Detection {i+1}:")
            print(f"  Label: {det['label']}")
            print(f"  Confidence: {det['confidence']:.4f}")
            bbox = det['bbox']
            print(f"  Bounding Box: [x1:{bbox[0]}, y1:{bbox[1]}, x2:{bbox[2]}, y2:{bbox[3]}]")
        
        return results
        
    except Exception as e:
        print(f"Error during inference: {e}")
        return None

if __name__ == "__main__":
    # Example usage (this will fail if no test image exists, but that's OK for now)
    print("YOLOv8 Inference Script")
    print("Note: To run inference, place a test image in the appropriate location and update the path below.")
    
    # Example usage with a placeholder path
    # run_inference('data/images/test/your_test_image.jpg')