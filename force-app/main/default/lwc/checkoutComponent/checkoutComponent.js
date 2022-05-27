import { LightningElement, api, track } from 'lwc';
import createCartItem from '@salesforce/apex/CartDetailsController.createCartItem';
import sumOfitems from '@salesforce/apex/CartDetailsController.sumOfitems';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import Id from '@salesforce/user/Id';

export default class CheckoutComponent extends LightningElement {
    @api book;
    @api quantity = 1;
    @api total = 0;
    @api sum = 0;
    userId = Id;
    @api isOpenModal = false;
    @track btnDisabled = false;

    hanldeValueChange(event) {
        this.quantity = event.detail;
    }

    addToBasket() {
        this.btnDisabled = true;
        createCartItem({ book: this.book, quantity: this.quantity })
            .then(() => {
                sumOfitems()
                    .then(result => {
                        this.sum = result['quantity'];
                        this.total = result['amount'];
                        this.isOpenModal = true;
                        this.btnDisabled = false;
                    })
                    .catch(error => {
                        console.error('Sum error:', error);
                        this.btnDisabled = false;
                    });
            })
            .catch(error => {
                const evt = new ShowToastEvent({
                    title: 'Error',
                    message: error.body.message,
                    variant: 'error',
                });
                this.dispatchEvent(evt);
                console.error('Create cart error:', error);
                this.btnDisabled = false;
            });

        this.quantity = 1;
    }

    closeModal() {
        this.isOpenModal = false;
    }
}