import { Avatar, Box, Divider, Stack, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import personBg from './img/bg.png'
import T from "../lib/translator";

const PersonBanner = ({userData, loading, error, setError}) => {
  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          height: 112,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 1,
          bgcolor: "#f5f5f5",
        }}
      >
        <Typography>{T('Загрузка...')}</Typography>
      </Box>
    );
  }

  if (!userData) {
    return null;
  }

  console.log(userData);
  
  return (
    <Box
      sx={{
        width: "100%",
        height: 112, // 28*4=112px
        position: "relative",
        borderRadius: 1,
        overflow: "hidden",
        backgroundImage: `url(${personBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{
          height: "100%",
          position: "relative",
          zIndex: 1,
          p: 2,
        }}
      >
        {/* Avatar */}
        <Avatar
          src={userData.avatarUrl}
          alt={userData.name}
          sx={{
            width: 76,
            height: 76,
            my: "auto",
          }}
        />

        {/* User info */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h6"
            component="h1"
            sx={{
              fontWeight: "bold",
              color: "#F9FAFB", // lightwhite from original
              fontSize: "1.25rem",
            }}
          >
            {userData.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#B5C8CC",
              fontSize: "1rem",
            }}
          >
            {T('в платформе с') + ' ' + userData.joinDate.replace(/\s.+$/, '')}
          </Typography>
        </Box>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Stats section */}
        <Stack
          direction="row"
          spacing={3}
          divider={
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.1)", // #ffffff1a from original
                my: 1,
              }}
            />
          }
          sx={{
            alignItems: "center",
            height: "100%",
          }}
        >
          {userData.stats.map((stat, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 125,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)", // #ffffffb2 from original
                  fontSize: "1rem",
                  fontWeight: 500,
                  textAlign: "center",
                }}
              >
                {stat.label}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "#F9FAFB", // lightwhite from original
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  textAlign: "center",
                  mt: 0.5,
                }}
              >
                {stat.value}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};

export default PersonBanner;
