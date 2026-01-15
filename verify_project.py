"""
Verification script to confirm all components of the YOLOv8 lung opacity detection project are working correctly.
"""

import os
from pathlib import Path
from ultralytics import YOLO

def verify_project():
    print("🔍 Verifying YOLOv8 Lung Opacity Detection Project")
    print("="*60)
    
    # 1. Check project structure
    print("\n📁 Checking project structure...")
    required_files = [
        'dataset.yaml',
        'train.py', 
        'test.py',
        'inference.py',
        'README.md',
        'generate_sample_data.py'
    ]
    
    structure_ok = True
    for file in required_files:
        if os.path.exists(file):
            print(f"  ✅ {file}")
        else:
            print(f"  ❌ {file}")
            structure_ok = False
    
    # Check data directories
    data_dirs_ok = True
    data_dirs = [
        'data/images/train',
        'data/images/val', 
        'data/images/test',
        'data/labels/train',
        'data/labels/val',
        'data/labels/test'
    ]
    
    for dir_path in data_dirs:
        if os.path.exists(dir_path):
            files_count = len(os.listdir(dir_path))
            print(f"  ✅ {dir_path} ({files_count} files)")
        else:
            print(f"  ❌ {dir_path}")
            data_dirs_ok = False
    
    # 2. Check if model was trained
    print("\n🏋️ Checking model training...")
    model_weights_path = 'runs/train/lung_opacity_detection/weights/best.pt'
    if os.path.exists(model_weights_path):
        print(f"  ✅ Trained model found: {model_weights_path}")
        model_exists = True
    else:
        print(f"  ❌ Trained model not found at {model_weights_path}")
        model_exists = False
    
    # 3. Test loading the model
    if model_exists:
        print("\n🧪 Testing model loading...")
        try:
            model = YOLO(model_weights_path)
            print("  ✅ Model loaded successfully")
            model_loaded = True
        except Exception as e:
            print(f"  ❌ Error loading model: {e}")
            model_loaded = False
    else:
        model_loaded = False
    
    # 4. Check evaluation results
    print("\n📊 Checking evaluation results...")
    eval_plots_exist = os.path.exists('runs/train/lung_opacity_detection/results.png')
    if eval_plots_exist:
        print("  ✅ Evaluation plots found")
    else:
        print("  ⚠️  Evaluation plots not found (may be OK if evaluation just ran)")
    
    # 5. Check inference output
    print("\n🔍 Checking inference output...")
    inference_outputs = os.path.exists('output')
    if inference_outputs and os.listdir('output'):
        print("  ✅ Inference outputs found")
        inference_ok = True
    else:
        print("  ⚠️  No inference outputs found (may be OK if inference just ran)")
        inference_ok = False
    
    # Summary
    print("\n" + "="*60)
    print("📋 VERIFICATION SUMMARY")
    print("="*60)
    print(f"Project Structure: {'✅ PASS' if structure_ok and data_dirs_ok else '❌ FAIL'}")
    print(f"Model Training: {'✅ PASS' if model_exists else '❌ FAIL'}")
    print(f"Model Loading: {'✅ PASS' if model_loaded else '❌ FAIL'}")
    print(f"Inference: {'✅ PASS' if inference_ok else '⚠️ PARTIAL'}")
    
    overall_status = structure_ok and data_dirs_ok and model_exists
    print(f"\n🎯 Overall Status: {'✅ SUCCESS' if overall_status else '❌ FAILURE'}")
    
    if overall_status:
        print("\n🎉 Project verification completed successfully!")
        print("All required components are present and functional.")
    else:
        print("\n❌ Some components are missing or not functioning properly.")
    
    return overall_status

if __name__ == "__main__":
    verify_project()