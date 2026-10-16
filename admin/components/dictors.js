import React from "react";
import Person from "./person";

class Dictors extends React.Component {

    render () {
        return (
            <Person title="Дикторы" type="диктора" table="dictors" history={this.props.history}/>
        )
    }
}

export default Dictors;