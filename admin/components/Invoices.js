
import React from 'react';
import { request } from '../lib/api';

const Invoices = () => {
    const [data, setData] = React.useState(undefined);

    React.useEffect(() => {
        if (data !== undefined) return;
        setData(null);
        request('access/invoices', {}).then(_ => {
            setData(_.data);
        }).catch(_ => alert(_));
    }, [data]);

    return <>
            <h2>Оплаты</h2>
            <table border={1} style={{borderCollapse: 'collapse'}}>
                <thead>
                    <tr>
                        <th style={{padding: 6}} >№ счёта</th>
                        <th style={{padding: 6}} >Дата</th>
                        <th style={{padding: 6}} >Пользователь</th>
                        <th style={{padding: 6}} >Сумма</th>
                        <th style={{padding: 6}} >Статус</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.map((invoice) => <tr key={'i' + invoice.id}>
                            <td style={{padding: 6}} align='center'>{invoice.click_id}</td>
                            <td style={{padding: 6}}  align='center'>{invoice.dt}</td>
                            <td style={{padding: 6}} >{invoice.users_name}</td>
                            <td style={{padding: 6}}  align='right'>{invoice.amount}</td>
                            <td style={{padding: 6}} >{invoice.payed ? 'Оплачен' : (invoice.cancelled ? 'Отменён' : (invoice.error ? invoice.error : 'Ожидает оплаты'))}</td>
                        </tr>
                    )}
                </tbody>
            </table>
    </>
}

export default Invoices;