import { LightningElement, track, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import basePath from '@salesforce/community/basePath';
import fetchUpBooks from '@salesforce/apex/BookListService.fetchUpBooks';

export default class NewBooksListComponent extends NavigationMixin(LightningElement) {

    @track books;
    __errors;
    @api limit = 6;
    @api sortBy = 'nameAZ';
    @api title = '';
    @api showMoreLink = '';

    connectedCallback() {
        this.fetchUpBooksJs();
    }

    fetchUpBooksJs() {
        fetchUpBooks({ recordLimit: this.limit, sortBy: this.sortBy })
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