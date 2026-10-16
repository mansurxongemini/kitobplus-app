import React from "react";
import MaterialTable from "material-table";
import {getColumns} from "./books/getColumns";
import {dataQuery} from "./books/dataQuery";
import {getStates} from "./books/states"
import {rowClick} from "./books/rowClick";
import {renderDetailPanel} from "./books/renderDetailPanel";
import {getSettings} from "./settings"
import PublishDialog from "./books/PublishDialog";
import BookDialog from "./books/BookDialog";
import DeleteDialog from "./books/DeleteDialog";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import AvatarEditor from "react-avatar-editor";
import CropDialog from "./CropDialog";

class Books extends React.Component {
    state = {
        options: {
            'authors': [],
            'dictors': [],
            'genres': [],
            'publishers': []
        }
    }

    constructor(props) {
        super(props);

        this.openedPanel = null;
        this.openedPanelId = 0;
        this.books_states = getStates()
        this.tableRef = React.createRef()
        this.selectedRow = null
        this.bookDialogIsOpen = false

        this.tables = {
            "authors": "автора",
            "dictors": "диктора",
            "publishers": "издательства",
            "genres": "жанра"
        };

        this.state = {
            selectedBook: {id: 0},
            cropDialogIsOpen: false,
        };

        this.options = {
            'authors': [],
            'dictors': [],
            'genres': [],
            'publishers': []
        };
    }

    _handleKeyDown = (event) => {
        switch( event.keyCode ) {
            case 27:
                this.audio.pause();
                console.log("ESCAPE is pressed")
                break;
            default:
                break;
        }
    }

    fetchOptions = async () => {
        try {
            const response = await fetch(getSettings().backend + "/options.php?token=" + localStorage.getItem('token'), {method: 'GET'});
            if (!response.ok) throw new Error('Network response was not ok');

            console.log("load data");
            const data = await response.json();
            console.log("data loaded");
            console.log(data.options);
            this.setState({options: data.options});
            //setOptions(data.options); // Assuming the response has an 'options' array
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    componentDidMount() {
        this.firstShow = true;
        this.recordsRefs = {};
        this.selectOnRefreshRowId = null;
        this.selectOnRefreshNextRowId = null;
        document.addEventListener("keydown", this._handleKeyDown);
    
        this.fetchOptions();
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this._handleKeyDown);
    }

    handleClick = (e, rowData) => {
        e.preventDefault();
        console.log("handleClick");
    }

    preview = (rowData) => {
        let id = rowData.id;
        while (id.length < 5) id = "0" + id;
        console.log("Click! (" + id +")")
        this.audio.pause();
        this.audioSource.src = rowData.preview ? rowData.preview : ('/books/' + id + '/0001.mp3');
        this.audio.load();
        this.audio.play();
        console.log('Change source to /books/' + id + '/0001.mp3')
    }

    stopPlayback = () => {
        this.audio.pause();
    }

    handleContextMenu = (e, rowData) => {
        console.log("client: " + e.clientX + "x" + e.clientY );
        console.log("page: " + e.pageX + "x" + e.pageY );
        console.log("screen: " + e.screenX + "x" + e.screenY );
        console.log(rowData);
        e.preventDefault();
        console.log("handleContextMenu");
    }

    updateRef = (id, ref) => this.recordsRefs[id] = ref
    
    reload = (id) => {
        this.openedPanel = null
        this.openedPanelId = null

        this.selectOnRefreshRowId = id;
        this.tableRef.current.onQueryChange()
    }

    editBook = (row) => {
        let state = this.state
        state.selectedRow = JSON.parse(JSON.stringify(row));
        state.selectedRow.name = row.title
        state.selectedRow.import = null
        state.bookDialogIsOpen = true        
        this.setState(state)
    }

    publishBook = (row, publish) => {
        let state = this.state
        state.selectedRow = JSON.parse(JSON.stringify(row));
        state.selectedRow.is_readable_from = (publish ? (row.is_readable_from ? row.is_readable_from : (new Date()).toISOString()): null)
        state.publishDialogIsOpen = true        
        this.setState(state)
    }

    notifyBook = (row) => {
        fetch(getSettings().backend + '/push/send.php?token=' + localStorage.getItem('token'), {method: 'POST', body: JSON.stringify({title: 'Yangi kitob!', body: row.name, books_id: row.id})}).then(response=>response.json()).then(response => {
            console.log(response)
            //this.reload(row.id)
            alert('Сообщение разослано!\nУспешно: ' + response['result']['sended'] + '\nОшибок: ' + response['result']['errors']);
        });
    }

    updateBook = () => {
        console.log(this.state.selectedRow.dictors_name)
    }

    updateRow = (field, value) => {
        let state = this.state
        state.selectedRow[field] = value
        this.setState(state)
    }

    deleteBook = (row) => {
        let state = this.state
        state.selectedRow = JSON.parse(JSON.stringify(row));
        state.deleteDialogIsOpen = true        
        this.setState(state)
    }

    undeleteBook = (row) => {
        fetch(getSettings().backend + '/undelete_book.php?token=' + localStorage.getItem('token'), {method: 'POST', body: JSON.stringify({id: row?.id})}).then(response=>response.json()).then(response => {
            console.log(response)
            this.reload(row.id)
        });
    }

    cropImage = (id, img) => {
        console.log("cropImage(" + id + ", " + img +")");
        this.setState({cropId: id, cropImg: img, cropDialogIsOpen: true});
    }

    render() {
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
                    rowData={this.state.selectedRow}
                    isOpen={this.state.bookDialogIsOpen}
                    closeBookDialog={() => this.setState({bookDialogIsOpen: false})}
                />
                <PublishDialog
                    reload={this.reload}
                    isOpen={this.state.publishDialogIsOpen}
                    rowData={this.state.selectedRow}
                    closePublishDialog={() => this.setState({publishDialogIsOpen: false})}
                />
                <DeleteDialog
                    reload={this.reload}
                    isOpen={this.state.deleteDialogIsOpen}
                    rowData={this.state.selectedRow}
                    closeDeleteDialog={() => this.setState({deleteDialogIsOpen: false})}
                />
                <CropDialog
                    isOpen={this.state.cropDialogIsOpen}
                    img={this.state.cropImg}
                    reload={this.reload}
                    id={this.state.cropId}
                    target='books'
                    closeCropDialog={() => this.setState({cropDialogIsOpen: false})}
                />
                <MaterialTable
                    title={"Книги" + (this.props.match.params.table ? " " + this.tables[this.props.match.params.table] + " " + this.props.match.params.name: "")}
                    localization={{
						toolbar: { searchPlaceholder: 'Поиск' },
						body: {filterRow: {filterTooltip: 'Фильтр'}},
						pagination: {
							labelRowsPerPage: 'Строк на странице',
							labelRowsSelect: 'строк',	
							firstTooltip: 'Первая страница',
							previousTooltip: 'Предыдущая страница',
							nextTooltip: 'Следующая страница',
							lastTooltip: 'Последняя страница',
							labelDisplayedRows: '{from}-{to} из {count}',
						}
					}}
                    columns={getColumns.bind(this)()}
                    tableRef={this  .tableRef}
                    data={dataQuery.bind(this)}
                    detailPanel={[{
                        disabled: false,
                        render: rowData=>renderDetailPanel.bind(this)(rowData)
                    }]}
                    onRowClick={(event, rowData, togglePanel) => rowClick.bind(this)(event, rowData, togglePanel)}
                    options={{
                        sorting: true,
                        paging: true,
                        localization: {toolbar: {searchPlaceholder: 'Поиск'}},
                        rowStyle: {padding: '0px'},
                        padding: "dense",
                        pageSize: 100,
                        pageSizeOptions: [10, 100, 1000],
                        searchText: localStorage.getItem('books_search') && ! (this.props.match && this.props.match.params.table) ? localStorage.getItem('books_search') : '',
                        draggable: false,
                        filtering: true,
                        search: false,
                        debounceInterval: 1000,
                        tableLayout: "auto"
                    }}
                />
            </div>
        )
    }
}

export default Books;

/*
    alter VIEW `books_view` AS select `b`.`id` AS `id`,(select count(distinct `bh`.`users_id`) from `bookshelfs_history` `bh` where `bh`.`books_id` = `b`.`id`) AS `downloads_count`,db.deleted,(select count(distinct `bs`.`users_id`) from `bookshelfs` `bs` where `bs`.`books_id` = `b`.`id`) AS `bookshelfs_count`,(select group_concat(`f`.`seconds` separator ',') from `files` `f` where `f`.`books_id` = `b`.`id` order by `f`.`pos`) AS `files`,`b`.`name` AS `name`,`b`.`preview_id` AS `preview_id`,`b`.`url` AS `url`,`b`.`is_readable_from` AS `is_readable_from`,group_concat(distinct `a`.`id` separator ',') AS `authors_id`,group_concat(distinct `d`.`id` separator ',') AS `dictors_id`,group_concat(distinct `g`.`id` order by `b2g`.`pos` ASC separator ',') AS `genres_id`,`pics`.`ext` AS `pics_ext`,`b`.`seconds` AS `seconds`,`b`.`bytes` AS `bytes`,`b`.`publishers_id` AS `publishers_id`,`b`.`folder` AS `folder`,`b`.`imported` AS `imported`,`b`.`adult` AS `adult`,`b`.`annotation` AS `annotation`,`authors_pics`.`ext` AS `authors_pics_ext`,`dictors_pics`.`ext` AS `dictors_pics_ext`,`genres_pics`.`ext` AS `genres_pics_ext`,sec_to_time(round(`b`.`seconds`,0)) AS `duration`,date_format(`b`.`is_readable_from`,'%d.%m.%Y') AS `is_readable_from_dt`,`p`.`name` AS `publishers_name`,`s`.`name` AS `states_name`,group_concat(distinct `a`.`name` order by `b2a`.`pos` ASC separator ', ') AS `authors_name`,group_concat(distinct `d`.`name` order by `b2d`.`pos` ASC separator ', ') AS `dictors_name`,group_concat(distinct `g`.`name` order by `b2g`.`pos` ASC separator ', ') AS `genres_name`,`b2i`.`states_id` AS `books_states_id`,`b2i`.`inbox_id` AS `inbox_id`
    from `books` `b` left join `books2dictors` `b2d` on `b`.`id` = `b2d`.`books_id`
    left join `dictors` `d` on `b2d`.`dictors_id` = `d`.`id`
    left join `books2authors` `b2a` on `b`.`id` = `b2a`.`books_id`
    left join `authors` `a` on `b2a`.`authors_id` = `a`.`id`
    left join `books2genres` `b2g` on `b`.`id` = `b2g`.`books_id`
    left join `genres` `g` on `b2g`.`genres_id` = `g`.`id`
    left join `books2inbox` `b2i` on `b2i`.`books_id` = `b`.`id`
    left join `states` `s` on `s`.`id` = `b2i`.`states_id`
    left join `publishers` `p` on `p`.`id` = `b`.`publishers_id`
    left join `pics` on `pics`.`target` = 'books' and `pics`.`id` = `b`.`id`
    left join `pics` `authors_pics` on `authors_pics`.`target` = 'authors' and `authors_pics`.`id` = `b2a`.`authors_id`
    left join `pics` `dictors_pics` on `dictors_pics`.`target` = 'dictors' and `dictors_pics`.`id` = `b2d`.`dictors_id`
    left join `pics` `genres_pics` on `genres_pics`.`target` = 'genres' and `genres_pics`.`id` = `g`.`id`
    left join deleted_books db on b.id = db.books_id
    group by `b`.`id`;
*/