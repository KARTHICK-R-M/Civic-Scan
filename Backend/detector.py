import torch
from torchvision.models.detection import fasterrcnn_mobilenet_v3_large_fpn
from torchvision.models.detection.faster_rcnn import FastRCNNPredictor
from torchvision import transforms as T
from PIL import Image

MODEL_PATH = "fasterrcnn_best.pth"  # or your actual filename

NUM_CLASSES = 2  # background + 1 billboard class

def get_model():
    # Load base model with MobileNetV3 backbone
    model = fasterrcnn_mobilenet_v3_large_fpn(weights=None)
    
    # Replace the classifier with a new one for our num_classes
    in_features = model.roi_heads.box_predictor.cls_score.in_features
    
    model.roi_heads.box_predictor = FastRCNNPredictor(in_features, NUM_CLASSES)

    # Load your trained weights
    checkpoint = torch.load(MODEL_PATH, map_location='cpu')
    model.load_state_dict(checkpoint)
    
    model.eval()
    print(f"Loaded MobileNetV3 backbone FasterRCNN with {NUM_CLASSES} classes")
    return model

model = get_model()

# Simple transform: resize was done in training, so do similar here (optional)
transform = T.Compose([
    T.Resize((512, 512)),
    T.ToTensor(),
])

def detect(image_bytes_io, threshold=0.5):
    image = Image.open(image_bytes_io).convert("RGB")
    img_t = transform(image)
    
    with torch.no_grad():
        preds = model([img_t])
    
    pred = preds[0]
    results = []
    for box, label, score in zip(pred['boxes'], pred['labels'], pred['scores']):
        if score >= threshold:
            results.append({
                'box': box.tolist(),
                'label': int(label),
                'score': float(score),
            })
    return results
