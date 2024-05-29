// ensure that the class uses with sharing in order to enforce record sharing settings for the current user
public with sharing class OpportunityController {
    
    // create a public static method that returns a List of Opportunities and takes an Account ID as a parameter
    // annontated with @AuraEnable(cacheable=true) so I can import and invoke with the wire service
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunities(String accountId) {

        // create a list to hold the related opportunity records
        List<Opportunity> opps = new List<Opportunity>();

        // query the database to return related opp records into my list
        opps = [SELECT Id, Name, Amount, StageName, CloseDate, IsWon, IsClosed FROM Opportunity 
                    WHERE AccountId = :accountId WITH SECURITY_ENFORCED];

        // return the list of opps
        return opps;
    }
}