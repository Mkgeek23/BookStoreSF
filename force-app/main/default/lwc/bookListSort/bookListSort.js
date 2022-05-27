import { LightningElement, api } from 'lwc';

export default class BookListSort extends LightningElement {

    @api value;

    get options() {
        return [
            { label: 'Name (A-Z)', value: 'nameAZ' },
            { label: 'Name (Z-A)', value: 'nameZA' },
            { label: 'Price - Low to High', value: 'priceLowHigh' },
            { label: 'Price - High to Low', value: 'priceHighLow' },
            { label: 'Date - Oldest to Newest', value: 'dateLowHigh' },
            { label: 'Date - Newest to Oldest', value: 'dateHighLow' },
            { label: 'Bestsellers', value: 'bestsellers' },
        ];
    }

    handleSelect = event => {
        const selectedEvent = new CustomEvent("handleselect", {
            detail: event.detail
        });
        this.dispatchEvent(selectedEvent);
    }
}