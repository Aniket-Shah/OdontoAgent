from ultralytics import YOLO

model = YOLO('weights/yolov8_dental.pt')

def run_yolo(img_bgr):
    results = model.predict(img_bgr, conf=0.25)
    detections=[]
    r=results[0]
    for box in r.boxes:
        detections.append({
            "cls": int(box.cls[0]),
            "label": r.names[int(box.cls[0])],
            "confidence": float(box.conf[0]),
            "bbox": box.xyxy[0].tolist()
        })
    return detections
