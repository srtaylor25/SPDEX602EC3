import { api } from 'lwc';
import LightningModal from 'lightning/modal';

export default class RecordModal extends LightningModal {

    // public properties to hold values for displaying/editing/creating a record
    @api recordId;
    @api objectApiName;
    @api formMode;
    @api layoutType;
    @api headerLabel;

    // create a method to handle the cancel event
    handleCancel() {
        // invoke the close method (inherited from LightningModal) and return a result
        this.close('modcancel');
    }

    // create a method to handle the sucess event
    handleSuccess(event) {
        this.close(event);
    }

}