import { LightningElement, track } from 'lwc';
import fetchUpOrders from '@salesforce/apex/OrderController.fetchUpOrders';

const columns = [
    { label: 'Order Name', fieldName: 'Name' },
    { label: 'Status', fieldName: 'Order_Status__c', type: 'picklist' },
    {
        label: 'Creation Date',
        fieldName: 'Creation_Date__c',
        type: "date",
        typeAttributes: {
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        },
    }, {
        label: 'Order details',
        fieldName: 'detailsPage',
        type: 'url',
        wrapText: 'true',
        cellAttributes: {
            iconName: 'standard:order_item',
            iconPosition: 'left'
        },
        typeAttributes: {
            label: 'Check order details',
            // target: '_blank'
        },
    },
];

export default class OrderListComponent extends LightningElement {
    @track data = [];
    columns = columns;
    rowOffset = 0;
    errors;

    connectedCallback() {
        this.ordersListFromApex();
    }

    ordersListFromApex() {
        fetchUpOrders()
            .then((result) => {
                result.forEach(order => {
                    order.Status = 'test';
                    //Zamiast tego to basepath i końcówka
                    order.detailsPage = 'https://' + window.location.host + '/s/order-details?orderId=' + order.Id + '&source=orders';
                    // order.EVNT_ORG = order.Event__r.Event_Organizer__r.Name;
                    // order.StartDateTime = order.Event__r.Start_DateTime__c;
                    // order.Location = (order.Location__c) ? order.Location__r.Name : 'This Event is Virtual';
                });
                window.console.log('result', result);
                this.data = result;
                this.errors = undefined;
            }).catch((err) => {
                this.data = undefined;
                window.console.log('err', err);
                this.errors = JSON.stringify(err);
            });

        fetchUpOrders
    }
}