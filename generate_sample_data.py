"""
Script to generate sample chest X-ray data for testing the YOLOv8 model.
This creates synthetic images with simulated lung opacity regions.
"""
import numpy as np
import cv2
import os
from pathlib import Path
from PIL import Image

def create_synthetic_chest_xray(width=640, height=640, has_opacity=False, opacity_position=None, opacity_size=None):
    """
    Create a synthetic chest X-ray image
    """
    # Create base image with typical chest X-ray appearance
    base_img = np.random.normal(180, 30, (height, width)).astype(np.uint8)
    
    # Add some anatomical-like structures
    # Simulate the mediastinum (central structure)
    center_x = width // 2
    for y in range(height):
        # Create a central dark area simulating the heart and mediastinum
        start_x = max(0, center_x - 40)
        end_x = min(width, center_x + 40)
        base_img[y, start_x:end_x] = np.clip(base_img[y, start_x:end_x] - 40, 0, 255)
        
        # Add some rib-like structures
        if y % 40 < 10:
            for rib_x in range(0, width, 30):
                rib_width = 5
                base_img[y:y+3, max(0, rib_x-rib_width//2):min(width, rib_x+rib_width//2)] = \
                    np.clip(base_img[y:y+3, max(0, rib_x-rib_width//2):min(width, rib_x+rib_width//2)] - 20, 0, 255)
    
    # Add lung opacity if specified
    if has_opacity:
        if opacity_position is None:
            # Random position in lung area (avoiding central region)
            opacity_x = np.random.randint(width // 4, 3 * width // 4)
            opacity_y = np.random.randint(height // 4, 3 * height // 4)
        else:
            opacity_x, opacity_y = opacity_position
            
        if opacity_size is None:
            opacity_w = np.random.randint(30, 100)
            opacity_h = np.random.randint(30, 100)
        else:
            opacity_w, opacity_h = opacity_size
        
        # Create an elliptical opacity region
        mask = np.zeros((height, width), dtype=np.uint8)
        cv2.ellipse(mask, (opacity_x, opacity_y), (opacity_w//2, opacity_h//2), 0, 0, 360, 255, -1)
        
        # Apply the opacity (make it brighter to simulate white opacity)
        opacity_region = base_img.copy()
        opacity_region = np.where(mask[..., None] == 255, 
                                 np.clip(base_img + 50, 0, 255), 
                                 base_img)
        
        return opacity_region, (opacity_x, opacity_y, opacity_w, opacity_h)
    
    return base_img, None

def normalize_bbox(x, y, w, h, img_width, img_height):
    """
    Convert absolute coordinates to YOLO format (normalized center coordinates)
    """
    x_center = (x + w/2) / img_width
    y_center = (y + h/2) / img_height
    width_norm = w / img_width
    height_norm = h / img_height
    return x_center, y_center, width_norm, height_norm

def generate_sample_dataset(num_train=20, num_val=5, num_test=5):
    """
    Generate sample dataset for testing
    """
    print("Generating sample chest X-ray dataset...")
    
    # Define paths
    data_root = Path("data")
    train_img_dir = data_root / "images" / "train"
    val_img_dir = data_root / "images" / "val"
    test_img_dir = data_root / "images" / "test"
    train_lbl_dir = data_root / "labels" / "train"
    val_lbl_dir = data_root / "labels" / "val"
    test_lbl_dir = data_root / "labels" / "test"
    
    # Create directories
    for dir_path in [train_img_dir, val_img_dir, test_img_dir, train_lbl_dir, val_lbl_dir, test_lbl_dir]:
        dir_path.mkdir(parents=True, exist_ok=True)
    
    # Generate training images
    print(f"Generating {num_train} training images...")
    for i in range(num_train):
        has_opacity = np.random.random() > 0.3  # 70% chance of having opacity
        img, bbox = create_synthetic_chest_xray(has_opacity=has_opacity)
        
        img_path = train_img_dir / f"train_{i:03d}.jpg"
        # Ensure the directory exists
        train_img_dir.mkdir(parents=True, exist_ok=True)
        # Ensure the image is the right data type for PIL and has correct dimensions
        img_uint8 = np.clip(img, 0, 255).astype(np.uint8)
        # Make sure it's 2D for grayscale
        if len(img_uint8.shape) == 3:
            img_uint8 = img_uint8[:, :, 0]  # Take first channel if RGB
        # Convert to PIL Image and save
        pil_img = Image.fromarray(img_uint8, mode='L')  # 'L' for grayscale
        pil_img.save(img_path)
        
        # Create label file
        lbl_path = train_lbl_dir / f"train_{i:03d}.txt"
        # Ensure the directory exists
        train_lbl_dir.mkdir(parents=True, exist_ok=True)
        with open(lbl_path, 'w') as f:
            if has_opacity and bbox:
                x, y, w, h = bbox
                x_norm, y_norm, w_norm, h_norm = normalize_bbox(x, y, w, h, 640, 640)
                f.write(f"0 {x_norm:.6f} {y_norm:.6f} {w_norm:.6f} {h_norm:.6f}\n")
    
    # Generate validation images
    print(f"Generating {num_val} validation images...")
    for i in range(num_val):
        has_opacity = np.random.random() > 0.3  # 70% chance of having opacity
        img, bbox = create_synthetic_chest_xray(has_opacity=has_opacity)
        
        img_path = val_img_dir / f"val_{i:03d}.jpg"
        # Ensure the directory exists
        val_img_dir.mkdir(parents=True, exist_ok=True)
        # Ensure the image is the right data type for PIL and has correct dimensions
        img_uint8 = np.clip(img, 0, 255).astype(np.uint8)
        # Make sure it's 2D for grayscale
        if len(img_uint8.shape) == 3:
            img_uint8 = img_uint8[:, :, 0]  # Take first channel if RGB
        # Convert to PIL Image and save
        pil_img = Image.fromarray(img_uint8, mode='L')  # 'L' for grayscale
        pil_img.save(img_path)
        
        # Create label file
        lbl_path = val_lbl_dir / f"val_{i:03d}.txt"
        # Ensure the directory exists
        val_lbl_dir.mkdir(parents=True, exist_ok=True)
        with open(lbl_path, 'w') as f:
            if has_opacity and bbox:
                x, y, w, h = bbox
                x_norm, y_norm, w_norm, h_norm = normalize_bbox(x, y, w, h, 640, 640)
                f.write(f"0 {x_norm:.6f} {y_norm:.6f} {w_norm:.6f} {h_norm:.6f}\n")
    
    # Generate test images
    print(f"Generating {num_test} test images...")
    for i in range(num_test):
        has_opacity = np.random.random() > 0.3  # 70% chance of having opacity
        img, bbox = create_synthetic_chest_xray(has_opacity=has_opacity)
        
        img_path = test_img_dir / f"test_{i:03d}.jpg"
        # Ensure the directory exists
        test_img_dir.mkdir(parents=True, exist_ok=True)
        # Ensure the image is the right data type for PIL and has correct dimensions
        img_uint8 = np.clip(img, 0, 255).astype(np.uint8)
        # Make sure it's 2D for grayscale
        if len(img_uint8.shape) == 3:
            img_uint8 = img_uint8[:, :, 0]  # Take first channel if RGB
        # Convert to PIL Image and save
        pil_img = Image.fromarray(img_uint8, mode='L')  # 'L' for grayscale
        pil_img.save(img_path)
        
        # Create label file
        lbl_path = test_lbl_dir / f"test_{i:03d}.txt"
        # Ensure the directory exists
        test_lbl_dir.mkdir(parents=True, exist_ok=True)
        with open(lbl_path, 'w') as f:
            if has_opacity and bbox:
                x, y, w, h = bbox
                x_norm, y_norm, w_norm, h_norm = normalize_bbox(x, y, w, h, 640, 640)
                f.write(f"0 {x_norm:.6f} {y_norm:.6f} {w_norm:.6f} {h_norm:.6f}\n")
    
    print("Sample dataset generation completed!")
    print(f"Training images: {num_train}")
    print(f"Validation images: {num_val}")
    print(f"Test images: {num_test}")

if __name__ == "__main__":
    generate_sample_dataset()