//ФК 28823 Паустовсккий
//Щукина 59
import React from 'react'
import StatSettings from './StatSettings'
import StatSimple from './StatSimple';
import { request as makeRequest} from '../../lib/api';

const Stat = () => {
    const [ss, setSs] = React.useState({
        interval: 1,
        begin: '2024-01-01',
        end: '2024-01-01',
        groupby: 0,
        complex: false,
    });

    const [request, setRequest] = React.useState();
    const [data, setData] = React.useState();
    const [summary, setSummary] = React.useState({});

    React.useEffect(() => {
        if (!request) return;
        setData(undefined);
        setSummary({});
        makeRequest('stat/list', request).then(_ => {
            setData(_.data);
            setSummary(_.summary);
        });
        setData([]);
    }, [request]);

    return <>
        <StatSettings ss={ss} setSs={setSs} setRequest={setRequest}/>
        {request && <StatSimple data={data} summary={summary}/>}
    </>
}


export default Stat;