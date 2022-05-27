import { LightningElement, api, track } from 'lwc';

export default class Pagination extends LightningElement {

    @api recordsNumber = 1;
    @api recordsLimit = 1;
    @api page = 1;
    @track isFirstPage = false;
    @track isLastPage = false;
    @track pages;

    @api renderPagination(numOfPages) {
        console.log('numOfPages', numOfPages);
        if (this.page === 1) this.isFirstPage = true;
        if (this.page === numOfPages) this.isLastPage = true;
        //Wyrenderować widok
        this.pages = [];

        if (this.page != 1) {
            this.pages.push({ label: '«', value: this.page - 1, class: '' });
        }
        if (this.page > 4 && parseInt(this.page) + 2 >= numOfPages) {
            this.pages.push({ label: this.page - 4, value: this.page - 4, class: '' });
        }
        if (this.page > 3 && parseInt(this.page) + 1 >= numOfPages) {
            this.pages.push({ label: this.page - 3, value: this.page - 3, class: '' });
        }
        if (this.page > 2) {
            this.pages.push({ label: this.page - 2, value: this.page - 2, class: '' });
        }
        if (this.page > 1) {
            this.pages.push({ label: this.page - 1, value: this.page - 1, class: '' });
        }
        this.pages.push({ label: this.page, value: this.page, class: 'active' });
        if (this.page < numOfPages) {
            this.pages.push({ label: parseInt(this.page) + 1, value: parseInt(this.page) + 1, class: '' });
        }
        if (parseInt(this.page) + 1 < numOfPages) {
            this.pages.push({ label: parseInt(this.page) + 2, value: parseInt(this.page) + 2, class: '' });
        }
        if (parseInt(this.page) + 2 < numOfPages && this.page <= 2) {
            this.pages.push({ label: parseInt(this.page) + 3, value: parseInt(this.page) + 3, class: '' });
        }
        if (parseInt(this.page) + 3 < numOfPages && this.page <= 1) {
            this.pages.push({ label: parseInt(this.page) + 4, value: parseInt(this.page) + 4, class: '' });
        }
        if (this.page != numOfPages) {
            this.pages.push({ label: '»', value: parseInt(this.page) + 1, class: '' });
        }
    }

    handleChangePage(event) {
        this.page = event.target.dataset.field;
        const selectedEvent = new CustomEvent("handleclick", { detail: this.page });
        this.dispatchEvent(selectedEvent);
    }

}