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

To run inference on a single image:

```bash
python inference.py
```

For inference on a specific image, modify the script to specify the image path:

```python
run_inference('path/to/your/test/image.jpg')
```

This will:
- Load the trained model
- Run inference on the specified image
- Draw bounding boxes on detected lung opacities
- Save the annotated image and detection results

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