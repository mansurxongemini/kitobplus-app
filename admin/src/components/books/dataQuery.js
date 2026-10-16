import {getSettings} from "../settings";

export function dataQuery(query) {
    return new Promise((resolve, reject) => {
        //console.log("fetch data")
        //console.log(query.filters);
        //var search = query.search ? query.search : '';
        var search = '';
        var states = [];

        console.log(query.filters);

        for(var i = 0; i < query.filters.length; i++) {
            console.log(query.filters[i]);
            if (query.filters[i].column.field === 'name') {
                search = query.filters[i].value;
            }

            if (query.filters[i].column.field === 'phone') {
                search = query.filters[i].value;
            }

            if (query.filters[i].column.field === 'states_id') {
                states = query.filters[i].value;
            }
        }

        console.log(search);

        localStorage.setItem("books_name_filter", search);
        localStorage.setItem("books_state_filter", JSON.stringify(states));
        localStorage.setItem('books_sort_column', query.orderBy ? query.orderBy.field : '')
        localStorage.setItem('books_sort_direction', query.orderDirection)
        //let url = 'http://czz.audiologos.ru/mybook/srv/?'
        let url = getSettings().backend + '/?'
        url += 'table=books'
        url += '&authors_id=' + (this.props.match && this.props.match.params.table === 'authors' ? this.props.match.params.id : '')
        url += '&dictors_id=' + (this.props.match && this.props.match.params.table === 'dictors' ? this.props.match.params.id : '')
        url += '&publishers_id=' + (this.props.match && this.props.match.params.table === 'publishers' ? this.props.match.params.id : '')
        url += '&genres_id=' + (this.props.match && this.props.match.params.table === 'genres' ? this.props.match.params.id : '')
        url += '&per_page=' + query.pageSize
        url += '&page=' + (query.page + 1)
        url += '&filter=' + encodeURIComponent(search)
        url += '&states=' + states.join(',')
        url += '&order=' + (query.orderBy ? query.orderBy.field : 'name')
        url += '&orderDirection=' + query.orderDirection
        url += '&token=' + localStorage.getItem('token')

        fetch(url)
            .then(response => {console.log(response); return response.json();})
            .then(result => {
                console.log(result)
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
                    //console.log("Let's select row (#" + rowId + ")")
                    //console.log(this.recordsRefs);
                    if (this.recordsRefs.hasOwnProperty(rowId)) {
                        //console.log("Book row ref found!")
                        if (this.recordsRefs[rowId]) {
                            this.recordsRefs[rowId].focus()
                        } else {
                            console.error("Ref is null :(");
                        }
                    } else {
                        console.warn("Book row ref for #" + rowId + " not found :(");
                    }
                    this.selectOnRefreshRowId = null;
                    this.selectOnRefreshNextRowId = null;
                }
            }
        )
    })
}