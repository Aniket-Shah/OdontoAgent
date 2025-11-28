import numpy as np

def iou(pred, gt):
    p=(pred>0.5).astype(np.uint8)
    g=(gt>0.5).astype(np.uint8)
    inter=(p&g).sum()
    union=(p|g).sum()
    if union==0: return 1.0 if inter==0 else 0.0
    return inter/union
