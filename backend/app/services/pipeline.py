from models.yolo_infer import run_yolo
from models.unet_infer import run_unetpp
from utils.preprocess import normalize_img
from pipeline.refine import crop_and_run_unetpp
from utils.postprocess import postprocess_mask_bin
from pipeline.ensemble import compute_final_confidence
import numpy as np

def full_pipeline(img_bgr):
    img_norm = normalize_img(img_bgr)
    detections = run_yolo(img_norm)
    results=[]
    for det in detections:
        bbox=det['bbox']
        yolo_conf=det['confidence']
        mask_probs, mask_bin, _ = crop_and_run_unetpp(img_norm, bbox)
        mask_bin = postprocess_mask_bin(mask_bin)
        mask_score = float(mask_probs[mask_bin==1].mean()) if mask_bin.sum()>0 else 0
        bbox_area=(bbox[2]-bbox[0])*(bbox[3]-bbox[1])
        iou_score=float(min(1.0, mask_bin.sum()/ (bbox_area+1e-6)))
        final_conf = compute_final_confidence(yolo_conf, mask_score, iou_score)
        results.append({
            "bbox":bbox,
            "label":det["label"],
            "yolo_conf":yolo_conf,
            "mask_score":mask_score,
            "iou_score":iou_score,
            "final_conf":final_conf
        })
    return results
