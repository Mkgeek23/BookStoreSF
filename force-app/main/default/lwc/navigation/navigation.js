import { NavigationMixin } from 'lightning/navigation';
import basePath from '@salesforce/community/basePath';

const setBasePath = () => {
    return basePath
        .replace('/login', '')
        .replace('/my-account', '')
        .replace('/my-proposals', '')
        .replace('/faqs', '')
        .replace('/terms-and-conditions', '');
}

const navigateToInternalPage = (pageName = '') => {
    console.log('internal');
    this[NavigationMixin.Navigate]({
        type: "standard__webPage",
        attributes: {
            url: setBasePath() + '/' + pageName,
        }
    });
}

const navigateToHomePage = () => {
    console.log('navigation');
    console.log(basePath);
    console.log(setBasePath());
    navigateToInternalPage('');
    console.log('znawigowano');
}

const log = () => {
    console.log('connected');
}

export { navigateToHomePage }