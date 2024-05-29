import { LightningElement, api } from 'lwc';

export default class OppRecordEditForm extends LightningElement {

    @api recordId;
    @api objectApiName;

    // boolean property to determine edit or view mode
    editMode = false;

    // create a method to toggle between modes
    toggleMode(event) {
        console.log(event);

        if (event.type === 'success') {
            console.log(event.detail.fields.Name.value);
        }
        this.editMode = !this.editMode;
    }
}