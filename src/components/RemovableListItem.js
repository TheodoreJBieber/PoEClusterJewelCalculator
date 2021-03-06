import React from 'react';
import uncheck from '../img/uncheck.svg';
import check from '../img/check.svg';
import x from '../img/x.svg';

class RemovableListItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = this.defaultState();
    }

    defaultState() {
        return {
            enabled: true
        };
    }

    handleRemove(event) {
        this.props.callbackRemove(this.props.notableName);
    }

    handleToggleEnabled(event) {
        if (this.props.enabled) {
            this.props.callbackDisable(this.props.notableName);
        } else {
            this.props.callbackEnable(this.props.notableName);
        }
    }

    render() {
        return (
            <li className={"standardli"}>
                {/* <span onMouseDown={this.handleToggleEnabled.bind(this)}>[{this.props.enabled ? "D":"E"}]</span> */}
                <span onMouseDown={this.handleToggleEnabled.bind(this)}>
                    <img className={"checksvg"} src={check} hidden={!this.props.enabled} alt={""}/>
                    <img className={"checksvg"} src={uncheck} hidden={this.props.enabled} alt={""}/>
                </span>
                <span style={{cursor: "default"}} className={"solid_block"}>{this.props.notableName}</span>
                <span onMouseDown={this.handleRemove.bind(this)}><img className={"xsvg"} src={x} alt={""}/></span>
            </li>
        );
    }
}

export default RemovableListItem;