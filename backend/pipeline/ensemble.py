def compute_final_confidence(yolo_conf, mask_score, iou_score, weights=(0.4,0.4,0.2)):
    return weights[0]*yolo_conf + weights[1]*mask_score + weights[2]*iou_score

compute_final_confidence(0.8, 0.7, 0.6)
