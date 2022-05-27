public with sharing class BookListService{
    @AuraEnabled
    public static List<Book__c> fetchUpBooks(Integer start, Integer recordLimit, Map<String, Object> filters, String sortBy){
        start = start == null ? 0 : start;
        recordLimit = recordLimit == null ? 20 : recordLimit;

        string condition = FiltersHelper.getConditionsFromFilters(filters);
        string orderBy = SortingHelper.getSort(sortBy);

        try{
            List<Book__c> bookList = Database.query('Select Id, Name, Author__c, Author__r.Name, Image_Path__c, ISBN_Code__c, Price__c, Year_of_publication__c From Book__c ' + condition + ' ' + orderBy + ' LIMIT :recordLimit Offset :start');
            return bookList;
        } catch (Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Decimal countBooks(Integer start, Integer recordLimit, Map<String, Object> filters){
        start = start == null ? 0 : start;
        recordLimit = recordLimit == null ? 20 : recordLimit;

        string condition = FiltersHelper.getConditionsFromFilters(filters);
        try{
            List<AggregateResult> result = Database.query('SELECT COUNT(Id)quantity From Book__c  ' + condition + 'With SECURITY_ENFORCED');
            return (Decimal) result[0].get('quantity');
        } catch (Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Book__c fetchUpBook(String bookId){
        List<Book__c> bookList = new List<Book__c>();
        try{
            bookList = [Select Id, Name, Author__c, Author__r.Name, Genre__c, Image_Path__c, Number_of_sold__c, Availability__c, Description__c, ISBN_Code__c, Price__c, Year_of_publication__c
                        From Book__c
                        Where Id = :bookId];
        } catch (Exception e){
            throw new AuraHandledException(e.getMessage());
        }
        return bookList[0];
    }

    @AuraEnabled
    public static List<String> getGenresList(){
        try{
            List<String> pickListValuesList = new List<String>();
            Schema.DescribeFieldResult fieldResult = Book__c.Genre__c.getDescribe();
            List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
            for (Schema.PicklistEntry pickListVal : ple){
                pickListValuesList.add(pickListVal.getLabel());
            }
            return pickListValuesList;
        } catch (Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<Book__c> searchBooks(String phrase, Integer recordLimit){
        try{
            if (recordLimit == null || recordLimit <= 0){
                recordLimit = 1;
            }
            List<List<sObject>> searchList = [FIND : phrase IN All FIELDS RETURNING Book__c(Name, Author__c, Author__r.Name, Image_Path__c, ISBN_Code__c, Price__c, Year_of_publication__c)LIMIT : recordLimit];
            Book__c[] books = (Book__c[])searchList[0];
            return books;
        } catch (Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

}