import React from 'react';
import SelectableList from './SelectableList';
import SelectedList from './SelectedList';

class CalculatorInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.defaultState();
    }

    defaultState() {
        return {
            selected: [],
            disabled: [],
            filter: null
        };
    }

    getEnabledSelectedNotables() {
        return this.state.selected.filter(n => !this.state.disabled.includes(n));
    }

    addSelectedNotable(name) {
        let tempState = this.state;

        if (!tempState.selected.includes(name)) {
            console.log("Added notable: " + name);
            tempState.selected.push(name);
        } else {
            console.log("Attempting to add notable " + name + " again.");
        }

        this.setState(tempState);
    }

    removeSelectedNotable(name) {
        // remove the selected notable from the disabled list
        this.enableSelectedNotable(name);
        let tempState = this.state;
        const index = tempState.selected.indexOf(name);
        if (index > -1) {
            console.log("Removed notable: " + name);
            tempState.selected.splice(index, 1);
        } else {
            console.log("Attempting to remove notable " + name + " which is not added.");
        }
        this.setState(tempState);
    }

    disableSelectedNotable(name) {
        let tempState = this.state;

        if (!tempState.disabled.includes(name)) {
            console.log("Disabled notable: " + name);
            tempState.disabled.push(name);
        } else {
            console.log("Attempting to disable notable " + name + " again.");
        }

        this.setState(tempState);
    }

    handleCalculate(event) {
        let calcInput = this.getEnabledSelectedNotables();
        this.props.calculateCallback(calcInput);
    }

    enableSelectedNotable(name) {
        let tempState = this.state;
        const index = tempState.disabled.indexOf(name);
        if (index > -1) {
            console.log("Enabled notable: " + name);
            tempState.disabled.splice(index, 1);
        } else {
            console.log("Attempting to enable notable " + name + " which is not disabled.");
        }
        this.setState(tempState);
    }

    render() {
        return (
            <div>
                <SelectedList selected={this.state.selected} disabled={this.state.disabled} removeCallback={this.removeSelectedNotable.bind(this)} 
                    disableCallback={this.disableSelectedNotable.bind(this)} enableCallback={this.enableSelectedNotable.bind(this)}/>
                <SelectableList options={this.props.sortOrderMap} addCallback={this.addSelectedNotable.bind(this)} currentlySelected={this.state.selected}/>
                <button className="calculateButton"
                    onClick={this.handleCalculate.bind(this)}><span className="calculateButton">Calculate</span></button>
            </div>
        );
    }
}

export default CalculatorInput;