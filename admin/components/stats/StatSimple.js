import React from 'react'
import '../../css/stat_table.css'
import CircularProgress from '@material-ui/core/CircularProgress';

const StatSimple = ({data, summary}) => <table className="stat_table" border="1" style={{borderCollapse: 'collapse', border: '1px solid gray'}}>
    <thead>
        <tr>
            <th>Интервал</th>
            <th>Посещения</th>
            <th>Книговыдача</th>
        </tr>
    </thead>
    <tbody>
        {data === undefined ?
            <tr><td colSpan={3} align="center"><CircularProgress sx={{p: 1}} /></td></tr>
            :
            data.map(_ => <tr key={_.interval}><td>{_.interval_title}</td><td align="right">{_.visits}</td><td align="right">{_.orders}</td></tr>)
        }
    </tbody>
    <tfoot>
        <tr>
            <th align="right"><b>Итого</b></th>
            <th align="right">{summary?.visits}</th>
            <th align="right">{summary?.orders}</th>
        </tr>
    </tfoot>
</table>

export default StatSimple