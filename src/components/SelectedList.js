import React from 'react';
import RemovableListItem from './RemovableListItem';

class SelectedList extends React.Component {

    removeSelectedItem(itemName) {
        this.props.removeCallback(itemName);
    }

    disableSelectedItem(itemName) {
        this.props.disableCallback(itemName);
    }

    enableSelectedItem(itemName) {
        this.props.enableCallback(itemName);
    }

    render() {
        return (
            <div>
                <div>Selected Notables: </div>
                <ul className={"selected_ul"}>
                    {this.props.selected.map(notableName => <RemovableListItem notableName={notableName} key={notableName} 
                        callbackRemove={this.removeSelectedItem.bind(this)}
                        callbackDisable={this.disableSelectedItem.bind(this)}
                        callbackEnable={this.enableSelectedItem.bind(this)}
                        enabled={!this.props.disabled.includes(notableName)}
                        />)}
                </ul>
            </div>
        );
    }
}

export default SelectedList;