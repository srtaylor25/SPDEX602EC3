import { LightningElement } from 'lwc';

export default class ParentComponent extends LightningElement {

    // private property
    childSpeak;

    // method to handle the event raised by the child component
    handleFit(event) {
        console.log(event.detail);
        this.childSpeak = event.detail.prop1;
    }


    // constructore method
    constructor() {
        super();
        console.log('Parent component:  Constructor fired....');
    }

    // connectedCallback fires when component is inserted into the DOM
    connectedCallback() {
        console.log('Parent component:  connectedCallback fired....');
    }

    // disconnectedCallback fires when component is removed from the DOM
    disconnectedCallback() {
        console.log('Parent component:  disconnectedCallback fired....');
    }

    // renderedCallback fires when component finishes rendering
    renderedCallback() {
        console.log('Parent component:  renderedCallback fired....');
    }
}