trigger OrderTrigger on Order__c(before insert, before update, after insert, after update ){
    if (Trigger.isBefore){
        if (Trigger.isInsert){
            for (Order__c o : Trigger.New ){
                CartDetailsController.updateBooksInCart(true, o.Cart__c);
            }
        } else{
            for (Id orderId : Trigger.newMap.keySet()){
                if (Trigger.oldMap.get(orderId).Order_Status__c != Trigger.newMap.get(orderId).Order_Status__c){
                    if (Trigger.oldMap.get(orderId).Order_Status__c == 'Canceled'){
                        CartDetailsController.updateBooksInCart(true, Trigger.newMap.get(orderId).Cart__c);
                    } else if (Trigger.newMap.get(orderId).Order_Status__c == 'Canceled'){
                        CartDetailsController.updateBooksInCart(false, Trigger.newMap.get(orderId).Cart__c);
                    }
                }
            }
        }
    } else{
        if (Trigger.isInsert){
            OrderTriggerHandler.sendEmail(Trigger.New);
        }
    }
}