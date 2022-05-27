import { LightningElement, api, track } from 'lwc';
import getGenresList from '@salesforce/apex/BookListService.getGenresList';

export default class BookListFilter extends LightningElement {
    @api priceMin;
    @api priceMinName = 'Price__c(ge)';
    @api priceMax;
    @api priceMaxName = 'Price__c(le)';
    @api genre = '';
    @api genreName = 'Genre__c(inc)';
    @track genreList;
    connectedCallback() {
        this.getGenresListJS();
    }

    getGenresListJS() {
        getGenresList()
            .then(result => {
                this.genreList = [
                    { label: 'All', value: undefined },
                ];
                result.forEach((res) => {
                    res = { label: res, value: res };
                    this.genreList.push(res)
                });
                this.__errors = undefined;
            })
            .catch(error => {
                this.books = undefined;
                console.log('Error', error);
                this.__errors = error;
            });
    }

    buildJson() {
        let res = '{';
        if (this.priceMin) {
            res += '"' + this.priceMinName + '": ';
            res += '"' + this.priceMin + '",';
        }
        if (this.priceMax) {
            res += '"' + this.priceMaxName + '": ';
            res += '"' + this.priceMax + '",';
        }
        if (this.genre) {
            res += '"' + this.genreName + '": ';
            res += '"' + this.genre + '",';
        }
        if (res.length > 1) {
            res = res.substring(0, res.length - 1);
        }
        res += '}';
        return res;
    }

    handleFilters() {
        const selectedEvent = new CustomEvent("handlefilters", {
            detail: this.buildJson(),
        });
        this.dispatchEvent(selectedEvent);
    }

    handlePriceMin(event) {
        this.priceMin = event.detail;
    }
    handlePriceMax(event) {
        this.priceMax = event.detail;
    }
    handleGenre(event) {
        this.genre = event.detail;
    }
}