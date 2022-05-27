public with sharing class OrderTriggerHandler{
    public static void sendEmail(List<Order__c> newOrderList){

        List<Messaging.SingleEmailMessage> mails = new List<Messaging.SingleEmailMessage>();
        for (Order__c order : newOrderList){
            Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            List<String> sendTo = new List<String>();
            //User user = [SELECT Email FROM User WHERE Id =: order.Cart__r.User__c];
            sendTo.add(order.Email__c);
            mail.setToAddresses(sendTo);
            mail.setSubject('Order Created');
            String body = 'An order was created. <br><strong>Address:</strong><br>' + order.Street__c + '<br>' + order.City__c + ', ' + order.State__c + ' ' + order.PostalCode__c + '<br>' + order.Country__c;

            List<Cart_Item__c> cartItems = [SELECT Book__r.Name, Quantity__c, Amount__c
                                            FROM Cart_Item__c
                                            WHERE Cart__c = :order.Cart__c];
            body += '<br>Ordered books:<br><ul>';
            body += '<!DOCTYPE html>' + 
                    '<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"' + 
                    '    xmlns:o="urn:schemas-microsoft-com:office:office">' + 
                    '' + 
                    '<head>' + 
                    '    <meta charset="utf-8"> <!-- utf-8 works for most cases -->' + 
                    '    <meta name="viewport" content="width=device-width"> <!-- Forcing initial-scale shouldn\'t be necessary -->' + 
                    '    <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->' + 
                    '    <meta name="x-apple-disable-message-reformatting"> <!-- Disable auto-scale in iOS 10 Mail entirely -->' + 
                    '    <title></title> <!-- The title tag shows in email notifications, like Android 4.4. -->' + 
                    '' + 
                    '    <link href="https://fonts.googleapis.com/css?family=Work+Sans:200,300,400,500,600,700" rel="stylesheet">' + 
                    '' + 
                    '' + 
                    '    <!-- CSS Reset : END -->' + 
                    '' + 
                    '    <!-- Progressive Enhancements : BEGIN -->' + 
                    '' + 
                    '' + 
                    '</head>' + 
                    '' + 
                    '<body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #f1f1f1;">' + 
                    '    <center style="width: 100%; background-color: #f1f1f1;">' + 
                    '        <div' + 
                    '            style="display: none; font-size: 1px;max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">' + 
                    '            &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;' + 
                    '        </div>' + 
                    '        <div style="max-width: 600px; margin: 0 auto;" class="email-container">' + 
                    '            <!-- BEGIN BODY -->' + 
                    '            <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"' + 
                    '                style="margin: auto;">' + 
                    '                <tr>' + 
                    '                    <td valign="top" class="bg_white" style="padding: 1em 2.5em 0 2.5em;">' + 
                    '                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">' + 
                    '                            <tr>' + 
                    '                                <td class="logo" style="text-align: left;">' + 
                    '                                    <h1><a href="https://' + URL.getSalesforceBaseUrl().getHost() + '">Best Bookstore Online</a></h1>' + 
                    '                                </td>' + 
                    '                            </tr>' + 
                    '                        </table>' + 
                    '                    </td>' + 
                    '                </tr><!-- end tr -->' + 
                    '                <tr>' + 
                    '                    <td valign="middle" class="hero bg_white" style="padding: 2em 0 2em 0;">' + 
                    '                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">' + 
                    '                            <tr>' + 
                    '                                <td style="padding: 0 2.5em; text-align: left;">' + 
                    '                                    <div class="text">' + 
                    '                                        <h2>Thanks for your purchasing</h2>' + 
                    '                                        <h3>You can check your order here</h3>' + 
                    '                                    </div>' + 
                    '                                </td>' + 
                    '                            </tr>' + 
                    '                        </table>' + 
                    '                    </td>' + 
                    '                </tr><!-- end tr -->' + 
                    '                <tr>' + 
                    '                    <table class="bg_white" role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">' + 
                    '                        <tr style="border-bottom: 1px solid rgba(0,0,0,.05);">' + 
                    '                            <th width="80%" style="text-align:left; padding: 0 2.5em; color: #000; padding-bottom: 20px">Item</th>' + 
                    '                            <th width="20%" style="text-align:right; padding: 0 2.5em; color: #000; padding-bottom: 20px">Price</th>' + 
                    '                        </tr>';
            for (Cart_Item__c cartItem : cartItems){
                body += '                        <tr style="border-bottom: 1px solid rgba(0,0,0,.05);">' + 
                        '                            <td valign="middle" width="80%" style="text-align:left; padding: 0 2.5em;">' + 
                        '                                <div class="product-entry">' + 
                        '                                    <div class="text">' + 
                        '                                        <h3>'+ cartItem.Book__r.Name +'</h3>' + 
                        '                                    </div>' + 
                        '                                </div>' + 
                        '                            </td>' + 
                        '                            <td valign="middle" width="20%" style="text-align:left; padding: 0 2.5em;">' + 
                        '                                <span class="price" style="color: #000; font-size: 20px;">'+cartItem.Amount__c+'€</span>' + 
                        '                            </td>' + 
                        '                        </tr>';
            }
            body += '                        <tr>' + 
                        '                            <td valign="middle" style="text-align:left; padding: 1em 2.5em;">' + 
                        '                                <p><a href="#" class="btn btn-primary">Go to your order</a></p>' + 
                        '                            </td>' + 
                        '                        </tr>' + 
                        '                    </table>' + 
                        '                </tr><!-- end tr -->' + 
                        '                <!-- 1 Column Text + Button : END -->' + 
                        '            </table>' + 
                        '' + 
                        '        </div>' + 
                        '    </center>' + 
                        '</body>' + 
                        '' + 
                        '</html>';
            mail.setHtmlBody(body);
            mails.add(mail);
        }
        Messaging.sendEmail(mails);
    }

}