import { LightningElement, api } from 'lwc';
import RecordModal from 'c/recordModal';        // import my custom component from the custom namespace (c)
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class OppCard extends NavigationMixin(LightningElement) {

    // create public properties to hold the opp record field values
    @api name;
    @api amount;
    @api stage;
    @api closeDate;
    @api oppId;

    // create a method to navigate t the full opportunity record page
    viewRecord() {
        // invoke the Navigate method from the NavigationMixin class and pass in some parameters/attributes
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.oppId,
                actionName: 'view'
            }
        });
    }

    // create a method to open the modal window to edit the opportunity record
    editOpp() {
        // open the modal window, and then access the result that is returned when it closes
        RecordModal.open({
            size: 'small',
            recordId: this.oppId,
            objectApiName: 'Opportunity',
            formMode: 'edit',
            layoutType: 'Compact',
            headerLabel: 'Edit Opportunity'
        })
        .then(result => {
            console.log(result);
            // checking if there is a result or if its undefined
            if (result) {
                // check to see if the result is a success, and if so, dispatch a toast event notification
                if (result.type === 'success') {
                    // create a toast notification
                    const myToast = new ShowToastEvent({
                        title: 'Opportunity Saved Successfully',
                        message: 'The opportunity ' + result.detail.fields.Name.value + ' was saved successfully.',
                        variant: 'success',
                        mode: 'dismissible'
                    });

                    // dispatch the toast notification
                    this.dispatchEvent(myToast);

                    // dispatch a custom event to notify parent (opportunityList) that a record change ocurred
                    const savedEvent = new CustomEvent('modsaved');
                    this.dispatchEvent(savedEvent);
                }
            }
        });
    }
}