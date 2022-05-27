import { LightningElement, track, api } from 'lwc';
import Id from '@salesforce/user/Id';
import getUserDetails from '@salesforce/apex/UserController.getUserDetails';
import updateUserDetails from '@salesforce/apex/UserController.updateUserDetails';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class UserDataComponent extends LightningElement {
    userId = Id;
    @track userDetails;
    @api btnDisabled;

    connectedCallback() {
        this.btnDisabled = true;
        this.handleUserDetails();
    }

    handleUserDetails() {
        getUserDetails()
            .then(result => {
                console.log('Result', result);
                this.userDetails = result;
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    handleUpdateUserDetails() {
        this.btnDisabled = true;
        updateUserDetails({ user: this.userDetails })
            .then(() => {
                const evt = new ShowToastEvent({
                    title: 'Success',
                    message: 'Profile updated successfully',
                    variant: 'success',
                });
                this.dispatchEvent(evt);
            })
            .catch(error => {
                const evt = new ShowToastEvent({
                    title: 'Error',
                    message: 'Something went wrong',
                    variant: 'error',
                });
                this.dispatchEvent(evt);
                this.btnDisabled = false;
            });
    }

    handleChange(event) {
        this.userDetails[event.target.dataset.field] = event.target.value;
        this.btnDisabled = false;
    }
}