import {changeState} from "./changeState";

export function rowClick(event, rowData, togglePanel) {
/*    
    if (event.shiftKey) {
        if (![0, 1, 3].includes(rowData.states_id)) {alert('Отложить можно только не проверенную, отсутствующую в библиотеке, либо скрытую книгу'); return;}
        changeState.bind(this)(rowData, 2);
        return;
    }

    if (event.ctrlKey) {
        if (rowData.states_id === 4) {alert('Книга уже находится в очереди на загрузку'); return;}
        if (rowData.states_id === 5) {alert('Книга уже загружена'); return;}
        if (rowData.states_id === 6) {alert('Книга уже есть в библиотеке'); return;}
        changeState.bind(this)(rowData, 4);
        return;
    }

    if (event.altKey) {
        this.preview(rowData);
        return;
    }
*/
    if (this.openedPanel && this.openedPanelId !== rowData.id) {
        this.openedPanel();
    }

    console.log("onRowClick")
    console.log(event.ctrlKey)
    togglePanel()
    if (this.openedPanelId !== rowData.id) {
        this.openedPanel = togglePanel;
        this.openedPanelId = rowData.id;
    } else {
        this.openedPanel = null;
    }
    setTimeout(()=>{
        var preview_link = document.getElementById('detailPanel' + rowData.id + '_preview');
        if (preview_link) {
            preview_link.focus()
        }
    }, 1)
}