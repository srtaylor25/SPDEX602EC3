import { LightningElement, wire } from 'lwc';
import AccountMC from '@salesforce/messageChannel/AccountMessageChannel__c';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';

export default class AcctRelated extends LightningElement {

    // properties to hold info received on the message channel
    accountId;
    accountName;
    subscription = {};          // create a property to hold the subscription object returned from subscribe

    oppLabel = 'Opportunities';
    caseLabel = 'Cases';

    // getter method to return a label to display in the card title
    get relatedLabel() {
        return 'Related Records for ' + this.accountName;
    }

    // method to update opp label
    updateOppLabel(event) {
        this.oppLabel = 'Opportunities (' + event.detail + ')';
    }

    // method to update case label
    updateCaseLabel(event) {
        this.caseLabel = 'Cases (' + event.detail + ')';
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
        console.log('acctRelated: Message received ' + this.accountId + this.accountName);
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    disconnectedCallback() {
        this.unsubscribeFromMessageChannel();
    }
}