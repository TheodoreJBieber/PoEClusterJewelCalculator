// basically jut a wrapper component

import Calculator from "./Calculator";

const App = () => {
    // Not working currently
    const params = new URLSearchParams(window.location.pathname);
    return (
        <Calculator 
            selected={params.get("s")} 
            disabled={params.get("d")}>
        </Calculator>
    );
};

export default App;