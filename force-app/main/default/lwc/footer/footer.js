import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import Id from '@salesforce/user/Id';
import basePath from '@salesforce/community/basePath';

export default class Footer extends NavigationMixin(LightningElement) {
    userId = Id;
    homeUrl = this.getBasePath();
    booksUrl = this.getBasePath() + '/books';
    ordersUrl = this.getBasePath() + '/orders';

    getBasePath() {
        return basePath
            .replace('/login', '')
            .replace('/my-account', '')
            .replace('/my-proposals', '')
            .replace('/faqs', '')
            .replace('/terms-and-conditions', '');
    }

}