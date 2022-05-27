import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import basePath from '@salesforce/community/basePath';
import fetchUpBooks from '@salesforce/apex/BookListService.fetchUpBooks';

export default class NewBooksListComponent extends NavigationMixin(LightningElement) {

    @track books;
    __errors;
    filters;
    @track start = 0;
    @track limit = 6;
    @track page = 1;
    @track all;
    @track numOfPages;
    @track showingStart = 1;
    @track showingEnd;
    @track sortBy = 'dateHighLow';
    priceMin;
    priceMax;
    genre;

    connectedCallback() {
        this.fetchUpBooksJs();
    }

    fetchUpBooksJs() {
        fetchUpBooks({ filters: this.filters, recordLimit: this.limit, start: this.start, sortBy: this.sortBy })
            .then(result => {
                this.books = (result.length > 0) ? result : undefined;
                this.__errors = undefined;
            })
            .catch(error => {
                this.books = undefined;
                console.log('Error', error);
                this.__errors = error;
            });

    }


    handleClick = event => {
        let selectedBookId = event.detail;
        console.log('doszlo');

        let navigationTarget = {
            type: 'standard__namedPage',
            attributes: {
                pageName: 'book-details'
            },
            state: {
                bookId: selectedBookId,
                source: 'bookListPage'
            }
        }

        this[NavigationMixin.Navigate](navigationTarget);
    }

}