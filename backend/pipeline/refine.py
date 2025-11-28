import cv2
from PIL import Image

from models.unet_infer import run_unetpp

def crop_and_run_unetpp(img_bgr, bbox):
    x1,y1,x2,y2 = map(int,bbox)
    crop = img_bgr[y1:y2, x1:x2]
    crop_rgb=cv2.cvtColor(crop, cv2.COLOR_BGR2RGB)
    pil = Image.fromarray(crop_rgb)
    return run_unetpp(pil) + ((x1,y1,x2,y2),)

crop_and_run_unetpp(image, bbox)
