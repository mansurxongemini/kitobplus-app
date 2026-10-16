import { Box, Button, Divider, TextField, Typography, useTheme } from "@mui/material";
import AppleIcon from "@mui/icons-material/Apple";
import React, { useState } from "react";
import { request } from "../lib/api";
import { clearToken } from "../lib/api";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { isPossiblePhoneNumber } from "react-phone-number-input";
import "../css/form.css";
import { sms, verify } from "../lib/auth.ts";
import T, { tr } from "../lib/translator.js";
import { GoogleLogin } from "@react-oauth/google";
import AppleLogin from "react-apple-login";
import useLibrary from "../LibraryContext.js";
import { SITE_URL } from "../lib/config";

// Phone → SMS-code login plus Google/Apple OAuth. Behaviour and API calls are
// unchanged; only the presentation follows the design system.
const LoginForm = ({ title, only_phone = false, callback = null }) => {
  const { kp } = useTheme();
  const { user, setUser } = useLibrary();
  const incorrectPhone = T("Введен некорректный номер телефона");
  const [value, setValue] = useState(user?.phone);
  const [isCorrect, setIsCorrect] = useState();
  const [smsSended, setSmsSended] = useState(false);
  const [debugCode, setDebugCode] = useState();
  const [error, setError] = useState();
  const [phoneError, setPhoneError] = useState("");
  const [code, setCode] = useState("");
  const codeId = React.useId();

  React.useEffect(() => {
    if (value) {
      setIsCorrect(isPossiblePhoneNumber("+" + value));
    } else {
      setIsCorrect(false);
    }
  }, [value]);

  const login = () => {
    if (!isCorrect) {
      setPhoneError(incorrectPhone);
      return;
    }
    setPhoneError("");

    if (!smsSended) {
      sms(value)
        .then((_) => {
          setDebugCode(_?.code);
          setSmsSended(true);
        })
        .catch((err) => {
          const msg = typeof err === "string" ? err : err?.message || tr("Ошибка отправки SMS");
          setPhoneError(msg);
        });
      return;
    }
  };

  React.useEffect(() => {
    if (!code || code.length !== 4) {
      return;
    }
    verify(value, code)
      .then((_) => {
        if (callback) {
          setUser(_.user);
          callback();
        } else {
          window.location = "/";
        }
      })
      .catch((err) => {
        const msg = typeof err === "string" ? err : err?.message || String(err);
        setError(msg);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const handleSuccess = async (credentialResponse) => {
    const idToken = credentialResponse.credential;
    try {
      clearToken();
      const response = await request("oauth/google", { google_token: idToken });
      window.location = "/";
      void response;
    } catch (error) {
      alert("Не удалось осуществить вход Google Sign in");
    }
  };

  const handleError = () => {
    alert("Google Sign In failed");
  };

  const handleAppleResponse = (response) => {
    if (response.error) {
      return;
    }
    verifyBackend(response.authorization);
  };

  const verifyBackend = async (authorization) => {
    try {
      clearToken();
      const response = await request("oauth/apple", { authorization: authorization });
      window.location = "/";
      void response;
    } catch (error) {
      alert("Ошибка входа с помощью Apple ID");
    }
  };

  if (!smsSended) {
    return (
      <Box>
        {title && (
          <Typography variant="h2" component="h2" sx={{ fontSize: "1.5rem", mb: 2.5 }}>
            {title}
          </Typography>
        )}
        <Typography component="label" htmlFor="login-phone-input" sx={{ display: "block", fontWeight: 600, mb: 1 }}>
          {T("Телефон")}
        </Typography>
        <Box
          sx={{
            "& .react-tel-input": { height: "auto" },
            "& .react-tel-input .form-control": {
              flex: "none",
              width: "100%", height: 56, fontSize: "1.125rem", fontFamily: "inherit", color: kp.p.text,
              bgcolor: kp.p.surface, border: `1.5px solid ${kp.p.borderStrong}`, borderRadius: "14px", pl: "56px",
            },
            "& .react-tel-input .form-control:focus": { borderColor: kp.p.primary, boxShadow: `0 0 0 3px ${kp.p.focus}`, outline: "none" },
            "& .react-tel-input .flag-dropdown": { bgcolor: "transparent", border: 0, borderRadius: "14px 0 0 14px" },
            "& .react-tel-input .selected-flag": { width: 48, pl: "16px", bgcolor: "transparent !important" },
            "& .react-tel-input .special-label": { display: "none" },
          }}
        >
        <PhoneInput
          inputProps={{
            id: "login-phone-input",
            name: "phone",
            required: true,
            autoFocus: true,
            autoComplete: "tel",
            inputMode: "tel",
            "aria-invalid": Boolean(phoneError),
            "aria-describedby": phoneError ? "login-phone-error" : undefined,
          }}
          specialLabel={T("Телефон")}
          placeholder={T("Введите номер телефона")}
          value={value}
          disableDropdown={true}
          onChange={(val) => {
            setPhoneError("");
            setValue(val);
          }}
        />
        </Box>
        {phoneError && (
          <Box
            id="login-phone-error"
            role="alert"
            sx={{ color: kp.p.error, fontSize: "0.9375rem", mt: 1 }}
          >
            {phoneError}
          </Box>
        )}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 2.5 }}>
          <Button variant="contained" size="large" fullWidth onClick={login}>
            {T("Продолжить")}
          </Button>
          {!only_phone && (
            <>
              <Divider sx={{ my: 1 }}>{T("или")}</Divider>
              <GoogleLogin onSuccess={handleSuccess} onError={handleError} size="large" shape="pill" />
              <AppleLogin
                clientId="uz.kitobplus.signin"
                redirectURI={SITE_URL + "/login"}
                responseType="code id_token"
                responseMode="form_post"
                usePopup={true}
                callback={handleAppleResponse}
                scope="name email"
                render={(renderProps) => (
                  <Button
                    variant="outlined"
                    size="large"
                    fullWidth
                    startIcon={<AppleIcon aria-hidden="true" />}
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    sx={{ borderWidth: 2, "&:hover": { borderWidth: 2 } }}
                  >
                    {T("Sign in with Apple")}
                  </Button>
                )}
              />
            </>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Typography>{T("Мы отправили SMS с кодом на номер")}</Typography>
      <Typography sx={{ fontWeight: 700 }}>+{value}</Typography>
      <Typography component="label" htmlFor={codeId} sx={{ display: "block", mt: 1 }}>
        {T("Пожалуйста, введите код из SMS")}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
        <TextField
          id={codeId}
          autoFocus={true}
          autoComplete="one-time-code"
          value={code}
          onChange={(e) => {
            setError(null);
            setCode(e.target.value);
          }}
          onKeyPress={(event) => {
            if (!/[0-9]/.test(event.key) || (event.target.value && event.target.value.length >= 4)) {
              event.preventDefault();
            }
          }}
          error={Boolean(error)}
          helperText={error}
          inputProps={{ inputMode: "numeric", maxLength: 4, "aria-describedby": error ? "sms-code-error" : undefined }}
          FormHelperTextProps={{ id: error ? "sms-code-error" : undefined }}
          sx={{
            width: 160,
            "& .MuiOutlinedInput-input": { fontSize: "2rem", textAlign: "center", letterSpacing: "0.5rem" },
          }}
        />
      </Box>
      {debugCode ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Typography sx={{ color: kp.p.success }}>
            {T("Код")}: {debugCode}
          </Typography>
        </Box>
      ) : null}
      {error ? (
        <Box id="sms-code-error" role="alert" sx={{ display: "flex", justifyContent: "center" }}>
          <Typography sx={{ color: kp.p.error }}>
            {typeof error === "string" ? error : error?.message || String(error)}
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
};

export default LoginForm;
