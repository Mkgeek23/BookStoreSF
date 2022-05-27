import { LightningElement, api } from 'lwc';

export default class QuantityCounter extends LightningElement {

    @api value = 1;
    @api max = 100;
    @api min = 1;

    plus() {
        this.value = Math.min(this.max, parseInt(this.value) + 1);
        this.fireEvent();
    }

    minus() {
        this.value = Math.max(this.min, parseInt(this.value) - 1);
        this.fireEvent();
    }

    handleChnage(event) {
        const value = event.target.value;
        this.value = (value > this.max) ? this.max : (value < this.min) ? this.min : value;
        this.fireEvent();
    }

    fireEvent() {
        // Creates the event with the data.
        const selectedEvent = new CustomEvent("valuechange", {
            detail: this.value
        });

        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
    }
}