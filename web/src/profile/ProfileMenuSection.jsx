import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import PersonIcon from "@mui/icons-material/Person";
import FavoriteIcon from "@mui/icons-material/Favorite";
import InfoIcon from "@mui/icons-material/Info";
import MenuBookOutlined from "@mui/icons-material/MenuBookOutlined";
import HistoryOutlined from "@mui/icons-material/HistoryOutlined";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import LogoutOutlined from "@mui/icons-material/LogoutOutlined";
import {
  Avatar,
  Box,
  Button,
  Card,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import EditProfileSection from "./EditProfileSection";
import HelpSection from "./HelpSection";
import RulesSection from "./RulesSection";
import AccessSection from "./AccessSection.jsx";
import ShelfSection from "./ShelfSection.jsx";
import HistorySection from "./HistorySection.jsx";
import SettingsSection from "./SettingsSection.jsx";
import useLibrary from "../LibraryContext";
import { clearToken } from "../lib/api.js";
import { setUser as setLocalUser } from "../lib/api";
import T from "../lib/translator.js";

const SECTIONS = [
  { id: "access", label: "Подписка и тарифы", icon: <WorkspacePremiumIcon /> },
  { id: "profile", label: "Мои данные", icon: <PersonIcon /> },
  { id: "shelf", label: "Книжная полка", icon: <MenuBookOutlined /> },
  { id: "history", label: "История прослушивания", icon: <HistoryOutlined /> },
  { id: "settings", label: "Настройки", icon: <SettingsOutlined /> },
  { id: "help", label: "Помощь", icon: <FavoriteIcon /> },
  { id: "rules", label: "Правила пользования", icon: <InfoIcon /> },
];

// Profile navigation: a vertical section list on desktop, a labelled select on
// mobile; the selected section renders in a content card on the right.
const ProfileMenuSection = () => {
  const { kp } = useTheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedSection, setSelectedSection] = useState("access");
  const { user, setUser } = useLibrary();
  const selectId = React.useId();

  React.useEffect(() => {
    if (user === null) {
      window.location = "/";
    }
  }, [user]);

  const renderSelectedSection = () => {
    switch (selectedSection) {
      case "access":
        return <AccessSection />;
      case "profile":
        return <EditProfileSection />;
      case "shelf":
        return <ShelfSection />;
      case "history":
        return <HistorySection />;
      case "settings":
        return <SettingsSection />;
      case "help":
        return <HelpSection />;
      case "rules":
        return <RulesSection />;
      default:
        return <AccessSection />;
    }
  };

  const logout = () => {
    clearToken();
    setLocalUser(null);
    setUser(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: { xs: 2, md: 3 },
        alignItems: { xs: "stretch", md: "flex-start" },
      }}
    >
      <Card
        sx={{
          width: { xs: "100%", md: 340 },
          flexShrink: 0,
          p: { xs: 2.5, md: 3 },
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          alignSelf: "flex-start",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <Avatar
            src="/ellipse-15.png"
            alt=""
            aria-hidden="true"
            sx={{ width: { xs: 80, md: 96 }, height: { xs: 80, md: 96 }, mb: 1 }}
          />
          <Typography variant="h2" sx={{ fontSize: "1.375rem" }}>
            {user?.name}
          </Typography>
          <Typography variant="body2" sx={{ color: kp.p.textSecondary, mt: 0.5 }}>
            {T("в платформе с")} {user?.register_date?.replace(/^(\d+)-(\d+)-(\d+)\s.*$/, "$3.$2.$1")}
          </Typography>
        </Box>

        {isMobile ? (
          <TextField
            select
            id={selectId}
            label={T("Раздел профиля")}
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            fullWidth
            sx={{ mt: 2.5 }}
          >
            {SECTIONS.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {T(item.label)}
              </MenuItem>
            ))}
          </TextField>
        ) : (
          <List
            component="nav"
            aria-label={T("Раздел профиля")}
            sx={{ width: "100%", mt: 2, display: "flex", flexDirection: "column", gap: 0.5 }}
          >
            {SECTIONS.map((item) => {
              const selected = item.id === selectedSection;
              return (
                <ListItemButton
                  key={item.id}
                  selected={selected}
                  aria-current={selected ? "page" : undefined}
                  onClick={() => setSelectedSection(item.id)}
                  sx={{
                    minHeight: 56,
                    borderRadius: 3,
                    px: 2,
                    "&.Mui-selected": {
                      bgcolor: kp.p.primary,
                      color: kp.p.onPrimary,
                      "&:hover": { bgcolor: kp.p.primaryHover },
                      "& .MuiSvgIcon-root": { color: kp.p.onPrimary },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 44, color: kp.p.textSecondary }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={T(item.label)}
                    primaryTypographyProps={{ fontWeight: selected ? 700 : 600 }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        )}

        <Button
          variant="outlined"
          size="large"
          fullWidth
          startIcon={<LogoutOutlined aria-hidden="true" />}
          onClick={logout}
          sx={{ mt: 2.5, borderWidth: 2, "&:hover": { borderWidth: 2 } }}
        >
          {T("Выход")}
        </Button>
      </Card>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        {renderSelectedSection()}
      </Box>
    </Box>
  );
};

export default ProfileMenuSection;
