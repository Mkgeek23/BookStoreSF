import { LightningElement, api } from 'lwc';

export default class FilterText extends LightningElement {
    @api value = '';
    @api label = '';
    @api name = '';
    @api placeholder = '';

    handleChange(event) {
        this.value = event.target.value;
        const selectedEvent = new CustomEvent("handlechange", {
            detail: this.value,
        });
        this.dispatchEvent(selectedEvent);
    }
}