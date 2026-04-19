# Civic-Scan

Overview
This project implements an AI-driven system to detect and flag unauthorized billboards in urban environments using computer vision, rule-based policy evaluation, and real-time citizen reporting. The solution integrates advanced deep learning, backend APIs, and an interactive user dashboard to facilitate scalable urban compliance and governance.

Technology Stack & Tools

Frontend
• React.js: UI framework for building the responsive web application interface.
• react-webcam: For accessing webcam streams and capturing photos/videos in-browser.
• Material-UI (MUI): Component library for sleek, modern UI elements.
• Axios: For HTTP communication with backend APIs.

Backend
• FastAPI: Python web framework for building fast, asynchronous REST APIs.
• uvicorn: ASGI server for running FastAPI application.
• PIL (Pillow): Image processing and validation (blank/blur checks).
• OpenCV: Video processing and frame extraction capabilities.
• Python 3.11: Runtime environment.

AI Model & Machine Learning
• PyTorch: Deep learning framework for model training and inference.
• Torchvision: Access to Faster R-CNN model, transforms, and utilities.
• Faster R-CNN: Object detection architecture used with MobileNetV3 Large FPN backbone.
• Pretrained Weights: Custom-trained model weights specific to billboard detection dataset.

Post-processing & Policy Evaluation
• Custom Python Modules: Rule-based violation checks incorporating size, placement, illumination, zoning, and regulatory guidelines derived from state policy.
External APIs and Services
• Geolocation API: Access location data from user devices for compliance checks and reporting.
• Note: No third-party external APIs were directly integrated beyond device geolocation.
Assumptions
• Input images/videos are captured in well-lit, minimally obstructed environments.
• Metadata (road type, dimensions, illumination info) is accurate and provided by clients or inferred correctly.
• Enforcement policy rules correspond to local state regulations (Odisha Outdoor Advertisement & Hoarding Policy, 2015).
• User devices have permission to access camera and location data.
• No facial recognition or sensitive personal data processing is performed, ensuring privacy compliance.
Compliance Checks
• Size validation against standard billboard dimensions with tolerance thresholds.
• Placement checks including minimum distances, footpath width restrictions, terrace projection bans.
• Illumination limits and operating hours enforcement.
• Road width and zoning-based restrictions.
• Dynamic rule engine that can be updated as local policies evolve.

# Important: Large Files and Model Weights have been excluded from this submission and are available via Google Drive:
• Trained model weights (fasterrcnn_best.pth) - Required for AI inference
• Training and validation datasets
• node_modules folder (Frontend dependencies)
• Python virtual environment (venv folder)

# Google Drive Link: https://drive.google.com/drive/folders/1ZST_PupVoXtifDIb1_p5AYPvCQYYEqvz?usp=drive_link

Setup & Running the Source Code
Prerequisites
• Python 3.11+ installed
• Node.js and npm installed (for frontend)
• Git (optional, for cloning repo)
• CUDA-compatible GPU (optional, for accelerated ML inference)

IMPORTANT: Pre-Setup Downloads

Before running the project, download the following from the Google Drive link above:
• Download fasterrcnn_best.pth and place it in the Backend/ folder
• Download any required datasets if you plan to retrain the model

Backend Setup
1. Navigate to Backend folder:
   cd Backend/

2. Create a virtual environment:
   python -m venv venv

3. Activate environment:
   source venv/bin/activate  # On Windows: venv\Scripts\activate

4. Install dependencies:
   pip install -r requirements.txt

5. Ensure fasterrcnn_best.pth is in the Backend/ folder (downloaded from Google Drive)

6. Run FastAPI server:
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload

Frontend Setup
1. Navigate to Frontend folder:
   cd Frontend/

2. Install npm dependencies:
   npm install

3. Run frontend locally:
   npm start

4. Ensure frontend API base URL points to backend server (http://localhost:8000 by default)

Usage Notes
• User can capture images or videos via webcam or upload files.
• Metadata such as location and environment details are auto-collected or manually provided.
• Backend processes data, runs AI inference, applies compliance logic, and returns detailed analysis.
• Frontend dashboard visualizes flagged violations and allows real-time user reporting.
• The system supports rapid iteration and deployment on cloud platforms like Vercel and containerization via Docker.

# Large Files(Trained Dataset, model) Google Drive link : 
https://drive.google.com/drive/folders/1ZST_PupVoXtifDIb1_p5AYPvCQYYEqvz?usp=drive_link