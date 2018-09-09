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
        console.log(this.constructor.template)
        let nodes=new DOMParser()
        .parseFromString(this.constructor.template, "text/html")
        .querySelector("body")
        .childNodes
        console.log(nodes.length)
        nodes.forEach(node=>{
            console.log(node)
            this.shadowRoot.appendChild(node)
        })
        this.shadowRoot.appendChild(new Hello())
    }   
}

customElements.define("app-test", WebComponent)