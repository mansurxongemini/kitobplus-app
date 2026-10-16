import React from "react";

class SelectedStatesSettings extends React.Component {
    constructor(props) {
        super(props);
        var ss = JSON.parse(localStorage.getItem(this.props.table + "_state_filter", "[]"))
        this.state = {
            states: this.props.states,
            selectedStates:  ss ? ss : []
        };
    }

    statesList() {
/*
        return Object.entries(this.state.states).map(([id, name]) =>
            <li key={'l' + id.toString()}>
                <input id={'l' + id.toString()} type={'checkbox'} onChange={()=>this.handleChange(id)} checked={this.state.selectedStates.includes(id.toString())}/>
                <label htmlFor={'l' + id.toString()}>{name}</label>
            </li>
        );
*/
        var states = [];
        for (var id in this.state.states) {
            if (this.state.states.hasOwnProperty(id)) {
                states.push({id: id, name: this.state.states[id]});
            }
        }

        return states.map(state => {
            return (
                <li key={'l' + state.id.toString()}>
                    <input id={'l' + state.id.toString()} type={'checkbox'} onChange={()=>this.handleChange(state.id)} checked={this.state.selectedStates.includes(state.id.toString())}/>
                    <label htmlFor={'l' + state.id.toString()}>{state.name}</label>
                </li>
            )
        })
    }


    handleChange (id) {
        let strid = id.toString();
        let ss = this.state.selectedStates;
        if (ss.includes(strid)) {
            ss = ss.filter((value) => value !== strid);
        } else {
            ss.push(strid);
        }

        this.setState({selectedStates: ss})
        localStorage.setItem(this.props.table + "_state_filter", JSON.stringify(ss));
    }

    render () {
        return (
            <div style={{textAlign: 'left'}}>
                <h2>Статусы, отображаемые в списке {this.props.title}</h2>
                <ul>{this.statesList()}</ul>
            </div>
        )
    }
}

export default SelectedStatesSettings;