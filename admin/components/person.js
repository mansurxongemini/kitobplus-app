import React from "react";
import MaterialTable from "material-table";
import {personRowClick} from "./person/personRowClick";
import {renderPersonDetailPanel} from "./person/renderPersonDetailPanel";
import {getSettings} from "./settings";
import {BrowserRouter as Router} from "react-router-dom";
import {Link} from "react-router-dom";
import PersonDialog from "./person/PersonDialog";
import CropDialog from "./CropDialog";
import { clearToken } from "../lib/api";

const initialState = {
    mouseX: null,
    mouseY: null,
    selectedRow: null
};

class Person extends React.Component {

    constructor(props) {
        super(props);
        this.recordsRefs = {};
        this.state = initialState;        
        this.tableRef = React.createRef();
        this.firstShow = true
        this.firstColumnTitle = this.props.firstColumnTitle ?? "ФИО";
        
        this.state.cropDialogIsOpen = false;
        this.state.personDialogIsOpen = false;
    }

    componentDidMount() {
        this.firstShow = true;
        this.recordsRefs = {};
        //this.personDialogIsOpen = false;
        this.selectOnRefreshRowId = localStorage.getItem(this.props.table + '_record_id', 0);
        this.selectOnRefreshNextRowId = null;
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

    handleClose() {
        this.setState(initialState);
    }

    updateRef = (id, ref) => this.recordsRefs[id] = ref
    
    reload = (id) => {
        this.selectOnRefreshRowId = id;
        this.tableRef.current.onQueryChange()
    }

    editPerson = (e, row) => {
        e.preventDefault()
        let state = this.state
        state.selectedRow = JSON.parse(JSON.stringify(row));
        state.personDialogIsOpen = true        
        console.log(state.selectedRow);
        this.setState(state)
    }

    cropImage = (id, img) => {
        console.log("cropImage(" + id + ", " + img +")");
        this.setState({cropId: id, cropImg: img, cropDialogIsOpen: true});
    }

    getColumns = () => {
        let columns=[
            {
                title: this.firstColumnTitle,
                field: 'name',
                width: (this.props.table === 'genres1' ? '60%' : '75%'),
                render: (rowData) => {    
                    return (
                        <div style={{display: 'flex', padding: 2,}}>
                            {rowData.pics_ext ? <img onClick={() => this.cropImage(rowData.id, 'https://kitobplus.uz/pics/' + this.props.table + '/' + rowData.id + '.orig.' + rowData.pics_ext)} src={'https://kitobplus.uz/pics/' + this.props.table + '/' + rowData.id + '.' + rowData.pics_ext} style={{maxWidth: 24, borderRadius: 12, marginRight: 4}}/> : ''}
                            <a ref={(a)=>{this.recordsRefs[rowData.id] = a}} href="#" onClick={(e) => this.editPerson(e, rowData)}>{rowData.name}</a>
                        </div>
                    );
                },
                cellStyle: {padding: '0px', paddingLeft: '12px'},
                defaultFilter: localStorage.getItem(this.props.table + "_name_filter", ""),
            },
            {
                title: 'Кол-во книг',
                field: 'books_count',
                type: 'numeric',
                width: (this.props.table === 'genres1' ? '20%' : '25%'),
                cellStyle: {padding: '0px', paddingRight: '12px'},
                filtering: false,
                render: rowData => {
                    return <Link to={"/kitobplus-admin/person/" + this.props.table + "/" + rowData.id + "/" + encodeURIComponent(rowData.name)} id={this.props.table + 'DetailPanel' + rowData.id + '_books'}>{rowData.books_count}</Link>
                },
                //defaultFilter: JSON.parse(localStorage.getItem("some_uniq_key", "[]")),
                //selectedFilter: 1,
                //selectedFilter: 1,
                //lookup: this.state.states,
            },
        ]

        if (0 && this.props.table === 'genres') {
            columns.push({
                title: 'Жанры в av3715',
                field: 'genre_links',
                width: '20%',
                cellStyle: {padding: '0px', paddingLeft: '12px'},
                filtering: false
            });
        }

        //console.log(this.props.table + " default sort column = " + localStorage.getItem(this.props.table + '_sort_column', 'name'));

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
                <PersonDialog
                    table={this.props.table}
                    reload={this.reload}
                    row={this.state.selectedRow}
                    isOpen={this.state.personDialogIsOpen}
                    closePersonDialog={() => {
                        console.log('closePersonDialog');
                        let s = this.state;
                        s.personDialogIsOpen = false;
                        this.setState(s);
                    }}
                />
                <CropDialog
                    circular={true}
                    isOpen={this.state.cropDialogIsOpen}
                    img={this.state.cropImg}
                    reload={this.reload}
                    id={this.state.cropId}
                    target={this.props.table}
                    closeCropDialog={() => this.setState({cropDialogIsOpen: false})}
                />
                <MaterialTable
                    title={this.props.title}
                    localization={{toolbar: {searchPlaceholder: 'Поиск'}}}
                    columns={this.getColumns()}
                    tableRef={this.tableRef}
                    data={query => new Promise((resolve, reject) => {
                            var search = '';
                            var states = [];

                            for(var i = 0; i < query.filters.length; i++) {
                                if (query.filters[i].column.field === 'name') {
                                    search = query.filters[i].value;
                                }

                                if (query.filters[i].column.field === 'states_id') {
                                    states = query.filters[i].value;
                                }
                            }

                            localStorage.setItem(this.props.table + "_name_filter", search);
                            localStorage.setItem(this.props.table + "_state_filter", JSON.stringify(states));
                            localStorage.setItem(this.props.table + '_sort_column', query.orderBy ? query.orderBy.field : '')
                            localStorage.setItem(this.props.table + '_sort_direction', query.orderDirection)

//                            let url = 'http://czz.audiologos.ru/mybook/srv/?'
                            let url = getSettings().backend + '/index.php?'
                            url += 'table=' + this.props.table
                            url += '&per_page=' + query.pageSize
                            url += '&page=' + (query.page + 1)
                            url += '&filter=' + search
                            url += '&states=' + states.join(',')
                            url += '&order=' + (query.orderBy ? query.orderBy.field : 'name')
                            url += '&orderDirection=' + query.orderDirection
                            url += '&all=1'
                            url += '&token=' + localStorage.getItem('token')

                            fetch(url)
                                .then(response => response.json())
                                .then(result => {
                                    if (!result.success) {
                                        clearToken()
                                        //this.props.history.push("/books/login")
                                        window.location.href = '/kitobplus-admin/login'
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
                        title: <></>,
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
                        searchText: localStorage.getItem(this.props.table + '_search') ? localStorage.getItem(this.props.table + '_search') : '',
                        draggable: false,
                        filtering: true,
                        search: false,
                        debounceInterval: 1000,
                        toolbar: false,
                    }}
                />
            </div>
        )
    }
}

export default Person;