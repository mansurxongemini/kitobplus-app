import React from 'react';
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArticleIcon from "@mui/icons-material/Article";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PostAddIcon from "@mui/icons-material/PostAdd";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Stack,
  Typography,
  IconButton
} from "@mui/material";
import { Link } from "react-router-dom";
import T from '../lib/translator';
import { request, getHost } from '../lib/api';
import { list } from '../lib/news.ts';
import useLibrary from '../LibraryContext.js';
import document from "./img/document.png";
import NewsModalGP from './NewsModalGP.jsx';

// Since we can't use local imports, we'll use the image paths as they were
//const document = "/document.png";
const group3 = "/group-3.png";
const rectangle2 = "/rectangle-2.png";
const rectangle22 = "/rectangle-2-2.png";
const rectangle23 = "/rectangle-2-3.png";
const rectangle24 = "/rectangle-2-4.png";

const newsData = [
  {
    id: 1,
    title: "Робин Шарма и «Монах, который продал свой Феррари»",
    description:
      "Робин Шарма, в настоящее время, один из лидеров в списке ТОП-бизнес-тренеров мировог...",
    image: rectangle23,
    time: "17:23 сегодня",
    views: "23",
  },
  {
    id: 2,
    title: "«Он был бы горд»: посмертная книга Брайанта стала бестселл...",
    description:
      "Созданная баскетболистом Коби Брайантом книга для детей стала бестселлером спустя неделю по...",
    image: rectangle22,
    time: "17:23 сегодня",
    views: "23",
  },
  {
    id: 3,
    title: "Михаил Лабковский рассказал про свою новую книгу в новых ...",
    description:
      "Психолог Михаил Лабковский абсолютно уверен, что человек может и имеет право быть счаст...",
    image: rectangle2,
    time: "17:23 сегодня",
    views: "23",
    hasReadMore: true,
  },
  {
    id: 4,
    title: 'Стало известно, когда выйдет новый роман Пауло Коэльо "Лу...',
    description:
      'Новый роман бразильского писателя Пауло Коэльо "Лучник", затрагивающий вопрос осмысл...',
    image: rectangle24,
    time: "17:23 сегодня",
    views: "23",
  },
];

const NewsSection = ({title, exclude = 0, per_page = 0}) => {
  const [news, setNews] = React.useState();
  const { user, isAdmin } = useLibrary();
  const [editableNewsId, setEditableNewsId] = React.useState();
  const [editNews, setEditNews] = React.useState(false);
  const [currentExclude, setCurrentExclude] = React.useState(null);

  React.useEffect(() => {    
    if ((currentExclude && currentExclude != exclude) || news !== undefined || news === null) return;
    
    setNews(null);
    setCurrentExclude(exclude);

    console.log("start news loading");

    list(0, per_page, exclude).then(_ => {
      console.log("news loaded");
      console.log(_);
      if (_.news) {
        setNews(_.news);
      }
    });
  }, [news, per_page, exclude]);

  const edit = (id) => {
    setEditableNewsId(id);
    setEditNews(true);
  }

  return (
    news && <Box sx={{ width: "100%", py: 8 }}>
      <Box sx={{ maxWidth: 1193, mx: "auto" }}>
        {/*isAdmin && <NewsModalDS newsId={editableNewsId} onClose={() => setNews(undefined)} open={editNews} />*/}
        {isAdmin && <NewsModalGP newsId={editableNewsId} onClose={() => setEditNews(false)} onSaveSuccess={() => {setEditNews(false); setNews(undefined);}} open={editNews} />}
        {/* Header section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 5,
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
              {T(title ?? 'Новости')}
            </Typography>
            
            {isAdmin && <IconButton
              sx={{
                width: 40,
                height: 40,

                borderRadius: 1,
              }}
              onClick={() => edit(0)}
              aria-label={T('Добавить новость')}
            >
              <PostAddIcon sx={{ }} />
            </IconButton>}
          </Stack>
          
          {per_page != 0 && <Link to="/news" style={{color: "inherit", textDecoration: 'none'}}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              href="#"
            >
              <Typography
                color="secondary.main"
                sx={{
                  fontFamily: "'PT_Root_UI-Bold',Helvetica",
                  fontWeight: "bold",
                }}
              >
                {T('Все новости')}
              </Typography>
              <ArrowForwardIcon color="secondary" />
            </Stack>
          </Link>}
        </Box>

        {/* News cards */}
        <Grid container style={{display: 'flex', justifyContent: 'space-between'}} spacing={0}>
          {news.map((news) => (
            <Grid item key={news.id} sx={{ width: 276 }}>
              <Card
                sx={{
                  width: 276,
                  height: 411,
                  borderRadius: 0,
                  border: "1px solid",
                  borderColor: 'transparent',
                  '&:hover': {
                    boxShadow: "0px 4px 30px rgba(38, 38, 38, 0.1)",
                    borderColor: "neutral.100",
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  src={getHost() + '/pics/' + (news.pics_ext ? 'news/' + news.id + '.' + news.pics_ext : 'news.png')}
                  alt={news.subject}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ px: 1.5 }}>
                    {/* Time and views */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 1.5,
                        mb: 2,
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <AccessTimeIcon
                          sx={{ width: 16, height: 16, color: "neutral.200" }}
                        />
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: "#adacae",
                            fontFamily: "'PT_Root_UI-Medium',Helvetica",
                          }}
                        >
                          {news.datetime_str}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: "#adacae",
                            fontFamily: "'PT_Root_UI-Medium',Helvetica",
                          }}
                        >
                          {news.views}
                        </Typography>
                        <VisibilityIcon
                          sx={{ width: 16, height: 16, color: "neutral.200" }}
                        />
                      </Stack>
                    </Box>

                    {/* Title */}
                    <Typography
                      variant="h5"
                      color="secondary.main"
                      sx={{
                        mb: 1.5,
                        fontFamily: "'PT_Root_UI-Bold',Helvetica",
                        fontWeight: "bold",
                      }}
                    >
                      {news.subject}
                    </Typography>

                    {/* Description */}
                    <Typography
                      variant="body1"
                      sx={{
                        color: "rgba(38, 38, 38, 0.8)",
                        fontFamily: "'PT_Root_UI-Regular',Helvetica",
                      }}
                    >
                      {news.body}
                    </Typography>

                    {/* Read more button for the third card */}
                    <Link to={"/news/" + news.id} style={{textDecoration: 'none'}} aria-label={news.subject + ', ' + news.datetime_str + ', ' + T('Просмотров') + ' ' + news.views}>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ mt: 2, cursor: "pointer" }}
                      >
                        <Typography
                          variant="subtitle1"
                          color="primary.main"
                          sx={{
                            fontFamily: "'PT_Root_UI-Bold',Helvetica",
                            fontWeight: "bold",
                          }}
                        >
                          {T('Подробнее')}
                        </Typography>
                        <ArrowForwardIcon
                          color="primary"
                          sx={{ width: 24, height: 24 }}
                        />
                      </Stack>
                    </Link>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default NewsSection;
