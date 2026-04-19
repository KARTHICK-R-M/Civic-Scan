import React from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  Grid,
  Divider,
} from "@mui/material";
import {
  Flag as FlagIcon,
  CheckCircle as CheckCircleIcon,
  EmojiEvents as EmojiEventsIcon,
} from "@mui/icons-material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Cell,
} from "recharts";

// Colors and style variables
const MAIN_BG = "#faf6fd";
const CARD_BG = "#fff";
const ACCENT_BLUE = "#5b5ce6";
const ACCENT_GREEN = "#23bc94";
const ACCENT_DANGER = "#ea6682";
const ACCENT_SAFE = "#70ca7c";
const TITLE_SHADOW = "0 7px 36px #9faae333";
const BORDER = "#e5e8f5";
const TEXT_PRIMARY = "#22235c";
const TEXT_SECONDARY = "#8fa3c7";

const user = {
  name: "Alex Ford",
  tag: "Vigilant",
  email: "alex.ford@example.com",
  points: 2380,
  rank: "Vigilance Star",
  nextRank: "Legend",
  nextPoints: 3000,
  about:
    "Passionate about city cleanliness and civic responsibility. I'm a dedicated contributor reporting civic violations.",
  reports: [
    {
      label: "Oversized illegal billboard detected",
      location: "Chennai, Anna Nagar",
      datetime: "2025-08-07 15:40",
      tag: "Oversized Billboard",
      type: "danger",
      points: 20,
    },
    {
      label: "Explicit content on billboard",
      location: "Chennai, Mount Road",
      datetime: "2025-08-05 13:04",
      tag: "Explicit Content",
      type: "danger",
      points: 20,
    },
    {
      label: "Compliant billboard (no violations)",
      location: "Chennai, T. Nagar",
      datetime: "2025-08-03 18:22",
      type: "safe",
      points: 0,
    },
    {
      label: "Improper placement on public monument",
      location: "Chennai, Egmore",
      datetime: "2025-08-01 09:17",
      tag: "Improper Placement",
      type: "danger",
      points: 20,
    },
  ],
  milestones: [
    { name: "Rookie", pts: 500, icon: "⭐", color: "#51d2e7", locked: false },
    { name: "Scout", pts: 1200, icon: "⭐", color: "#9d75cb", locked: false },
    { name: "Vigilance Star", pts: 2000, icon: "⭐", color: "#23bc94", locked: false },
    { name: "Legend", pts: 3000, icon: "⭐", color: "#212865", locked: true },
  ],
  pointsByYear: [
    { year: "2018", points: 400 },
    { year: "2019", points: 600 },
    { year: "2020", points: 750 },
    { year: "2021", points: 900 },
    { year: "2022", points: 1150 },
    { year: "2023", points: 1350 },
  ],
};

export default function CivicDashboard() {
  // Animated CSS (for glowing circle and fade)
  React.useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
    @keyframes glow-fade {
      0% { box-shadow: 0 0 0 0 #5b5ce637, 0 2px 32px 3px #86f7ec33; }
      70% { box-shadow: 0 0 0 15px #5b5ce600; }
      100% { box-shadow: 0 0 0 0 #5b5ce637; }
    }`;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <Box sx={{ bgcolor: MAIN_BG, minHeight: "100vh", py: 0, fontFamily: "Roboto, sans-serif" }}>
      {/* Spacer between topbar and content */}
      <Box sx={{ height: { xs: 20, sm: 36 } }} />
      <Grid
        container
        spacing={4}
        justifyContent="center"
        alignItems="flex-start"
        sx={{ maxWidth: 1220, mx: "auto", width: "100%", p: { xs: 1, md: 0 } }}
      >
        {/* LEFT: Report History */}
        <Grid item xs={12} md={5} lg={5}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              border: `1.5px solid ${BORDER}`,
              bgcolor: CARD_BG,
              boxShadow: "0 3px 32px #b1ace85a",
              backdropFilter: "blur(4px)",
              minHeight: 420
            }}
          >
            <Typography
              variant="h5"
              fontWeight={900}
              sx={{
                color: ACCENT_BLUE,
                mb: 2.5,
                letterSpacing: 0.6,
                textShadow: TITLE_SHADOW,
                fontSize: { xs: 22, md: 24 },
              }}
            >
              Recent Report History
            </Typography>
            <Stack spacing={2} divider={<Divider flexItem sx={{ borderColor: "#efe9fa", my: 0.2 }} />}>
              {user.reports.map((record, i) => (
                <Paper
                  key={i}
                  elevation={0}
                  sx={{
                    p: 2.2,
                    borderRadius: 3,
                    border: `1.2px solid ${record.type === "danger" ? "#fae7e9" : "#e4f7e6"}`,
                    background:
                      record.type === "danger"
                        ? "linear-gradient(98deg,#fae7e9 55%,#eddeef 130%)"
                        : "linear-gradient(98deg,#f0fbe7 57%,#daeedc 130%)",
                    color: TEXT_PRIMARY,
                    minHeight: 94,
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 2px 14px #d8eaff12",
                    gap: 1,
                  }}
                >
                  <Stack direction="row" spacing={1.2} alignItems="center" mb={.5}>
                    {record.type === "danger" ? (
                      <FlagIcon sx={{ color: ACCENT_DANGER, fontSize: 21 }} />
                    ) : (
                      <CheckCircleIcon sx={{ color: ACCENT_SAFE, fontSize: 21 }} />
                    )}
                    <Typography fontWeight={800} fontSize={16} sx={{ lineHeight: 1 }}>
                      {record.label}
                    </Typography>
                  </Stack>
                  <Typography fontSize={13.2} sx={{ color: TEXT_SECONDARY }}>
                    {record.location}
                  </Typography>
                  <Typography fontSize={13} sx={{ color: TEXT_SECONDARY }}>
                    {record.datetime}
                  </Typography>
                  <Stack direction="row" spacing={1.1} alignItems="center" justifyContent="flex-end" mt={.5}>
                    {record.tag && (
                      <Chip
                        label={record.tag}
                        size="small"
                        sx={{
                          bgcolor: record.type === "danger" ? "#fddbe3" : "#d2ffea",
                          color: record.type === "danger" ? ACCENT_DANGER : ACCENT_SAFE,
                          fontWeight: 700,
                          fontSize: 11,
                          borderRadius: 2,
                        }}
                      />
                    )}
                    {record.points > 0 && (
                      <Chip
                        label={`+${record.points}`}
                        size="small"
                        sx={{
                          bgcolor: "#f5fefe",
                          color: ACCENT_GREEN,
                          fontWeight: 800,
                          fontSize: 11.5,
                          borderRadius: 2,
                        }}
                      />
                    )}
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* RIGHT: Civic Score, Graph, Journey */}
        <Grid item xs={12} md={7} lg={7}>
          <Stack spacing={4} direction={{ xs: "column", sm: "row" }} alignItems="stretch" justifyContent="stretch">
            {/* Civic Score: round, glowing, standout */}
            <Paper
              sx={{
                minWidth: 185,
                minHeight: 185,
                width: 196,
                height: 196,
                background: "#fff",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 45px #5b5ce619, 0 0 0 0px #5bc3ec00`,
                border: `3.5px solid ${ACCENT_BLUE}`,
                margin: "auto",
                animation: "glow-fade 2.1s infinite",
                transition: "box-shadow 0.2s",
                mt: { xs: 1, sm: 2 }
              }}
            >
              <Stack sx={{ textAlign: "center", width: 1, alignItems: "center" }}>
                <Typography variant="subtitle2" sx={{ color: ACCENT_GREEN, fontWeight: 800, mb: 1, letterSpacing: 0.2 }}>
                  Total Points
                </Typography>
                <Typography
                  variant="h3"
                  fontWeight={900}
                  sx={{ color: ACCENT_BLUE, letterSpacing: 2, mb: 1, fontSize: 47 }}
                >
                  {user.points}
                </Typography>
                <Typography fontSize={15} sx={{ color: TEXT_SECONDARY }}>
                  {user.rank}
                </Typography>
              </Stack>
            </Paper>

            {/* Points Bar Chart */}
            <Paper
              sx={{
                flex: 1,
                background: CARD_BG,
                p: 3,
                borderRadius: 3,
                border: `1px solid ${BORDER}`,
                minWidth: 200,
                maxWidth: 320,
                ml: { sm: 2 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 5px 28px #5baeda22",
                mt: { xs: 3, sm: 2 },
              }}
            >
              <Typography
                variant="subtitle1"
                color={ACCENT_BLUE}
                fontWeight="bold"
                mb={1.5}
                textAlign="center"
                sx={{ letterSpacing: 0.1 }}
              >
                Points Over Years
              </Typography>
              <ResponsiveContainer width="100%" height={92}>
                <BarChart
                  data={user.pointsByYear}
                  margin={{ top: 2, right: 0, left: -10, bottom: 7 }}
                >
                  <XAxis
                    dataKey="year"
                    stroke={TEXT_SECONDARY}
                    fontWeight={700}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke={TEXT_SECONDARY} tick={{ fontSize: 12 }} />
                  <RechartsTooltip
                    cursor={{ fill: "#eaf5fe" }}
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: 8,
                      border: "none",
                      boxShadow: `0 0 8px ${ACCENT_BLUE}14`,
                    }}
                  />
                  <Bar dataKey="points" radius={[7, 7, 0, 0]}>
                    {user.pointsByYear.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index % 2 === 0 ? ACCENT_GREEN : ACCENT_BLUE}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Paper>
            {/* Contributor Journey */}
            <Paper
              sx={{
                minWidth: 200,
                maxWidth: 232,
                p: 2.8,
                borderRadius: 3.5,
                background: "#f9fcff",
                border: `1px solid ${BORDER}`,
                color: TEXT_PRIMARY,
                boxShadow: "0 1.5px 15px #8be6d54d",
                display: "flex",
                flexDirection: "column",
                mx: { xs: "auto", sm: 0 },
                mt: { xs: 3, sm: 2 }
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                mb={1}
                color={ACCENT_GREEN}
                sx={{ letterSpacing: 0.5 }}
              >
                Contributor Journey
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" mb={.7}>
                <EmojiEventsIcon fontSize="small" sx={{ color: ACCENT_GREEN }} />
                <Typography fontSize={14} fontWeight="bold" color={ACCENT_GREEN}>
                  {user.rank}
                </Typography>
              </Stack>
              <Typography color={TEXT_SECONDARY} mb={2} fontSize={14}>
                Your efforts drive real change!
              </Typography>
              <Stack spacing={1.15} sx={{ mt: 1 }}>
                {user.milestones.map((ms, idx) => (
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    key={idx}
                    sx={{ opacity: ms.locked ? 0.45 : 1 }}
                  >
                    <Typography fontSize={18}>{ms.icon}</Typography>
                    <Typography fontWeight="bold" color={ms.locked ? TEXT_SECONDARY : ms.color}>
                      {ms.name}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Chip
                      label={`${ms.pts} pts`}
                      size="small"
                      sx={{
                        bgcolor: "#f7faf5",
                        color: ACCENT_GREEN,
                        fontWeight: 700,
                        fontSize: 13,
                        px: 1.3,
                      }}
                    />
                  </Stack>
                ))}
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
