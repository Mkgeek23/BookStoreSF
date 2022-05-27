public with sharing class OrderController{
    @AuraEnabled
    public static string createOrder(){
        try{
            List<Cart_Item__c> cartItems = CartDetailsController.getCartItemsList('');
            String cartId;
            if (cartItems != null && cartItems.size() > 0){
                cartId = cartItems.get(0).Cart__r.Id;
                Order__c order = new Order__c(Cart__c = cartId);
                insert order;
                Cart__c cart = [SELECT Id, Is_Active__c
                                From Cart__c
                                WHERE Cart__c.Id = :cartId];
                cart.Is_Active__c = false;
                update cart;
                return order.Id;
            } else{
                throw new AuraHandledException('Basket is empty');
            }
        } catch (Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<Order__c> fetchUpOrders(){
        List<Order__c> orderList = new List<Order__c>();
        try{
            orderList = [Select Id, Name, Order_Status__c, Creation_Date__c
                         From Order__c
                         Where Cart__r.User__c = :UserInfo.getUserId()
                         With SECURITY_ENFORCED];
        } catch (Exception e){
            throw new AuraHandledException(e.getMessage());
        }
        return orderList;
    }

    @AuraEnabled
    public static Order__c fetchUpOrder(String orderId){
        List<Order__c> orderList = new List<Order__c>();
        try{
            orderList = [Select Id, Name, Order_Status__c, Creation_Date__c, Cart__r.Id
                         From Order__c
                         Where Cart__r.User__c = :UserInfo.getUserId() AND Id = :orderId
                         With SECURITY_ENFORCED];
        } catch (Exception e){
            throw new AuraHandledException(e.getMessage());
        }
        return orderList[0];
    }

}