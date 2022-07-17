import React from 'react';

class NotableSelect extends React.Component {
    handleChange(event) {
        const notableName = event.target.value;
        const thisName = this.props.name;
        this.props.onChange(thisName, notableName);
    }

    render() {
        return (
            <div>
                <label>Desired Notable #1 (Position 1 or 3)</label>
                <select onChange={this.handleChange.bind(this)} ref="select">
                    <option value={-1}>Please make a selection</option>
                    {Object.keys(this.props.sortOrderMap)
                        .map(k => <NotableOption key={k} name={k}/>)}
                </select>
            </div>
        );
    }
}

class NotableOption extends React.Component {
    render() {
        return <option value={this.props.name}>{this.props.name}</option>
    }
}

export default NotableSelect;
