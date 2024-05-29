public with sharing class AccountController {
    
    // create a method that returns a list of five account records sorted by annualrevenue
    @AuraEnabled(cacheable=true)
    public static List<Account> getTopAccounts() {
        return [SELECT Id, Name, AnnualRevenue, Phone FROM Account WITH SECURITY_ENFORCED 
                    ORDER BY AnnualRevenue DESC NULLS LAST LIMIT 5];
    }
}