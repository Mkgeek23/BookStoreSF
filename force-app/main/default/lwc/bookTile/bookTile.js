import { LightningElement, api } from 'lwc';

export default class BookTile extends LightningElement {
    @api book

    handleClick(event) {
        console.log('poszlo');
        const selectedEvent = new CustomEvent("handleclick", {
            detail: event.currentTarget.dataset.eventId,
        });
        this.dispatchEvent(selectedEvent);
    }
}