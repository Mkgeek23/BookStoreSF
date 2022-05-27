const decodeValidationError = (error) => {
    if (!error) {
        return '';
    }
    if (!error.body) {
        return '';
    }
    if (!error.body.pageErrors[0]) {
        return '';
    }
    if (!error.body.pageErrors[0].message) {
        return '';
    }
    const errCode = 'FIELD_CUSTOM_VALIDATION_EXCEPTION';
    const message = error.body.pageErrors[0].message;
    const index = message.indexOf(errCode);
    return index ? message.substring(index + errCode.length + 2, message.indexOf(': [')) : '';
}

export { decodeValidationError }