import { LightningElement, api } from 'lwc';

export default class OppRecordForm extends LightningElement {

    // public properties to inherit the record context from the record page
    @api recordId;
    @api objectApiName;

    @api formMode = 'readonly';               // property to determine mode to display (readonly, view, edit)
    @api layoutType = 'Compact';             // property to determine layout-type (Compact, Full)

}