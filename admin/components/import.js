import React from "react";
import MaterialTable from "material-table";
import {personRowClick} from "./person/personRowClick";
import {getSettings} from "./settings"; 
import BookDialog from "./books/BookDialog";

const initialState = {
    mouseX: null,
    mouseY: null,
    selectedRow: null
};

class Import extends React.Component {
    constructor(props) {
        super(props);
        this.recordsRefs = {};
        this.state = initialState;
        this.tableRef = React.createRef();
        this.firstShow = true
        this.firstColumnTitle = this.props.firstColumnTitle ?? "ФИО";
        this.options = {
            'authors': [],
            'dictors': [],
            'genres': [],
            'publishers': []
        };
    }

    fetchOptions = async () => {
        try {
            const response = await fetch(getSettings().backend + "/options.php?token=" + localStorage.getItem('token'), {method: 'GET'});
            if (!response.ok) throw new Error('Network response was not ok');

            console.log("load data");
            const data = await response.json();
            console.log("data loaded");
            console.log(data.options);
            this.setState({options: data.options, freeSpace: data.options.free_space})
            //setOptions(data.options); // Assuming the response has an 'options' array
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    componentDidMount() {
        this.firstShow = true;
        this.recordsRefs = {};
        this.selectOnRefreshRowId = localStorage.getItem(this.props.table + '_record_id', 0);
        this.selectOnRefreshNextRowId = null;
        this.fetchOptions();
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
                title: 'Папка',
                field: 'name',
                width: '75%',
                render: rowData => {
                    return <a ref={(a) => this.updateRef(rowData.id, a)} href="#" onClick={(e) => this.importBook(e, rowData)}>{rowData.name}</a>
/*
                    if (this.firstShow && !this.selectOnRefreshRowId) {
                        this.firstShow = false
                        this.selectOnRefreshRowId = rowData.id;
                    }

                    return <a
                                href={"/mybook/import/import/" + rowData.id + "/" + encodeURIComponent(rowData.name)}
                                onClick={(e) => {
                                    e.preventDefault();
                                    localStorage.setItem(this.props.table + '_record_id', rowData.id)
                                    if (e.ctrlKey) this.props.history.push("/mybook/person/" + this.props.table + "/" + rowData.id + "/" + encodeURIComponent(rowData.name));
                                }}
                                ref={(a)=>{this.recordsRefs[rowData.id] = a}}
                            >{rowData.name}</a>
*/
                },
                cellStyle: {padding: '0px', paddingLeft: '12px'},
                defaultFilter: localStorage.getItem(this.props.table + "_name_filter", ""),
            },
            {
                title: 'Длительность',
                field: 'duration',
                cellStyle: {padding: '0px', textAlign: 'right'},
                filtering: false,
                width: '15%'
            },
            {
                title: 'Кол-во файлов',
                field: 'files_count',
                type: 'numeric',
                cellStyle: {padding: '0px', paddingRight: '12px'},
                filtering: false,
                width: '10%'
            },
        ]

        let sort_column_id = 0;
        for (var i = 0; i < columns.length; i++) {
            if (columns[i].field === localStorage.getItem(this.props.table + '_sort_column', 'name')) {
                sort_column_id = i;
            }
        }
        columns[sort_column_id]['defaultSort'] = (localStorage.getItem(this.props.table + '_sort_direction') === 'asc' || localStorage.getItem(this.props.table + '_sort_direction') === 'desc') ? localStorage.getItem(this.props.table + '_sort_direction') : 'asc';
        return columns;
    }

    render () {
        return (
            <div>
                <audio controls hidden ref={(a) => {this.audio = a}}>
                    <source ref={(as)=>{this.audioSource = as}} type="audio/mpeg"/>
                </audio>
                <BookDialog
                    stopPlayback={this.stopPlayback}
                    preview={this.preview}
                    options={this.state.options}
                    reload={this.reload}
                    updateRef={this.updateRef}
                    rowData={this.state.selectedRow}
                    isOpen={this.state.bookDialogIsOpen}
                    closeBookDialog={() => this.setState({bookDialogIsOpen: false})}
                />
                <MaterialTable
                    title={'Импорт книг' + (this.state?.freeSpace ? ' (свободно на диске ' + Math.round(this.state?.freeSpace / (1024 * 1024 * 1024))+ 'Gb)' : '')}
                    localization={{toolbar: {searchPlaceholder: 'Поиск'}}}
                    columns={this.getColumns()}
                    tableRef={this.tableRef}
                    data={query => new Promise((resolve, reject) => {
                            var search = '';

                            for(var i = 0; i < query.filters.length; i++) {
                                if (query.filters[i].column.field === 'name') {
                                    search = query.filters[i].value;
                                }
                            }

                            localStorage.setItem(this.props.table + "_name_filter", search);
                            localStorage.setItem(this.props.table + '_sort_column', query.orderBy ? query.orderBy.field : '')
                            localStorage.setItem(this.props.table + '_sort_direction', query.orderDirection)

//                            let url = 'http://czz.audiologos.ru/mybook/srv/?'
                            let url = getSettings().backend + '/index.php?'
                            url += 'table=import'
                            url += '&per_page=' + query.pageSize
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
                        searchText: localStorage.getItem(this.props.table + '_search') ? localStorage.getItem(this.props.table + '_search') : '',
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

export default Import;
