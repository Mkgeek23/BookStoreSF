import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import Id from '@salesforce/user/Id';
import basePath from '@salesforce/community/basePath';
// import { navigateToHomePage } from 'c/navigation';

export default class BlockLoggedUserComponent extends NavigationMixin(LightningElement) {

    setBasePath() {
        return basePath
            .replace('/login', '')
            .replace('/my-account', '')
            .replace('/my-proposals', '')
            .replace('/faqs', '')
            .replace('/terms-and-conditions', '');
    }

    connectedCallback() {
        if (Id) {
            this.navigateToHomePage();
        }
    }

    navigateToInternalPage(pageName) {
        this[NavigationMixin.Navigate]({
            type: "standard__webPage",
            attributes: {
                url: this.setBasePath() + '/' + pageName,
            }
        });
    }
    navigateToHomePage() {
        this.navigateToInternalPage('');
    }
}