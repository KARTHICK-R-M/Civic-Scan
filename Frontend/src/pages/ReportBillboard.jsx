import React, { useState, useRef } from 'react';
import Webcam from "react-webcam";
import {
  Box, Paper, Typography, Button, CircularProgress, Chip, Snackbar, Fade, Stack,
  Avatar
} from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import VideocamIcon from '@mui/icons-material/Videocam';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';
import axios from 'axios';

// Convert dataURL to File helper
const dataURLtoFile = (dataurl, filename) => {
  let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], filename, {type:mime});
};

const reasonLabels = {
  oversized: "Oversized Billboard",
  improper_placement: "Improper Placement",
  explicit: "Explicit/Improper Content",
  other: "Other Violation"
};
const reasonIcons = {
  oversized: <FlagIcon />,
  improper_placement: <LocationOnIcon sx={{color:"#fdb322"}}/>,
  explicit: <StarIcon sx={{color:"#e32962"}}/>,
  other: <FlagIcon />
};

export default function ReportBillboard() {
  // States
  const [showCamera, setShowCamera] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const webcamRef = useRef(null);

  const [previewUrl, setPreviewUrl] = useState('');
  const [fileType, setFileType] = useState("");
  const [image, setImage] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState('');

  const [geo, setGeo] = useState(null);
  const [captureTime, setCaptureTime] = useState(null);

  const [scorePopup, setScorePopup] = useState(false);

  // Setup geolocation
  const requestGeo = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      pos => setGeo({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      err => setGeo({ error: 'Unavailable' })
    );
  };

  // Hero Stat Example (animated count up for demo)
  const [totalReports, setTotalReports] = useState(802);
  React.useEffect(() => {
    let v = 790;
    const interv = setInterval(() => { v++; setTotalReports(v); if(v >= 802) clearInterval(interv); }, 36);
    return ()=> clearInterval(interv);
  }, []);

  // Handlers
  const handlePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) {  // Added null check to prevent error
      setSnack("Capture failed. Please try again.");
      return;
    }

    setPreviewUrl(imageSrc);
    setImage(dataURLtoFile(imageSrc, "captured.jpg"));
    setFileType("image");
    setVideoBlob(null);
    setAnalysis(null);
    setCaptureTime(new Date().toLocaleString());
    requestGeo();
    setShowCamera(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file.type.startsWith('image/') ? file : null);
    setVideoBlob(file.type.startsWith('video/') ? file : null);
    setFileType(file.type.startsWith('video/') ? "video" : "image");
    setPreviewUrl(URL.createObjectURL(file));
    setAnalysis(null);
    setCaptureTime(new Date().toLocaleString());
    requestGeo();
    setShowCamera(false);
    setShowVideo(false);
  };

  const startRecording = () => {
    let chunks = [];
    const stream = webcamRef.current.stream;
    const recorder = new window.MediaRecorder(stream);
    recorder.ondataavailable = e => chunks.push(e.data);
    recorder.onstop = () => {
      const completeBlob = new Blob(chunks, { type: 'video/webm' });
      setVideoBlob(completeBlob);
      setFileType("video");
      setPreviewUrl(URL.createObjectURL(completeBlob));
      setAnalysis(null);
      setCaptureTime(new Date().toLocaleString());
      requestGeo();
    };
    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder) mediaRecorder.stop();
    setRecording(false);
    setShowVideo(false);
  };

  // Default metadata
  const defaultMetadata = {
    pixel_to_feet_scale: 0.02,
    road_type: 'commercial',
    road_width_ft: 80,
    footpath_width_ft: 10,
    base_height_ft: 15,
    top_height_ft: 60,
    illumination_hours: 6,
    illumination_off_time: '22:00',
    distance_to_other_hoarding_m: 200,
    zone_type: 'commercial',
    on_terrace: false,
    projects_beyond_building_line: false,
  };

  // Updated handleAnalyze function including metadata
  const handleAnalyze = async () => {
    setLoading(true);
    setSnack('');

    const formData = new FormData();
    const isVideo = fileType === "video";
    if (isVideo) formData.append('file', videoBlob, 'capture.webm');
    else formData.append('file', image, 'capture.jpg');

    // Append metadata
    Object.entries(defaultMetadata).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (geo?.lat) {
      formData.append("latitude", geo.lat);
      formData.append("longitude", geo.lng);
    }
    formData.append("capture_time", captureTime || new Date().toISOString());

    const url = isVideo ? "http://127.0.0.1:8000/analyze_video" : "http://127.0.0.1:8000/analyze";

    try {
      const response = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setAnalysis(response.data);
    } catch (error) {
      setSnack('Analysis error.');
      setAnalysis(null);
    }
    setLoading(false);
  };

  const handleReport = () => { setScorePopup(true); };

  return (
    <Box sx={{
      minHeight: "100vh",
      px: { xs: 1, md: 4 },
      py: 4,
      bgcolor: "linear-gradient(122deg,#dbe5fc 40%,#fff3fc 100%)",
      display: "flex", flexDirection: "column"
    }}>
      {/* Hero Header */}
      <Paper elevation={8} sx={{
        mb: 4,
        px: { xs: 2, md: 6 },
        py: { xs: 2.3, md: 3.5 },
        borderRadius: 4,
        bgcolor: "rgba(33,50,115,0.93)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        gap: 3,
        boxShadow: "0 6px 32px #a3a6dba6"
      }}>
        <Avatar sx={{ width: 76, height: 76, fontWeight: 900, bgcolor: "#ffd700", fontSize: 36, color: "#17224b" }}>
          <FlagIcon fontSize="inherit" />
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight={900}>Report Illegal Billboards!</Typography>
          <Typography sx={{ fontSize: 18, mt: 1, mb: .6, opacity: 0.87 }}>
            Every submission keeps the city cleaner. You’ve submitted <span style={{ fontWeight: 900, color: "#ff9d2a" }}>{totalReports}</span> reports so far!
          </Typography>
        </Box>
      </Paper>

      {/* Glass Panels */}
      <Box sx={{
        display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 5, justifyContent: "center", alignItems: 'stretch'
      }}>
        {/* Capture/Upload Side */}
        <Paper elevation={8} sx={{
          p: 3, borderRadius: 5, minWidth: 320, mb: { xs: 7, md: 0 }, flexShrink: 0,
          bgcolor: "rgba(252,253,255, 0.8)", boxShadow: "0 4px 50px #bdd5ff8b",
          display: "flex", flexDirection: "column", alignItems: 'center',
          backdropFilter: 'blur(12px)'
        }}>
          <Button
            startIcon={<CameraAltIcon sx={{ fontSize: 30 }} />}
            variant="contained"
            size="large"
            sx={{
              background: "linear-gradient(90deg,#7377f5,#3e82eb)",
              fontWeight: 900,
              fontSize: 18,
              py: 1.2, px: 3,
              mb: 3, mt: 2,
              width: "100%",
              letterSpacing: .5,
              boxShadow: "0 2px 12px #abd3fd82",
              "&:hover": { background: "linear-gradient(90deg,#3e82eb,#7377f5)" }
            }}
            onClick={() => { setShowCamera(true); setShowVideo(false); }}
          >Take Photo (Webcam)</Button>
          <Button
            startIcon={<VideocamIcon sx={{ fontSize: 28 }} />}
            variant="contained"
            size="large"
            sx={{
              background: "linear-gradient(90deg,#97e6ec,#31847c)", color: "#212b4a",
              fontWeight: 900, fontSize: 18, py: 1.2, px: 3,
              mb: 3, width: "100%", letterSpacing: .5,
              "&:hover": { background: "linear-gradient(90deg,#31847c,#97e6ec)" }
            }}
            onClick={() => { setShowVideo(true); setShowCamera(false); }}
          >Record Video (Webcam)</Button>
          <Button
            startIcon={<FileUploadIcon sx={{ fontSize: 24 }} />}
            component="label"
            fullWidth
            size="large"
            variant="outlined"
            color="primary"
            sx={{ mb: 2, fontWeight: 900, fontSize: 17, py: 1.3, borderWidth: 2, borderColor: "#b5bdea" }}
          >
            Upload Photo/Video
            <input type="file" accept="image/*,video/*" hidden onChange={handleFileChange} />
          </Button>
          {showCamera && (
            <Box sx={{ mt: 2 }}>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "environment" }}
                style={{ width: 320, borderRadius: 12, boxShadow: "0 4px 40px #aaa4" }}
              />
              <Button variant="contained" color="success" sx={{ mt: 2, fontWeight: 700 }} onClick={handlePhoto}>Capture Photo</Button>
              <Button variant="outlined" sx={{ mt: 2, ml: 2 }} onClick={() => setShowCamera(false)}>Cancel</Button>
            </Box>
          )}
          {showVideo && (
            <Box sx={{ mt: 2 }}>
              <Webcam
                audio={true}
                ref={webcamRef}
                videoConstraints={{ facingMode: "environment" }}
                style={{ width: 320, borderRadius: 12, boxShadow: "0 4px 40px #aaa4" }}
              />
              {!recording ? (
                <Button sx={{ mt: 2 }} variant="contained" color="error" onClick={startRecording} >Start Recording</Button>
              ) : (
                <Button sx={{ mt: 2 }} variant="contained" color="success" onClick={stopRecording}>Stop & Save Video</Button>
              )}
              <Button variant="outlined" sx={{ mt: 2, ml: 2 }} onClick={() => setShowVideo(false)}>Cancel</Button>
            </Box>
          )}
          {previewUrl && (
            fileType === "image"
              ? <img src={previewUrl} alt="preview" style={{ width: 320, borderRadius: 15, marginTop: 18, boxShadow: '0 2px 28px #bdd5ff5e' }} />
              : <video src={previewUrl} controls style={{ width: 320, borderRadius: 15, marginTop: 18, boxShadow: '0 2px 28px #bdd5ff5e' }} />
          )}
        </Paper>

        {/* Analyze Results Side */}
        <Paper elevation={10} sx={{
          p: 4, borderRadius: 5, bgcolor: "rgba(255,255,255,0.97)",
          minWidth: 350, maxWidth: 560, flex: 1,
          boxShadow: "0 8px 60px #f6c7ff62", position: 'relative'
        }}>
          {/* FLAGGED or NOT FLAGGED badge at top center */}
          {analysis && (
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              {analysis.flagged
                ? <Chip label="FLAGGED" color="error" icon={<FlagIcon />} sx={{
                  fontWeight: 900, fontSize: 19, px: 2, py: 2, boxShadow: "0 3px 15px #e35f7a3c"
                }} />
                : <Chip label="Not Flagged" color="success" icon={<CheckCircleIcon />} sx={{
                  fontWeight: 900, fontSize: 19, px: 2, py: 2, boxShadow: "0 1px 8px #34cf7643"
                }} />
              }
            </Box>
          )}

          {(previewUrl && (image || videoBlob)) && (
            <Button
              variant="contained"
              fullWidth
              sx={{
                mb: 2, fontWeight: 900, fontSize: 19, py: 1.4,
                bgcolor: '#d1295a', letterSpacing: .6,
                '&:hover': { bgcolor: '#f43f5e' }
              }}
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'ANALYZE'}
            </Button>
          )}
          {loading && <CircularProgress sx={{ my: 4, mx: "auto" }} />}
          {snack && <Typography sx={{ mt: 2, color: "#fd1c34", fontWeight: 800 }}>{snack}</Typography>}

          {/* Model Confidence and Reason Chips */}
          {analysis && (
            <Fade in={!!analysis}>
              <Box sx={{ mt: 3 }}>
                {/* Confidence Score */}
                {fileType === "image" && analysis.score !== undefined &&
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
                    <Typography sx={{ fontWeight: 700 }}>Model Confidence</Typography>
                    <Box sx={{ position: 'relative', display: 'inline-flex', mt: 1, mb: 1 }}>
                      <CircularProgress
                        variant="determinate"
                        value={Math.round((Number(analysis.score) || 0) * 100)}
                        size={110}
                        thickness={7}
                        sx={{ color: analysis.flagged ? "#fd5c63" : "#29c771", bgcolor: "#f6f6fd" }}
                      />
                      <Box
                        sx={{
                          top: 0, left: 0, bottom: 0, right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="h5" component="div" color="inherit" sx={{ fontWeight: 900 }}>
                          {`${Math.round((Number(analysis.score) || 0) * 100)}%`}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                }
                {/* Violation Chips */}
                {analysis.flagged && Array.isArray(analysis.reasons) && analysis.reasons.length > 0 &&
                  <Stack
                    direction="row"
                    flexWrap="wrap"
                    alignItems="center"
                    gap={1.4}
                    sx={{ mt: 2, mb: 0, justifyContent: "center" }}
                  >
                    {analysis.reasons.map((reason, ridx) => (
                      <Chip
                        key={ridx}
                        icon={reasonIcons[reason] || <FlagIcon />}
                        label={reasonLabels[reason] || reason}
                        color="error"
                        sx={{ fontWeight: 900, fontSize: 17, px: 1.8, py: 1.1, mb: 1, letterSpacing: .6 }}
                      />
                    ))}
                  </Stack>
                }
                {/* GEO AND TIMESTAMP BELOW */}
                <Box sx={{
                  mt: 3,
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  flexWrap: "wrap"
                }}>
                  <Chip
                    icon={<LocationOnIcon />}
                    label={geo?.lat ? `${geo.lat.toFixed(4)}, ${geo.lng.toFixed(4)}` : "Unknown Location"}
                    sx={{ fontWeight: 700, fontSize: 16, bgcolor: "#f3f6fa", color: "#30496b" }}
                  />
                  <Chip
                    icon={<AccessTimeIcon />}
                    label={captureTime || "No Time"}
                    sx={{ fontWeight: 700, fontSize: 16, bgcolor: "#f3f6fa", color: "#30496b" }}
                  />
                </Box>
                {/* Report Button and score animation */}
                {analysis.flagged && (
                  <Button
                    variant="contained"
                    color="warning"
                    fullWidth
                    sx={{
                      mt: 4, height: 56, fontSize: 22, fontWeight: 900,
                      bgcolor: "#fe9b1a",
                      letterSpacing: .6,
                      borderRadius: 3,
                      '&:hover': { bgcolor: "#ffd700", color: "#fd2e56" }
                    }}
                    onClick={handleReport}
                  >
                    + REPORT BILLBOARD
                  </Button>
                )}
              </Box>
            </Fade>
          )}
          {/* Civic Score reward effect */}
          <Snackbar
            open={scorePopup}
            autoHideDuration={1700}
            onClose={() => setScorePopup(false)}
            message={
              <span style={{ color: "#17aa27", fontWeight: 900, fontSize: 'x-large', letterSpacing: 1.2 }}>
                <StarIcon sx={{ color: '#17aa27', fontSize: 30, verticalAlign: 'middle', mr: .7 }} />
                Civic Score +20 🚀
              </span>
            }
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          />
        </Paper>
      </Box>
      {/* Subtle Floating Motivation Banner */}
      <Fade in timeout={1600}>
        <Paper elevation={0} sx={{
          mt: 7, p: 2.4,
          textAlign: "center",
          fontWeight: 800,
          color: "#212573",
          fontSize: 22,
          borderRadius: 3,
          background: "rgba(255,245,234,0.88)",
          boxShadow: "0 8px 48px #f3eead3c"
        }}>
          🌆 Every eye on the streets makes the city cleaner.<br />
          <span style={{ color: "#e32962" }}>Thank you for being an Urban Sentinel!</span>
        </Paper>
      </Fade>
    </Box>
  );
}
