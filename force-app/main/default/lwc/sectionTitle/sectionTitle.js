import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import basePath from '@salesforce/community/basePath';

export default class SectionTitle extends NavigationMixin(LightningElement) {
    @api title = '';
    @api linkText = '';
    @api linkAddress = '';

    navigateToLink() {
        this[NavigationMixin.Navigate]({
            type: "standard__webPage",
            attributes: {
                url: basePath + '/' + this.linkAddress,
            }
        });
    }
}