import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Modal,
  IconButton,
} from "@mui/material";
import React, { useState } from "react";
import PlanButton from "./PlanButton.jsx";
import useLibrary from "../LibraryContext";
import { pay } from '../lib/auth.ts';
import Register from './Register.jsx';
import T, { tr } from '../lib/translator.js';
import CachedIcon from '@mui/icons-material/Cached';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { request } from '../lib/api.js';
import LoginForm from "../login/LoginForm";
import {SITE_URL} from "../lib/config";

const AccessSection = () => {
  const { user, setUser } = useLibrary();
  const [isDisabilityModalOpen, setIsDisabilityModalOpen] = useState(false);
  const errorMessage = T("Пожалуйста, введите номер телефона на вкладке \"Мои данные\"");
  const [isPhoneModalOpened, setIsPhoneModalOpened] = useState(false);
  const [selectedPlansId, setSelectedPlansId] = useState();

  const phoneUpdated = () => {
    setIsPhoneModalOpened(false);
    handlePayment(selectedPlansId);
  }

  const handlePayment = async (plans_id) => {
    if (!user.phone) {
      //alert(errorMessage);
      setSelectedPlansId(plans_id);
      setIsPhoneModalOpened(true);
      return;
    }

    try {
      const result = await pay(plans_id);
      if (result && result.data) {
        const { service_id, merchant_id, merchant_user_id, amount, transaction_param } = result.data;
        const paymentUrl = `https://my.click.uz/services/pay?service_id=${service_id}&merchant_id=${merchant_id}&merchant_user_id=${merchant_user_id}&amount=${amount}&transaction_param=` + encodeURIComponent(transaction_param) + `&return_url=` + encodeURIComponent(SITE_URL + '/profile');
        console.log(paymentUrl);
        window.location.href = paymentUrl;
      }
    } catch (error) {
      alert(error);
    }
  };

  const handleDisabilityAccess = () => {
    if (!user.phone) {
      alert(errorMessage);
      return;
    }

    setIsDisabilityModalOpen(true);
  };

  const handleModalClose = () => {
    setIsDisabilityModalOpen(false);
  };

  const handleModalSubmit = () => {
    // Здесь можно добавить логику отправки данных
    console.log('Отправка данных для подтверждения инвалидности');
    setIsDisabilityModalOpen(false);
  };

  const [refreshing, setRefreshing] = useState(false);
  const refresh = async () => {
    if (refreshing) {
      return;
    }

    setRefreshing(true);

    try {
      const response = await request('auth/user');
      if (response.success) {
        setUser(response.user);
      }
    } catch(e) {
      alert(tr('Ошибка во время обновления статуса'));
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",
        borderRadius: 6,
        p: 3,
        width: "100%",
        flex: 1,
      }}
    >
      <Typography
        variant="h3" component="h2"
        sx={{
          fontWeight: "bold",
          mb: 3,
        }}
      >
        {T('Параметры доступа')}
      </Typography>

      {/* Контактная информация */}
      <Card sx={{ mb: 3, border: 0, borderColor: "divider" }}>
        <CardContent>
          {T('Ваш уровень доступа')}: <b>{T(user?.plans_name)}</b>{(user?.plans_id == 1 || user?.plans_id == 3) ? " " + T("до") + " " + user?.plan_end_str : ""}
        </CardContent>
      </Card>

      {/* Кнопка оплаты для пользователей с plans_id 0 или 1 */}
      {(user?.plans_id === 0 || user?.plans_id === 1 || (user?.plans_id === 3 && user?.can_top_up != 0)) && (
        <Card sx={{ mb: 3, border: 0, borderColor: "divider" }}>
          <CardContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
             {T('Получите доступ ко всем аудиокнигам')}
            </Typography>

            {user?.hasUnpayedInvoice ? <>
              <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <div>{T('Ожидается оплата счёта')} {/*<a href={'https://my.click.uz/services/pay?service_id=' + user.service_id + '&merchant_id=' + user.merchant_id + '&amount=' + user.amount + '&transaction_param=' + encodeURIComponent(user.transaction_param) + `&return_url=` + encodeURIComponent(SITE_URL + '/new/profile')}>*/}<strong>{user?.hasUnpayedInvoice}</strong>{/*</a>*/}</div>
                <IconButton onClick={refresh} aria-label={refreshing ? T('Подождите...') : T('Обновить')}>
                  {refreshing ? <HourglassEmptyIcon/> : <CachedIcon />}
                </IconButton>
              </div>
            </> : <>            
              {user?.disability === 1 && (user?.plans_id != 2) && (user?.state != 1) && (
                <PlanButton
                  color="secondary"
                  onClick={handleDisabilityAccess}
                  ariaLabel={T("Получить полный доступ, подтвердив инвалидность")}
                >
                  {T("Получить полный доступ, подтвердив инвалидность")}
                </PlanButton>
              )}
              {user?.disability === 1 && (user?.plans_id != 2) && (user?.state == 1) && (
                <div tabOrder="0" style={{fontSize: 18, margin: 12, fontWeight: 'bold'}}>{T('Ожидается подтверждение регистрации')}</div>
              )}

              {user?.disability !== 1 && user?.available_payments && <div style={{display: 'flex', 'gap': 8}}>{user?.available_payments.map((payment) => (
                <PlanButton
                  id={payment?.id}
                  color="primary"
                  onClick={() => handlePayment(payment?.id)}
                  ariaLabel={
                    ((user?.plan_active && user?.plans_id != 0) ? T('Продлить') : T('Оплатить')) +
                    ' ' + T('премиум доступ') + ' ' + T('на') + ' ' + T(payment.name) + ' ' + T('за') + ' ' + T(payment.price) + ' ' + T('сум')
                  }
                >
                  {((user?.plan_active && user?.plans_id != 0) ? T('Продлить') : T('Оплатить')) + ' ' + T('премиум доступ') + ' ' + T('на') + ' ' + T(payment.name) + ' ' + T('за') + ' ' + T(payment.price) + ' ' + T('сум')}
                </PlanButton>
              ))}</div>}
            </>}
          </CardContent>
        </Card>
      )}

      {/* Модальное окно для подтверждения инвалидности */}
      <Modal
        open={isDisabilityModalOpen}
        onClose={handleModalClose}
        aria-labelledby="disability-modal-title"
        aria-describedby="disability-modal-description"
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
            //bgcolor: 'background.paper',
            //border: '2px solid #000',
            //boxShadow: 24,
            p: 0,
            overflow: 'auto',
          }}
        >
          <Register close={() => setIsDisabilityModalOpen(false)} />
        </Box>
      </Modal>
      <Modal
        open={isPhoneModalOpened}
        onClose={() => setIsPhoneModalOpened(false)}
        aria-label={T('Введит номер телефона')}
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
          <LoginForm title={T('Введите номер телефона')} only_phone={true} callback={phoneUpdated}/>
          <Button onClick={() => setIsPhoneModalOpened(false)} sx={{pt:2}}>{T('Отмена')}</Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default AccessSection;
