public with sharing class CartDetailsController{
    @AuraEnabled
    public static String getCartId(){
        List<Cart__c> cartList = getCart();
        if (cartList != null && cartList.size() > 0){
            return cartList[0].Id;
        } else{
            Cart__c cart = new Cart__c(Is_Active__c = true, User__c = UserInfo.getUserId());
            insert cart;
            return cart.Id;
        }
    }

    private static List<Cart__c> getCart(){
        List<Cart__c> cartList = [Select Id, Name
                                  From Cart__c
                                  Where User__c = :UserInfo.getUserId() AND Is_Active__c = true];
        return cartList;
    }

    @AuraEnabled(cacheable = true)
    public static Map<Id, Cart_Item__c> getCartItems(String cartId){
        if (cartId == null || cartId == ''){
            cartId = getCartId();
        }
        List<Cart_Item__c> existingItemList = [Select Id, Name, Quantity__c, Book__c, Book__r.Availability__c, Amount__c
                                               From Cart_Item__c
                                               Where Cart__c = :cartId];
        Map<Id, Cart_Item__c> bookQntyMap = new Map<Id, Cart_Item__c>();
        for (Cart_Item__c item : existingItemList){
            if (!bookQntyMap.containsKey(item.Book__c)){
                bookQntyMap.put(item.Book__c, item);
            }
        }
        return bookQntyMap;
    }

    @AuraEnabled
    public static List<Cart_Item__c> getCartItemsList(String cartId){
        if (cartId == null || cartId == ''){
            cartId = getCartId();
        }
        List<Cart_Item__c> existingItemList = [Select Id, Name, Cart__r.Id, Quantity__c, Book__c, Book__r.Id, Book__r.Name, Book__r.ISBN_Code__c, Book__r.Image_Path__c, Book__r.Author__c, Book__r.Author__r.Name, Book__r.Year_of_publication__c, Book__r.Availability__c, Amount__c
                                               From Cart_Item__c
                                               Where Cart__c = :cartId];
        return existingItemList;
    }

    @AuraEnabled
    public static void createCartItems(List<Book__c> bookList){
        List<Cart_Item__c> cartItemList = new List<Cart_Item__c>();
        List<Cart_Item__c> cartItemToUpdate = new List<Cart_Item__c>();

        String cartId = getCartId();
        Map<Id, Cart_Item__c> bookQntyMap = getCartItems(cartId);
        for (Book__c book : bookList){
            if (bookQntyMap.containsKey(book.Id)){
                Cart_Item__c it = bookQntyMap.get(book.Id);
                Cart_Item__c item = new Cart_Item__c(Id = it.Id, Quantity__c = it.Quantity__c + 1);
                cartItemToUpdate.add(item);
            } else{
                Cart_Item__c item = new Cart_Item__c(Cart__c = cartId, Book__c = book.Id, Quantity__c = 1);
                cartItemList.add(item);
            }
        }
        insert cartItemList;
        if (cartItemToUpdate != null && cartItemToUpdate.size() > 0){
            update cartItemToUpdate;
        }
    }

    /*Poprawić*/
    @AuraEnabled
    public static void updateCartItems(String cartId, Integer quantity){
        List<Cart_Item__c> cartItems = [Select Id, Quantity__c, Book__r.Price__c, Book__r.Availability__c
                                        FROM Cart_Item__c
                                        Where Id = :cartId];

        if (quantity < 1){
            throw new AuraHandledException('The quantity must be grater than 1');
        }
        if (cartItems[0].Book__r.Availability__c < quantity){
            throw new AuraHandledException('The number of avaiability is too low');
        }
        cartItems[0].Quantity__c = quantity;
        update cartItems;
    }

    @AuraEnabled
    public static void createCartItem(Book__c book, Integer quantity){
        if (quantity < 1){
            throw new AuraHandledException('The quantity must be grater than 1');
        }
        List<Cart_Item__c> cartItemList = new List<Cart_Item__c>();
        List<Cart_Item__c> cartItemToUpdate = new List<Cart_Item__c>();

        String cartId = getCartId();
        Map<Id, Cart_Item__c> bookQntyMap = getCartItems(cartId);

        if (bookQntyMap.containsKey(book.Id)){
            Cart_Item__c it = bookQntyMap.get(book.Id);
            Cart_Item__c item = new Cart_Item__c(Id = it.Id, Quantity__c = it.Quantity__c + quantity);
            if (it.Book__r.Availability__c < item.Quantity__c){
                throw new AuraHandledException('The number of avaiability is too low');
            }
            cartItemToUpdate.add(item);
        } else{
            Cart_Item__c item = new Cart_Item__c(Cart__c = cartId, Book__c = book.Id, Quantity__c = quantity);
            Book__c tmpbook = [Select Availability__c
                            From Book__c
                            WHERE Id =: book.Id];
            //throw new AuraHandledException(tmpbook.Availability__c);
            if (tmpbook.Availability__c < item.Quantity__c){
                throw new AuraHandledException('The number of avaiability is too low');
            }
            cartItemList.add(item);
        }

        insert cartItemList;
        if (cartItemToUpdate != null && cartItemToUpdate.size() > 0){
            update cartItemToUpdate;
        }
    }

    @AuraEnabled
    public static Cart_Item__c removeCartItem(String cartItemId){
        List<Cart_Item__c> cartItemsToDelete = [SELECT Id
                                                From Cart_Item__c
                                                WHERE Id = :cartItemId];
        delete cartItemsToDelete;
        return cartItemsToDelete[0];
    }

    public static void updateBooksInCart(Boolean sold, String cartId){
        Integer modifier = sold ? 1:-1;
        List<Cart_Item__c> cartItemsList = [SELECT Id, Name, Book__c, Quantity__c
                                            From Cart_Item__c
                                            WHERE Cart__c = :cartId];
        List<Book__c> bookListToUpdate = new List<Book__c>();
        for (Cart_Item__c c : cartItemsList){
            Book__c b = [SELECT Id, Availability__c, Number_of_sold__c
                         FROM Book__c
                         WHERE Id = :c.Book__c];
            b.Availability__c -= modifier * c.Quantity__c;
            b.Number_of_sold__c += modifier * c.Quantity__c;
            bookListToUpdate.add(b);
        }
        update bookListToUpdate;
    }

    @AuraEnabled
    public static Map<String, Decimal> sumOfitems(){
        String cartId = getCartId();
        List<AggregateResult> result = [Select SUM(Quantity__c)quantity, SUM(Amount__c)amount
                                        FROM Cart_Item__c
                                        WHERE Cart__r.Id = :cartId];
        Map<String, Decimal> data = new Map<String, Decimal>();
        data.put('quantity', (Decimal) result[0].get('quantity'));
        data.put('amount', (Decimal) result[0].get('amount'));
        return data;
    }

}