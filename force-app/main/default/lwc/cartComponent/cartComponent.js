import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getCartItemsList from '@salesforce/apex/CartDetailsController.getCartItemsList';
import removeCartItem from '@salesforce/apex/CartDetailsController.removeCartItem';
import updateCartItems from '@salesforce/apex/CartDetailsController.updateCartItems';
import createOrder from '@salesforce/apex/OrderController.createOrder';
import basePath from '@salesforce/community/basePath';
import { decodeValidationError } from 'c/errorDecode'
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CartComponent extends NavigationMixin(LightningElement) {

    @track items;
    size;
    total = 0;
    @track btnDisabled = false;

    setBasePath() {
        return basePath
            .replace('/login', '')
            .replace('/my-account', '')
            .replace('/my-proposals', '')
            .replace('/faqs', '')
            .replace('/terms-and-conditions', '');
    }

    connectedCallback() {
        this.handleCartItems();
    }

    navigateToInternalPage(pageName) {
        this[NavigationMixin.Navigate]({
            type: "standard__webPage",
            attributes: {
                url: this.setBasePath() + '/' + pageName,
            }
        });
    }
    navigateToOrderDetailsPage(orderId) {
        this.navigateToInternalPage('order-details?orderId=' + orderId);
    }

    handleCreateOrder() {
        this.btnDisabled = true;
        createOrder()
            .then((result) => {
                this.__errors = undefined;
                this.handleCartItems();
                this.navigateToOrderDetailsPage(result);

            }).catch((error) => {
                console.log('Error', error);
                this.__errors = decodeValidationError(error);
                const evt = new ShowToastEvent({
                    title: 'Error',
                    message: this.__errors,
                    variant: 'error',
                });
                this.dispatchEvent(evt);
                console.log(this.__errors);
            });
    }


    handleCartItems() {
        getCartItemsList({
                cartId: '',
            })
            .then((data) => {
                console.log('Data', data);
                if (data.length > 0) {
                    this.items = data;
                } else {
                    this.items = undefined;
                }
                this.total = 0;
                data.forEach(element => {
                    this.total += element.Amount__c;
                });
                this.__errors = undefined;
            }).catch((error) => {
                console.error('Error:', error);
                this.items = undefined;
                this.__errors = error;
            });
    }

    handleDelete = event => {
        event.preventDefault();
        let selectedItemId = event.currentTarget.dataset.eventId;

        console.log('Usuwam', selectedItemId);
        removeCartItem({
                cartItemId: selectedItemId,
            })
            .then((data) => {
                console.log('Done:', data);
                this.handleCartItems();
            }).catch((error) => {
                console.error('Error:', error);
                this.__errors = error;
            });
    }

    updateQuantity = event => {
        event.preventDefault();
        let selectedItemId = event.currentTarget.dataset.eventId;
        let selectedItemQuantity = event.detail;

        console.log('Updateuje', selectedItemQuantity);
        updateCartItems({
                cartId: selectedItemId,
                quantity: selectedItemQuantity,
            })
            .then((data) => {
                console.log('Done:');
                this.handleCartItems();
            }).catch((error) => {
                console.error('Error:', error);
                this.__errors = error;
            });
    }

}