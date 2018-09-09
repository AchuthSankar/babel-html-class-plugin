export default class Hello extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        if(this.attachShadow) {
            this.attachShadow({mode: 'open'})
        }
        let node=new DOMParser().parseFromString(this.constructor.template, "text/html").querySelector("body").childNodes[0]
        this.shadowRoot.appendChild(node)
    }   
}

customElements.define('app-hello', Hello)