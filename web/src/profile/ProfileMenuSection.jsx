import Favorite from "@mui/icons-material/Favorite";
import Info from "@mui/icons-material/Info";
import Person from "@mui/icons-material/Person";
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import {
  Box,
  Card,
  Tab,
  Tabs,
  Typography,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import {Avatar} from "@mui/material";
import EditProfileSection from "./EditProfileSection";
import HelpSection from "./HelpSection";
import RulesSection from "./RulesSection";
import AccessSection from "./AccessSection.jsx"
import useLibrary from "../LibraryContext";
import { clearToken } from "../lib/api.js";
import { setUser as setLocalUser } from '../lib/api';
import T from "../lib/translator.js";

const ProfileMenuSection = () => {
  const menuItems = [
    {
      id: 1,
      icon: <WorkspacePremiumIcon />,
      text: T("Доступ"),
      component: "access",
    },
    {
      id: 2,
      icon: <Person />,
      text: T("Мои данные"),
      component: "profile",
    },
    {
      id: 3,
      icon: <Favorite />,
      text: T("Помощь"),
      component: "help",
    },
    {
      id: 4,
      icon: <Info />,
      text: T("Правила пользования"),
      component: "rules",
    },
  ];

  const [selectedSection, setSelectedSection] = useState("access");
  const { user, setUser } = useLibrary();

  const handleTabChange = (event, newValue) => {
    setSelectedSection(newValue);
  };
  
  React.useEffect(() => {
    if (user === null) {
      window.location = '/';
    }
  }, [user]);
  const renderSelectedSection = () => {
    switch (selectedSection) {
      case "access":
        return <AccessSection />;
      case "profile":
        return <EditProfileSection />;
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
  }

  return (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: { xs: 2, md: 3 }, flex: 1}}>
      {/* Меню профиля */}
      <Card
        sx={{
          width: { xs: "100%", md: 377 },
          border: "1px solid",
          borderColor: "neutral.100",
          borderRadius: 0,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          alignSelf: "flex-start",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: { xs: 3, md: 4 },
            mb: { xs: 2, md: 4 },
          }}
        >
          <Avatar
            src="/ellipse-15.png"
            alt={T('Профиль')}
            sx={{ width: { xs: 80, md: 110 }, height: { xs: 80, md: 110 }, mb: 1 }}
          />
        </Box>

        <Box sx={{ mt: { xs: 1, md: 2 }, textAlign: "center", px: 2 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "text.primary",
              fontSize: { xs: "18px", md: "24px" },
            }}
          >
            {user?.name}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#9da0a2",
              mt: 0.5,
              fontSize: { xs: "12px", md: "14px" },
            }}
          >
            {T('в платформе с')} {user?.register_date?.replace(/^(\d+)-(\d+)-(\d+)\s.*$/, '$3.$2.$1')}
          </Typography>
        </Box>

        <Tabs
          value={selectedSection}
          onChange={handleTabChange}
          orientation="vertical"
          variant="standard"
          sx={{
            width: "100%",
            mt: { xs: 1, md: 2 },
            "& .MuiTabs-indicator": {
              backgroundColor: "#00BCD4",
              width: 4,
            },
            "& .MuiTab-root": {
              alignItems: "flex-start",
              textAlign: "left",
              minHeight: { xs: 44, md: 48 },
              mx: 2,
              my: 0.5,
              px: 2,
              justifyContent: "flex-start",
              textTransform: "none",
              fontWeight: "bold",
              fontSize: { xs: "0.875rem", md: "1.125rem" },
              "&.Mui-selected": {
                backgroundColor: "#00BCD4",
                color: "white",
                "& .MuiSvgIcon-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                },
              },
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
              "&.Mui-selected:hover": {
                backgroundColor: "#00BCD4",
              },
            },
          }}
        >
          {menuItems.map((item, index) => (
            <Tab
              id={index == 0 ? 'main_content' : undefined}
              key={item.id}
              value={item.component}
              icon={item.icon}
              label={item.text}
              iconPosition="start"
              sx={{
                "& .MuiSvgIcon-root": {
                  minWidth: 40,
                  color: "text.secondary",
                  mr: 1,
                  fontSize: { xs: "1.2rem", md: "1.5rem" },
                },
              }}
            />
          ))}
        </Tabs>
        <Button onClick={logout} sx={{m: { xs: 1.5, md: 1 }, color: 'gray', fontSize: { xs: "14px", md: "16px" }}}>{T('Выход')}</Button>
      </Card>

      {/* Выбранная секция */}
      <Box sx={{ flex: 1 }}>
        {renderSelectedSection()}
      </Box>
    </Box>
  );
};

export default ProfileMenuSection;
