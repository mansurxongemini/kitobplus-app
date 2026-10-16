import React from "react";
import ReactHtmlParser from "react-html-parser";
import {changeState} from "./changeState";
import InboxBookSelectDialog from "../InboxBookSelectDialog";
import {linkToInbox} from "./linkToInbox";
import InboxBookUnlinkDialog from "../InboxBookUnlinkDialog";
import {getSettings} from "../settings";
import Button from '@material-ui/core/Button';

export function renderDetailPanel(rowData) {
//export const renderDetailPanel = (rowData) => {
//        this.React.useEffect (() => {
//            console.log("some work");
//        })
//        this.setState({detail: null});
/*
    if (this.state.selectedBook.id != rowData.id) {
        fetch(getSettings().backend + '/book.php?id=' + rowData.id, {method: 'GET'}).then(response => response.json()).then(response => {
            this.setState({selectedBook: response});
        });
    }
*/
    return (
        <div className={'booksDetailPanel'}>
            <img
                style={{float: 'left', marginRight: 8, width: 128, height: 128, borderRadius: 12,}}
                src={rowData.pics_ext ? "https://kitobplus.uz/pics/books/" + rowData.id + "." + rowData.pics_ext : "/pics/book.png"}
                alt="Обложка книги"
                onClick={() => {if (rowData.pics_ext) this.cropImage(rowData.id, "https://kitobplus.uz/pics/books/" + rowData.id + ".orig." + rowData.pics_ext);}}
            />

            {rowData.imported != null &&
                <Button size="small" color="primary" variant="contained"  
                id={'detailPanel' + rowData.id + '_preview'}
                onBlur={()=>{console.log('preview.onBlur'); this.audio.pause();}}
                onClick={(e)=>{e.preventDefault(); this.preview(rowData);}}>Слушать</Button>
            }
            {!parseInt(rowData.states_id) && <Button size="small" variant="contained" color="primary" onClick={() => this.publishBook(rowData, true)}>Опубликовать</Button>}
            {parseInt(rowData.states_id) > 0 && <Button size="small" variant="contained" color="primary" onClick={() => this.publishBook(rowData, false)}>Снять с публикации</Button>}
            {parseInt(rowData.states_id) >= 0 && <Button size="small" color="primary" variant="contained" onClick={() => this.editBook(rowData)}>Редактировать</Button>}
            {parseInt(rowData.states_id) > 0 && <Button size="small" variant="contained" color="primary" onClick={() => this.notifyBook(rowData)}>Разослать уведомление</Button>}
            {!parseInt(rowData.states_id) && <Button size="small" variant="contained" color="secondary" onClick={() => this.deleteBook(rowData)}>Удалить</Button>}
            {parseInt(rowData.states_id) == -1 && <Button size="small" variant="contained" color="primary" onClick={() => this.undeleteBook(rowData)}>Восстановить</Button>}
            {rowData.is_readable_from != null && <div>Дата публикации: <a href="#" onClick={(e) => {e.preventDefault(); this.publishBook(rowData, true)}}>{rowData.is_readable_from_dt}</a></div>}
            <div>Жанр: {rowData.genres.length ? rowData.genres.map(g => <a href={"/kitobplus-admin/person/genres/" + g.id + "/" + encodeURIComponent(g.name)}>{g.name}</a>).reduce((prev, curr) => [prev, ', ', curr]) : ''}</div>
            <div>Издательство: {rowData.publishers_name ? <a href={"/kitobplus-admin/person/publishers/" + rowData.publishers_id + "/" + encodeURIComponent(rowData.publishers_name)}>{rowData.publishers_name}</a> : ''}</div>
            <div>Размер: {Math.round(parseInt(rowData.bytes) / (1024 * 1024)) + "Mb"}</div>
            <div>{ReactHtmlParser(rowData.annotation.replace(/\n/g, '<br/>'))}</div>
        </div>
    )
}
