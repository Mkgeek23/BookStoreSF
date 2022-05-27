public with sharing class FiltersHelper {
    
    public static String getConditionsFromFilters(Map<String, Object> filters){
        String condition = '';
        if (filters != null && filters.size() > 0){
            condition += 'WHERE ';
            for (String key : filters.keySet()){
                condition += convertFilter(key, filters.get(key).toString(), !isNumber(filters.get(key).toString()));
            }
            condition = condition.substring(0, condition.length() - 3);
        }
        return condition;
    } 

    private static Boolean isNumber(String value){
        try{
            Integer.valueOf(value);
        } catch (Exception e){
            return false;
        }
        return true;
    }

    private static string convertFilter(String key, String value, Boolean isString){
        String condition = '';
        String stringmodifier = isString ? '\'' : '';
        if (key.indexOf('(') == -1)
            return '';
        String option = key.substring(key.indexOf('('));
        switch on option{
            when '(inc)'{
                return ' ' + key.substring(0, key.indexOf('(')) + ' includes(' + stringmodifier + value + stringmodifier + ') AND';
            }
            when '(ge)'{
                return ' ' + key.substring(0, key.indexOf('(')) + ' > ' + stringmodifier + value + stringmodifier + ' AND';
            }
            when '(le)'{
                return ' ' + key.substring(0, key.indexOf('(')) + ' < ' + stringmodifier + value + stringmodifier + ' AND';
            }
        }
        return '';
    }
}