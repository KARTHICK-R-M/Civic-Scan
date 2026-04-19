import React from 'react';
import { useLocation } from 'react-router-dom';
import { Typography, Box } from '@mui/material';

const routeTitles = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
  "/report": "Report Billboard",
  "/civic": "Civic Score",   // Updated path to "/civic" to match your routes
  "/profile": "Profile",
  "/premium": "Premium",
};

export default function Header() {
  const location = useLocation();
  const title = routeTitles[location.pathname] || "Page";

  return (
    <Box
      sx={{
        height: 72,
        bgcolor: "#374dff", // A rich blue for a vibrant top bar
        px: { xs: 3, md: 6 },
        display: "flex",
        alignItems: "center",
        boxShadow: "0 8px 30px 2px #2a35a3aa",
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        userSelect: "none",
        color: "white",
      }}
    >
      <Typography
        variant="h5"
        fontWeight={900}
        sx={{
          letterSpacing: 2,
          fontFamily: "'Segoe UI Semibold', 'Roboto', sans-serif",
          textShadow: "0 1px 3px rgba(0,0,0,0.4)",
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}
