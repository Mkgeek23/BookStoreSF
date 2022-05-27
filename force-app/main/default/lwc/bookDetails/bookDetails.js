import { LightningElement, wire, track, api } from 'lwc';
import fetchUpBook from '@salesforce/apex/BookListService.fetchUpBook';
import { CurrentPageReference } from 'lightning/navigation';
import Id from '@salesforce/user/Id';
import { NavigationMixin } from 'lightning/navigation';
import basePath from '@salesforce/community/basePath';
export default class BookDetails extends NavigationMixin(LightningElement) {
    @api bookId;
    @api source;
    @track book;
    genres;
    __errors;
    userId = Id;

    __currentPageReference;

    @wire(CurrentPageReference)
    getCurrentPageReference(pageReference) {
        this.__currentPageReference = pageReference;
        this.bookId = this.__currentPageReference.state.bookId;
        this.source = this.__currentPageReference.state.source;
    }

    connectedCallback() {
        this.fetchUpBookJS();
    }

    fetchUpBookJS() {
        fetchUpBook({ bookId: this.bookId })
            .then(result => {
                if (result['Genre__c']) {
                    this.genres = result['Genre__c'].split(';');
                }
                this.book = result;
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    navigateToInternalPage(event) {
        console.log('navigate', event.target.dataset.field);
        this[NavigationMixin.Navigate]({
            type: "standard__webPage",
            attributes: {
                url: basePath + '/books?filters={"Genre__c(inc)":"' + event.target.dataset.field + '"}',
            }
        });
    }
}