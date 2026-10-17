import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    CircularProgress,
    Box,
    Typography,
    IconButton,
    Grid,
} from '@mui/material';
import { PhotoCamera, Clear } from '@mui/icons-material'; // Import Clear icon
import { Stack } from '@mui/material';
import { add, get, remove } from '../lib/news.ts'
import { useNavigate } from "react-router-dom";
import T from '../lib/translator';



const initialNewsState = {
    id: 0,
    subject: '',
    datetime: '',
    body: '',
};

function NewsModalGP({ open, onClose, newsId, onSaveSuccess }) {
    const [newsData, setNewsData] = useState(initialNewsState);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fileInputRef = useRef(null);
    const dialogContentRef = useRef(null); // Ref for paste event

    const isCreatingNew = newsId === 0;

    const navigate = useNavigate()

    const resetForm = useCallback(() => {
        setNewsData(initialNewsState);
        setImageFile(null);
        setImagePreviewUrl('');
        setError('');
    }, []);

    useEffect(() => {
        if (!open) {
            // Сброс формы при закрытии, если не идет загрузка
            // Это предотвращает сброс, если модалка закрывается программно после успешного сохранения
            if (!loading) {
                resetForm();
            }
            return;
        }

        if (newsId === 0) {
            // Создание новой новости
            resetForm();
            // Устанавливаем текущую дату и время по умолчанию для новой новости
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // Коррекция на часовой пояс для datetime-local
            setNewsData(prev => ({ ...prev, datetime: now.toISOString().slice(0, 16) }));
            setLoading(false);
        } else {
            // Редактирование существующей
            setLoading(true);
            setError('');
            get(newsId, false)
                .then(data => {
                    setNewsData(data.data);
                    // Если у новости есть imageUrl, можно его установить для предпросмотра
                    // if (data.imageUrl) setImagePreviewUrl(data.imageUrl);
                    // Для этого примера мы не загружаем существующее изображение обратно в file input
                    setImageFile(null); 
                    setImagePreviewUrl(data.imageData); // Сброс превью, если было от предыдущей сессии
                })
                .catch(err => {
                    setError(`Ошибка загрузки новости: ${err.message}`);
                    console.error(err);
                })
                .finally(() => setLoading(false));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- loading intentionally excluded: adding it would re-run the fetch/reset on every loading toggle
    }, [open, newsId, resetForm]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewsData(prev => ({ ...prev, [name]: value }));
    };

    const processImageFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
            setError(''); // Clear previous image errors
        } else if (file) {
            setError('Пожалуйста, выберите файл изображения (JPEG, PNG, GIF и т.д.).');
            setImageFile(null);
            setImagePreviewUrl('');
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        processImageFile(file);
    };

    const handleImagePaste = useCallback((event) => {
        const items = event.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                processImageFile(file);
                event.preventDefault(); // Предотвратить стандартную вставку
                break;
            }
        }
    }, []); // processImageFile не меняется, поэтому можно оставить пустой массив зависимостей

     useEffect(() => {
        const contentElement = dialogContentRef.current;
        if (open && contentElement) {
            contentElement.addEventListener('paste', handleImagePaste);
            return () => {
                contentElement.removeEventListener('paste', handleImagePaste);
            };
        }
    }, [open, handleImagePaste]);


    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreviewUrl('');
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Clear the file input
        }
    };

    const handleSave = async () => {
        setLoading(true);
        setError('');
        try {
            var nd = newsData;
            nd['datatime'] = newsData['datetime'].replace('T', ' ') + ':00';
            nd['imageData'] = imagePreviewUrl;
            await add(nd);
            setLoading(false);
            onSaveSuccess();
            // resetForm(); // Нет необходимости, т.к. useEffect[open] сделает это
        } catch (err) {
            setError(`Ошибка сохранения: ${err}`);
            console.error(err);
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (!loading) {
            onClose();
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        setError('');
        try {
            await remove(newsId);
            navigate("/news");
        } catch (err) {
            setError(`Ошибка удаления: ${err}`);
            setLoading(false);
        }
    }

    const dialogTitleId = 'news-modal-title';
    const dialogDescriptionId = 'news-modal-description';

    return (
        <Dialog
            open={open}
            onClose={handleCancel}
            aria-labelledby={dialogTitleId}
            aria-describedby={dialogDescriptionId}
            fullWidth
            maxWidth="sm"
            disableEscapeKeyDown={loading} // Не закрывать по Escape во время загрузки
        >
            <DialogTitle id={dialogTitleId}>
                {isCreatingNew ? 'Добавить новость' : 'Редактировать новость'}
            </DialogTitle>
            <DialogContent dividers ref={dialogContentRef} id={dialogDescriptionId}>
                {loading && !error && ( // Показываем общий лоадер только если нет ошибки загрузки новости
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                        <CircularProgress aria-label={T("Загрузка данных новости")} />
                    </Box>
                )}
                {!loading && ( // Показываем контент только если не идет основная загрузка
                    <Grid container spacing={2} style={{display: 'flex'}} omponent="form" noValidate autoComplete="off">
                        {/* ID (только для информации, не редактируется пользователем) */}
                        {/* <Grid item xs={12}>
                            <TextField
                                label="ID"
                                name="id"
                                value={newsData.id}
                                fullWidth
                                disabled
                                margin="dense"
                                size="small"
                            />
                        </Grid> */}

                        <Grid item xs={12}>
                            <Typography variant="subtitle1" component="h3" gutterBottom>
                                {T('Изображение')}
                            </Typography>
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="news-image-upload"
                                type="file"
                                onChange={handleImageChange}
                                ref={fileInputRef}
                                aria-labelledby="image-upload-button-label"
                            />
                            <label htmlFor="news-image-upload">
                                <Button
                                    variant="outlined"
                                    component="span"
                                    startIcon={<PhotoCamera aria-hidden="true" />}
                                    id="image-upload-button-label"
                                    sx={{ mr: 1 }}
                                >
                                    Выбрать файл изображения
                                </Button>
                            </label>
                            <Typography variant="caption" component="span">
                                или вставьте из буфера обмена (Ctrl+V / Cmd+V) в эту область.
                            </Typography>
                            {imagePreviewUrl && (
                                <Box sx={{ mt: 2, position: 'relative', maxWidth: 200, maxHeight:200, border: '1px solid #ddd' }}>
                                    <img 
                                        src={imagePreviewUrl} 
                                        alt={T("Предпросмотр изображения")} 
                                        style={{ width: '100%', height: 'auto', display: 'block' }} 
                                    />
                                    <IconButton
                                        aria-label={T("Удалить изображение")}
                                        onClick={handleRemoveImage}
                                        size="small"
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                            }
                                        }}
                                    >
                                        <Clear aria-hidden="true" fontSize="small" />
                                    </IconButton>
                                </Box>
                            )}
                             {imageFile && (
                                <Typography variant="body2" sx={{mt: 1}}>Выбран файл: {imageFile.name}</Typography>
                            )}
                        </Grid>

                        <Stack style={{flex: 1}}>
                            <TextField
                                autoFocus // Фокус на первом поле
                                margin="dense"
                                id="subject"
                                name="subject"
                                label="Заголовок"
                                type="text"
                                fullWidth
                                value={newsData.subject}
                                onChange={handleInputChange}
                                required
                                error={!!(error && error.toLowerCase().includes("заголовок"))} // Пример подсветки ошибки для заголовка
                                aria-required="true"
                            />
                            <TextField
                                margin="dense"
                                id="datetime"
                                name="datetime"
                                label="Дата и время"
                                type="datetime-local"
                                fullWidth
                                value={newsData.datetime}
                                onChange={handleInputChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                required
                                aria-required="true"
                            />
                            <TextField
                                margin="dense"
                                id="body"
                                name="body"
                                label="Текст новости"
                                type="text"
                                fullWidth
                                multiline
                                rows={4}
                                value={newsData.body}
                                onChange={handleInputChange}
                                required
                                aria-required="true"
                            />
                            {error && (
                                <Grid item xs={12}>
                                    <Typography color="error" role="alert">
                                        {error}
                                    </Typography>
                                </Grid>
                            )}
                        </Stack>
                    </Grid>
                )}
            </DialogContent>
            <DialogActions sx={{ px:3, py:2 }}>
                <Box style={{flex: 1, display: 'flex', justifyContent: 'space-between'}}>
                    {loading ? <CircularProgress size="30px" /> : <Box/>}
                    <Box>
                        <Button 
                            onClick={handleSave} 
                            disabled={loading || !(newsData?.subject?.trim())} // Дизейблим если загрузка или пустой заголовок
                            variant="contained"
                            color="primary"
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                        >
                            {loading ? 'Сохранение...' : 'Сохранить'}
                        </Button>                    
                        {(Number(newsId) !== 0) &&
                            <Button onClick={handleDelete} disabled={loading} color="secondary">Удалить</Button>                
                        }
                        <Button onClick={handleCancel} disabled={loading} color="secondary">
                            Отмена
                        </Button>   
                    </Box>
                </Box>
            </DialogActions>
        </Dialog>
    );
}

// --- Пример использования компонента ---
// (В реальном приложении это будет в другом файле/компоненте)
/*
function AppNewsManager() {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingNewsId, setEditingNewsId] = useState(0); // 0 для создания новой

    const handleOpenCreateModal = () => {
        setEditingNewsId(0);
        setModalOpen(true);
    };

    const handleOpenEditModal = (id) => {
        setEditingNewsId(id);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        // setEditingNewsId(0); // Сброс ID, чтобы следующаяя 'чистая' форма открылась (делает NewsModal useEffect)
    };
    
    const handleSaveSuccess = (savedNews) => {
        // Здесь можно обновить список новостей в UI
        // Например, refetch списка или обновление состояния
        // alert(`Новость "${savedNews.subject}" сохранена!`);
    };

    return (
        <Box sx={{p: 2}}>
            <Typography variant="h4" gutterBottom>Управление новостями</Typography>
            <Button variant="contained" onClick={handleOpenCreateModal} sx={{ mb: 2 }}>
                Добавить новость
            </Button>
            
            <Typography variant="h6">Существующие новости (для теста редактирования):</Typography>
            <ul>
                {mockNewsDatabase.map(news => (
                    <li key={news.id}>
                        {news.subject} (ID: {news.id})
                        <Button size="small" onClick={() => handleOpenEditModal(news.id)} sx={{ml:1}}>
                            Редактировать
                        </Button>
                    </li>
                ))}
            </ul>

            <NewsModal
                open={modalOpen}
                onClose={handleCloseModal}
                newsId={editingNewsId}
                onSaveSuccess={handleSaveSuccess}
            />
        </Box>
    );
}

export default AppNewsManager; // Экспортируем AppNewsManager для рендера в index.js
*/

export default NewsModalGP // Экспортируем основной компонент

