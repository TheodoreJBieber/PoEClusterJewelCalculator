// basically jut a wrapper component

import Calculator from "./Calculator";
import TradeTemplates from "./TradeTemplates";

const tradePathBase = "https://www.pathofexile.com/trade/search/Ancestor?q=";

const App = () => {
    // Not working currently
    const params = new URLSearchParams(window.location.pathname);
    return (
        <div>
            <TradeTemplates tradePathBase={tradePathBase}/>
            <Calculator 
                selected={params.get("s")} 
                disabled={params.get("d")}
                tradePathBase={tradePathBase}>
            </Calculator>
        </div>
    );
};

export default App;