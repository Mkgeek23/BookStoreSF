import { LightningElement, track, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class ModalComponent extends NavigationMixin(LightningElement) {
    @api isModalOpen = false;
    @api total = 0;
    @api items = 0;

    openModal() {
        this.isModalOpen = true;
    }
    closeModal() {
        this.handleCloseModal();
    }
    closeModalByBg(event) {
        if (event.target.id.includes('modal-bg')) {
            this.handleCloseModal();
        }
    }

    handleCloseModal() {
        const selectedEvent = new CustomEvent("closemodal", {});
        this.dispatchEvent(selectedEvent);
    }

    navigateToCartPage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__namedPage',
            attributes: {
                pageName: 'basket'
            },
        });
    }
}