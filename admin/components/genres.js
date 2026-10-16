import React from "react";
import Person from "./person";

class Genres extends React.Component {
    render () {
        return (
            <Person title="Жанры" type="жанра" table="genres" firstColumnTitle="Жанр" history={this.props.history}/>
        )
    }
}

export default Genres;