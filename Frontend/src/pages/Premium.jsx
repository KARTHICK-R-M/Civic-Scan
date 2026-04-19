import React from 'react';
import {
  Box, Paper, Typography, Button, Chip, Divider, Avatar, Slide, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

// Plan, user, FAQ data
const plans = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    highlight: false,
    features: [
      { icon: <VerifiedUserIcon color="primary" />, text: "Basic reporting system" },
      { icon: <CheckCircleIcon color="success" />, text: "Community support" },
      { icon: <SupportAgentIcon color="disabled" />, text: "Limited support" }
    ],
    button: "Get Started"
  },
  {
    id: "premium",
    name: "Premium",
    price: "₹499/month",
    highlight: true,
    features: [
      { icon: <RocketLaunchIcon sx={{ color: "#fdc045" }} />, text: "Unlimited reporting" },
      { icon: <TrendingUpIcon sx={{ color: "#1976d2" }} />, text: "Civic Score Boosts" },
      { icon: <SupportAgentIcon sx={{ color: "#32be52" }} />, text: "Priority Support" },
      { icon: <WorkspacePremiumIcon sx={{ color: "#fd5c63" }} />, text: "Early access to new features" }
    ],
    button: "Upgrade Now"
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Contact Us",
    highlight: false,
    features: [
      { icon: <EmojiEventsIcon sx={{ color: "#b374d7" }} />, text: "Custom integration & reports" },
      { icon: <SupportAgentIcon color="secondary" />, text: "Dedicated account manager" },
      { icon: <RocketLaunchIcon color="secondary" />, text: "API Access" }
    ],
    button: "Contact Sales"
  }
];

const currentUserPlan = {
  id: "premium",
  name: "Premium",
  expiry: "2026-03-15"
};

const faqs = [
  { q: "How do I upgrade?", a: "Select your desired plan above—activation is instant!" },
  { q: "What happens when my premium expires?", a: "You’ll continue on the Free plan, but can renew anytime." },
  { q: "Can I cancel anytime?", a: "Yes—plans are fully flexible with no hidden charges." },
  { q: "Need enterprise features?", a: "Contact our team for a custom solution." }
];

const animationTimeout = 900; // ms

export default function PremiumPage() {
  return (
    <Box sx={{
      maxWidth: 1100,
      mx: "auto",
      py: 6,
      px: { xs: 2, md: 5 },
      minHeight: "100vh",
      bgcolor: "#f5f7fa"
    }}>
      {/* PLANS FLEX ROW */}
      <Box id="plans" sx={{
        display: 'flex',
        gap: 4,
        justifyContent: 'center',
        alignItems: 'stretch',
        flexWrap: { xs: 'wrap', md: 'nowrap' },
        mb: 7
      }}>
        {/* Free Plan */}
        <Slide in direction="up" timeout={animationTimeout}>
          <Paper
            elevation={4}
            sx={{
              minWidth: 260,
              maxWidth: 320,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              borderRadius: 4,
              p: 4,
              alignItems: "center",
              bgcolor: "#fff"
            }}
          >
            <Typography variant="h5" fontWeight={900} sx={{ color: "#213164" }}>Free</Typography>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 800, color: "#555" }}>₹0</Typography>
            <Divider sx={{ mb: 2, width: "100%" }} />
            <Box component="ul" sx={{ pl: 2, mb: 3, listStyle: "none", width: "100%" }}>
              <li style={{ marginBottom: 12, fontWeight: 600, color: "#222", fontSize: 18, display:"flex",alignItems:"center"}}>
                <VerifiedUserIcon color="primary" sx={{mr:1}} /> Basic reporting system
              </li>
              <li style={{ marginBottom: 12, fontWeight: 600, color: "#222", fontSize: 18, display:"flex",alignItems:"center"}}>
                <CheckCircleIcon color="success" sx={{mr:1}} /> Community support
              </li>
              <li style={{ marginBottom: 12, fontWeight: 600, color: "#222", fontSize: 18, display:"flex",alignItems:"center"}}>
                <SupportAgentIcon color="disabled" sx={{mr:1}} /> Limited support
              </li>
            </Box>
            <Button variant="contained" fullWidth sx={{ fontWeight: 900, fontSize: 16, py: 1.5, mt:"auto" }}>GET STARTED</Button>
          </Paper>
        </Slide>

        {/* Premium Plan */}
        <Slide in direction="up" timeout={animationTimeout+200}>
          <Paper
            elevation={16}
            sx={{
              minWidth: 300,
              maxWidth: 380,
              flex: 1.2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              borderRadius: 6,
              p: 4,
              alignItems: "center",
              position: 'relative',
              zIndex: 10,
              mt: { xs: 4, md: -3 },
              bgcolor: "linear-gradient(112deg,#fffbe7 70%,#ffefc4 100%)",
              border: "3.5px solid #fdad32",
              boxShadow: "0 0 32px #ffca7066,0 16px 54px #ffd90023"
            }}
          >
            <Chip
              label="Most Popular"
              color="warning"
              sx={{
                fontWeight: 800,
                px: 2,
                fontSize: 16,
                mb: 1,
                position: 'absolute',
                top: -24,
                left: '50%',
                transform: 'translateX(-50%)'
              }}
            />
            <Typography variant="h5" fontWeight={900} sx={{ color: "#fd8e15", mb: 0.5 }}>Premium</Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: 900,
                color: "#ff9c05",
                position: "relative",
                display: "inline-block",
                background: "linear-gradient(to right,#ffe3a3 30%,#fff8d0 65%,#ffe78c 100%)",
                px: 2.8,
                py: 0.7,
                borderRadius: 2.5,
                fontSize: 32,
                boxShadow: "0 0 28px 6px #ffe09b88,0 4px 16px #ffdf6d99"
              }}
            >₹499/month</Typography>
            <Chip label="Your Plan" color="success" sx={{ mb: 2, fontWeight: 700, fontSize: 16, px: 2 }} />
            <Divider sx={{ mb: 2, width: "100%" }} />
            <Box component="ul" sx={{ pl: 2, mb: 3, listStyle: "none", width: "100%" }}>
              <li style={{ marginBottom: 12, fontWeight: 600, color: "#222", fontSize: 18, display:"flex",alignItems:"center"}}>
                <RocketLaunchIcon sx={{ color: "#fdc045", mr:1 }} /> Unlimited reporting
              </li>
              <li style={{ marginBottom: 12, fontWeight: 600, color: "#222", fontSize: 18, display:"flex",alignItems:"center"}}>
                <TrendingUpIcon sx={{ color: "#1976d2", mr:1 }} /> Civic Score Boosts
              </li>
              <li style={{ marginBottom: 12, fontWeight: 600, color: "#222", fontSize: 18, display:"flex",alignItems:"center"}}>
                <SupportAgentIcon sx={{ color: "#32be52", mr:1 }} /> Priority Support
              </li>
              <li style={{ marginBottom: 12, fontWeight: 600, color: "#fd5c63", fontSize: 18, display:"flex",alignItems:"center"}}>
                <WorkspacePremiumIcon sx={{ color: "#fd5c63", mr:1 }} /> Early access to new features
              </li>
            </Box>
            <Button variant="outlined" color="warning" sx={{
              fontWeight: 900, fontSize: 17, py: 1.7, mt: "auto",
              borderWidth: 2.6, borderColor: "#ffb700", color: "#ef8c13",
              background: "#fffde5", boxShadow: "0 4px 18px #ffdb6f33"
            }}>
              CURRENT PLAN
            </Button>
          </Paper>
        </Slide>

        {/* Enterprise Plan */}
        <Slide in direction="up" timeout={animationTimeout+400}>
          <Paper
            elevation={4}
            sx={{
              minWidth: 260,
              maxWidth: 320,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              borderRadius: 4,
              p: 4,
              alignItems: "center",
              bgcolor: "#fff",
              mt: { xs: 4, md: 0 }
            }}
          >
            <Typography variant="h5" fontWeight={900} sx={{ color: "#213164" }}>Enterprise</Typography>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 800, color: "#38994c" }}>Contact Us</Typography>
            <Divider sx={{ mb: 2, width: "100%" }} />
            <Box component="ul" sx={{ pl: 2, mb: 3, listStyle: "none", width: "100%" }}>
              <li style={{ marginBottom: 12, fontWeight: 600, color: "#222", fontSize: 18, display:"flex",alignItems:"center"}}>
                <EmojiEventsIcon sx={{ color: "#b374d7", mr:1 }} /> Custom integration & reports
              </li>
              <li style={{ marginBottom: 12, fontWeight: 600, color: "#222", fontSize: 18, display:"flex",alignItems:"center"}}>
                <SupportAgentIcon color="secondary" sx={{mr:1}} /> Dedicated account manager
              </li>
              <li style={{ marginBottom: 12, fontWeight: 600, color: "#222", fontSize: 18, display:"flex",alignItems:"center"}}>
                <RocketLaunchIcon color="secondary" sx={{mr:1}} /> API Access
              </li>
            </Box>
            <Button variant="contained" color="secondary" sx={{ fontWeight: 900, fontSize: 16, py: 1.5, mt:"auto" }}>CONTACT SALES</Button>
          </Paper>
        </Slide>
      </Box>

      {/* FAQ DROPDOWN SECTION */}
      <Box sx={{ mt: 9, maxWidth: 600, mx: 'auto' }}>
        <Typography
          variant="h6"
          fontWeight={900}
          sx={{
            mb: 2,
            color: "#212573",
            textAlign: 'center',
            letterSpacing: 0.2
          }}
        >
          Frequently Asked Questions
        </Typography>
        {faqs.map(({ q, a }, idx) => (
          <Accordion key={idx} sx={{ mb: 1, borderRadius: 2, boxShadow: '0 1px 7px #ece8fd55' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${idx}-content`} id={`panel${idx}-header`}>
              <Typography sx={{ fontWeight: 600 }}>{q}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography fontSize={16}>{a}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
}
