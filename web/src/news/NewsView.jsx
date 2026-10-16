import React from 'react';
import Navigation from '../parts/Navigation'
import FooterSection from '../parts/FooterSection'
import { Box, Breadcrumbs, Typography, Stack, IconButton } from "@mui/material";
import { Link } from 'react-router-dom';
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import NewsSection from './NewsSection'
import EditNoteIcon from "@mui/icons-material/EditNote";
import T from '../lib/translator';
import { get, add } from '../lib/news.ts';
import { useParams } from 'react-router-dom';
import useLibrary from '../LibraryContext.js';
import NewsModalGP from './NewsModalGP.jsx';
import document from "./img/document.png";
import { getHost } from '../lib/api.js';

const NewsView = () => {
    const params = useParams();
    const [news, setNews] = React.useState();
    const [error, setError] = React.useState();
    const { user, isAdmin } = useLibrary();
    const [editableNewsId, setEditableNewsId] = React.useState();
    const [editNews, setEditNews] = React.useState(false);

    const edit = (id) => {
        setEditableNewsId(id);
        setEditNews(true);
    }

    React.useEffect(() => {
        if (!params?.id) return;
        load();
    }, [params]);

    const load = () => {
        get(params?.id, true).then(_ => setNews(_.data));
    };

    return <>
        <Navigation/>
        {isAdmin && <NewsModalGP newsId={editableNewsId} onClose={() => setEditNews(false)} onSaveSuccess={() => {setEditNews(false); load();}} open={editNews} />}
        <Box
            sx={{
                width: "100%",
                height: "44px",
                position: "relative",
                top: "12px",
                bgcolor: "background.paper",
                borderBottom: 1,
                borderColor: "divider",
            }}
            >
            <Breadcrumbs
                sx={{ position: "relative", top: "6px", left: "32px" }}
                separator={
                <KeyboardArrowRight
                    fontSize="small"
                    sx={{ color: "text.secondary" }}
                />
                }
            >
                <Link
                    color="text.secondary"
                    style={{
                        fontFamily: "'PT Root UI', Helvetica",
                        fontWeight: 500,
                        fontSize: "16px",
                        textDecoration: 'none',
                        color: '#333'
                    }}
                    to="/"
                >
                    {T('Главная')}
                </Link>
                <Link
                    color="text.secondary"
                    style={{
                        fontFamily: "'PT Root UI', Helvetica",
                        fontWeight: 500,
                        fontSize: "16px",
                        textDecoration: 'none',
                        color: '#333'
                    }}
                    to="/news"
                >
                    {T('Новости')}
                </Link>
                <Typography
                    color="text.secondary"
                    sx={{
                        fontFamily: "'PT Root UI', Helvetica",
                        fontWeight: 500,
                        fontSize: "16px",
                        color: '#333'
                    }}
                >
                {news?.subject}
                </Typography>
            </Breadcrumbs>
        </Box>
        
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            m: 3
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
            <Box
              component="img"
              src={document}
              alt="Document"
              sx={{ width: 28, height: 28 }}
            />
            </Box>
            <Typography
              variant="h2"
              color="secondary.main"
              sx={{
                fontFamily: "'PT_Root_UI-Bold',Helvetica",
                fontWeight: "bold",
              }}
            >
              {news?.subject}
            </Typography>
            
            {isAdmin && <IconButton
              sx={{
                width: 40,
                height: 40,

                borderRadius: 1,
              }}
              onClick={() => edit(news?.id)}
              aria-label={T('Редактировать новость')}
            >
              <EditNoteIcon sx={{ }} />
            </IconButton>}
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            {news?.datetime_str}, {T('Просмотров').toLowerCase() + ' ' + news?.views}
          </Stack>
        </Box>
        <Stack direction="row" spacing={2} ml={4} mr={4} style={{flex:1}} >
            <Box
                component="img"
                height="200"                
                src={getHost() + '/pics/' + (news?.pics_ext ? 'news/' + news?.id + '.' + news?.pics_ext : 'news.png')}
                alt={news?.subject}
                sx={{ objectFit: "cover" }}
                style={{width: '50%'}}
            />
            <Typography>
                {news?.body}
            </Typography>
        </Stack>

        <NewsSection per_page={4} title={'Другие новости'} exclude={params?.id} />
        <FooterSection/>
    </>
}

export default NewsView;