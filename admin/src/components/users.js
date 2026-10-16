import React from "react";
import MaterialTable from "material-table"
import {getSettings} from "./settings"; 
import UserDialog from "./UserDialog";
import Button from '@material-ui/core/Button';
import { getUser } from "../lib/api";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { IconButton } from "@material-ui/core";
import {Link} from "react-router-dom";

const initialState = {
    mouseX: null,
    mouseY: null,
    selectedRow: null
};

class Users extends React.Component {
    constructor(props) {
        super(props);
        this.recordsRefs = {};
        this.state = initialState;
        this.tableRef = React.createRef();
    }

    componentDidMount() {
        this.firstShow = true;
        this.recordsRefs = {};
        //console.log('Previosly selected record = ' + localStorage.getItem(this.props.table + '_record_id', 0));
    }

    contextMenuHandler = (event, rowData) => {
        //console.log(rowData)
        event.preventDefault();
        this.setState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
            selectedRow: rowData
        });
    };

    updateRef = (id, ref) => this.recordsRefs[id] = ref
    reload = (id) => {
        this.selectOnRefreshRowId = id;
        this.tableRef.current.onQueryChange()
    }

    handleClose() {
        this.setState(initialState);
    }

    preview = (rowData) => {
        console.log("Click! (" + rowData.preview +")")
        this.audio.pause();
        this.audioSource.src = rowData.preview;
        this.audio.load();
        this.audio.play();
        console.log('Change source to ' + rowData.preview);
    }

    stopPlayback = () => {
        this.audio.pause();
    }

    importBook = (e, row) => {
        e.preventDefault()
        let state = this.state
        state.selectedRow = JSON.parse(JSON.stringify(row));
        state.selectedRow.name = row.title
        state.selectedRow.import = row.folder
        state.bookDialogIsOpen = true
        this.setState(state)
    }

    getColumns = () => {
        let columns=[
            {
                title: 'ФИО',
                field: 'name',
                width: '40%',
                render: rowData => {
                    return <a ref={(a) => this.updateRef(rowData.id, a)} href="#" onClick={(e) => {e.preventDefault(); this.editUser(rowData)}}>{rowData.name ?? '-'}</a>
                },
                cellStyle: {padding: '0px', paddingLeft: '12px'},
                defaultFilter: localStorage.getItem("users_name_filter", ""),
            },{
                title: 'Телефон',
                field: 'phone',
                cellStyle: {padding: '0px', textAlign: 'left'},
                width: '20%',
                render: rowData => rowData.phone ? '+' + rowData.phone : ''
            },{
                title: 'Дата регистрации',
                field: 'register_date',
                cellStyle: {padding: '0px', whiteSpace: 'no-wrap', textAlign: 'left'},
                width: '20%',
                filtering: false,
            }
        ];

        if (getUser().levels_id === 0) {
            columns.push({
                title: 'Статус',
                field: 'state',
                type: 'numeric',
                cellStyle: {padding: '0px', paddingRight: '12px'},
                width: '20%',
                lookup: {1: 'Ожидает подтверждения', 2: 'Доступ подтвержден', 3: 'Доступ запрещён'},
                render: rowData => {
                    const states = ['Ожидает подтверждения', 'Доступ подтвержден', 'Доступ запрещён'];
                    return (
                        rowData.state > 0 && rowData.state < 4 ? 
                            <span>{states[rowData.state - 1]}</span>
                        :
                            <span>?</span>
                    );
                }
            });

            columns.push({
                title: 'Доступ',
                field: 'levels_id',
                cellStyle: {padding: '0px', paddingRight: '12px'},
                type: 'numeric',
                lookup: {0: 'Администратор', 1: 'Читатель', 2: 'Библиотека', 3: 'Школа'},
                width: '20%',
                render: rowData => rowData.policies
            });
/*
            columns.push({
                title: 'e-mail',
                field: 'email',
                cellStyle: {padding: '0px', textAlign: 'left'},
                filtering: false,
                width: '20%'
            });
*/
        }
/*        
        columns.push({
                title: 'Дата входа',
                field: 'visited',
                filtering: false,
                width: '20%',
                render: rowData => <Link to="/kitobplus-admin/journal">{rowData.visited}</Link>
        });
*/
        columns.push({
                title: 'План',
                field: 'plans_id',
                lookup: {0: 'Ограниченный доступ', 1: 'Демо-премиум', 2: 'Полный доступ', 3: 'Премиум'},
                type: 'numeric',
                width: '20%',
                render: rowData => {
                    return <>
                        <span>{rowData.plans_name}</span>
                        {(rowData.plans_id && rowData.plan_end_str) ? <><br/><span>{'до ' + rowData.plan_end_str}</span></> : ""}
                    </>
                }
        });

        columns.push({
                title: 'Выдано книг',
                field: 'deployed',
                filtering: false,
                width: '20%',
                render: rowData => (Number.parseInt(rowData.deployed) > 0 ? <Link to={"/kitobplus-admin/bookshelf_history/users_id/" + rowData.id}>{rowData.deployed}</Link> : '0')
        });

        columns.push({
                title: 'Книг на книжной полке',
                field: 'bookshelfed',
                filtering: false,
                width: '20%',
                render: rowData => (Number.parseInt(rowData.bookshelfed) > 0 ? <Link to={"/kitobplus-admin/bookshelf/users_id/" + rowData.id}>{rowData.bookshelfed}</Link> : '0')
        });

        let sort_column_id = 0;
        for (var i = 0; i < columns.length; i++) {
            if (columns[i].field === localStorage.getItem('users_sort_column', 'name')) {
                sort_column_id = i;
            }
        }
        columns[sort_column_id]['defaultSort'] = (localStorage.getItem('users_sort_direction') === 'asc' || localStorage.getItem('users_sort_direction') === 'desc') ? localStorage.getItem('users_sort_direction') : 'asc';
        return columns;
    }

    editUser = (row) => {
        this.setState({userDialogIsOpen: true, selectedRow: row})
    }

    render () {
        return (
            <div>
                <UserDialog
                    stopPlayback={this.stopPlayback}
                    preview={this.preview}
                    reload={this.reload}
                    updateRef={this.updateRef}
                    rowData={this.state.selectedRow}
                    isOpen={this.state.userDialogIsOpen}
                    closeUserDialog={() => this.setState({userDialogIsOpen: false})}
                />
                <MaterialTable
                    title={<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}><h2 style={{flex: 1}}>{getUser().levels_id === 0 ? 'Пользователи' : (getUser().levels_id === 3 ? 'Учащиеся' : 'Читатели')}</h2> <IconButton onClick={_ => this.editUser({id: 0, name: '', email: '', password: ''})} color="primary" title='Добавить' aria-label={getUser().levels_id === 0 ? 'Добавить пользователя' : (getUser().levels_id === 3 ? 'Добавить учащегося' : 'Добавить читателя')}><PersonAddIcon style={{color: '#024959'}}/></IconButton></div>}
                    localization={
                        {
                            toolbar: {searchPlaceholder: 'Поиск'},
                            body: {filterRow: {filterTooltip: 'Фильтр'}, emptyDataSourceMessage: 'Нет данных для отображения'},                            
                        }
                    }
                    columns={this.getColumns()}
                    tableRef={this.tableRef}
                    data={query => new Promise((resolve, reject) => {
                            var search = '';

                            let phone_filter = '';
                            let levels_id = '';
                            let plans_id = '';
                            let state ='';

                            for(var i = 0; i < query.filters.length; i++) {
                                if (query.filters[i].column.field === 'name') {
                                    search = query.filters[i].value;
                                }
                                
                                if (query.filters[i].column.field === 'phone') {
                                    phone_filter = query.filters[i].value;
                                }

                                if (query.filters[i].column.field === 'state') {
                                    state = JSON.stringify(query.filters[i].value);
                                }

                                if (query.filters[i].column.field === 'levels_id') {
                                    levels_id = JSON.stringify(query.filters[i].value);
                                }

                                if (query.filters[i].column.field === 'plans_id') {
                                    plans_id = JSON.stringify(query.filters[i].value);
                                }
                            }

                            localStorage.setItem('users_name_filter', search);
                            localStorage.setItem('users_sort_column', query.orderBy ? query.orderBy.field : '')
                            localStorage.setItem('users_sort_direction', query.orderDirection)

                            let url = getSettings().backend + '/index.php?'
                            url += 'table=users'
                            url += '&per_page=' + query.pageSize
                            url += '&phone=' + phone_filter;
                            url += '&state=' + state;
                            url += '&levels_id=' + levels_id;
                            url += '&plans_id=' + plans_id;
                            url += '&page=' + (query.page + 1)
                            url += '&filter=' + search
                            url += '&order=' + (query.orderBy ? query.orderBy.field : 'name')
                            url += '&orderDirection=' + query.orderDirection
                            url += '&token=' + localStorage.getItem('token')

                            fetch(url)
                                .then(response => response.json())
                                .then(result => {
                                    if (!result.success) {
                                        localStorage.removeItem('token')
                                        this.props.logout();
                                        this.props.history.push("/books/login")
                                        return;
                                    }

                                    this.recordsRefs = {};
                                    resolve({
                                        data: result.data,
                                        page: result.page - 1,
                                        totalCount: result.total,
                                    })
                                }).then(() => {
                                    //console.log("Fetch done!")
                                    if (this.selectOnRefreshRowId) {
                                        let rowId = (this.recordsRefs.hasOwnProperty(this.selectOnRefreshRowId) && this.recordsRefs[this.selectOnRefreshRowId]) ? this.selectOnRefreshRowId : this.selectOnRefreshNextRowId
                                        console.log("Let's select row (#" + rowId + ")")
                                        //console.log(this.recordsRefs);
                                        if (this.recordsRefs.hasOwnProperty(rowId)) {
                                            console.log("Book row ref found!")
                                            if (this.recordsRefs[rowId]) {
                                                this.recordsRefs[rowId].focus()
                                            } else {
                                                console.error("Ref is null :(");
                                            }
                                        } else {
                                            console.error("record row ref not found :(");
                                        }
                                        this.selectOnRefreshRowId = null;
                                        this.selectOnRefreshNextRowId = null;
                                    }
                                }
                            )
                        })
                    }

                    options={{
                        sorting: true,
                        paging: true,
                        localization: {
                            toolbar: {
                                searchPlaceholder: 'Поиск'
                            },
                            pagination: {
                                labelDisplayedRows: '{from}-{to} из {count}',
                                labelRowsSelect: 'строк',
                                labelRowsPerPage: 'Строк на страницу',
                                firstAriaLabel: 'Первая страница',
                                firstTooltip: 'Первая страница',
                                previousAriaLabel: 'Предыдущая страница',
                                previousTooltip: 'Предыдущая страница',
                                nextAriaLabel: 'Следующая страница',
                                nextTooltip: 'Следующая страница',
                                lastAriaLabel: 'Последняя страница',
                                lastTooltip: 'Последняя страница',
                            }
                        },
                        rowStyle: {
                            padding: '0px',
                        },
                        pageSize: 100,
                        pageSizeOptions: [100, 1000, 10000],
                        searchText: localStorage.getItem('users_search') ? localStorage.getItem('users_search') : '',
                        draggable: false,
                        filtering: true,
                        search: false,
                        debounceInterval: 1000
                    }}
                />
            </div>
        )
    }
}

export default Users;
