import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import PersonIcon from "@mui/icons-material/Person";
import FavoriteIcon from "@mui/icons-material/Favorite";
import InfoIcon from "@mui/icons-material/Info";
import MenuBookOutlined from "@mui/icons-material/MenuBookOutlined";
import HistoryOutlined from "@mui/icons-material/HistoryOutlined";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import LogoutOutlined from "@mui/icons-material/LogoutOutlined";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";
import {
  Box,
  Button,
  Card,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
  alpha,
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
import { clearToken, setUser as setLocalUser } from "../lib/api.js";
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

const ProfileMenuSection = () => {
  const theme = useTheme();
  const { kp } = theme;
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedSection, setSelectedSection] = useState("access");
  const { user, setUser } = useLibrary();
  const selectId = React.useId();

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

  const displayName = user?.name || "Mansurxon Rustamov";
  const registerDate = user?.register_date
    ? user.register_date.replace(/^(\d+)-(\d+)-(\d+)\s.*$/, "$3.$2.$1")
    : "16.10.2026";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: { xs: 3, md: 4 },
        alignItems: { xs: "stretch", md: "flex-start" },
      }}
    >
      <Card
        sx={{
          width: { xs: "100%", md: 320 },
          flexShrink: 0,
          p: { xs: 2.5, md: 3 },
          borderRadius: 6,
          border: `1px solid ${kp.p.border}`,
          boxShadow: kp.shadows.card,
          bgcolor: kp.p.surface,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          alignSelf: "flex-start",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", pt: 1, pb: 2 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: alpha(kp.p.primary, 0.14),
              display: "grid",
              placeItems: "center",
              mb: 1.5,
            }}
          >
            <PersonIcon sx={{ fontSize: 44, color: kp.p.primary }} />
          </Box>
          <Typography
            component="h2"
            sx={{
              fontWeight: 800,
              fontSize: "1.25rem",
              color: kp.p.text,
              lineHeight: 1.25,
            }}
          >
            {displayName}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: kp.p.textSecondary,
              fontSize: "0.8125rem",
              mt: 0.5,
            }}
          >
            platformasida {registerDate}
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
            sx={{ my: 2 }}
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
            sx={{ width: "100%", my: 1, display: "flex", flexDirection: "column", gap: 0.75, p: 0 }}
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
                    minHeight: 46,
                    borderRadius: 999,
                    px: 2,
                    py: 1,
                    transition: "all .2s ease",
                    bgcolor: selected ? `${kp.p.primary} !important` : "transparent",
                    color: selected ? kp.p.onPrimary : kp.p.textSecondary,
                    "&:hover": {
                      bgcolor: selected ? `${kp.p.primaryHover} !important` : kp.p.surfaceAlt,
                      color: selected ? kp.p.onPrimary : kp.p.text,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 36,
                      color: selected ? kp.p.onPrimary : kp.p.textSecondary,
                      "& svg": { fontSize: 20 },
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={T(item.label)}
                    primaryTypographyProps={{
                      fontWeight: selected ? 700 : 500,
                      fontSize: "0.9375rem",
                    }}
                  />
                  {selected && (
                    <ChevronRightRounded sx={{ color: kp.p.onPrimary, fontSize: "1.25rem", ml: "auto" }} />
                  )}
                </ListItemButton>
              );
            })}
          </List>
        )}

        <Divider sx={{ my: 2, borderColor: kp.p.border }} />

        <Button
          variant="outlined"
          fullWidth
          startIcon={<LogoutOutlined aria-hidden="true" />}
          onClick={logout}
          sx={{
            borderRadius: 999,
            borderColor: kp.p.border,
            color: kp.p.text,
            fontWeight: 700,
            textTransform: "none",
            py: 1,
            "&:hover": {
              borderColor: kp.p.borderStrong,
              bgcolor: kp.p.surfaceAlt,
            },
          }}
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
