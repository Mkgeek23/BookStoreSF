import { LightningElement, wire, track } from 'lwc';
import fetchUpBooks from '@salesforce/apex/BookListService.fetchUpBooks';
import searchBooks from '@salesforce/apex/BookListService.searchBooks';
import countBooks from '@salesforce/apex/BookListService.countBooks';
import { CurrentPageReference } from 'lightning/navigation';
import { NavigationMixin } from 'lightning/navigation';
import basePath from '@salesforce/community/basePath';

export default class BookListComponent extends NavigationMixin(LightningElement) {

    @track books;
    __errors;
    filters;
    @track start = 0;
    @track limit = 12;
    @track page = 1;
    @track all;
    @track numOfPages;
    @track showingStart = 1;
    @track showingEnd;
    @track sortBy = 'nameAZ';
    priceMin;
    priceMax;
    genre;
    @track searchedBooks;

    __currentPageReference;

    @wire(CurrentPageReference)
    getCurrentPageReference(pageReference) {
        this.__currentPageReference = pageReference;
        if (this.__currentPageReference.state.sortby)
            this.sortBy = this.__currentPageReference.state.sortby;
        if (this.__currentPageReference.state.filters) {
            this.filters = JSON.parse(this.__currentPageReference.state.filters);
            this.genre = this.filters['Genre__c(inc)'];
            this.priceMin = this.filters['Price__c(ge)'];
            this.priceMax = this.filters['Price__c(le)'];
        }
        if (this.__currentPageReference.state.page) {
            this.page = this.__currentPageReference.state.page;
            this.start = this.page * this.limit - this.limit;
        }
    }

    connectedCallback() {
        this.fetchUpBooksJs();
    }

    calculateShowingStartEnd() {
        this.showingStart = this.start + 1;
        this.showingEnd = (this.numOfPages == this.page) ? this.start + this.all - Math.floor(this.all / this.limit) * this.limit : this.limit * this.page;
    }

    fetchUpBooksJs() {
        this.countBooksJs();
        fetchUpBooks({ filters: this.filters, recordLimit: this.limit, start: this.start, sortBy: this.sortBy })
            .then(result => {
                this.books = (result.length > 0) ? result : undefined;
                this.__errors = undefined;
                this.calculateShowingStartEnd();
            })
            .catch(error => {
                this.books = undefined;
                console.log('Error', error);
                this.__errors = error;
            });

    }

    countBooksJs() {
        countBooks({ filters: this.filters })
            .then(result => {
                this.all = result;
                this.numOfPages = Math.max(Math.ceil(this.all / this.limit), 1);
                this.template.querySelector('c-pagination').renderPagination(this.numOfPages);
                this.__errors = undefined;
            })
            .catch(error => {
                this.all = undefined;
                console.log('Error', error);
                this.__errors = error;
            });

    }

    handleClick = event => {
        let selectedBookId = event.detail;

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

    handleFilters = event => {
        this.filters = JSON.parse(event.detail);
        this.generateUrl();
    }

    handleSearch = event => {
        searchBooks({ phrase: event.detail, recordLimit: this.limit })
            .then(result => {
                this.searchedBooks = result;
                this.showOnlySearchBooks();
            })
            .catch(error => {
                this.fetchUpBooksJs();
            });
    }

    changePage = event => {
        this.page = event.detail;
        this.generateUrl();
    }

    handleSortBy = event => {
        this.sortBy = event.detail;
        this.generateUrl();
    }

    showOnlySearchBooks() {
        if (this.searchedBooks) {
            this.books = this.searchedBooks;
            this.all = this.books.length;
            this.showingStart = 1;
            this.showingEnd = this.books.length;
            //this.calculateShowingStartEnd();
        } else {
            this.fetchUpBooksJs();
        }
    }

    generateUrl() {
        let params = '';
        if (this.sortBy) {
            params += 'sortby=' + this.sortBy + '&';
        }
        if (this.filters) {
            params += 'filters=' + JSON.stringify(this.filters) + '&';
        }
        if (this.page) {
            params += 'page=' + this.page + '';
        }
        this.navigateToInternalPage('books', params);
    }

    navigateToInternalPage(pageName, params) {
        this[NavigationMixin.Navigate]({
            type: "standard__webPage",
            attributes: {
                url: basePath + '/' + pageName + '?' + params,
            }
        });
    }
}