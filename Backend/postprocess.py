from datetime import datetime


def estimate_real_dimensions(box, metadata):
    """
    Estimate real-world width and height from bounding box pixels.
    Placeholder - scales pixels to feet using pixel_to_feet_scale from metadata.
    """
    x1, y1, x2, y2 = box
    pixel_width = x2 - x1
    pixel_height = y2 - y1

    scale = metadata.get('pixel_to_feet_scale', 0.1)  # feet per pixel
    real_width = pixel_width * scale
    real_height = pixel_height * scale

    return real_width, real_height


def is_within_tolerance(val, target, tolerance=0.10):
    return abs(val - target) / target < tolerance


def flag_billboard(detection, metadata):
    reasons = []
    flagged = False

    # --- SIZE CHECK (convert real size units e.g. in feet)
    real_width, real_height = estimate_real_dimensions(detection['box'], metadata)
    allowed_sizes = [(12, 20), (8, 15)]
    size_ok = False
    for w, h in allowed_sizes:
        if is_within_tolerance(real_width, w) and is_within_tolerance(real_height, h):
            size_ok = True
            break
    if not size_ok:
        flagged = True
        reasons.append("Non-standard size")

    # --- ROAD WIDTH & PROPORTION CHECK
    road_width = metadata.get('road_width_ft', 80)
    if road_width < 60 and max(real_width, real_height) >= 60:
        flagged = True
        reasons.append("Oversized for narrow road")

    # --- HEIGHT CHECK
    base_height = metadata.get('base_height_ft', 0)
    top_height = metadata.get('top_height_ft', 80)
    if base_height < 11 or base_height > 60:
        flagged = True
        reasons.append("Improper base height")
    if top_height > 70:
        flagged = True
        reasons.append("Exceeds maximum height allowed")

    # --- PLACEMENT CHECK
    footpath_width = metadata.get('footpath_width_ft', 10)
    if footpath_width < 6:
        flagged = True
        reasons.append("Placement on too narrow footpath")
    if metadata.get('zone_type', '') == "residential":
        flagged = True
        reasons.append("Illegal zone (residential)")
    if metadata.get('on_terrace', False) and metadata.get('projects_beyond_building_line', False):
        flagged = True
        reasons.append("Terrace projection beyond building line")

    # --- DISTANCE TO OTHER HOARDINGS
    distance_to_nearest = metadata.get('distance_to_other_hoarding_m', 200)
    if distance_to_nearest < 100:
        flagged = True
        reasons.append("Too close to existing hoarding")

    # --- ILLUMINATION
    illumination_hours = metadata.get('illumination_hours', 0)
    illumination_off_time_str = metadata.get('illumination_off_time', "00:00")
    if illumination_hours > 8:
        flagged = True
        reasons.append("Illuminated for too many hours")

    # Convert illumination_off_time string to datetime.time for robust comparison
    try:
        illumination_off_time = datetime.strptime(illumination_off_time_str, "%H:%M").time()
        midnight_time = datetime.strptime("23:59", "%H:%M").time()
        if illumination_off_time > midnight_time:
            flagged = True
            reasons.append("Not switched off before midnight")
    except ValueError:
        # If parsing fails, optionally flag or ignore
        pass

    # --- ZONE CHECK (bus station, major road, etc.)
    # Add any additional zone-based checks you need here

    return {
        "flagged": flagged,
        "reasons": reasons,
        "details": {
            "width_ft": real_width,
            "height_ft": real_height,
            "road_width_ft": road_width,
            "base_height_ft": base_height,
            "top_height_ft": top_height,
            "distance_to_nearest": distance_to_nearest,
            "illumination_hours": illumination_hours,
            "illumination_off_time": illumination_off_time_str
        }
    }