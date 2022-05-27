public with sharing class SortingHelper{
    public static String getSort(String sortBy){
        String orderBy;
        if (sortBy != null){
            orderBy = 'Order By ';
            switch on sortBy{
                when 'nameZA'{
                    orderBy += 'Name DESC';
                }
                when 'priceLowHigh'{
                    orderBy += 'Price__c ASC';
                }
                when 'priceHighLow'{
                    orderBy += 'Price__c DESC';
                }
                when 'dateLowHigh'{
                    orderBy += 'CreatedDate ASC';
                }
                when 'dateHighLow'{
                    orderBy += 'CreatedDate DESC';
                }
                when 'bestsellers'{
                    orderBy += 'Number_of_sold__c DESC';
                }
                when else{
                    orderBy += 'Name';
                }
            }
        } else{
            orderBy = 'Order By Name';
        }
        return orderBy;
    }

}