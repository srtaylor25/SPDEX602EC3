import { LightningElement, api } from 'lwc';
import getContactList from '@salesforce/apex/ContactController.getContactList';
import creditCheckApi from '@salesforce/apexContinuation/CreditCheckContinuation.creditCheckApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AcctCard extends LightningElement {

    @api name;
    @api annualRevenue;
    @api phone;
    @api acctId;
    @api rank;

    showContacts = false;           // property to determine display of contacts
    contacts;                       // property to hold contact records
    creditObj = {};                 // property to hold the credit check response


    // getter method to return the account ranking
    get ranking() {
        const acctRank = this.rank + 1;
        return acctRank + '. ';
    }

    // create a method to dispatch a custom event when the user selects an Account
    handleSelect() {
        const myEvent = new CustomEvent('selected', { detail: {'acctId': this.acctId, 'acctName': this.name}});
        this.dispatchEvent(myEvent);
    }

    // create a method to handle the displaying of contact records
    displayContacts() {
        if (this.showContacts) {
            this.showContacts = false;
        } else {
            // invoke the getContactList method
            getContactList({accountId: this.acctId})
                .then((data) => {
                    this.contacts = data;
                    this.showContacts = true;
                    console.log(this.contacts);
                })
                .catch((error) => {
                    console.error('Error occurred retrieving contacts...');
                })
                .finally(() => {
                    console.log('Finally done with contacts...');
                });
        }
    }

    // create a method to ionvoke the creditCheckApi callout and handle the response
    checkCredit() {
        // make an imperative call to our creditCheckApi method
        creditCheckApi({ accountId: this.acctId })
            .then((response) => {
                console.log(response);
                // parse the response returned from the continuation class
                this.creditObj = JSON.parse(response);
                console.log(this.creditObj.Name);

                var toastMessage = 'Credit check approved for ' + this.creditObj.Company_Name__c + '!';
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Credit Check Complete',
                    message: toastMessage,
                    variant: 'success',
                    mode: 'sticky'
                }));
            })
            .catch((error) => {
                console.error('Error running credit check...');
                console.error(error);
            });
    }
}