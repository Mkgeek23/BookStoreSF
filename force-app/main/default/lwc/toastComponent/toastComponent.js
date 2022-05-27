import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ToastComponent extends LightningElement {
    btnType;
    handleClick(event) {
        console.log('btnType');
        console.log(event.target.name);
        this.btnType = event.target.name;
        console.log(this.btnType);
        if (this.btnType == 'success') {
            const evt = new ShowToastEvent({
                title: 'Success',
                message: 'This is Toast of type Success',
                variant: 'success',
            });
            this.dispatchEvent(evt);
        } else if (this.btnType == 'error') {
            const evt = new ShowToastEvent({
                title: 'Error',
                message: 'This is Toast of type Error',
                variant: 'error',
            });
            this.dispatchEvent(evt);
        } else if (this.btnType == 'warning') {
            const evt = new ShowToastEvent({
                title: 'Warning',
                message: 'This is Toast of type warning',
                variant: 'warning',
            });
            this.dispatchEvent(evt);
        } else if (this.btnType == 'info') {
            const evt = new ShowToastEvent({
                title: 'Info',
                message: 'This is Toast of type Info',
                variant: 'info',
            });
            this.dispatchEvent(evt);
        }
    }
}