import cv2
import numpy as np
from utils.postprocess import postprocess_mask_bin

def postprocess_mask_bin(mask_bin, min_area=150):
    kernel=cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(5,5))
    mask=cv2.morphologyEx(mask_bin.astype('uint8'), cv2.MORPH_OPEN, kernel, iterations=1)
    num_labels, labels, stats, centroids=cv2.connectedComponentsWithStats(mask,8)
    out=np.zeros_like(mask)
    for i in range(1,num_labels):
        if stats[i, cv2.CC_STAT_AREA] >= min_area:
            out[labels==i]=1
    return out
