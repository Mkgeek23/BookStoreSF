import { LightningElement, api, track } from 'lwc';

export default class BookListSearch extends LightningElement {

    @api value = '';

    updateValue(event) {
        this.value = event.detail;
    }

    handleSearch(event) {
        console.log('szuk');
        const selectedEvent = new CustomEvent("handlesearch", {
            detail: this.value,
        });
        this.dispatchEvent(selectedEvent);
    }
}