import { LightningElement } from 'lwc';

export default class MyComponent extends LightningElement {

    // private property
    showContacts = false;

    // create an array property to hold some Contact objects
    contacts = [
        { Id: '111', Name: 'John', Title: 'VP' },
        { Id: '222', Name: 'Dagny', Title: 'SVP' },
        { Id: '333', Name: 'Henry', Title: 'President' }
    ];

    // create a method to toggle the value of showContacts when the user clicks the button
    toggleView() {
        this.showContacts = !this.showContacts;
    }

}