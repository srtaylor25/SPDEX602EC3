import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

export default class GetRecordForm extends LightningElement {

    // public property to inherit the record ID from the record page
    @api recordId;

    // use the wire decorator to decorate a property that will hold the provisioned object
    // returned by the wire service
    @wire(getRecord, { recordId: '$recordId', fields: ['Contact.Name', 'Contact.Title', 'Contact.Phone', 'Contact.Email']})
    contact;

    // getter methods to return field values
    get name() {
        let nameVar = this.contact.data.fields.Name.value;
        return nameVar.toUpperCase();
    }
    get title() {
        return this.contact.data.fields.Title.value;
    }

    get phone() {
        return this.contact.data.fields.Phone.value;
    }

    get email() {
        return this.contact.data.fields.Email.value;
    }

    renderedCallback() {
        console.log(this.contact.data);
    }
}