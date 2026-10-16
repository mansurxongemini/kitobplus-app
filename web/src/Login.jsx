import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
//import { ThemeProvider } from './login/ThemeProvider';
import { request } from "./lib/api";
import { clearToken } from "./lib/api";
import AppleIcon from '@mui/icons-material/Apple';
import { Link } from "react-router-dom";
// Import images
import group110001 from "./login/img/group-1-10001.png"
import logo_icon from "./login/img/logo_icon.png"
import group19 from "./login/img/group19.png"
import rectangle21815 from "./login/img/rectangle-21815.png"
import PhoneInput from "react-phone-input-2"
import 'react-phone-input-2/lib/style.css'
import { getMode } from './lib/api'
import { isPossiblePhoneNumber } from 'react-phone-number-input'
import './css/form.css';
import { sms, verify } from './lib/auth.ts'
import T from './lib/translator.js'
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import AppleLogin from 'react-apple-login';
import LoginForm from "./login/LoginForm.jsx";

const Login = () => {
  return (
    //<ThemeProvider>
        <Box
            display="flex"
            justifyContent="center"
            width="100%"
            bgcolor="background.paper"
            sx={{ minHeight: "100vh" }}
        >
        <Box
            position="relative"
            width="100%"
            maxWidth="1440px"
            height={{ xs: "auto", md: "1024px" }}
            minHeight={{ xs: "100vh", md: "1024px" }}
            sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" }
            }}
        >
            {/* Left side with image and overlay */}
            <Box
                position={{ xs: "relative", md: "absolute" }}
                width={{ xs: "100%", md: "705px" }}
                height={{ xs: "200px", md: "1024px" }}
                top={0}
                left={0}
                sx={{
                    display: { xs: "block", md: "block" }
                }}
            >
            <Box position="relative" width={{ xs: "100%", md: "766px" }} height="100%">
                <Box
                    component="img"
                    src={rectangle21815}
                    alt="Background"
                    sx={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        top: 0,
                        left: 0,
                        objectFit: "cover",
                    }}
                />

                    <Box
                    position="absolute"
                    width="100%"
                    height="100%"
                    top={0}
                    left={0}
                    bgcolor="maindark.main"
                    sx={{ opacity: 0.7 }}
                    />
                    <Link to="/" title={T('На главную')}>
                    {/* Logo */}
                        <Box
                            position="absolute"
                            width={{ xs: "200px", md: "251px" }}
                            height={{ xs: "36px", md: "48px" }}
                            top={{ xs: "20px", md: "50px" }}
                            left={{ xs: "20px", sm: "40px", md: "124px" }}
                        >
                            <Box
                                component="img"
                                src={logo_icon}
                                position="absolute"
                                width={{ xs: "30px", md: "39px" }}
                                height={{ xs: "36px", md: "48px" }}
                                top={0}
                                left={0}
                            />

                            <Box
                                component="img"
                                src={group19}
                                alt="Logo"
                                sx={{
                                    position: "absolute",
                                    width: { xs: "130px", md: "171px" },
                                    height: { xs: "18px", md: "24px" },
                                    top: { xs: "9px", md: "12px" },
                                    left: { xs: "40px", md: "54px" },
                                }}
                            />
                        </Box>
                    </Link>

                {/* Decorative image - hidden on mobile */}
                <Box
                    position="absolute"
                    width="496px"
                    height="640px"
                    top="437px"
                    left="270px"
                    sx={{
                        display: { xs: "none", md: "block" }
                    }}
                >
                    <Box position="relative" height="640px">
                        <Box
                        position="absolute"
                        width="236px"
                        height="477px"
                        top="163px"
                        left="254px"
                        bgcolor="#000000"
                        borderRadius="118.05px/238.41px"
                        sx={{
                            filter: "blur(45px)",
                            opacity: 0.2,
                        }}
                        />

                        <Box
                        component="img"
                        src={group110001}
                        alt="Decorative"
                        sx={{
                            position: "absolute",
                            width: "496px",
                            height: "587px",
                            top: 0,
                            left: 0,
                            objectFit: "cover",
                        }}
                        />
                    </Box>
                </Box>
            </Box>
            </Box>

            {/* Right side with login form */}
            <Box
                position={{ xs: "relative", md: "absolute" }}
                width={{ xs: "100%", sm: "90%", md: "379px" }}
                maxWidth={{ xs: "400px", md: "379px" }}
                height="auto"
                top={{ xs: 0, md: "278px" }}
                left={{ xs: "50%", md: "800px" }}
                sx={{
                    transform: { xs: "translateX(-50%)", md: "none" },
                    px: { xs: 2, sm: 0 },
                    py: { xs: 4, md: 0 },
                    mt: { xs: 0, md: 0 }
                }}
            >
                <Box>
                    <LoginForm title={T('Регистрация/вход')} />
                </Box>
            </Box>
        </Box>
        </Box>
    //</ThemeProvider>
  );
};

export default Login;
