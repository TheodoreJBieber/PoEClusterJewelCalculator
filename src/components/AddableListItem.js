import React from 'react';

class AddableListItem extends React.Component {

    handleClick(event) {
        this.props.callback(this.props.notableName);
    }

    render() {
        return (
            <li className={"pointable standardli"} onMouseDown={this.handleClick.bind(this)} hidden={this.props.hidden}>
                <span className={"solid_block"}>+ {this.props.notableName}</span>
            </li>
        );
    }
}

export default AddableListItem;