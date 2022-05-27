public with sharing class UserController{

    @AuraEnabled
    public static User getUserDetails(){

        List<User> user = [Select Id, FirstName, LastName, Phone, Email, Address, Street, City, PostalCode, Country, State
                           From User
                           Where Id = :UserInfo.getUserId()
                           With SECURITY_ENFORCED];
        return user[0];
    }

    @AuraEnabled
    public static User updateUserDetails(User user){
        update user;
        return user;
    }
}