import React from 'react'
import { Box, ToggleButtonGroup, ToggleButton, Tabs, Tab } from "@mui/material";
import ViewList from "@mui/icons-material/ViewList";
import ViewModule from "@mui/icons-material/ViewModule";
import T from "../lib/translator";

const FilterTab = ({ label, isSelected, ...props }) =>
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

const BooksViewParams = ({selectedFilter, setSelectedFilter, view, viewMode, setViewMode, isMobile}) => {
  const [tabValue, setTabValue] = React.useState(selectedFilter === 'popular' ? 1 : 0);

  React.useEffect(() => {
    setTabValue(selectedFilter === 'popular' ? 1 : 0);
  }, [selectedFilter]);

  const handleTabChange = (event, newValue) => {
    console.log('tabValue = ' + newValue);
    const newFilter = newValue ? 'popular' : 'new';
    console.log('new filter = ' + newFilter);
    setTabValue(newValue);
    setSelectedFilter(newFilter);
  };

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  return (
    <Box sx={{
      display: "flex",
      flexDirection: { xs: "column", sm: "row" },
      alignItems: { xs: "stretch", sm: "center" },
      gap: { xs: 2, sm: 0 },
      width: { xs: "100%", sm: "auto" }
    }}>
      <Box sx={{
        height: 32,
        bgcolor: "#eeeeee",
        mr: { xs: 0, sm: 6 },
        width: { xs: "100%", sm: "auto" }
      }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          TabIndicatorProps={{ style: { display: "none" } }}
          sx={{ height: "100%" }}
          variant={{ xs: "fullWidth", sm: "standard" }}
        >
          <FilterTab label={T('Последние')} isSelected={tabValue === 0} />
          <FilterTab label={T('Популярные')} isSelected={tabValue === 1} />
        </Tabs>
      </Box>
      {/* Hide view mode toggle on mobile since we auto-switch to grid */}
      {!isMobile && (
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          sx={{
            width: { xs: "100%", sm: "auto" },
            '& .MuiToggleButton-root': {
              flex: { xs: 1, sm: 'initial' }
            }
          }}
        >
          <ToggleButton
            value="list"
            aria-label={T('Отображать списком')}
            sx={{
              '&.Mui-selected': {
                backgroundColor: "primary.main",
                color: "lightwhite.main",
              }
            }}
          >
            <ViewList />
          </ToggleButton>
          <ToggleButton
            value="grid"
            aria-label={T('Отображать плитками')}
            sx={{
              '&.Mui-selected': {
                backgroundColor: "primary.main",
                color: "lightwhite.main",
              }
            }}
          >
            <ViewModule />
          </ToggleButton>
        </ToggleButtonGroup>
      )}
    </Box>
  )
}

export default BooksViewParams