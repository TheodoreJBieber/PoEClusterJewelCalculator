import React from 'react';
import TradeUrl from './TradeUrl';
import { getEnchantKey, includesEnchant } from './Calculator';

class CalculatorOutput extends React.Component {

    render() {
        if (this.props.error != null) {
            return (
                <div>{this.props.error}</div>
            );
        } 
        if (this.props.validEnchants != null) {
            return (
                <div>
                    <b>Enchantments</b>
                    {this.renderSpecificEnchants()}
                    {this.renderAnyEnchant()}
                </div>
            );
        }
        return "";
    }

    renderSpecificEnchants() {
        return this.props.validEnchants.map(ench => {
            let notablesNames = this.props.notablesBetween.filter(nObj => {
                return includesEnchant(nObj.Enchantments, ench);
            }).map(nObj => nObj.PassiveSkill.Name);
            if (notablesNames.length > 0) {
                return this.renderTradeUrl(notablesNames, ench);
            }
            return null;
        }).filter(o => o != null);
    }

    renderAnyEnchant() {
        if (this.props.validEnchants.length > 1) {
            return this.renderTradeUrl(this.props.notablesBetween);
        }
        return "";
    }

    renderTradeUrl(notableNames, ench = null) {
        let key = "any";
        if (ench != null) {
            key = getEnchantKey(ench);
        }
        let desired = [this.props.notableName1, this.props.notableName3];
        return <TradeUrl desired={desired} notableNames={notableNames} ench={ench} key={key}/>;
    }
}

export default CalculatorOutput;