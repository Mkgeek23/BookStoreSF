import { api, LightningElement } from 'lwc';

export default class Button extends LightningElement {

    @api iconName;
    @api value = '';
    @api disabled = false;
    @api disableAfterClick = false;

    handleClick() {
        if (this.disableAfterClick) {
            this.disabled = true;
        }
        const selectedEvent = new CustomEvent("handleclick", {});
        this.dispatchEvent(selectedEvent);
    }
}