public with sharing class CreditCheckContinuation {
    
    // create an "action" method to populate a continuation object with callout(s)
    @AuraEnabled(continuation=true)
    public static Object creditCheckApi(String accountId) {
        // create my continuation object
        Continuation con = new Continuation(60);

        // set the callback method
        con.continuationMethod = 'processResponse';

        // set the (optional) state property to pass data into the callback method
        con.state = 'Howdy';

        // need account information for callout parameters
        Account a = [SELECT Id, Name, Owner.Name, Owner.Email FROM Account
                        WHERE Id = :accountId LIMIT 1];

        // create string to hold the url for my endpoint
        String url = 'https://steve-wasula-splx201-dev-ed.my.salesforce-sites.com/creditcheck';

        // append parameters to url
        url += '?name=' + EncodingUtil.urlEncode(a.Name, 'UTF-8')
            + '&email=' + a.Owner.Email
            + '&requestor=' + EncodingUtil.urlEncode(a.Owner.Name, 'UTF-8');

        // create a new HTTP request and set the method and endpoint properties
        HttpRequest req = new HttpRequest();
        req.setEndPoint(url);
        req.setMethod('GET');

        // add our HttpRequest to the continuation object
        con.addHttpRequest(req);

        // we can add up to two more (for a total of 3) requests

        // return the continuation object
        return con;
    }

    // create a callback method that executes when the callout(s) are complete
    @AuraEnabled
    public static Object processResponse(List<String> labels, Object state) {
        // access the response from the list and return the body to our LWC
        HttpResponse response = Continuation.getResponse(labels[0]);
        return response.getBody();
    }
}