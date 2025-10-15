public with sharing class OpportunityDocumentTabsController {
    @AuraEnabled(cacheable=true)
    public static List<Document_Link__c> getDocumentsByOpportunity(Id opportunityId) {
        return [
            SELECT Id,
                   Application_Document__r.Id,
                   Application_Document__r.Name,
                   Application_Document__r.Type__c,
                   Application_Document__r.Google_Doc_URL__c
            FROM Document_Link__c
            WHERE Opportunity__c = :opportunityId
        ];
    }
}