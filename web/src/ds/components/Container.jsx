import { Box, useTheme } from "@mui/material";

// Единая ширина контента и поля по краям для всех страниц.
const Container = ({ children, sx, component = "div", ...rest }) => {
  const { kp } = useTheme();
  return (
    <Box component={component} sx={{ width: "100%", maxWidth: kp.layout.maxWidth + 48, mx: "auto", px: { xs: 2, sm: 3 }, ...sx }} {...rest}>
      {children}
    </Box>
  );
};

export default Container;
