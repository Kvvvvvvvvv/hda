# YOLOv8 Lung Opacity Detection

This project implements a YOLOv8 object detection model for detecting lung opacities in chest X-ray images.

## Project Structure

```
yolov8_training/
├── data/
│   ├── images/
│   │   ├── train/
│   │   ├── val/
│   │   └── test/
│   ├── labels/
│   │   ├── train/
│   │   ├── val/
│   │   └── test/
├── dataset.yaml
├── train.py
├── test.py
├── inference.py
└── README.md
```

## Setup

1. Install required dependencies:

```bash
pip install ultralytics opencv-python matplotlib torch torchvision
```

2. Prepare your dataset:
   - Place chest X-ray images in the appropriate folders (`data/images/train`, `data/images/val`, `data/images/test`)
   - Create corresponding label files in YOLO format (.txt) in the `data/labels` folders
   - Labels should be in the format: `<class_id> <x_center> <y_center> <width> <height>` (normalized coordinates 0-1)
   - For this project, class_id `0` corresponds to `lung_opacity`

## Training

To train the model:

```bash
python train.py
```

This will:
- Load the pretrained `yolov8n.pt` model
- Train for 30 epochs with image size 640 and batch size 8
- Save the best model to `runs/train/lung_opacity_detection/weights/best.pt`

## Evaluation

To evaluate the trained model:

```bash
python test.py
```

This will:
- Load the trained model
- Evaluate on the validation set
- Print metrics including mAP@0.5, mAP@0.5-0.95, precision, recall, and F1-score
- Generate evaluation plots

## Inference

### Command Line Interface
To run inference on a single image:

```bash
python inference.py
```

For inference on a specific image:

```python
run_inference('path/to/your/test/image.jpg')
```

### Python API
Use the MedicalDetector class for programmatic access:

```python
from inference import MedicalDetector

detector = MedicalDetector()

# Standard detection with JSON output
results = detector.predict('path/to/image.jpg')

# Enhanced analysis with clinical explanation
patient_metadata = {
    'patient_id': 'PAT001',
    'age': 65,
    'gender': 'M'
}
results = detector.analyze_with_explanation('path/to/image.jpg', patient_metadata)
```

### FastAPI Web Service
Start the API server:

```bash
python api.py
```

Access the interactive API documentation at: `http://localhost:8000/docs`

Available endpoints:
- `POST /analyze` - Full analysis with patient metadata and clinical explanation
- `POST /predict` - Simple prediction without metadata
- `GET /health` - Health check endpoint

Example API usage:
```bash
curl -X POST "http://localhost:8000/analyze" \
  -H "Content-Type: multipart/form-data" \
  -F "image=@chest_xray.jpg" \
  -F "patient_id=PAT001" \
  -F "age=65" \
  -F "gender=M"
```

All inference methods will:
- Load the trained model
- Run inference on the specified image
- Return standardized JSON output
- Generate cryptographic audit hashes
- Optionally provide clinical explanations

## Output Format

All inference methods return standardized JSON in the HealVision format:

```json
{
  "detections": [
    {
      "label": "lung_opacity",
      "confidence": 0.9345,
      "bbox": [120.5, 85.2, 245.8, 198.7]
    }
  ],
  "image_metadata": {
    "filename": "chest_xray.jpg",
    "image_size": {
      "width": 640,
      "height": 640
    }
  },
  "patient_metadata": {
    "patient_id": "PAT001",
    "age": 65,
    "gender": "M"
  },
  "timestamp": "2026-01-15T20:59:18.870442",
  "audit_hash": "4dce48cdfc4f002c9c2976bed574b4abcc5021e4638264635431d7e5ccd646cc",
  "clinical_explanation": "Detected 1 lung opacity with average confidence of 93.5%. Findings suggest possible pneumonia. Clinical correlation recommended."
}
```

## Dataset Format

The dataset follows the YOLO format:
- Images: `.jpg` or `.png` files
- Labels: `.txt` files with one object per line in the format:
  ```
  <class_id> <x_center> <y_center> <width> <height>
  ```
  All coordinates are normalized between 0 and 1.

The `dataset.yaml` file specifies:
- Path to the data directory
- Locations of train, validation, and test splits
- Number of classes (`nc: 1`)
- Class names (`names: ['lung_opacity']`)

## Model Configuration

- Base model: `yolov8n.pt` (pretrained)
- Image size: 640x640
- Epochs: 30
- Batch size: 8
- Device: CPU (can be changed to GPU if available)