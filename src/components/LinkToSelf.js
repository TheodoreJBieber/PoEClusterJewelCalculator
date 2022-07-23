import React from 'react';

class LinkToSelf extends React.Component {
    copyURI(evt) {
        evt.preventDefault();
        navigator.clipboard.writeText(evt.target.getAttribute('href')).then(() => {
        }, () => {
        });
    }

    generateUrl() {
        let base = "?s=";
        if (this.props.selected != null) {
            let s = this.props.selected.join(",")
            let combined = base + encodeURIComponent(s);
            if (this.props.disabled != null) {
                let d = this.props.disabled.join(",")
                combined += "&d=" + encodeURIComponent(d);
            }
            return combined;
        }
    }

    render() {
        if (this.props.selected == null) {
            return "";
        }
        let url = this.generateUrl();
        return (
            <a href={url} rel={"noreferrer"}>Share</a>
        );
    }
}

export default LinkToSelf;