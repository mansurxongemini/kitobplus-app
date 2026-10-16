import React from "react";
import MaterialTable from "material-table"
import {getSettings} from "./settings"; 
import Books from "./books";

const initialState = {
    mouseX: null,
    mouseY: null,
    selectedRow: null,
    columns: [],
    users_id: undefined,
    books_id: undefined,
};


class Bookshelfs extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.recordsRefs = {};
        this.state = initialState;
        this.tableRef = React.createRef();
    }

    static async upColumns() {
        //fetch(getSettings().backend + '/users.php?id=' + this.props.users_id).then(_ => console.log(_));
    };

    getColumns = async (users_id, books_id) => {
        let users_name = '', books_name = '';
        console.log('getColumns(' + users_id + ', ' + books_id + ')');
        if (users_id) {
            let response = await fetch(getSettings().backend + '/index.php?token=' + localStorage.getItem('token') + '&table=users&id=' + users_id);
            let answer = await response.json();
            if (answer.data.length === 1) {
                users_name = answer.data[0].name;
            }
            //console.log(answer);
        }

        let columns=[
            {
                title: 'Пользователь',
                field: 'users_name',
                width: '40%',
                cellStyle: {padding: '0px', paddingLeft: '12px'},
                filtering: true,
                defaultFilter: users_name,
            },
            {
                title: 'Книга',
                field: 'books_name',
                cellStyle: {padding: '0px', paddingRight: '12px'},
                width: '40%',
                defaultFilter: books_name,
            },
            {
                title: 'Дата',
                field: 'dt',
                cellStyle: {padding: '0px', paddingRight: '12px'},
                filtering: false,
                width: '20%',
            },
        ]

        let sort_column_id = 0;
        for (var i = 0; i < columns.length; i++) {
            if (columns[i].field === localStorage.getItem('bookshelfs_sort_column', 'name')) {
                sort_column_id = i;
            }
        }
        columns[sort_column_id]['defaultSort'] = (localStorage.getItem('bookshelfs_sort_direction') === 'asc' || localStorage.getItem('bookshelfs_sort_direction') === 'desc') ? localStorage.getItem('bookshelfs_sort_direction') : 'asc';
        return columns;
    }

    componentDidMount() {
        this.firstShow = true;
        this.recordsRefs = {};
        //this.getColumns(this.props.users_id, this.props_books_id).then(_ => this.setState(ps => ({...ps, columns: _})));
        console.log(this.props);
        this.getColumns(this.props.match.params.users_id, this.props.match.params.books_id).then(_ => {this.setState(ps => ({...ps, columns: _}));});
        //fetch().then(_ => {});
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

    editUser = (row) => {
        this.setState({userDialogIsOpen: true, selectedRow: row})
    }

    render () {
        return (
            <div>
                {this.state.columns.length > 0 &&
                    <MaterialTable
                        title='Книжные полки'
                        localization={{toolbar: {searchPlaceholder: 'Поиск'}}}
                        columns={this.state.columns}
                        tableRef={this.tableRef}
                        data={query => new Promise((resolve, reject) => {
                                console.log("fetchData");
                                var search = '';
                                var users_name = '';
                                var books_name = '';
                                
                                console.log(query.filters);

                                for(var i = 0; i < query.filters.length; i++) {
                                    if (query.filters[i].column.field === 'users_name') {
                                        users_name = query.filters[i].value;
                                    }
                                    
                                    if (query.filters[i].column.field === 'books_name') {
                                        books_name = query.filters[i].value;
                                    }
                                }

                                localStorage.setItem('bookshelfs_name_filter', search);
                                localStorage.setItem('bookshelfs_sort_column', query.orderBy ? query.orderBy.field : '')
                                localStorage.setItem('bookshelfs_sort_direction', query.orderDirection)

                                let url = getSettings().backend + '/index.php?'
                                url += 'table=bookshelfs'
                                url += '&per_page=' + query.pageSize
                                url += '&page=' + (query.page + 1)
                                url += '&users_name=' + users_name
                                url += '&books_name=' + books_name
                                url += '&order=' + (query.orderBy ? query.orderBy.field : 'name')
                                url += '&orderDirection=' + query.orderDirection
                                url += '&employee=1'
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
                            paging: false,
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
                }
            </div>
        )
    }
}

export default Bookshelfs;
