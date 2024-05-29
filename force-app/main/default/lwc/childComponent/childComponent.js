import { LightningElement, api } from 'lwc';

export default class ChildComponent extends LightningElement {

    //public properties
    @api childName;
    @api age;

    // create a method that dispatchs a custom event
    respondToParent() {
        // create a custom event
        const myEvent = new CustomEvent('crying', { detail: { prop1: this.childName, prop2: this.age }});

        // dispatch the custom event
        this.dispatchEvent(myEvent);
    }

    // constructor method
    constructor() {
        super();
        console.log('Child component:  Constructor fired....');
    }

    // connectedCallback fires when component is inserted into the DOM
    connectedCallback() {
        console.log('Child component:  connectedCallback fired....');
    }

    // disconnectedCallback fires when component is removed from the DOM
    disconnectedCallback() {
        console.log('Child component:  disconnectedCallback fired....');
    }

    // renderedCallback fires when component finishes rendering
    renderedCallback() {
        console.log('Child component:  renderedCallback fired....');
    }
}