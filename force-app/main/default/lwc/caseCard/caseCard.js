import { LightningElement, api } from 'lwc';
import RecordModal from 'c/recordModal';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CaseCard extends LightningElement {

    // public properties
    @api caseNumber;
    @api subject;
    @api status;
    @api priority;
    @api caseId;

    // create a method to allow editing the case record and display a toast message on success
    editCase() {
        RecordModal.open({
            size: 'small',
            recordId: this.caseId,
            objectApiName: 'Case',
            formMode: 'edit',
            layoutType: 'Compact',
            headerLabel: 'Edit Case'
        })
        .then((result) => {
            if (result) {
                if (result.type === 'success') {
                    this.dispatchEvent(new ShowToastEvent({
                        title: 'Case saved successfully!',
                        message: 'The case ' + result.detail.fields.CaseNumber.value + ' was saved successfully!',
                        variant: 'success'
                    }));
                }
            }
        });
    }
}