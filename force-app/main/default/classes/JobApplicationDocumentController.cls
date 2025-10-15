public with sharing class JobApplicationDocumentController {
    @AuraEnabled(cacheable=true)
    public static List<Application_Document__c> getDocumentsByType(String type) {
        return [
            SELECT Id, Name, Type__c
            FROM Application_Document__c
            WHERE Type__c = :type
            ORDER BY Name
        ];
    }

    @AuraEnabled
    public static Id createOpportunityAndLinkDocuments(
        String jobTitle,
        String companyName,
        Date applicationDate,
        String location,
        String pay,
        String jobDescription,
        String stage,
        List<Id> documentIds
    ) {
        // Find or create Account
        List<Account> accounts = [SELECT Id FROM Account WHERE Name = :companyName LIMIT 1];
        Account acc = accounts.isEmpty() ? new Account(Name = companyName) : accounts[0];
        if (accounts.isEmpty()) {
            insert acc;
        }

        // Create Opportunity
        Opportunity opp = new Opportunity(
            Name = jobTitle,
            AccountId = acc.Id,
            StageName = stage,
            CloseDate = Date.today().addDays(14),
            Application_Date__c = applicationDate,
            Location__c = location,
            Pay__c = pay,
            Job_Description__c = jobDescription
        );
        insert opp;

        // Link Documents
        List<Document_Link__c> links = new List<Document_Link__c>();
        for (Id docId : documentIds) {
            links.add(new Document_Link__c(
                Opportunity__c = opp.Id,
                Application_Document__c = docId
            ));
        }
        insert links;

        return opp.Id;
    }
}