import { LightningElement, wire } from 'lwc';
import getTopAccounts from '@salesforce/apex/AccountController.getTopAccounts';
import { refreshApex } from '@salesforce/apex';
import AccountMC from '@salesforce/messageChannel/AccountMessageChannel__c';
import { publish, MessageContext } from 'lightning/messageService';
import RecordModal from 'c/recordModal';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AcctList extends LightningElement {

    records;                // property to hold the account records returned from the wire service
    results;                // property to hold object provisioned from the wire service
    selectedId;             // property to hold the selected Account ID
    selectedName;           // property to hold the selected Account Name

    // create the MessageContext object
    @wire(MessageContext)
    msgContext;

    // using the wire service to return the account records
    @wire(getTopAccounts)
    wiredAccounts(wireObj) {
        this.results = wireObj;

        // check if data is returned
        if (this.results.data) {
            this.records = this.results.data;
            console.log(this.records);
            this.selectedId = this.records[0].Id;
            this.selectedName = this.records[0].Name;
            this.sendMessageService(this.selectedId, this.selectedName);
        }

        if (this.results.error) {
            console.error('Error retrieving accounts....');
        }
    }

    // create a method to handle the selected event
    handleSelection(event) {
        console.log(event.detail.acctId);
        console.log(event.detail.acctName);
        this.selectedId = event.detail.acctId;
        this.selectedName = event.detail.acctName;
        this.sendMessageService(this.selectedId, this.selectedName);
    }

    // create a method to publish the Account ID and Name to the message channel
    sendMessageService(accountId, accountName) {
        // invoke the publish method to publish the information
        publish(this.msgContext, AccountMC, { recordId: accountId, accountName: accountName } )
    }

    // create a method to allow user to create an Account record with RecordModal
    createAcct() {
        // use the RecordModal.open to open the modal window
        RecordModal.open({
            size: 'medium',
            objectApiName: 'Account',
            formMode: 'edit',
            layoutType: 'Full',
            headerLabel: 'Create Account'
        })
        .then((result) => {
            if (result) {
                if (result.type === 'success'){
                    // show a toast event
                    this.dispatchEvent(new ShowToastEvent({
                        title: 'Account Created',
                        message: result.detail.fields.Name.value + ' was created successfully!',
                        variant: 'success',
                        mode: 'dismissible'
                    }));
                    // refresh records
                    this.refreshAccounts();
                }
            }
        });
    }

    // create a method to refresh the cache of account records
    refreshAccounts() {
        refreshApex(this.results);
    }
}