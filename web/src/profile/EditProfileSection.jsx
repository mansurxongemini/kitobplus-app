import EditIcon from '@mui/icons-material/Edit';
import PhoneIcon from '@mui/icons-material/Phone';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  TextField,
  Typography,
  Modal
} from "@mui/material";
import React, { useState, useEffect } from "react";
import useLibrary from "../LibraryContext";
import { request } from "../lib/api";
import T, { tr } from "../lib/translator";
import LoginForm from "../login/LoginForm";
import { DateField } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const EditProfileSection = () => {
  const [isPhoneModalOpened, setIsPhoneModalOpened] = useState(false);
  

  const { user, setUser } = useLibrary();
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    birthday: "",
    email: "",
    disability: false,
    readers_club: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        nickname: user.nickname || "",
        birthday: user.birthday || "",
        email: user.email || "",
        disability: user.disability === 1 || user.disability === "1",
        readers_club: user.readers_club === 1 || user.readers_club === "1",
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const phoneUpdated = () => {
    setIsPhoneModalOpened(false);
  }

  const handleSave = async () => {
    setLoading(true);
    try {
      const dataToSend = {
        ...formData,
        disability: formData.disability ? 1 : 0,
        readers_club: formData.readers_club ? 1 : 0
      };
      const response = await request('readers/update', dataToSend);
      if (response.success) {
        setUser(response.user);
      }
    } catch (error) {
      console.error('Ошибка при сохранении профиля:', error);
      alert(tr('Ошибка во время сохранения профиля'));
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Box
        sx={{
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
          borderRadius: 6,
          p: { xs: 2, md: 3 },
          width: "100%",
        }}
      >
        <Typography
          variant="h3" component="h2"
          sx={{
            fontWeight: "bold",
            mb: 2,
          }}
        >
          {T('Мои данные')}:
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: { xs: 3, md: 4 },
          }}
        >
          <Avatar
            src="/ellipse-15.png"
            alt={T('Профиль')}
            sx={{ width: { xs: 80, md: 110 }, height: { xs: 80, md: 110 }, mb: 1 }}
          />
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: { xs: "14px", md: "16px" },
            }}
          >
            {T('Удалить аватар')}
          </Typography>
        </Box>

        <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
          <div style={{flex: 1, justifyContent: 'center', display: 'flex', paddingBottom: 16}}>
            <div style={{gap: 8, alignItems: 'center', display: 'flex'}}>
              <PhoneIcon sx={{color: 'gray'}}/>
              <Typography
                sx={{
                  color: "text.primary",
                  fontSize: "18px",
                  fontWeight: 'bold'
                }}
              >
                {user?.phone ? '+' + user?.phone : '?'}
              </Typography>
              <IconButton onClick={() => setIsPhoneModalOpened(true)} aria-label={T('Изменить номер телефона')}>
                <EditIcon/>
              </IconButton>
            </div>
          </div>
          <Box sx={{
            flex: 1,
            gap: { xs: 2, md: 1 },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' }
          }}>
            <TextField
              fullWidth
              label={T('ФИО')}
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              variant="outlined"
              InputProps={{
                sx: {
                  fontWeight: "medium",
                  fontSize: { xs: "16px", md: "18px" },
                  borderColor: "primary.main",
                },
              }}
            />

            <TextField
              fullWidth
              variant="outlined"
              label={T('Ник')}
              value={formData.nickname}
              onChange={(e) => handleInputChange('nickname', e.target.value)}
              InputProps={{
                sx: {
                  fontWeight: "medium",
                  fontSize: { xs: "16px", md: "18px" },
                  borderColor: "primary.main",
                },
              }}
            />
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.readers_club}
                onChange={(e) => handleInputChange('readers_club', e.target.checked)}
                sx={{
                  color: "primary.main",
                  '&.Mui-checked': {
                    color: "primary.main",
                  },
                }}
              />
            }
            label={
              <Typography
                sx={{
                  fontWeight: "medium",
                  color: "text.secondary",
                  fontSize: "18px",
                }}
              >
                {T('Учавствовать в читательском клубе')}
              </Typography>
            }
          />

          <div style={{flex: 1, gap: 8, justifyItems: 'stretch', alignItems: 'stretch', display: 'flex', flexDirection: 'row'}}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateField 
                      fullWidth
                      value={formData.birthday ? dayjs(formData.birthday) : null}
                      onChange={(e) => handleInputChange('birthday', e.target.value)}
                      label={T("Дата рождения")}
                      format="DD.MM.YYYY"
                      variant="outlined"
                      style={{paddingTop: 8}}
                      InputProps={{
                        sx: {
                          fontWeight: "medium",
                          fontSize: "18px",
                          borderColor: "primary.main",
                        },
                      }}
                  />
              </LocalizationProvider>
              <TextField
                label={T('Электронная почта')}
                fullWidth
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                variant="outlined"
                InputProps={{
                  sx: {
                    fontWeight: "medium",
                    fontSize: "18px",
                    borderColor: "primary.main",
                  },
                }}
              />
          </div>

          <div style={{marginTop: 16, flex: 1, gap: 8, alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between', display: 'flex', flexDirection: 'row'}}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.disability}
                  onChange={(e) => handleInputChange('disability', e.target.checked)}
                  sx={{
                    color: "primary.main",
                    '&.Mui-checked': {
                      color: "primary.main",
                    },
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    fontWeight: "medium",
                    color: "text.secondary",
                    fontSize: "18px",
                  }}
                >
                  {T('У меня есть инвалидность')}
                </Typography>
              }
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={loading}
              sx={{
                width: 211,
                height: 44,
                fontWeight: "bold",
                fontSize: "1.0625rem",
              }}
            >
              {loading ? T("Сохранение...") : T("Сохранить")}
            </Button>
          </div>
        </div>
      </Box>
      <Modal
        open={isPhoneModalOpened}
        onClose={() => setIsPhoneModalOpened(false)}
        aria-label={T('Изменение телефона')}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            //width: '90%',
            maxWidth: 600,
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            //border: '2px solid #000',
            boxShadow: 24,
            p: 2,
            overflow: 'auto',
            borderRadius: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch'
          }}
        >
          <LoginForm title={T('Изменение телефона')} only_phone={true} callback={phoneUpdated}/>
          <Button onClick={() => setIsPhoneModalOpened(false)} sx={{pt:2}}>{T('Отмена')}</Button>
        </Box>
      </Modal>
    </>
  );
};

export default EditProfileSection;
