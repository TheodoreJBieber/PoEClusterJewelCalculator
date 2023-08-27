import React from 'react';
import TemplateUrl from './TemplateUrl';

class TradeTemplates extends React.Component {
    render() {
        return (
            <div>
            <h2>Trade Templates</h2>
            <TemplateUrl tradePathBase={this.props.tradePathBase} min={2} max={3} description="Any Small (2-3 Passives)"></TemplateUrl>
            <TemplateUrl tradePathBase={this.props.tradePathBase} min={4} max={5} description="Any Medium (4-5 Passives)"></TemplateUrl>
            <TemplateUrl tradePathBase={this.props.tradePathBase} min={8} max={8} description="Any Large (8 Passives)"></TemplateUrl>
            <TemplateUrl tradePathBase={this.props.tradePathBase} min={12} max={12} ilvlMin={84} description="Any iLvl 84+ Large 12 Passive Cluster Jewel"></TemplateUrl>
            </div>
        )
    }
}



export default TradeTemplates;