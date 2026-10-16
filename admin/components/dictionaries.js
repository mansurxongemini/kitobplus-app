import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Authors from './authors';
import Dictors from './dictors';
import Publishers from './publishers';
import Genres from './genres';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Dictionaries = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return <>
        <Tabs value={value} onChange={handleChange} aria-label="Справочники">
            <Tab label="Авторы" {...a11yProps(0)} />
            <Tab label="Дикторы" {...a11yProps(1)} />
            <Tab label="Издатели" {...a11yProps(2)} />
            <Tab label="Жанры" {...a11yProps(3)} />
        </Tabs>
        <TabPanel value={value} index={0}><Authors/></TabPanel>
        <TabPanel value={value} index={1}><Dictors/></TabPanel>
        <TabPanel value={value} index={2}><Publishers/></TabPanel>
        <TabPanel value={value} index={3}><Genres/></TabPanel>
    </>
}

export default Dictionaries;