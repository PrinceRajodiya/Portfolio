public with sharing class ContactFormController {
    @AuraEnabled
    public static Id createLead(
        String firstName,
        String lastName,
        String email,
        String phone,
        String description,
        String company
    ) {
        // Log exactly what LWC sent
        System.debug(LoggingLevel.WARN, 'createLead args => ' +
            JSON.serialize(new Map<String,Object>{
                'firstName'=>firstName, 'lastName'=>lastName,
                'email'=>email, 'phone'=>phone, 'company'=>company, 'description'=>description
            })
        );

        // Required fields guard
        if (String.isBlank(lastName))  lastName  = 'Website Visitor';
        if (String.isBlank(company))   company   = 'Website Inquiry';

        Lead l = new Lead();
        l.FirstName   = firstName;
        l.LastName    = lastName;
        l.Email       = email;
        l.Phone       = phone;
        l.Company     = company;
        l.Status      = 'Open - Not Contacted';
        l.Description = description;

        insert l;
        return l.Id;
    }
}
