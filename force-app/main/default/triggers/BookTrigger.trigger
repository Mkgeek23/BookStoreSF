trigger BookTrigger on Book__c(before insert, before update ){

    Integer zeroAsciiValue = '0'.charAt(0);
    Integer xAsciiValue = 'X'.charAt(0);
    String isbnCode10Format = '[0-9]{9}[0-9xX]{1}';
    String isbnCode13Format = '[0-9]{13}';
    String errMsg = 'The ISBN Code is invalid.';

    for (Book__c b : Trigger.New ){

        //Validate if is number

        Pattern numberFormat = Pattern.Compile(b.Year_of_publication__c < 2007 ? isbnCode10Format : isbnCode13Format);
        Matcher numberMatch = numberFormat.matcher(b.ISBN_Code__c);

        if (!numberMatch.Matches()){
            b.ISBN_Code__c.addError(errMsg);
            continue;
        }

        //Validate checksum
        Integer sum = 0;
        Integer isbnLen = b.ISBN_Code__c.length();

        if (b.Year_of_publication__c < 2007){

            for (Integer i = 0; i < isbnLen - 1; i++){
                sum += (b.ISBN_Code__c.charAt(i) - zeroAsciiValue) * (i + 1);
            }

            Integer lastCharValue = b.ISBN_Code__c.toUpperCase().charAt(isbnLen - 1);
            Integer checksum = lastCharValue == xAsciiValue ? 10 : lastCharValue - zeroAsciiValue;

            if (math.mod(sum, 11) != checksum){
                b.ISBN_Code__c.addError(errMsg);
            }
        } else{
            for (Integer i = 0; i < isbnLen - 1; i++){
                sum += (b.ISBN_Code__c.charAt(i) - zeroAsciiValue) * (math.mod(i, 2) == 0 ? 1:3);
            }

            Boolean shouldSubstract = math.mod(sum, 10) != 0;

            if ((shouldSubstract ? 10 : 0)-math.mod(sum, 10) != b.ISBN_Code__c.charAt(isbnLen - 1) - zeroAsciiValue){
                b.ISBN_Code__c.addError(errMsg);
            }
        }
    }
}