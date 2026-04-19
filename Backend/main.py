from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
import tempfile
import cv2
import numpy as np
from PIL import Image, ImageStat
from postprocess import flag_billboard
from detector import detect

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

LABEL_TO_REASON = {1: "billboard"}

def is_blank_image(image, threshold=5):
    stat = ImageStat.Stat(image)
    return max(stat.stddev) < threshold

def is_blurred(image, blur_threshold=100):
    img_gray = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2GRAY)
    laplacian_var = cv2.Laplacian(img_gray, cv2.CV_64F).var()
    return laplacian_var < blur_threshold

@app.post("/analyze")
async def analyze(
    file: UploadFile = File(...),
    road_type: str = Form("commercial"),
    road_width_ft: float = Form(80.0),
    footpath_width_ft: float = Form(10.0),
    base_height_ft: float = Form(15.0),
    top_height_ft: float = Form(60.0),
    illumination_hours: float = Form(6.0),
    illumination_off_time: str = Form("22:00"),
    distance_to_other_hoarding_m: float = Form(200.0),
    zone_type: str = Form("commercial"),
    on_terrace: bool = Form(False),
    projects_beyond_building_line: bool = Form(False),
    latitude: float = Form(None),
    longitude: float = Form(None),
    capture_time: str = Form(None),
):
    image_bytes = await file.read()
    image = Image.open(BytesIO(image_bytes)).convert('RGB')

    if is_blank_image(image):
        return {"flagged": False, "reason": "Image is blank or mostly uniform color"}

    if is_blurred(image):
        return {"flagged": False, "reason": "Image is blurry"}

    metadata = {
        "road_type": road_type,
        "road_width_ft": road_width_ft,
        "footpath_width_ft": footpath_width_ft,
        "base_height_ft": base_height_ft,
        "top_height_ft": top_height_ft,
        "illumination_hours": illumination_hours,
        "illumination_off_time": illumination_off_time,
        "distance_to_other_hoarding_m": distance_to_other_hoarding_m,
        "zone_type": zone_type,
        "on_terrace": on_terrace,
        "projects_beyond_building_line": projects_beyond_building_line,
        "latitude": latitude,
        "longitude": longitude,
        "capture_time": capture_time,
    }

    detections = detect(BytesIO(image_bytes), threshold=0.5)

    if len(detections) == 0:
        return {"flagged": False, "reason": "No billboards detected"}

    flagged_overall = False
    detailed_results = []
    aggregated_reasons = set()
    highest_score = 0.0

    for det in detections:
        flag_result = flag_billboard(det, metadata)
        if flag_result["flagged"]:
            flagged_overall = True
            aggregated_reasons.update(flag_result["reasons"])
        if det["score"] > highest_score:
            highest_score = det["score"]
        detailed_results.append({**det, **flag_result})

    return {
        "flagged": flagged_overall,
        "score": highest_score,
        "reasons": list(aggregated_reasons),
        "detections": detailed_results,
        "metadata": metadata,
    }

@app.post("/analyze_video")
async def analyze_video(
    file: UploadFile = File(...),
    road_type: str = Form("commercial"),
    road_width_ft: float = Form(80.0),
    footpath_width_ft: float = Form(10.0),
    base_height_ft: float = Form(15.0),
    top_height_ft: float = Form(60.0),
    illumination_hours: float = Form(6.0),
    illumination_off_time: str = Form("22:00"),
    distance_to_other_hoarding_m: float = Form(200.0),
    zone_type: str = Form("commercial"),
    on_terrace: bool = Form(False),
    projects_beyond_building_line: bool = Form(False),
    latitude: float = Form(None),
    longitude: float = Form(None),
    capture_time: str = Form(None),
):
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")
    temp_file.write(await file.read())
    temp_file.close()

    metadata = {
        "road_type": road_type,
        "road_width_ft": road_width_ft,
        "footpath_width_ft": footpath_width_ft,
        "base_height_ft": base_height_ft,
        "top_height_ft": top_height_ft,
        "illumination_hours": illumination_hours,
        "illumination_off_time": illumination_off_time,
        "distance_to_other_hoarding_m": distance_to_other_hoarding_m,
        "zone_type": zone_type,
        "on_terrace": on_terrace,
        "projects_beyond_building_line": projects_beyond_building_line,
        "latitude": latitude,
        "longitude": longitude,
        "capture_time": capture_time,
    }

    cap = cv2.VideoCapture(temp_file.name)
    flagged = False
    reasons = set()
    highest_score = 0.0
    detailed_results = []
    frame_count = 0
    threshold = 0.5

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1
        if frame_count % 5 != 0:
            continue

        img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        pil_img = Image.fromarray(img_rgb)
        buffer = BytesIO()
        pil_img.save(buffer, format='JPEG')
        buffer.seek(0)

        detections = detect(buffer, threshold=threshold)

        for det in detections:
            flag_result = flag_billboard(det, metadata)
            if flag_result["flagged"]:
                flagged = True
                reasons.update(flag_result["reasons"])
            if det["score"] > highest_score:
                highest_score = det["score"]
            detailed_results.append({**det, **flag_result})

        if flagged:
            break

        if frame_count >= 100:
            break

    cap.release()

    return {
        "flagged": flagged,
        "score": highest_score,
        "reasons": list(reasons),
        "detections": detailed_results,
        "metadata": metadata,
    }
