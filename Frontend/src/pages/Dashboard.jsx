import React from 'react';
import {
  Box, Paper, Typography, Avatar, Chip, LinearProgress,
  Grid, List, ListItem, ListItemAvatar, ListItemText, Badge, Tooltip, Divider, Fade, Stack
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import GroupIcon from '@mui/icons-material/Group';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { LineChart, Line, XAxis, YAxis, Tooltip as RTooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

// Color palette (Dark background, contrast cards!)
const BACKGROUND = "#f0f0f0";
const CARD_BG = "#f8fafd";
const TEXT = "#1b1b2f";
const SUBDUED = "#706d9a";

const dashColors = {
  reports: "#3564f7",
  verified: "#12b871",
  violations: "#f44336",
  score: "#9c5aff",
  donut: ["#f95e5e", "#ffd638", "#377dfc"],
};

const statData = [
  { label: "Total Reports", value: 132, color: dashColors.reports, icon: <ShowChartIcon fontSize="large" /> },
  { label: "Verified Legal", value: 74, color: dashColors.verified, icon: <VerifiedUserIcon fontSize="large" /> },
  { label: "Flagged Violations", value: 46, color: dashColors.violations, icon: <GroupIcon fontSize="large" /> },
  { label: "Civic Score", value: 2380, color: dashColors.score, icon: <EmojiEventsIcon fontSize="large" /> }
];

const violationsOverTime = [
  { month: "Feb", violations: 6 },
  { month: "Mar", violations: 10 },
  { month: "Apr", violations: 18 },
  { month: "May", violations: 13 },
  { month: "Jun", violations: 23 },
  { month: "Jul", violations: 28 },
  { month: "Aug", violations: 23 }
];

const violationBreakdown = [
  { type: "Oversized", value: 12 },
  { type: "Improper Placement", value: 8 },
  { type: "Explicit Content", value: 14 }
];

const donutColors = ["#f95e5e", "#ffd638", "#377dfc"];

const topReporters = [
  { name: "Priya R.", score: 120, avatar: "🅿️" },
  { name: "Arjun S.", score: 112, avatar: "🅰️" },
  { name: "You", score: 96, avatar: "🧑" },
  { name: "Smita K.", score: 83, avatar: "🆂" },
  { name: "Rahul T.", score: 77, avatar: "🆁" }
];

const userBadge = {
  level: "Vigilance Star 🌟",
  message: "You’re in the Top 3! Lead the charge for a cleaner city!"
};

export default function Dashboard() {
  const userIndex = topReporters.findIndex(r => r.name === "You");

  return (
    <Box sx={{
      px: { xs: 1, md: 6 }, py: 4,
      bgcolor: BACKGROUND, minHeight: "100vh", color: TEXT,
    }}>
      {/* Hero/Wave */}
      <Paper elevation={8} sx={{
        display: 'flex', alignItems: 'center',
        mb: 5, p: { xs: 2, md: 4 }, bgcolor: "#fff", color: TEXT, borderRadius: 4,
        boxShadow: "0 8px 44px #675cff22, 0 1px 0 #fff",
        border: 'none',
        position: 'relative',
        ...( // glow only for hero
          { boxShadow: "0 0 38px #6c70d955, 0 1.5px 0 #fff" }
        )
      }}>
        <Avatar sx={{
          bgcolor: "#9c5aff", width: 72, height: 72, fontSize: 38, mr: 4, boxShadow: "0 2px 16px #9c5aff48",
          border: "3px solid #fff"
        }}>U</Avatar>
        <Box>
          <Typography variant="h5" fontWeight={900}>Welcome, Urban Sentinel!</Typography>
          <Typography sx={{ mt: 1, fontStyle: "italic", fontSize: 18, color: "#5a4a90", fontWeight: 700 }}>
            Every scan makes a difference. Step up, stay vigilant, be the hero your city needs!
          </Typography>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Stats */}
        <Grid item xs={12} md={9}>
          <Grid container spacing={2}>
            {statData.map((stat, idx) => (
              <Grid item xs={6} md={3} key={idx}>
                <Paper elevation={4} sx={{
                  bgcolor: CARD_BG, py: 3, px: 2.4, borderRadius: 3, textAlign: "center", minHeight: 117,
                  boxShadow: stat.label === "Civic Score"
                    ? "0 0 18px #9c5aff77"
                    : "0 4px 18px #5a5ed944",
                  border: stat.label === "Civic Score" ? "2.5px solid #9c5aff" : "none",
                  color: TEXT
                }}>
                  <Box>{stat.icon}</Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, mt: 1, color: SUBDUED }}>
                    {stat.label}
                  </Typography>
                  <Typography sx={{
                    color: stat.color, fontWeight: 900, fontSize: 29, letterSpacing: 1,
                  }}>
                    {stat.value}
                  </Typography>
                  {stat.label === "Civic Score" &&
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(stat.value / 30, 100)}
                      sx={{
                        mt: 1, height: 8, borderRadius: 8,
                        bgcolor: "#f1eaff",
                        "& .MuiLinearProgress-bar": { bgcolor: dashColors.score }
                      }}
                    />
                  }
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Violation Donut */}
        <Grid item xs={12} md={3}>
          <Paper elevation={4}
            sx={{
              bgcolor: CARD_BG, p: 2.2, borderRadius: 3, minHeight: 168,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 19px #7ac7fd55"
            }}>
            <Typography fontWeight={800} sx={{ mb: .8, fontSize: "1.13rem", color: dashColors.reports }}>
              Violation Breakdown
            </Typography>
            <PieChart width={110} height={90} style={{ marginBottom: 0 }}>
              <Pie
                data={violationBreakdown}
                dataKey="value"
                nameKey="type"
                cx="50%"
                cy="50%"
                innerRadius={22}
                outerRadius={40}
                labelLine={false}
                isAnimationActive={true}
                stroke="#fff"
              >
                {violationBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={donutColors[index % donutColors.length]} />
                ))}
              </Pie>
            </PieChart>
            <Box sx={{ mt: 1, display: "flex", flexWrap: 'wrap', gap: 1, justifyContent:'center' }}>
              {violationBreakdown.map((v, idx) => (
                <Chip
                  key={idx}
                  size="small"
                  label={`${v.type} (${v.value})`}
                  sx={{
                    bgcolor: donutColors[idx % donutColors.length],
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 12.5,
                  }}
                />
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Violations Over Time Line Chart */}
        <Grid item xs={12} md={7}>
          <Paper elevation={4} sx={{
            mt: 3, bgcolor: CARD_BG, px: 4, py: 3, borderRadius: 3, height: 260,
            boxShadow: "0 4px 16px #437bca33"
          }}>
            <Typography fontWeight={800} sx={{ mb: 2, fontSize: "1.08rem", color: dashColors.violations }}>
              Violations Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={170}>
              <LineChart data={violationsOverTime}>
                <CartesianGrid stroke="#ececec" />
                <XAxis dataKey="month" stroke={SUBDUED} />
                <YAxis allowDecimals={false} stroke={SUBDUED}/>
                <RTooltip
                  contentStyle={{
                    borderRadius: 8,
                    boxShadow: "0 2px 8px #fab91f20",
                    fontWeight: 800
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="violations"
                  stroke={dashColors.violations}
                  strokeWidth={3.2}
                  dot={{ r: 8, fill: "#fff", strokeWidth: 2.1, stroke: dashColors.violations }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Top reporters leaderboard */}
        <Grid item xs={12} md={5}>
          <Paper elevation={4} sx={{
            mt: 3, bgcolor: CARD_BG, px: 3, py: 2.2, borderRadius: 3, height: 260, overflowY: "auto",
            boxShadow: "0 2px 14px #aac2fd52"
          }}>
            <Typography fontWeight={800} sx={{ mb: 1, fontSize: "1.08rem", color: dashColors.reports }}>
              Top Reporters
            </Typography>
            <List dense>
              {topReporters.map((r, idx) => (
                <ListItem key={idx} sx={{
                  bgcolor: idx === userIndex ? "#d7fdc0" : undefined,
                  borderRadius: 3, mb: 1,
                  boxShadow: idx === 0 ? "0 3px 14px #ffe7a7" : undefined,
                  border: idx === userIndex ? "2px solid #12b871" : undefined
                }}>
                  <ListItemAvatar>
                    <Avatar sx={{
                      bgcolor: idx === 0 ? "#ffd700" : (idx === userIndex ? "#12b871" : "#ebecf0"),
                      color: idx === userIndex ? "#fff" : "#111", fontWeight: 'bold',
                    }}>{r.avatar}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{
                        fontWeight: 800,
                        fontSize: idx === userIndex ? 18 : 16,
                        color: idx === userIndex ? "#12b871" : TEXT
                      }}>
                        {r.name}{idx === userIndex && <Chip color="success" size="small" sx={{ ml: 1, fontWeight: 700 }} label="You" />}
                      </Box>
                    }
                    secondary={<span style={{ color: SUBDUED }}>Civic Score: {r.score}</span>}
                  />
                  {idx === 0 && <EmojiEventsIcon color="warning" />}
                </ListItem>
              ))}
            </List>
            {/* Motivational badge */}
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Chip label={userBadge.level} color="success" sx={{ fontWeight: 700, fontSize: 15, px: 2.5, py: .8, mb: .7 }} />
              <Typography color={dashColors.verified} sx={{ fontStyle: "italic", fontSize: 14, mt: .2 }}>{userBadge.message}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Tip Banner */}
      <Fade in timeout={1400}>
        <Paper elevation={0} sx={{
          mt: 7, p: 2.5, textAlign: "center", fontWeight: 900,
          color: dashColors.violations, fontSize: 20, borderRadius: 3,
          background: "#fff3f7", boxShadow: "0 8px 38px #fff0"
        }}>
          💡 <span style={{ color: dashColors.violations, fontWeight: 700 }}>Tip:</span>{" "}
          Check your <b>Civic Score</b> and contribute daily for extra leaderboard points!
        </Paper>
      </Fade>
    </Box>
  );
}
