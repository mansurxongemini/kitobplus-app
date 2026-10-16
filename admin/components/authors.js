import React from "react";
import Person from './person'

class Authors extends React.Component {
    render () {
        return (
            <Person title="Авторы" type="автора" table="authors" logout={this.props.logout} history={this.props.history}/>
        )
    }
}

export default Authors;