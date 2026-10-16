import React from "react";
import Person from "./person";

class Publishers extends React.Component {
    render () {
        return (
            <Person title="Издательства" type="издательства" table="publishers" firstColumnTitle="Название" history={this.props.history}/>
        )
    }
}

export default Publishers;