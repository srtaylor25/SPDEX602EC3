import { LightningElement, api, wire } from 'lwc';
import getOpportunities from '@salesforce/apex/OpportunityController.getOpportunities';
import { refreshApex } from '@salesforce/apex';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import OPP_STAGE_FIELD from '@salesforce/schema/Opportunity.StageName';
import { subscribe, unsubscribe } from 'lightning/empApi';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class OpportunityList extends LightningElement {

    // public property to inherit the Account record ID from the Account record page
    @api recordId;

    // private properties to use in my controller logic
    allOpps = [];                       // property to hold ALL the related opportunity records returned from Apex
    displayOpps = [];                   // property to hold the records to DISPLAY in the UI
    results;                            // property to hold the object provisioned by the wire service (refresh later)
    recordsToDisplay = false;           // property to determine if I have opps to display
    status = 'All';                             // property to hold the value selected in the combobox
    totalRecords;                       // property to hold the record count for the records displaying
    totalAmount;                        // property to hold the cummulative total amount for opps displaying
    channelName = '/topic/Opportunities'; // property for my push topic channel
    subscription = {}                   // property to hold the subscription object returned from the subscribe method
    tableMode = false;                  // property to determine display of data table or card mode
    cardChecked = true;                 // property to determine display of checked menu item
    tableChecked = false;               // property to determine display of checked menu item
    myDrafts = [];                      // property to hold the draft values from inline editing in the data table

    // array property for column information to use in the datatable
    columns = [
        { label: 'Opportunity Name', fieldName: 'Name', type: 'text', editable: true },
        { label: 'Amount', fieldName: 'Amount', type: 'currency', editable: true },
        { label: 'Close Date', fieldName: 'CloseDate', type: 'date', editable: true}
    ];


    // array property to hold the options for my combobox
    comboOptions = [
        // { label: 'All', value: 'All' },
        // { label: 'Open', value: 'Open' },
        // { label: 'Closed', value: 'Closed' },
        // { label: 'Closed Won', value: 'ClosedWon' },
        // { label: 'Closed Lost', value: 'ClosedLost'}
    ];

    // use the wire service to invoke getPicklistValues and add the response to the comboOptions
    @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: OPP_STAGE_FIELD })
    wiredPicklist({ data, error }) {
        // check to see if data was returned
        if (data) {
            // move the picklist values from the data response into comboOptions
            this.comboOptions = [...data.values];
            this.comboOptions.unshift({ label: 'Closed', value: 'Closed'});
            this.comboOptions.unshift({ label: 'Open', value: 'Open'});
            this.comboOptions.unshift({ label: 'All', value: 'All'});
        }

        if (error) {
            console.error('Error occurred retrieving picklist values....');
        }
    }

    // use the wire service to invoke getOpportunities, and handle the response in a function(method)
    @wire(getOpportunities, { accountId: '$recordId' })
    wiredOpps(wireObj) {
        this.results = wireObj;         // move the object provisioned into a property so I can refresh later
        console.log(this.results);

        // check to see if data or error was returned
        if (this.results.data) {
            this.allOpps = this.results.data;
            this.updateList();
            // this.displayOpps = this.results.data;
            // this.recordsToDisplay = this.displayOpps.length > 0 ? true : false;
            this.dispatchEvent(new CustomEvent('oppcount', { detail: this.allOpps.length }));
        }

        if (this.results.error) {
            console.error(this.results.error);
        }
    }

    // create a method to take the value selected in the comboBox
    handleChange(event) {
        this.status = event.detail.value;
        this.updateList();
    }

    // create a method to update the list of opps displaying in the UI to match the status selected
    updateList() {
        // clear out the current displayOpps
        this.displayOpps = [];

        // create a variable to hold the current record as I iterate of it
        let currentRecord = {};

        // determine which records meet the filter criteria, and move them into displayedOpps
        if (this.status === 'All') {
            this.displayOpps = this.allOpps;
        } else {
            // iterate over all the opps, check them against the status, and add to displayOpps as needed
            for (let i = 0; i < this.allOpps.length; i++) {
                currentRecord = this.allOpps[i];

                // check records against the status
                if (this.status === 'Open' && !currentRecord.IsClosed) {
                    this.displayOpps.push(currentRecord);
                } else if (this.status === 'Closed' && currentRecord.IsClosed) {
                    this.displayOpps.push(currentRecord);
                } else if (this.status === currentRecord.StageName) {
                    this.displayOpps.push(currentRecord);
                }
                // } else if (this.status === 'ClosedWon' && currentRecord.IsWon) {
                //     this.displayOpps.push(currentRecord);
                // } else if (this.status === 'ClosedLost' && currentRecord.IsClosed && !currentRecord.IsWon) {
                //     this.displayOpps.push(currentRecord);
                // }
            }
        }

        this.recordsToDisplay = this.displayOpps.length > 0 ? true : false;     // determine if I have records to display
        this.totalRecords = this.displayOpps.length;
        this.totalAmount = this.displayOpps.reduce((prev, curr) => prev + curr.Amount, 0);
    }

    // create a method to refresh the cache of records
    refreshWire() {
        refreshApex(this.results);
    }

    // create method to subscribe and unsubscribe from streaming API push topic
    handleSubscribe() {
        // variable to hold my callback function
        const messageCallback = response => {
            console.log(response);
            if (response.data.event.type === 'deleted') {
                if (this.allOpps.find(elem => { return elem.Id === response.data.sobject.Id})) {
                    this.refreshWire();
                }
            } else {
                if (response.data.sobject.AccountId === this.recordId) {
                    this.refreshWire();
                }
            }
        }

        // subscribe to the push topic and create a callback function to invoke when a notification is received
        subscribe(this.channelName, -1, messageCallback)
        .then(response => {this.subscription = response});
    }

    handleUnsubscribe() {
        // unsubscribe from the push topic
        unsubscribe(this.subscription, response => { console.log('opportunityList unsubscribed from the push topic....')});
    }

    // create method to toggle between table and card display
    handleToggle(event) {
        console.log(event);
        
        if (event.detail.value === 'card') {
            this.tableMode = false;
            this.tableChecked = false;
            this.cardChecked = true;
        } else if (event.detail.value === 'table') {
            this.tableMode = true;
            this.tableChecked = true;
            this.cardChecked = false;
        }
    }

    // create a method to handle the save event from the data table
    handleTableSave(event) {
        console.log(event);

        // move the draft values from the event into my property
        this.myDrafts = event.detail.draftValues;

        // convert the draft values objects (elements) into recordInpu objects to be passed into updateRecord
        const inputItems = this.myDrafts.slice().map( draft => {
            var fields = Object.assign({}, draft);
            return { fields };
        });

        console.log(JSON.stringify(inputItems));

        // create an array of Promises, with each Promise being a call to updateRecord
        const promises = inputItems.map(recordInput => updateRecord(recordInput));

        console.log(JSON.stringify(promises));

        // Use the Promise.all static method to update the records and see if they were successful or failed
        Promise.all(promises)
        .then( result => {
            console.log(result);
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success!',
                message: 'Successfully updated the records.',
                variant: 'success',
                mode: 'dismissible'
            }));
        })
        .catch(error => {
            console.log(error);
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error!',
                message: 'Error updating records...',
                variant: 'error',
                mode: 'sticky'
            }));
        })
        .finally( () => {
            this.myDrafts = [];
        });
    }

    // lifecycle methods to invoke handleSubscribe and handleUnsubscribe
    connectedCallback() {
        this.handleSubscribe();
    }

    disconnectedCallback() {
        this.handleUnsubscribe();
    }
}