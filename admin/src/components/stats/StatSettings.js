import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
//import FormControlLabel from '@mui/material/FormControlLabel';
//import Checkbox from '@mui/material/Checkbox';
import Button from '@material-ui/core/Button';

const StatSettings = ({ss, setSs, setRequest}) => {
    const [begins, setBegins] = React.useState([]);
    const [ends, setEnds] = React.useState([]);

    React.useEffect(() => {
        const Q = ['?', 'I', 'II', 'III', 'IV'];
        const M = ['?', 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        const b = [];
        //const e = [];
        for (let y = 2024; y >= 2023; y--) {
            if (ss.interval == 3) {
                b.push({value: y + '-01-01', label: y})
                //e.push({value: y + '-01-01', label: y})
            } else {
                for (let m = (y == 2024 ? 2 : 12); m >= (y == 2023 ? 12 : 1); m--) {
                    if (ss.interval == 2) {
                        if (!(m % 3)) {
                            b.push({value: y + '-' + m.toString().padStart(2, '0') + '-01', label: Q[m / 3] + '/' + y});
                            //e.push({value: y + '-' + m.toString().padStart(2, '0') + '-01', label: q[m / 3] + '/' + y});
                        }
                    } else {
                            b.push({value: y + '-' + m.toString().padStart(2, '0') + '-01', label: M[m] + ' ' + y});
                            //e.push({value: y + '-' + m.toString().padStart(2, '0') + '-01', label: y + '/' + (m / 3)});
                    }
                }
            }
        }

        setBegins(b);
        setEnds(b);

        //ends.push({id: 1, name: ss.interval});
    }, [ss.interval]);

    return <>
    <h2>Статистика</h2>
    <div style={{display:'flex'}}>    
        <FormControl style={{textAlign: 'left', minWidth: 200 }} size="small">
            <InputLabel id="interval-label">Интервал</InputLabel>
            <Select
                labelId="intreval-label"
                id="interval-select"
                value={ss.interval}
                label="Интервал"
                onChange={_ => setSs(ss => ({...ss, interval: _.target.value}))}
            >
                <MenuItem value={0}>Пользовательский</MenuItem>
                <MenuItem value={1}>Месяц</MenuItem>
                <MenuItem value={2}>Квартал</MenuItem>
                <MenuItem value={3}>Год</MenuItem>
            </Select>
        </FormControl>
        <FormControl style={{ minWidth: 120 }} size="small">
            <InputLabel id="begin-label">Начало</InputLabel>
            <Select
                labelId="begin-label"
                id="begin-select"
                value={ss.begin}
                label="Начало"
                onChange={_ => setSs(ss => ({...ss, begin: _.target.value}))}
            >
                {begins.map(_ => <MenuItem key={_.value} value={_.value}>{_.label}</MenuItem>)}
            </Select>
        </FormControl>
        <FormControl style={{minWidth: 120 }} size="small">
            <InputLabel id="end-label">Конец</InputLabel>
            <Select
                labelId="end-label"
                id="end-select"
                value={ss.end}
                label="Конец"
                onChange={_ => setSs(ss => ({...ss, end: _.target.value}))}
            >
                {ends.map(_ => <MenuItem key={_.value} value={_.value}>{_.label}</MenuItem>)}
            </Select>
        </FormControl>
        <FormControl style={{ minWidth: 160 }} size="small">
            <InputLabel id="groupby-label">Группировка</InputLabel>
            <Select
                labelId="groupby-label"
                id="groupby-select"
                value={ss.groupby}
                label="Интервал"
                onChange={_ => setSs(ss => ({...ss, groupby: _.target.value}))}
            >
                <MenuItem value={0}>День</MenuItem>
                <MenuItem value={1}>Месяц</MenuItem>
                <MenuItem value={2}>Квартал</MenuItem>
                <MenuItem value={3}>Год</MenuItem>
            </Select>
        </FormControl>
        <div style={{padding: '6px'}}>
            <Button variant="contained" color="primary" onClick={_ => setRequest(ss)}>Обновить</Button>     
        </div>
    </div></>
}

export default StatSettings