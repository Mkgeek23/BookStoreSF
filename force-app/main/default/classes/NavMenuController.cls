public with sharing class NavMenuController {
    @AuraEnabled(Cacheable=true)
    public static Map<String, Object> getConnectNavigationItems(String menuName, String communityId) {
      
      // Get the base url for the community to form our callout url
      String baseUrl = Url.getSalesforceBaseUrl().toExternalForm();
      
      // Query the naviagion link set assigned to the specified menu
      List<NavigationLinkSet> navigationLinkSets = [
        SELECT Id
        FROM NavigationLinkSet
        WHERE DeveloperName = :menuName
        WITH SECURITY_ENFORCED
        LIMIT 1
      ];
      
      // verify that a NavigationLinkSet has been returned
      NavigationLinkSet navigationLinkSet = (navigationLinkSets.size() == 1)
        ? navigationLinkSets.get(0)
        : null;
  
      // Construct the URL for the callout to the connect API
      String restEndpointTemplate = '{0}/services/data/v48.0/connect/communities/{1}/navigation-menu/navigation-menu-items?navigationLinkSetId={2}&includeImageUrl=true&addHomeMenuItem=false';
      List<Object> parameters = new List<Object>{
        baseUrl,
        communityId,
        navigationLinkSet.Id
      };
      String restEndpointFormatted = String.format(
        restEndpointTemplate,
        parameters
      );
      
      // Build the HttpRequest
      HttpRequest httpRequest = new HttpRequest();
      httpRequest.setMethod('GET');
  
      // Use the current users sessionId to authorize the transaction
      // the guest user must be API enabled 
      String sessionId = UserInfo.getSessionId();
      httpRequest.setHeader('Authorization', 'OAuth ' + sessionId);
      httpRequest.setHeader('Authorization', 'Bearer ' + sessionId);
      httpRequest.setEndpoint(restEndpointFormatted);
  
      Map<String, Object> navigationItems = new Map<String, Object>();
        Http http = new Http();
        HttpResponse httpResponse = http.send(httpRequest);
        if (httpResponse.getStatusCode() == 200) {
        
          // If the request is successful, desearliaze the response into a Map
          Map<String, Object> response = (Map<String, Object>) JSON.deserializeUntyped(
            httpResponse.getBody()
          );
          navigationItems = response;
        } else {
        
          // If the request is unsuccessful, handle the error
          System.debug(' httpResponse ' + httpResponse.getBody());
          throw new CalloutException(httpResponse.getBody());
        }
        return navigationItems;
    }
}