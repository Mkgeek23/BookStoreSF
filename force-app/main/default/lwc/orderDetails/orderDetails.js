import { LightningElement, wire, api, track } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import fetchUpOrder from '@salesforce/apex/OrderController.fetchUpOrder';
import getCartItemsList from '@salesforce/apex/CartDetailsController.getCartItemsList';

const columns = [{
        label: 'Book Title',
        fieldName: 'BookReference',
        type: 'url',
        wrapText: 'true',
        typeAttributes: {
            label: {
                fieldName: 'Name'
            },
            // target: '_blank'
        },
    },
    {
        label: 'Quantity',
        fieldName: 'Quantity',
        type: 'number',
        wrapText: 'true',
    },
    {
        label: 'Amount',
        fieldName: 'Amount',
        type: 'currency',
        typeAttributes: { currencyCode: 'EUR', step: '0.01', minimumFractionDigits: '2', maximumFractionDigits: '2' },
        wrapText: 'true',
    },
];
export default class OrderDetails extends LightningElement {
    @track cartItems = [];
    columns = columns;
    rowOffset = 0;
    errors;
    @track order;
    @api orderId;
    @api source;
    @track totalPrice = 0;
    __currentPageReference;

    @wire(CurrentPageReference)
    getCurrentPageReference(pageReference) {
        this.__currentPageReference = pageReference;
        this.orderId = this.__currentPageReference.state.orderId;
        this.source = this.__currentPageReference.state.source;

        this.fetchUpOrderJS();
    }

    fetchUpOrderJS() {
        fetchUpOrder({ orderId: this.orderId })
            .then(result => {
                console.log('Result', result);
                this.order = result;
                this.errors = undefined;

                this.fetchUpOrderItemsJS();
            })
            .catch(error => {
                console.error('Error:', error);
                this.order = undefined;
                this.errors = error;
            });
    }

    fetchUpOrderItemsJS() {
        getCartItemsList({ cartId: this.order.Cart__r.Id })
            .then(result => {
                result.forEach(cartItem => {
                    cartItem.Name = cartItem.Book__r.Name;
                    cartItem.Quantity = cartItem.Quantity__c;
                    cartItem.Amount = cartItem.Amount__c;
                    this.totalPrice += cartItem.Amount__c;
                    cartItem.BookReference = 'https://' + window.location.host + '/s/book-details?bookId=' + cartItem.Book__r.Id + '&source=orders';;
                });
                this.cartItems = result;
            })
            .catch(error => {
                this.errors = error;
            });
    }
}