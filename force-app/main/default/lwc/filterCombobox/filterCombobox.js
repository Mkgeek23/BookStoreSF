import { LightningElement, api } from 'lwc';

export default class FilterCombobox extends LightningElement {
    @api label = '';
    @api placeholder = 'Select';
    @api value;
    @api options;

    handleChange(event) {
        const changedEvent = new CustomEvent("handlechange", {
            detail: event.detail.value,
        });
        this.dispatchEvent(changedEvent);
    }
}