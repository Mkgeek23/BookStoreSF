import { LightningElement } from 'lwc';
import Id from '@salesforce/user/Id';
import { NavigationMixin } from 'lightning/navigation';

export default class ProfileComponent extends NavigationMixin(LightningElement) {
    userId = Id;

    //Navigate to home page
    logout() {
        this.toggleDropdown();
        this[NavigationMixin.Navigate]({
            type: 'comm__loginPage',
            attributes: {
                actionName: 'logout'
            }
        });
    }

    //Navigate to home page
    navigateToLoginPage() {
        this[NavigationMixin.Navigate]({
            type: 'comm__loginPage',
            attributes: {
                actionName: 'login'
            }
        });
    }

    //Navigate to home page
    navigateToUserDetailsPage() {
        this.toggleDropdown();
        this[NavigationMixin.Navigate]({
            type: 'standard__namedPage',
            attributes: {
                pageName: 'user-details'
            },
        });
    }

    toggleDropdown() {
        const divblock = this.template.querySelector('[data-id="dropdown-menu"]');
        if (!divblock.classList.contains('show')) {
            divblock.classList.add('show');
        } else {
            divblock.classList.remove('show');
        }
    }
}