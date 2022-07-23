import React from 'react';
import TradeUrl from './TradeUrl';
import { getEnchantKey, includesEnchant } from './Calculator';

class CalculatorOutput extends React.Component {

    render() {
        if (this.props.error != null) {
            return (
                <div style={{maxWidth: "400px"}}>{this.props.error}</div>
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
        if (this.props.megaOutput != null) {
            const allDesired = new Set();
            const allUndesired = new Set();
            this.props.megaOutput.forEach(out => {
                allDesired.add(out.notableName1);
                allDesired.add(out.notableName3);
                out.betweenNames.forEach(not => {
                    allUndesired.add(not);
                })
            });
            return this.renderMegaSearch(allDesired, allUndesired);
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
            return this.renderTradeUrl(this.props.notablesBetween.map(nObj => nObj.PassiveSkill.Name));
        }
        return "";
    }

    renderMegaSearch(allDesired, allUndesired) {
        return <TradeUrl allDesired={allDesired} allUndesired={allUndesired}/>
    }

    renderTradeUrl(notableNames, ench = null) {
        let key = "any";
        if (ench != null) {
            key = getEnchantKey(ench);
        }
        let desired = [this.props.notableName1, this.props.notableName3];
        return (
            <ul key={key + "ul"}>
            <li key={key + "li"}>
                <TradeUrl desired={desired} notableNames={notableNames} ench={ench} key={key}/>
                <ul key={key + "ul2"}>Position 2 Notable Options: <span key={key + "span"}>
                    {this.props.notablesBetween.map(nObj => nObj.PassiveSkill.Name + " (ilvl: " + nObj.Mod.Level + ")").join(", ")}
                </span></ul>
            </li>
            </ul>
        );
    }
}

export default CalculatorOutput;