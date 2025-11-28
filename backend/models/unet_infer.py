import torch
import segmentation_models_pytorch as smp
from torchvision import transforms
import numpy as np
import cv2
from PIL import Image

device='cuda' if torch.cuda.is_available() else 'cpu'

model = smp.UnetPlusPlus(
    encoder_name='resnet34',
    encoder_weights='imagenet',
    in_channels=3,
    classes=1
).to(device)

state=torch.load('weights/unetpp_dental.pth', map_location=device)
model.load_state_dict(state)
model.eval()

transform=transforms.Compose([
    transforms.Resize((512,512)),
    transforms.ToTensor()
])

def run_unetpp(pil_img):
    img_t = transform(pil_img).unsqueeze(0).to(device)
    with torch.no_grad():
        out = model(img_t)
    probs = torch.sigmoid(out)[0][0].cpu().numpy()
    mask_bin = (probs>0.4).astype('uint8')
    return probs, mask_bin
