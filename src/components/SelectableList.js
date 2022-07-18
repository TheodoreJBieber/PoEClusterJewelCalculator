import React from 'react';
import AddableListItem from './AddableListItem';

class SelectableList extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.defaultState();
    }

    defaultState() {
        return {
            hidden: true,
            filter: ""
        };
    }

    addSelectedItem(itemName) {
        let tempState = this.state;
        this.setState(tempState);
        this.props.addCallback(itemName);
    }

    expandDropDown() {
        let tempState = this.state;
        tempState.hidden = false;
        this.setState(tempState);
    }

    hideDropDown() {
        let tempState = this.state;
        tempState.hidden = true;
        tempState.filter = "";
        this.setState(tempState);
    }

    handleFilterUpdate(event) {
        let targetString = event.target.value;
        let tempState = this.state;
        tempState.filter = targetString;
        this.setState(tempState);
    }

    shouldHideListItem(option) {
        return !option.toLowerCase().includes(this.state.filter.toLowerCase());
    }

    render() {
        return (
            <div onFocus={this.expandDropDown.bind(this)} onBlur={this.hideDropDown.bind(this)}>
                <input className={this.state.hidden ? "filter_unselected" : "filter_selected"} 
                    placeholder="+ Add Notable" onChange={this.handleFilterUpdate.bind(this)} value={this.state.filter}/>
                <ul hidden={this.state.hidden} className={"selectable_ul"}>
                    {Object.keys(this.props.options).map(option => 
                    <AddableListItem notableName={option} key={option} callback={this.addSelectedItem.bind(this)}
                        hidden={this.shouldHideListItem(option)}/>
                    )}
                </ul>
            </div>
        );
    }
}


export default SelectableList;