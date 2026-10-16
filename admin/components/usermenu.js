import React, {useRef} from 'react';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const UserMenu = () => {
    
    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/kitob-admin/';
        return false;
    }

    return <a href="#" onClick={logout} aria-label='Выход'><ExitToAppIcon style={{ color: '#ffb27d', fontSize: 36 }}/></a>
}

export default UserMenu;
