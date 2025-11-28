import cv2
import numpy as np
from utils.preprocess import normalize_img

def apply_clahe_gray(img_bgr):
    gray=cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    clahe=cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    cl=clahe.apply(gray)
    return cv2.cvtColor(cl, cv2.COLOR_GRAY2BGR)

def adjust_gamma(image, gamma=1.0):
    invGamma=1.0/gamma
    table=np.array([((i/255.0)**invGamma)*255 for i in range(256)]).astype("uint8")
    return cv2.LUT(image, table)

def normalize_img(img_bgr):
    cl=apply_clahe_gray(img_bgr)
    g=adjust_gamma(cl,0.9)
    return g
