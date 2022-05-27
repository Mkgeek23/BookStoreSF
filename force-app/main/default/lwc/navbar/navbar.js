import { LightningElement, api, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import Id from '@salesforce/user/Id';
import basePath from '@salesforce/community/basePath';

export default class navbar extends NavigationMixin(LightningElement) {
    userId = Id;
    @track isNavOpen = false;

    setBasePath() {
        return basePath
            .replace('/login', '')
            .replace('/my-account', '')
            .replace('/my-proposals', '')
            .replace('/faqs', '')
            .replace('/terms-and-conditions', '');
    }

    navigateToInternalPage(pageName) {
        this[NavigationMixin.Navigate]({
            type: "standard__webPage",
            attributes: {
                url: this.setBasePath() + '/' + pageName,
            }
        });
    }

    navigateToBooksPage() {
        this.navigateToInternalPage('books');
        this.closeNav();
    }

    navigateToOrdersPage() {
        this.navigateToInternalPage('orders');
        this.closeNav();
    }

    navigateToCartPage() {
        this.navigateToInternalPage('basket');
        this.closeNav();
    }

    navigateToHomePage() {
        this.navigateToInternalPage('');
        this.closeNav();
    }

    navigateToUserDetails() {
        this.navigateToInternalPage('user-details');
        this.closeNav();
    }

    navigateToLogin() {
        this.navigateToInternalPage('login');
        this.closeNav();
    }

    showNav() {
        console.log('Rozwinięte');
        let x = document.getElementById("myTopnav");
        if (x.className === "topnav") {
            x.className += " responsive";
        } else {
            x.className = "topnav";
        }
    }

    logout() {
        this[NavigationMixin.Navigate]({
            type: 'comm__loginPage',
            attributes: {
                actionName: 'logout'
            }
        });
    }


    /* Open when someone clicks on the span element */
    openNav() {
        this.isNavOpen = true;
    }

    /* Close when someone clicks on the "x" symbol inside the overlay */
    closeNav() {
        this.isNavOpen = false;
    }
}