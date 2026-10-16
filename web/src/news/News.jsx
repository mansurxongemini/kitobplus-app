import Navigation from '../parts/Navigation'
import FooterSection from '../parts/FooterSection'
import { Box, Breadcrumbs, Typography } from "@mui/material";
import { Link } from 'react-router-dom';
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import NewsSection from './NewsSection'
import T from '../lib/translator';
import { useRouteA11y, VisuallyHidden } from '../lib/a11y';

const News = () => {
    useRouteA11y(T('Новости'));
    return <>
    <Navigation/>
    <Box component="main" id="main_content" tabIndex={-1}>
    <VisuallyHidden component="h1">{T('Новости')}</VisuallyHidden>
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
            <Typography
            color="text.secondary"
            sx={{
                fontFamily: "'PT Root UI', Helvetica",
                fontWeight: 500,
                fontSize: "16px",
                color: '#333'
            }}
            >
        {T('Новости')}
        </Typography>
    </Breadcrumbs>
    </Box>
    <NewsSection per_page={0}/>
    </Box>
    <FooterSection/>
</>
}

export default News;