import { LightningElement, api } from 'lwc';
import GenWattStyle from '@salesforce/resourceUrl/GenWattStyle';        // import from scoped module
import { loadStyle } from 'lightning/platformResourceLoader';            // import function to load style sheet

export default class HelloWorld extends LightningElement {

    @api firstName = 'World';

    // "special" public properties that will inherit the record ID and Object API name from a RECORD PAGE
    @api recordId;
    @api objectApiName;

    // use the constructor lifecycle method to load the external style sheet (static resource)
    constructor() {
        // first call in a constructor method must be to super()
        super();

        // use the loadStyle method to load my external style sheet (static resource)
        loadStyle(this, GenWattStyle)
            .then(() => {console.log('Style sheet loaded....')});      


    }
}