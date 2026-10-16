import React from "react";
import {Link} from "react-router-dom";

export function getColumns() {    
    let columns=[
        {
            title: 'Название',
            field: 'name',
            width: '50%',
            render: rowData => {
                if (this.firstShow) {
                    this.firstShow = false
                    this.selectOnRefreshRowId = rowData.id;
                }
                                
/*                return <a ref={(a) => this.updateRef(rowData.id, a)} href="#" onClick={(e) => this.editBook(e, rowData)}>{rowData.name}</a>*/
                return <>
                    <a
                    to={"/kitobplus-admin/book/" + rowData.id}
                    ref={(a)=>{this.recordsRefs[rowData.id] = a}}
                    onClick={(e) => {this.handleClick(e, rowData);}}
                    onBlur={()=>{this.audio.pause()}}
                    onContextMenu={(e)=> {this.handleContextMenu(e, rowData)}}
                    href={"/kitobplus-admin/book/" + rowData.id}>
                        <img
                            style={{float: 'left', paddingRight: 8, width: 22, height: 22}}
                            src={rowData.pics_ext ? "/pics/books/" + rowData.id + "." + rowData.pics_ext : "/pics/book.png"}
                            alt="Обложка книги"
                        />{rowData.name + (rowData.adult ? ' ' + rowData.adult + '+' : '')}
                    </a>
                </>
            },
            cellStyle: {padding: '0px', paddingLeft: '12px'},
            defaultFilter: localStorage.getItem("books_name_filter", "")
        },
        { title: 'Время', field: 'duration', cellStyle: {padding: '0px', textAlign: 'right'}, filtering: false},
        {
            title: 'Публикация',
            field: 'states_id',
            type: 'numeric',
            defaultFilter: JSON.parse(localStorage.getItem("books_state_filter", "[]")),
            lookup: this.books_states,
            cellStyle: {padding: '0px', textAlign: 'center'},
        },
        {
            title: 'Выдача',
            field: 'downloads_count',
            type: 'numeric',
            filtering: false,
            cellStyle: {padding: '0px', textAlign: 'right'},
            render: rowData => (Number.parseInt(rowData.downloads_count) > 0 ? <Link to={"/kitobplus-admin/bookshelf_history/books_id/" + rowData.id}>{rowData.downloads_count}</Link> : '0')
        },
        {
            title: 'На книжных полках',
            field: 'bookshelfs_count',
            type: 'numeric',
            filtering: false,
            cellStyle: {padding: '0px', textAlign: 'right'},
            render: rowData => (Number.parseInt(rowData.bookshelfs_count) > 0 ? <Link to={"/kitobplus-admin/bookshelf/books_id/" + rowData.id}>{rowData.bookshelfs_count}</Link> : '0')
        }

/*        { title: 'Издательство', field: 'publishers_name', cellStyle: {padding: '0px', paddingRight: '12px', maxWidth: '32px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}, filtering: false},*/
    ]

    let sort_column_id = 0;
    for (var i = 0; i < columns.length; i++) {
        if (columns[i].field === localStorage.getItem('books_sort_column', 'name')) {
            sort_column_id = i;
        }
    }
    columns[sort_column_id]['defaultSort'] = (localStorage.getItem('books_sort_direction') === 'asc' || localStorage.getItem('books_sort_direction') === 'desc') ? localStorage.getItem('books_sort_direction') : 'asc';
    return columns;
}
