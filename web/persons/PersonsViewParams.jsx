import React from "react";
import { Box, ToggleButtonGroup, ToggleButton, Tabs, Tab } from "@mui/material";
import ViewList from "@mui/icons-material/ViewList";
import ViewModule from "@mui/icons-material/ViewModule";
import T from "../lib/translator";

const FilterTab = ({ label, isSelected, ...props }) => (
  <Tab
    label={label}
    {...props}
    sx={{
      px: 4, // 32px слева и справа
      minWidth: 'auto',
      whiteSpace: 'nowrap',
      minHeight: 32,
      height: 32,
      bgcolor: isSelected ? "primary.main" : "transparent",
      color: isSelected ? "lightwhite.main" : "neutral.200",
      fontWeight: "bold",
      fontSize: 18,
      textTransform: "none",
      "&.Mui-selected": {
        color: "lightwhite.main",
      },
    }}
  />
);

const PersonsViewParams = ({ selectedFilter, setSelectedFilter, viewMode, setViewMode }) => {
  const filters = ['new', 'popular', 'recommend'];
  const [tabValue, setTabValue] = React.useState(filters.indexOf(selectedFilter) !== -1 ? filters.indexOf(selectedFilter) : 0);

  React.useEffect(() => {
    const index = filters.indexOf(selectedFilter);
    if (index !== -1) {
      setTabValue(index);
    }
  }, [selectedFilter]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSelectedFilter(filters[newValue]);
  };

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ height: 32, bgcolor: "#eeeeee", mr: 6 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          TabIndicatorProps={{ style: { display: "none" } }}
          sx={{ height: "100%" }}
        >
          <FilterTab label={T("Последние")} isSelected={tabValue === 0} />
          <FilterTab label={T("Популярные")} isSelected={tabValue === 1} />
          {false && <FilterTab label={T("Рекомендуемые")} isSelected={tabValue === 2} />}
        </Tabs>
      </Box>
      <ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={handleViewModeChange}
      >
        <ToggleButton
          value="list"
          aria-label={T("Отображать списком")}
          sx={{
            "&.Mui-selected": {
              backgroundColor: "primary.main",
              color: "lightwhite.main",
            },
          }}
        >
          <ViewList />
        </ToggleButton>
        <ToggleButton
          value="grid"
          aria-label={T("Отображать плитками")}
          sx={{
            "&.Mui-selected": {
              backgroundColor: "primary.main",
              color: "lightwhite.main",
            },
          }}
        >
          <ViewModule />
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default PersonsViewParams;
