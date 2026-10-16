import Navigation from '../parts/Navigation'
import FooterSection from '../parts/FooterSection'
import { Box, Breadcrumbs, Typography } from "@mui/material";
import { Link } from 'react-router-dom';
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import NewsSection from './NewsSection'

const News = () => <>
    <Navigation/>
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
            Главная
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
        Новости
        </Typography>
    </Breadcrumbs>
    </Box>
    <NewsSection per_page={0}/>
    <FooterSection/>
</>

export default News;