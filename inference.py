from ultralytics import YOLO
import cv2
import os
from pathlib import Path

def run_inference(image_path, model_path='runs/train/lung_opacity_detection/weights/best.pt', output_path='output'):
    """
    Run inference on a single chest X-ray image
    """
    print(f"Loading model from: {model_path}")
    
    # Load the trained model
    model = YOLO(model_path)
    
    # Check if image exists
    if not os.path.exists(image_path):
        print(f"Error: Image not found at {image_path}")
        return None
    
    print(f"Running inference on image: {image_path}")
    
    # Run inference
    results = model(image_path, save=False)
    
    # Create output directory if it doesn't exist
    os.makedirs(output_path, exist_ok=True)
    
    # Process results
    result = results[0]
    detections = []
    
    print("\n=== DETECTION RESULTS ===")
    for i, det in enumerate(result.boxes):
        class_id = int(det.cls[0])
        confidence = float(det.conf[0])
        bbox = det.xyxy[0].tolist()  # x1, y1, x2, y2
        
        # Convert to x_center, y_center, width, height for YOLO format
        x_center = (bbox[0] + bbox[2]) / 2 / result.orig_img.shape[1]  # Normalize
        y_center = (bbox[1] + bbox[3]) / 2 / result.orig_img.shape[0]
        width = (bbox[2] - bbox[0]) / result.orig_img.shape[1]
        height = (bbox[3] - bbox[1]) / result.orig_img.shape[0]
        
        detection_info = {
            'class_id': class_id,
            'class_name': 'lung_opacity',
            'confidence': confidence,
            'bbox_xyxy': bbox,  # x1, y1, x2, y2
            'bbox_normalized': [x_center, y_center, width, height]
        }
        
        detections.append(detection_info)
        
        print(f"Detection {i+1}:")
        print(f"  Class: {detection_info['class_name']}")
        print(f"  Confidence: {detection_info['confidence']:.4f}")
        print(f"  Bounding Box (x1,y1,x2,y2): [{bbox[0]:.2f}, {bbox[1]:.2f}, {bbox[2]:.2f}, {bbox[3]:.2f}]")
        print(f"  Normalized BBox: [{x_center:.4f}, {y_center:.4f}, {width:.4f}, {height:.4f}]")
    
    # Draw bounding boxes on the image
    annotated_img = result.plot()  # This draws the bounding boxes
    
    # Save the output image
    image_filename = Path(image_path).stem
    output_image_path = os.path.join(output_path, f"inference_result_{image_filename}.jpg")
    cv2.imwrite(output_image_path, annotated_img)
    
    print(f"\nAnnotated image saved to: {output_image_path}")
    
    # Save detection results to a text file
    output_txt_path = os.path.join(output_path, f"detection_results_{image_filename}.txt")
    with open(output_txt_path, 'w') as f:
        f.write("DETECTION RESULTS\n")
        f.write("==================\n")
        for i, det in enumerate(detections):
            f.write(f"Detection {i+1}:\n")
            f.write(f"  Class: {det['class_name']}\n")
            f.write(f"  Confidence: {det['confidence']:.4f}\n")
            f.write(f"  Bounding Box: [{det['bbox_xyxy'][0]:.2f}, {det['bbox_xyxy'][1]:.2f}, {det['bbox_xyxy'][2]:.2f}, {det['bbox_xyxy'][3]:.2f}]\n")
            f.write(f"  Normalized: [{det['bbox_normalized'][0]:.4f}, {det['bbox_normalized'][1]:.4f}, {det['bbox_normalized'][2]:.4f}, {det['bbox_normalized'][3]:.4f}]\n\n")
    
    print(f"Detection results saved to: {output_txt_path}")
    
    return detections

if __name__ == "__main__":
    # Example usage (this will fail if no test image exists, but that's OK for now)
    print("YOLOv8 Inference Script")
    print("Note: To run inference, place a test image in the appropriate location and update the path below.")
    
    # Example usage with a placeholder path
    # run_inference('data/images/test/your_test_image.jpg')