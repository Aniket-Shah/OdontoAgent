from ultralytics import YOLO

model = YOLO('weights/yolov8_dental.pt')
model.export(format='onnx')
