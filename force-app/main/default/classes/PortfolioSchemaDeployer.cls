public with sharing class PortfolioSchemaDeployer {
    // Remote-Site diagnostic version (doesn't throw; logs status/body)
    private static final String API_VER = 'v61.0';

    private static String base() {
        return URL.getOrgDomainUrl().toExternalForm(); // e.g., https://YOURDOMAIN.my.salesforce.com
    }
    private static void auth(HttpRequest req) {
        req.setHeader('Authorization', 'Bearer ' + UserInfo.getSessionId());
        req.setHeader('Content-Type', 'application/json');
    }

    // Public entry: creates all objects + fields (idempotent)
    public static void deployAll() {
        System.debug('--- deployAll start --- base=' + base());
        ensureCustomObject('Profile__c', 'Profile', 'Profiles', 'Text');
        ensureField('Profile__c', fieldText('Headline__c','Headline',255));
        ensureField('Profile__c', fieldLongText('Summary__c','Summary',32768, 6, false));
        ensureField('Profile__c', fieldEmail('Email__c','Email'));
        ensureField('Profile__c', fieldPhone('Phone__c','Phone'));
        ensureField('Profile__c', fieldText('Location__c','Location',100));
        ensureField('Profile__c', fieldUrl('LinkedIn__c','LinkedIn'));

        ensureCustomObject('Education__c', 'Education', 'Education', 'Text');
        ensureField('Education__c', fieldText('School__c','School',255));
        ensureField('Education__c', fieldText('Degree__c','Degree',255));
        ensureField('Education__c', fieldText('Field__c','Field',255));
        ensureField('Education__c', fieldDate('StartDate__c','StartDate'));
        ensureField('Education__c', fieldDate('EndDate__c','EndDate'));
        ensureField('Education__c', fieldText('Location__c','Location',100));

        ensureCustomObject('Skill__c', 'Skill', 'Skills', 'Text');
        ensureField('Skill__c', fieldPicklist('Category__c','Category',
            new List<String>{'Programming','Salesforce Dev','Salesforce Admin','Frameworks & Tools','Cloud & DB'}, true));
        ensureField('Skill__c', fieldPicklist('Level__c','Level',
            new List<String>{'Beginner','Intermediate','Advanced'}, false));

        ensureCustomObject('Experience__c', 'Experience', 'Experiences', 'Text');
        ensureField('Experience__c', fieldText('Company__c','Company',255));
        ensureField('Experience__c', fieldText('Role__c','Role',255));
        ensureField('Experience__c', fieldDate('StartDate__c','StartDate'));
        ensureField('Experience__c', fieldDate('EndDate__c','EndDate'));
        ensureField('Experience__c', fieldCheckbox('Is_Current__c','Is Current', false));
        ensureField('Experience__c', fieldLongText('Responsibilities__c','Responsibilities',32768, 8, false));
        ensureField('Experience__c', fieldLongText('KeyAchievements__c','KeyAchievements',32768, 8, true));

        ensureCustomObject('Project__c', 'Project', 'Projects', 'Text');
        ensureField('Project__c', fieldText('TechStack__c','TechStack',255));
        ensureField('Project__c', fieldLongText('Description__c','Description',32768, 8, false));
        ensureField('Project__c', fieldText('Impact__c','Impact',255));
        ensureField('Project__c', fieldUrl('GitHubUrl__c','GitHubUrl'));
        ensureField('Project__c', fieldUrl('LiveDemoUrl__c','LiveDemoUrl'));
        ensureField('Project__c', fieldDate('StartDate__c','StartDate'));
        ensureField('Project__c', fieldDate('EndDate__c','EndDate'));
        ensureField('Project__c', fieldCheckbox('Is_Published__c','Is Published', true));
        ensureField('Project__c', fieldUrl('ThumbnailUrl__c','ThumbnailUrl'));

        ensureCustomObject('Certification__c', 'Certification', 'Certifications', 'Text');
        ensureField('Certification__c', fieldText('Issuer__c','Issuer',255));
        ensureField('Certification__c', fieldDate('Date__c','Date'));
        ensureField('Certification__c', fieldPicklist('Type__c','Type',
            new List<String>{'Admin','Developer','Architect','Consultant','Specialist','Other'}, true));
        ensureField('Certification__c', fieldUrl('CredentialUrl__c','CredentialUrl'));

        System.debug('--- deployAll end ---');
    }

    // -------- Field builders --------
    private static String fieldText(String fullName, String label, Integer length) {
        return JSON.serialize(new Map<String,Object>{
            'FullName' => fullName,
            'Metadata' => new Map<String,Object>{ 'type' => 'Text', 'label' => label, 'length' => length }
        });
    }
    private static String fieldLongText(String fullName, String label, Integer length, Integer visibleLines, Boolean rich) {
        String t = rich ? 'Html' : 'TextArea';
        return JSON.serialize(new Map<String,Object>{
            'FullName' => fullName,
            'Metadata' => new Map<String,Object>{ 'type' => t, 'label' => label, 'length' => length, 'visibleLines' => visibleLines }
        });
    }
    private static String fieldCheckbox(String fullName, String label, Boolean defaultVal) {
        return JSON.serialize(new Map<String,Object>{
            'FullName' => fullName,
            'Metadata' => new Map<String,Object>{ 'type' => 'Checkbox', 'label' => label, 'defaultValue' => String.valueOf(defaultVal) }
        });
    }
    private static String fieldDate(String fullName, String label) {
        return JSON.serialize(new Map<String,Object>{
            'FullName' => fullName,
            'Metadata' => new Map<String,Object>{ 'type' => 'Date', 'label' => label }
        });
    }
    private static String fieldUrl(String fullName, String label) {
        return JSON.serialize(new Map<String,Object>{
            'FullName' => fullName,
            'Metadata' => new Map<String,Object>{ 'type' => 'Url', 'label' => label }
        });
    }
    private static String fieldEmail(String fullName, String label) {
        return JSON.serialize(new Map<String,Object>{
            'FullName' => fullName,
            'Metadata' => new Map<String,Object>{ 'type' => 'Email', 'label' => label }
        });
    }
    private static String fieldPhone(String fullName, String label) {
        return JSON.serialize(new Map<String,Object>{
            'FullName' => fullName,
            'Metadata' => new Map<String,Object>{ 'type' => 'Phone', 'label' => label }
        });
    }
    private static String fieldPicklist(String fullName, String label, List<String> values, Boolean restricted) {
        List<Object> entries = new List<Object>();
        for (String v : values) entries.add(new Map<String,Object>{ 'fullName' => v, 'default' => false, 'label' => v });
        return JSON.serialize(new Map<String,Object>{
            'FullName' => fullName,
            'Metadata' => new Map<String,Object>{
                'type' => 'Picklist',
                'label' => label,
                'valueSet' => new Map<String,Object>{
                    'valueSetDefinition' => new Map<String,Object>{ 'sorted' => false, 'value' => entries },
                    'restricted' => restricted
                }
            }
        });
    }

    // -------- Tooling helpers with diagnostics --------
    private static Map<String,Object> getJson(HttpResponse res) {
        try { return (Map<String,Object>) JSON.deserializeUntyped(res.getBody()); }
        catch (Exception e) { return new Map<String,Object>{ 'raw' => res.getBody() }; }
    }

    private static Boolean objectExists(String apiName) {
        String devName = apiName.removeEnd('__c');
        String q = 'SELECT Id FROM CustomObject WHERE DeveloperName = \'' + devName + '\'';
        HttpRequest req = new HttpRequest();
        req.setEndpoint(base() + '/services/data/' + API_VER + '/tooling/query/?q=' + EncodingUtil.urlEncode(q, 'UTF-8'));
        req.setMethod('GET'); auth(req);
        HttpResponse res = new Http().send(req);
        System.debug('objectExists(' + apiName + ') => ' + res.getStatus() + ' ' + res.getBody().left(300));
        if (res.getStatusCode() == 200) {
            Map<String,Object> body = getJson(res);
            Integer total = Integer.valueOf(String.valueOf(body.get('totalSize')));
            return total > 0;
        }
        return false;
    }

    private static Boolean fieldExists(String objectApi, String fieldFullName) {
        String fq = objectApi + '.' + fieldFullName; // e.g., Project__c.Impact__c
        String q = 'SELECT Id FROM CustomField WHERE FullName = \'' + fq + '\'';
        HttpRequest req = new HttpRequest();
        req.setEndpoint(base() + '/services/data/' + API_VER + '/tooling/query/?q=' + EncodingUtil.urlEncode(q, 'UTF-8'));
        req.setMethod('GET'); auth(req);
        HttpResponse res = new Http().send(req);
        System.debug('fieldExists(' + fq + ') => ' + res.getStatus() + ' ' + res.getBody().left(300));
        if (res.getStatusCode() == 200) {
            Map<String,Object> body = getJson(res);
            Integer total = Integer.valueOf(String.valueOf(body.get('totalSize')));
            return total > 0;
        }
        return false;
    }

    public static void ensureCustomObject(String apiName, String label, String pluralLabel, String nameFieldType) {
        if (objectExists(apiName)) { System.debug('✓ Object exists: ' + apiName); return; }
        Map<String,Object> payload = new Map<String,Object>{
            'FullName' => apiName,
            'Metadata' => new Map<String,Object>{
                'label' => label, 'pluralLabel' => pluralLabel, 'sharingModel' => 'ReadWrite',
                'nameField' => new Map<String,Object>{ 'type' => nameFieldType, 'label' => 'Name' },
                'deploymentStatus' => 'Deployed', 'enableActivities' => false, 'enableReports' => true
            }
        };
        HttpRequest req = new HttpRequest();
        req.setEndpoint(base() + '/services/data/' + API_VER + '/tooling/sobjects/CustomObject');
        req.setMethod('POST'); auth(req); req.setBody(JSON.serialize(payload));
        HttpResponse res = new Http().send(req);
        System.debug('createObject(' + apiName + ') => ' + res.getStatus() + ' ' + res.getBody().left(400));
        // do not throw; just log
    }

    public static void ensureField(String objectApi, String fieldMetadataJson) {
        Map<String,Object> parsed = (Map<String,Object>) JSON.deserializeUntyped(fieldMetadataJson);
        String fieldFullName = (String) parsed.get('FullName');
        if (fieldExists(objectApi, fieldFullName)) { System.debug('✓ Field exists: ' + objectApi + '.' + fieldFullName); return; }

        Map<String,Object> payload = new Map<String,Object>{
            'FullName' => objectApi + '.' + fieldFullName,
            'Metadata' => parsed.get('Metadata')
        };
        HttpRequest req = new HttpRequest();
        req.setEndpoint(base() + '/services/data/' + API_VER + '/tooling/sobjects/CustomField');
        req.setMethod('POST'); auth(req); req.setBody(JSON.serialize(payload));
        HttpResponse res = new Http().send(req);
        System.debug('createField(' + objectApi + '.' + fieldFullName + ') => ' + res.getStatus() + ' ' + res.getBody().left(400));
        // do not throw; just log
    }
}