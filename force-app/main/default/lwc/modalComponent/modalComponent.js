import { LightningElement, track } from 'lwc';

export default class ModalComponent extends LightningElement {
    @track isModalOpen = false;

    openModal() {
        this.isModalOpen = true;
    }
    closeModal(event) {
        this.isModalOpen = false;
    }
    closeModalByBg(event) {
        if (event.target.id.includes('modal-bg')) {
            this.isModalOpen = false;
        }
    }
    submitDetails() {
        this.isModalOpen = false;
    }
}