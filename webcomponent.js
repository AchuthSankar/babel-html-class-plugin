import Hello from './hello'

class WebComponent extends HTMLElement {
    constructor() {
        super()
        console.log('wow')
    }
    connectedCallback() {
        if(this.attachShadow) {
            this.attachShadow({mode: 'open'})
        }
        let node=new DOMParser().parseFromString(this.constructor.template, "text/html").querySelector("body").childNodes[0]
        this.shadowRoot.appendChild(node)
        this.shadowRoot.appendChild(new Hello())
    }   
}

customElements.define("app-test", WebComponent)