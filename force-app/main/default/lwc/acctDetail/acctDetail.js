import { LightningElement, wire } from 'lwc';
import AccountMC from '@salesforce/messageChannel/AccountMessageChannel__c';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AcctDetail extends LightningElement {

    // properties to hold info received on the message channel
    accountId;
    accountName;
    subscription = {};          // create a property to hold the subscription object returned from subscribe

    // getter method to return a label to display in the card title
    get detailLabel() {
        return 'Details for ' + this.accountName;
    }

    // create the MessageContext object
    @wire(MessageContext)
    msgContext;

    // method to subscribe to message channel
    subscribeToMessageChannel() {
        this.subscription = subscribe(this.msgContext, AccountMC, (message) => this.handleMessage(message));
    }

    // method to unsubscribe from the message channel
    unsubscribeFromMessageChannel() {
        unsubscribe(this.subscription);
    }

    // method to handle message received on the message channel
    handleMessage(message) {
        this.accountId = message.recordId;
        this.accountName = message.accountName;
        console.log('acctDetail: Message received ' + this.accountId + this.accountName);
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    disconnectedCallback() {
        this.unsubscribeFromMessageChannel();
    }

    // method to dispatch a toast event when the record is successfully saved
    detailSaved(event) {
        this.dispatchEvent(new ShowToastEvent({
            title: 'Account Updated',
            message: 'Account ' + event.detail.fields.Name.value + ' was successfully updated!',
            variant: 'success',
            mode: 'dismissible'
        }));
    }
}