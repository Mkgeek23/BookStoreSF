import { LightningElement, api, track } from 'lwc';
export default class Filter extends LightningElement {
    @api type = 'text';
    @api value;
    @track text = (type === 'text');
    @track combobox = type === 'combobox';
}