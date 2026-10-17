import {
  Box,
  Typography,
  Card,
  Button,
  Modal,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import React, { useState } from "react";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import CalendarTodayRounded from "@mui/icons-material/CalendarTodayRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import CachedIcon from "@mui/icons-material/Cached";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import useLibrary from "../LibraryContext";
import { pay } from "../lib/auth.ts";
import Register from "./Register.jsx";
import T, { tr } from "../lib/translator.js";
import { request } from "../lib/api.js";
import LoginForm from "../login/LoginForm";
import { SITE_URL } from "../lib/config";

const AccessSection = () => {
  const { user, setUser } = useLibrary();
  const { kp } = useTheme();
  const effectiveUser = user || {
    name: "Mansurxon Rustamov",
    plans_name: "Sinov",
    plan_end_str: "23.10.2026",
    phone: "+998 90 123 45 67",
  };

  const [isDisabilityModalOpen, setIsDisabilityModalOpen] = useState(false);
  const errorMessage = T("Пожалуйста, введите номер телефона на вкладке \"Мои данные\"");
  const [isPhoneModalOpened, setIsPhoneModalOpened] = useState(false);
  const [selectedPlansId, setSelectedPlansId] = useState();

  const phoneUpdated = () => {
    setIsPhoneModalOpened(false);
    handlePayment(selectedPlansId);
  };

  const handlePayment = async (plans_id) => {
    if (!effectiveUser.phone) {
      setSelectedPlansId(plans_id);
      setIsPhoneModalOpened(true);
      return;
    }

    try {
      const result = await pay(plans_id);
      if (result && result.data) {
        const { service_id, merchant_id, merchant_user_id, amount, transaction_param } = result.data;
        const paymentUrl =
          `https://my.click.uz/services/pay?service_id=${service_id}&merchant_id=${merchant_id}&merchant_user_id=${merchant_user_id}&amount=${amount}&transaction_param=` +
          encodeURIComponent(transaction_param) +
          `&return_url=` +
          encodeURIComponent(SITE_URL + "/profile");
        window.location.href = paymentUrl;
      }
    } catch (error) {
      alert(error);
    }
  };

  const handleDisabilityAccess = () => {
    if (!effectiveUser.phone) {
      alert(errorMessage);
      return;
    }
    setIsDisabilityModalOpen(true);
  };

  const [refreshing, setRefreshing] = useState(false);
  const refresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      const response = await request("auth/user");
      if (response.success) {
        setUser(response.user);
      }
    } catch (e) {
      alert(tr("Ошибка во время обновления статуса"));
    } finally {
      setRefreshing(false);
    }
  };

  const plans = [
    {
      id: 1,
      name: T("1 oylik"),
      price: "15 000",
      active: true,
      circleBg: alpha(kp.p.primary, 0.15),
      iconColor: kp.p.primary,
      btnBg: kp.p.primary,
      btnColor: kp.p.onPrimary,
      borderColor: kp.p.primary,
      shadow: kp.shadows.card,
    },
    {
      id: 3,
      name: T("3 oylik"),
      price: "39 000",
      active: false,
      circleBg: alpha(kp.p.primary, 0.08),
      iconColor: kp.p.primary,
      btnBg: kp.p.surfaceAlt,
      btnColor: kp.p.text,
      borderColor: kp.p.border,
      shadow: kp.shadows.card,
    },
  ];

  return (
    <Card
      sx={{
        bgcolor: kp.p.surface,
        border: `1px solid ${kp.p.border}`,
        boxShadow: kp.shadows.card,
        borderRadius: 6,
        p: { xs: 2.5, sm: 3.5, md: 4 },
        width: "100%",
      }}
    >
      <Typography
        component="h2"
        sx={{
          fontWeight: 800,
          fontSize: { xs: "1.375rem", md: "1.625rem" },
          color: kp.p.text,
          letterSpacing: "-0.03em",
          lineHeight: 1.2,
        }}
      >
        {T("Kirish sozlamalari")}
      </Typography>

      {/* Access status box matching mockup_profile.png */}
      <Box
        sx={{
          bgcolor: alpha(kp.p.primary, 0.1),
          border: `1px solid ${alpha(kp.p.primary, 0.25)}`,
          borderRadius: 4,
          p: { xs: 2, sm: 2.5 },
          display: "flex",
          alignItems: "center",
          gap: 2,
          my: 3,
        }}
      >
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            bgcolor: alpha(kp.p.primary, 0.15),
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          <WorkspacePremiumIcon sx={{ fontSize: 24, color: kp.p.primary }} />
        </Box>
        <Typography sx={{ color: kp.p.text, fontSize: "0.9375rem" }}>
          {T("Sizning kirish darajangiz:")}{" "}
          <Box component="span" sx={{ fontWeight: 800, color: kp.p.primary }}>
            {T(effectiveUser.plans_name || "Sinov")}
          </Box>
          {" " + T("до") + " " + (effectiveUser.plan_end_str || "23.10.2026")}
        </Typography>
      </Box>

      {effectiveUser.hasUnpayedInvoice && (
        <Box sx={{ mb: 3, p: 2, bgcolor: "#FEF3C7", borderRadius: 3, display: "flex", alignItems: "center", gap: 1 }}>
          <Typography sx={{ color: "#92400E", fontSize: "0.9375rem" }}>
            {T("Ожидается оплата счёта")}: <strong>{effectiveUser.hasUnpayedInvoice}</strong>
          </Typography>
          <IconButton onClick={refresh} aria-label={refreshing ? T("Подождите...") : T("Обновить")} size="small">
            {refreshing ? <HourglassEmptyIcon /> : <CachedIcon />}
          </IconButton>
        </Box>
      )}

      <Typography
        sx={{
          color: kp.p.textSecondary,
          fontSize: "0.9375rem",
          fontWeight: 500,
          mb: 2,
        }}
      >
        {T("Barcha audiokitoblardan foydalanish huquqini oling")}
      </Typography>

      {/* Two Plan Cards matching mockup_profile.png */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
          gap: 2.5,
          mb: 2,
        }}
      >
        {plans.map((p) => (
          <Box
            key={p.id}
            onClick={() => handlePayment(p.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handlePayment(p.id);
              }
            }}
            sx={{
              bgcolor: kp.p.surfaceAlt,
              border: `1.5px solid ${p.borderColor}`,
              borderRadius: 5,
              p: { xs: 2.25, sm: 2.5 },
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              boxShadow: p.shadow,
              transition: "transform .2s ease, box-shadow .2s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: kp.shadows.raised,
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  bgcolor: p.circleBg,
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                <CalendarTodayRounded sx={{ fontSize: 22, color: p.iconColor }} />
              </Box>
              <Box>
                <Typography sx={{ color: kp.p.textSecondary, fontSize: "0.78rem", lineHeight: 1.2 }}>
                  {T("Uzatish premium ruxsat uchun")}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: "1.25rem",
                    color: kp.p.text,
                    lineHeight: 1.25,
                    mt: 0.25,
                  }}
                >
                  {p.name}
                </Typography>
                <Typography sx={{ color: kp.p.text, fontSize: "0.875rem", mt: 0.25 }}>
                  {T("uchun")}{" "}
                  <Box component="span" sx={{ fontWeight: 800 }}>
                    {p.price} {T("so'm")}
                  </Box>
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                bgcolor: p.btnBg,
                color: p.btnColor,
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
                boxShadow: p.active ? "0 4px 12px rgba(24,90,219,0.3)" : "none",
              }}
            >
              <ArrowForwardRounded sx={{ fontSize: 20 }} />
            </Box>
          </Box>
        ))}
      </Box>

      {/* Disability access option */}
      {effectiveUser.disability === 1 && Number(effectiveUser.plans_id) !== 2 && (
        <Box sx={{ mt: 3, pt: 2, borderTop: `1px solid ${kp.p.border}` }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleDisabilityAccess}
            sx={{ borderRadius: 999, textTransform: "none", fontWeight: 700 }}
          >
            {T("Получить полный доступ, подтвердив инвалидность")}
          </Button>
        </Box>
      )}

      {/* Disability modal */}
      <Modal open={isDisabilityModalOpen} onClose={() => setIsDisabilityModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: 600,
            maxHeight: "90vh",
            overflow: "auto",
            p: 0,
          }}
        >
          <Register close={() => setIsDisabilityModalOpen(false)} />
        </Box>
      </Modal>

      {/* Phone verification modal */}
      <Modal open={isPhoneModalOpened} onClose={() => setIsPhoneModalOpened(false)} aria-label={T("Введит номер телефона")}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: 480,
            width: "calc(100% - 32px)",
            bgcolor: kp.p.surface,
            color: kp.p.text,
            border: kp.isContrast ? "2px solid #FFFFFF" : `1px solid ${kp.p.border}`,
            p: { xs: 2.5, sm: 3 },
            borderRadius: 5,
            boxShadow: kp.shadows.float,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <LoginForm title={T("Введите номер телефона")} only_phone={true} callback={phoneUpdated} />
          <Button
            onClick={() => setIsPhoneModalOpened(false)}
            sx={{
              textTransform: "none",
              color: kp.p.textSecondary,
              "&:hover": { color: kp.p.text, bgcolor: alpha(kp.p.text, 0.05) },
            }}
          >
            {T("Отмена")}
          </Button>
        </Box>
      </Modal>
    </Card>
  );
};

export default AccessSection;
