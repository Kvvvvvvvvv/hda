from ultralytics import YOLO
import os

def train_model():
    """
    Train YOLOv8 model for lung opacity detection
    """
    print("Starting YOLOv8 model training...")
    
    # Load a model (pretrained)
    model = YOLO('yolov8n.pt')  # Load a pretrained model
    
    # Train the model
    results = model.train(
        data='dataset.yaml',  # Path to dataset.yaml
        epochs=30,            # Number of epochs
        imgsz=640,            # Image size
        batch=8,              # Batch size
        save=True,            # Save checkpoints
        project='runs/train', # Save directory
        name='lung_opacity_detection',  # Run name
        exist_ok=True,        # Overwrite existing
        device='cpu'          # Use CPU
    )
    
    print("Training completed!")
    print(f"Model saved to: {results.save_dir}")
    
    return model

if __name__ == "__main__":
    trained_model = train_model()