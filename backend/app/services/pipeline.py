from models.yolo_infer import run_yolo
from utils.preprocess import normalize_img

def full_pipeline(img_bgr):
    # normalize input
    img_norm = normalize_img(img_bgr)

    # run YOLO only
    detections = run_yolo(img_norm)

    results = []
    for det in detections:
        bbox = det['bbox']
        yolo_conf = det['confidence']

        # UNet removed
        results.append({
            "bbox": bbox,
            "label": det["label"],
            "yolo_conf": yolo_conf,
            "mask_score": 0,
            "iou_score": 0,
            "final_conf": yolo_conf    # fallback
        })

    return results
