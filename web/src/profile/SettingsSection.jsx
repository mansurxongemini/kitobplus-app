import React from "react";
import { Box, Typography } from "@mui/material";
import { DisplaySettingsPanel } from "../ds/components/HeaderMenus";
import T from "../lib/translator.js";

// "Sozlamalar": the same appearance and text-size panel as in the site header,
// so there is a single implementation and no new logic.
const SettingsSection = () => (
  <Box component="section" aria-labelledby="profile-settings-title">
    <Typography id="profile-settings-title" variant="h3" component="h2" sx={{ mb: 3 }}>{T("Настройки")}</Typography>
    <DisplaySettingsPanel />
  </Box>
);

export default SettingsSection;
