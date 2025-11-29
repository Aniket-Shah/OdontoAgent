import os
import shutil
import random

def make_dirs(path):
    if not os.path.exists(path):
        os.makedirs(path)

def split_yolo_dataset():
    print("🔵 Splitting YOLO dataset into 70/15/15...")

    img_dir = "raw_data/images"
    label_dir = "raw_data/labels"

    images = [f for f in os.listdir(img_dir) if f.endswith((".jpg",".png",".jpeg"))]
    random.shuffle(images)

    total = len(images)
    train_count = int(total * 0.70)
    val_count = int(total * 0.15)

    train_files = images[:train_count]
    val_files = images[train_count : train_count + val_count]
    test_files = images[train_count + val_count :]

    sets = {
        "train": train_files,
        "val": val_files,
        "test": test_files
    }

    for split in ["train", "val", "test"]:
        make_dirs(f"yolo_dataset/images/{split}")
        make_dirs(f"yolo_dataset/labels/{split}")

    for split, files in sets.items():
        for file in files:
            shutil.copy(f"{img_dir}/{file}", f"yolo_dataset/images/{split}/{file}")

            txt = file.replace(".jpg", ".txt").replace(".png",".txt")
            shutil.copy(f"{label_dir}/{txt}", f"yolo_dataset/labels/{split}/{txt}")

    print("✔ YOLO dataset prepared successfully!")


def split_unet_dataset():
    print("🟢 Splitting UNet dataset into 70/15/15...")

    img_dir = "raw_seg/images"
    mask_dir = "raw_seg/masks"

    images = [f for f in os.listdir(img_dir) if f.endswith((".jpg",".png",".jpeg"))]
    random.shuffle(images)

    total = len(images)
    train_count = int(total * 0.70)
    val_count = int(total * 0.15)

    train_files = images[:train_count]
    val_files = images[train_count : train_count + val_count]
    test_files = images[train_count + val_count :]

    sets = {
        "train": train_files,
        "val": val_files,
        "test": test_files
    }

    for split in ["train", "val", "test"]:
        make_dirs(f"unet_dataset/images/{split}")
        make_dirs(f"unet_dataset/masks/{split}")

    for split, files in sets.items():
        for file in files:
            shutil.copy(f"{img_dir}/{file}", f"unet_dataset/images/{split}/{file}")

            mask_file = file.replace(".jpg",".png").replace(".jpeg",".png")
            shutil.copy(f"{mask_dir}/{mask_file}", f"unet_dataset/masks/{split}/{mask_file}")

    print("✔ UNet dataset prepared successfully!")


if __name__ == "__main__":
    split_yolo_dataset()
    split_unet_dataset()
