import React from "react";
import SelectedStatesSettings from "./settings/SelectedStatesSettings";
import {getStates} from "./books/states";
import Button from '@material-ui/core/Button';

export function getSettings() {
    return {
//        backend: 'http://192.168.0.64:3001/srv'
        backend: 'https://kitobplus.uz/srv'
//        backend: '/mybook/srv'
    }
}


class Settings extends React.Component {
    constructor(props) {
        super(props);
    }

    logout() {
        localStorage.removeItem('token');
        console.log("Logout");
        this.props.history.push("/mybook/login")
        this.props.logout();
    }

    render () {
        return (
            <div>
                <h1>Настройки</h1>
                <Button color="primary" variant="contained" onClick={()=>this.logout()}>Выход</Button>
            </div>
        )
    }
}

export default Settings;
