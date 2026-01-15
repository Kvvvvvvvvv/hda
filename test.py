from ultralytics import YOLO
import matplotlib.pyplot as plt
import numpy as np

def evaluate_model(model_path='runs/train/lung_opacity_detection/weights/best.pt'):
    """
    Evaluate the trained YOLOv8 model
    """
    print("Loading trained model for evaluation...")
    
    # Load the trained model
    model = YOLO(model_path)
    
    # Validate the model
    print("Starting model validation...")
    metrics = model.val(
        data='dataset.yaml',
        imgsz=640,
        batch=8,
        save_txt=False,
        save_conf=False,
        plots=True,  # Generate evaluation plots
        device='cpu'
    )
    
    # Print evaluation metrics
    print("\n=== EVALUATION RESULTS ===")
    print(f"mAP@0.5: {metrics.box.map50:.4f}")
    print(f"mAP@0.5-0.95: {metrics.box.map:.4f}")
    print(f"Mean Precision: {metrics.box.mp:.4f}")
    print(f"Mean Recall: {metrics.box.mr:.4f}")
    print(f"F1-Score: {metrics.box.f1[0]:.4f}")
    
    # Additional metrics
    print(f"\nPer-class metrics:")
    print(f"Class 0 (lung_opacity) - AP@0.5: {metrics.box.ap50[0]:.4f}, AP@0.5-0.95: {metrics.box.ap[0]:.4f}")
    
    # Print confusion matrix
    print(f"\nConfusion Matrix: {metrics.confusion_matrix.matrix}")
    
    print("\nEvaluation completed!")
    
    return metrics

if __name__ == "__main__":
    evaluation_results = evaluate_model()