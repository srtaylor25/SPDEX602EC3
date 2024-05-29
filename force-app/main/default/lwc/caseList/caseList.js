import { LightningElement, api, wire } from 'lwc';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';

export default class CaseList extends LightningElement {

    @api recordId;

    casesToDisplay = false;
    cases;
    results;

    // wire up the getRelatedListRecords method and handle the response
    @wire(getRelatedListRecords, { parentRecordId: '$recordId', relatedListId: 'Cases', 
        fields: ['Case.Id', 'Case.CaseNumber', 'Case.Subject', 'Case.Status', 'Case.Priority']})
    wiredCases(wireObj) {
        this.results = wireObj;
        console.log(this.results);

        if (this.results.data) {
            this.cases = this.results.data.records;
            this.casesToDisplay = this.cases.length > 0 ? true : false;
            this.dispatchEvent(new CustomEvent('casecount', { detail: this.cases.length }));
        }

        if (this.results.error) {
            console.error('Error retrieving case records....');
            this.casesToDisplay = false;
        }
        
    }
}