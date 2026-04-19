import React, { useState } from 'react';
import {
  Box, Paper, Typography, Avatar, Button, Chip, Stack, IconButton,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions, Fade,
  Snackbar, Grid, Tooltip, Divider, Tabs, Tab
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

// New, distinct avatar for clear visual
const AVATAR_URL = "https://randomuser.me/api/portraits/men/65.jpg";

const BG = "#faf7fc";
const CARD_BG = "#fff";
const MAIN_TEXT = "#20234d";
const SUB_TEXT = "#7e8baf";
const BLUE = "#417ffa";
const GREEN = "#22bb88";
const BORDER = "#e2e6f5";

const initialUser = {
  name: "Alex Ford",
  tag: "Vigilant",
  email: "alex.ford@example.com",
  avatar: AVATAR_URL,
  plan: "Premium",
  city: "Chennai",
  joined: "March 2023",
  about: "Passionate about city cleanliness and civic responsibility. I'm an active contributor to public safety through vigilant billboard reporting.",
  stats: [
    { label: "Reports Submitted", value: 86 },
    { label: "Flagged Reports", value: 18 },
    { label: "Civic Score", value: 2380 },
    { label: "Member Since", value: "March 2023" },
  ],
};

const achievementsList = [
  {
    id: 'civic2000',
    title: "Civic Score 2000+",
    image: "https://img.icons8.com/color/96/000000/champion-r.png",
    desc: "Awarded for reaching a civic score above 2000. Your vigilance keeps cities safer.",
    claimed: true,
  },
  {
    id: 'flag10',
    title: "10+ Violations Flagged",
    image: "https://img.icons8.com/color/96/000000/flag.png",
    desc: "For spotting and reporting 10+ violations. You truly make a difference!",
    claimed: true,
  },
  {
    id: 'vigilstar',
    title: "Vigilance Star",
    image: "https://img.icons8.com/color/96/000000/star.png",
    desc: "For consistent reporting over 6 months.",
    claimed: false,
  },
  {
    id: 'legenduser',
    title: "Legend User",
    image: "https://img.icons8.com/color/96/000000/certificate.png",
    desc: "Recognized for community mentoring and assisting fellow sentinels.",
    claimed: false,
  },
];

const feedTabs = ["Profile", "Achievements"];

export default function ProfilePage() {
  const [user, setUser] = useState(initialUser);
  const [editing, setEditing] = useState(false);
  const [editFields, setEditFields] = useState({ name: user.name, about: user.about });
  const [claimPopup, setClaimPopup] = useState({ open: false, achv: null });
  const [claimSnackbar, setClaimSnackbar] = useState(false);
  const [userAchievements, setUserAchievements] = useState(achievementsList);
  const [feedTab, setFeedTab] = useState(0);

  const claimedAchievements = userAchievements.filter(a => a.claimed);

  const handleEdit = () => setEditing(true);
  const handleCancel = () => {
    setEditing(false);
    setEditFields({ name: user.name, about: user.about });
  };
  const handleSave = () => {
    setUser({ ...user, name: editFields.name.trim(), about: editFields.about.trim() });
    setEditing(false);
  };

  const handleClaim = (id) => {
    const achv = userAchievements.find(a => a.id === id);
    setUserAchievements(prev => prev.map(a => (a.id === id ? { ...a, claimed: true } : a)));
    setClaimPopup({ open: true, achv });
    setTimeout(() => setClaimSnackbar(true), 600);
  };

  const handlePopupClose = () => setClaimPopup({ open: false, achv: null });
  const handleAdd = () => { setClaimPopup({ open: false, achv: null }); setClaimSnackbar(false); };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: BG, overflowX: 'hidden', pt: { xs: 1, md: 4 } }}>
      {/* No extra side space; fills width */}
      <Grid
        container
        spacing={3}
        sx={{
          maxWidth: "98vw",
          boxSizing: 'border-box',
          alignItems: "flex-start",
          mx: 0,
        }}
      >
        {/* Left: Avatar, name, contacts */}
        <Grid item xs={12} md={3} lg={2.7}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', pl: { xs: 1, md: 4 }, pr: 1 }}>
            <Avatar src={user.avatar} sx={{ width: 100, height: 100, mb: 2, bgcolor: "#eff0fa" }} />
            <Stack direction='row' alignItems='center' spacing={1} mb={0.5}>
              {!editing ?
                (<Typography variant='h5' color={MAIN_TEXT} fontWeight='bold'>{user.name}</Typography>) :
                (<TextField
                  variant='standard'
                  value={editFields.name}
                  onChange={e => setEditFields({ ...editFields, name: e.target.value })}
                  sx={{ input: { color: MAIN_TEXT, fontWeight: 700, fontSize: '1.25rem' }, width: 110 }}
                />)
              }
              <Tooltip title="Edit Name">
                <IconButton onClick={handleEdit} sx={{ color: BLUE, p: .5 }}>
                  <EditIcon fontSize='small' />
                </IconButton>
              </Tooltip>
            </Stack>
            <Typography color={SUB_TEXT} fontWeight={600} fontSize={15} mb={.4}>
              {user.tag} · {user.city}
            </Typography>
            <Chip label={user.plan} color="success" size="small" sx={{ mb: 1, px: 1.2, fontWeight: 600, fontSize: 13, bgcolor: "#eaffec", color: GREEN }} />
            <Typography color={BLUE} fontWeight={700} fontStyle='italic' fontSize={14} mb={.3}>
              Joined {user.joined}
            </Typography>
            <Typography color={SUB_TEXT} fontSize={14}>{user.email}</Typography>
            <Stack direction='row' spacing={1} mt={1} mb={1.2}>
              <IconButton sx={{ color: '#1da1f2' }}><TwitterIcon fontSize="small" /></IconButton>
              <IconButton sx={{ color: '#c13584' }}><InstagramIcon fontSize="small" /></IconButton>
              <IconButton sx={{ color: '#0077b5' }}><LinkedInIcon fontSize="small" /></IconButton>
              <IconButton sx={{ color: '#1877f2' }}><FacebookIcon fontSize="small" /></IconButton>
            </Stack>
            {/* Bio Edit (edit below contacts if mobile, top if desktop, mirrors your image) */}
            {editing ? (
              <>
                <TextField
                  multiline
                  minRows={2}
                  fullWidth
                  variant='outlined'
                  value={editFields.about}
                  onChange={e => setEditFields({ ...editFields, about: e.target.value })}
                  sx={{ mt: 2, mb: 2, fontSize: 15, minWidth: 180, maxWidth: 270 }}
                />
                <Stack direction='row' spacing={2} mt={1} justifyContent="flex-start">
                  <Button variant='contained' color='success' size="small" startIcon={<SaveIcon />} onClick={handleSave}>Save</Button>
                  <Button variant='outlined' color='error' size="small" startIcon={<CancelIcon />} onClick={handleCancel}>Cancel</Button>
                </Stack>
              </>
            ) : (
              <Typography sx={{ mt: 1, color: "#8793b4", minHeight: 44, fontSize: 14.5, textAlign: "left", maxWidth: 320 }}>{user.about}</Typography>
            )}
          </Box>
        </Grid>

        {/* Right: Content, tabs, stats, achievements */}
        <Grid item xs={12} md={9} lg={9.3}>
          <Box sx={{ px: { xs: 1, md: 1 }, pr: { xs: 0 }, width: "100%" }}>
            <Box sx={{ mb: 1 }}>
              <Tabs
                value={feedTab}
                onChange={(_, val) => setFeedTab(val)}
                TabIndicatorProps={{ sx: { background: `linear-gradient(90deg,#38ecb6,#407ffe)` } }}
                sx={{
                  mb: 1.8, fontWeight: 700,
                  ".MuiTab-root": { fontWeight: 800, fontSize: 17, px: 4, textTransform: "none" }
                }}
              >
                <Tab label="Profile" />
                <Tab label="Achievements" />
              </Tabs>
            </Box>
            {feedTab === 0 &&
              <>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={3}>
                  {user.stats.map(stat => (
                    <Paper key={stat.label} sx={{
                      bgcolor: '#f3f8ff',
                      color: BLUE,
                      borderRadius: 2.5,
                      p: 2,
                      flex: 1,
                      textAlign: 'center',
                      minWidth: 120,
                      fontWeight: 700,
                      fontSize: 15
                    }}>
                      <Typography sx={{ color: SUB_TEXT, fontWeight: 700, pb: .6, fontSize: 15 }}>{stat.label}</Typography>
                      <Typography variant="h5" sx={{ color: stat.label === "Civic Score" ? BLUE : GREEN, fontWeight: 900, fontSize: 22 }}>
                        {stat.value}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
                <Paper sx={{
                  bgcolor: CARD_BG,
                  border: `1.3px solid ${BORDER}`,
                  borderRadius: 2.8,
                  boxShadow: "0 2px 12px #dbeaff1c",
                  p: 2.2,
                }}>
                  <Typography fontWeight={900} fontSize={18.5} sx={{ color: BLUE, mb: 2, letterSpacing: 0.27 }}>
                    Achievements
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    {userAchievements.map(({ id, image, title, desc, claimed }) => (
                      <Grid item xs={12} sm={6} md={4} key={id}>
                        <Paper elevation={0} sx={{
                          p: 2.1,
                          borderRadius: 2.8,
                          bgcolor: claimed ? '#f3fcf9' : '#f7f9fd',
                          border: claimed ? `2px solid #23d6b4` : `2px solid #e0e8f6`,
                          color: MAIN_TEXT,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          boxShadow: claimed ? "0 0 16px #75f9d016" : "none",
                          height: "100%",
                          minHeight: 160
                        }}>
                          <Avatar src={image} variant='rounded' sx={{ width: 41, height: 41, mb: 1, bgcolor: '#e4f3ee' }} />
                          <Typography fontWeight={700} fontSize={15} mb={0.3} align='center' sx={{ color: BLUE }}>{title}</Typography>
                          <Typography sx={{ fontWeight: 400, fontSize: 13, color: SUB_TEXT, textAlign: "center", flexGrow: 1 }}>
                            {desc}
                          </Typography>
                          {claimed
                            ? <Chip label='Claimed' color='success' size='small' icon={<AssignmentTurnedInIcon />} sx={{ mt: 1, fontWeight: 700 }} />
                            : <Button size='small' variant='contained' color='primary' sx={{ mt: 1, fontWeight: 700, px: 2, letterSpacing: '.01em' }}
                              onClick={() => handleClaim(id)}>
                              Claim
                            </Button>
                          }
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </>
            }
            {/* Achievements Tab */}
            {feedTab === 1 &&
              <Paper sx={{
                bgcolor: CARD_BG,
                border: `1.3px solid ${BORDER}`,
                boxShadow: "0 2px 14px #dbeaff1c",
                borderRadius: 3,
                p: 4,
                mt: 1,
              }}>
                <Typography variant="h6" fontWeight={900} color={BLUE} mb={2}>
                  Your Achievements
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2.1}>
                  {claimedAchievements.length === 0 && (
                    <Grid item xs={12}>
                      <Typography textAlign="center" color={SUB_TEXT} my={3}>
                        You haven't claimed any achievements yet.
                      </Typography>
                    </Grid>
                  )}
                  {claimedAchievements.map(({ id, image, title, desc }) => (
                    <Grid item xs={12} sm={6} md={4} key={id}>
                      <Paper elevation={0} sx={{
                        p: 2.1,
                        borderRadius: 2.8,
                        bgcolor: "#f3faf6",
                        border: `2px solid #23d6b4`,
                        color: MAIN_TEXT,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        boxShadow: "0 0 16px #62f9bf26",
                        height: "100%"
                      }}>
                        <Avatar src={image} variant='rounded' sx={{ width: 41, height: 41, mb: 1, bgcolor: "#e0f8e9" }} />
                        <Typography fontWeight={700} fontSize={15} mb={0.3} align='center' sx={{ color: BLUE }}>{title}</Typography>
                        <Typography sx={{ fontWeight: 400, fontSize: 13, color: SUB_TEXT, textAlign: "center" }}>
                          {desc}
                        </Typography>
                        <Chip label='Claimed' color='success' size='small' icon={<AssignmentTurnedInIcon />} sx={{ mt: 1, fontWeight: 700 }} />
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            }
          </Box>
        </Grid>
      </Grid>

      {/* Dialog for achievement claim */}
      <Dialog open={claimPopup.open} onClose={handlePopupClose} PaperProps={{
        sx: { bgcolor: '#fdfdff', borderRadius: 3, p: 3, textAlign: 'center', color: MAIN_TEXT }
      }} TransitionComponent={Fade}>
        <DialogTitle sx={{ color: BLUE, fontWeight: 'bold', fontSize: '1.32rem' }}>Achievement Claimed!</DialogTitle>
        <DialogContent>
          <Avatar src={claimPopup.achv?.image} sx={{ width: 72, height: 72, mx: 'auto', mb: 2 }} />
          <Typography variant="h6" mb={1}>{claimPopup.achv?.title}</Typography>
          <Typography mb={2} color={SUB_TEXT}>{claimPopup.achv?.desc}</Typography>
          <Button variant="contained" color="success" sx={{ mb: 1, fontWeight: 700, px: 4, letterSpacing: ".05em" }} onClick={handleAdd}>
            Add to Story
          </Button>
          <Stack direction="row" spacing={3} justifyContent="center" mt={1}>
            <IconButton sx={{ bgcolor: '#eaf4fa', color: '#c13584' }}><InstagramIcon /></IconButton>
            <IconButton sx={{ bgcolor: '#eaf4fa', color: '#185aab' }}><LinkedInIcon /></IconButton>
            <IconButton sx={{ bgcolor: '#eaf4fa', color: '#1da1f2' }}><TwitterIcon /></IconButton>
            <IconButton sx={{ bgcolor: '#eaf4fa', color: '#3b5998' }}><FacebookIcon /></IconButton>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button color="inherit" onClick={handlePopupClose}>Close</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={claimSnackbar}
        autoHideDuration={1800}
        onClose={() => setClaimSnackbar(false)}
        message={<span style={{ color: '#23bb88', fontWeight: 'bold' }}>Achievement claimed!</span>}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </Box>
  );
}
