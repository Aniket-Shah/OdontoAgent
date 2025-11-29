from fastapi import APIRouter, UploadFile, File, Form
from PIL import Image, ImageDraw
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
import json, io, requests, base64, os
from datetime import datetime

router = APIRouter()

# --------------------------------------------------------
# 1. Extract Drive ID cleanly
# --------------------------------------------------------
def make_drive_id(url: str) -> str:
    """
    Extract Google Drive file ID in a clean way.
    """
    if "id=" in url:
        return url.split("id=")[1]
    return url.split("/d/")[1].split("/")[0]

# --------------------------------------------------------
# 2. Convert Drive ID → Direct Download Link
# --------------------------------------------------------
def convert_drive_id_to_url(file_id: str):
    return f"https://drive.google.com/uc?export=download&id={file_id}"

# --------------------------------------------------------
# 3. YOLO bbox convertor
# --------------------------------------------------------
def yolo_to_xyxy(bbox, img_w, img_h):
    cx, cy, w, h = bbox
    x1 = int((cx - w/2) * img_w)
    y1 = int((cy - h/2) * img_h)
    x2 = int((cx + w/2) * img_w)
    y2 = int((cy + h/2) * img_h)
    return x1, y1, x2, y2


# --------------------------------------------------------
# 4. API ROUTE
# --------------------------------------------------------
@router.post("/draw")
async def draw_boxes(
    image_url: str = Form(...),
    data: UploadFile = File(...)
):
    # ---------- DRIVE ID ----------
    drive_id = make_drive_id(image_url)
    direct_url = convert_drive_id_to_url(drive_id)

    # ---------- Download image ----------
    response = requests.get(direct_url)
    if response.status_code != 200:
        return {"error": "Unable to download Google Drive image"}

    img = Image.open(io.BytesIO(response.content)).convert("RGB")
    w, h = img.size

    # ---------- Read JSON ----------
    parsed = json.load(io.BytesIO(await data.read()))
    healthy = parsed[0].get("healthy_teeth", [])
    danger = parsed[0].get("danger_teeth", [])
    explanation = parsed[0].get("explanation", "")

    draw = ImageDraw.Draw(img)

    # ---------- Draw boxes ----------
    for item in healthy:
        x1, y1, x2, y2 = yolo_to_xyxy(item["yolo_bbox"], w, h)
        draw.rectangle([x1, y1, x2, y2], outline="green", width=4)

    for item in danger:
        x1, y1, x2, y2 = yolo_to_xyxy(item["yolo_bbox"], w, h)
        draw.rectangle([x1, y1, x2, y2], outline="red", width=4)

    # ---------- Save processed image ----------
    output_image_path = f"output/processed_{drive_id}.jpg"
    img.save(output_image_path)

    # --------------------------------------------------------
    # 5. Generate Professional PDF (ReportLab)
    # --------------------------------------------------------
    pdf_path = f"output/report_{drive_id}.pdf"
    c = canvas.Canvas(pdf_path, pagesize=A4)
    width, height = A4

    # Title
    c.setFont("Helvetica-Bold", 20)
    c.drawString(40, height - 50, "Dental Radiograph AI Report")

    # Date
    c.setFont("Helvetica", 12)
    c.drawString(40, height - 75, f"Generated On: {datetime.now().strftime('%d-%m-%Y %H:%M')}")

    # Summary Boxes
    c.setFont("Helvetica-Bold", 14)
    c.drawString(40, height - 110, f"Healthy Teeth: {len(healthy)}")
    c.drawString(40, height - 130, f"Danger Teeth: {len(danger)}")

    # Insert Image
    img_reader = ImageReader(output_image_path)
    c.drawImage(img_reader, 40, height - 500, width=500, preserveAspectRatio=True)

    # Explanation Text
    text_obj = c.beginText(40, 250)
    text_obj.setFont("Helvetica", 12)
    for line in explanation.split("\n"):
        text_obj.textLine(line)
    c.drawText(text_obj)

    c.save()

    # --------------------------------------------------------
    # Return base64 + PDF path
    # --------------------------------------------------------
    with open(output_image_path, "rb") as f:
        base64_image = base64.b64encode(f.read()).decode()

    return {
        "status": "success",
        "drive_id": drive_id,
        "processed_image_base64": base64_image,
        "pdf_path": pdf_path
    }