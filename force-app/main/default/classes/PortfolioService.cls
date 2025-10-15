public without sharing class PortfolioService {

    // ---- DTOs returned to LWC ----
    public class ProfileDTO {
        @AuraEnabled public Id id;
        @AuraEnabled public String name;
        @AuraEnabled public String headline;
        @AuraEnabled public String summary;
        @AuraEnabled public String email;
        @AuraEnabled public String phone;
        @AuraEnabled public String location;
        @AuraEnabled public String linkedin;
    }
    public class EducationDTO {
        @AuraEnabled public Id id;
        @AuraEnabled public String name;
        @AuraEnabled public String school;
        @AuraEnabled public String degree;
        @AuraEnabled public String field;
        @AuraEnabled public Date startDate;
        @AuraEnabled public Date endDate;
        @AuraEnabled public String location;
    }
    public class ExperienceDTO {
        @AuraEnabled public Id id;
        @AuraEnabled public String name;
        @AuraEnabled public String company;
        @AuraEnabled public String role;
        @AuraEnabled public Date startDate;
        @AuraEnabled public Date endDate;
        @AuraEnabled public Boolean isCurrent;
        @AuraEnabled public String responsibilities;
        @AuraEnabled public String keyAchievements;
    }
    public class ProjectDTO {
        @AuraEnabled public Id id;
        @AuraEnabled public String name;
        @AuraEnabled public String techStack;
        @AuraEnabled public String description;
        @AuraEnabled public String impact;
        @AuraEnabled public String githubUrl;
        @AuraEnabled public Date startDate;
        @AuraEnabled public Date endDate;
        @AuraEnabled public String thumbnailUrl;
    }
    public class SkillDTO {
        @AuraEnabled public Id id;
        @AuraEnabled public String name;
        @AuraEnabled public String category;
        @AuraEnabled public String level;
    }
    public class CertificateDTO {
        @AuraEnabled public Id id;
        @AuraEnabled public String name;
        @AuraEnabled public String issuer;
        @AuraEnabled public Date issuedDate;
        @AuraEnabled public String type;
        @AuraEnabled public String credentialUrl;
    }
    public class PortfolioDTO {
        @AuraEnabled public ProfileDTO profile;
        @AuraEnabled public List<EducationDTO> education;
        @AuraEnabled public List<ExperienceDTO> experience;
        @AuraEnabled public List<ProjectDTO> projects;
        @AuraEnabled public List<SkillDTO> skills;
        @AuraEnabled public List<CertificateDTO> certificates;
    }

    // ---- Helpers (FLS-safe mapping) ----
    private static List<SObject> scrub(List<SObject> rows) {
        // Read-level FLS enforcement
        return (List<SObject>) Security.stripInaccessible(
            AccessType.READABLE,
            rows
        ).getRecords();
    }
    private static SObject scrubOne(SObject row) {
        List<SObject> r = new List<SObject>();
        if (row != null) r.add(row);
        List<SObject> out = scrub(r);
        return out.isEmpty() ? null : out[0];
    }

    // ---- Public API (call from LWC) ----
    @AuraEnabled(cacheable=true)
    public static ProfileDTO getProfile() {
        List<Profile__c> q = [
            SELECT Id, Name, Headline__c, Summary__c, Email__c, Phone__c, Location__c, LinkedIn__c
            FROM Profile__c
            ORDER BY LastModifiedDate DESC
            LIMIT 1
        ];
        if (q.isEmpty()) return null;
        Profile__c p = (Profile__c) scrubOne(q[0]);
        if (p == null) return null;

        ProfileDTO dto = new ProfileDTO();
        dto.id = p.Id; dto.name = p.Name; dto.headline = p.Headline__c; dto.summary = p.Summary__c;
        dto.email = p.Email__c; dto.phone = p.Phone__c; dto.location = p.Location__c; dto.linkedin = p.LinkedIn__c;
        return dto;
    }

    @AuraEnabled(cacheable=true)
    public static List<EducationDTO> getEducation() {
        List<Education__c> q = [
            SELECT Id, Name, School__c, Degree__c, Field__c, Start_Date__c, End_Date__c, Location__c
            FROM Education__c
            ORDER BY Start_Date__c DESC NULLS LAST, End_Date__c DESC NULLS LAST
            LIMIT 100
        ];
        // upcast -> scrub -> downcast
        List<SObject> tmp = new List<SObject>(); tmp.addAll(q);
        List<SObject> cleaned = scrub(tmp);
        List<Education__c> safe = new List<Education__c>();
        for (SObject so : cleaned) safe.add((Education__c)so);

        List<EducationDTO> out = new List<EducationDTO>();
        for (Education__c e : safe) {
            EducationDTO d = new EducationDTO();
            d.id=e.Id; d.name=e.Name; d.school=e.School__c; d.degree=e.Degree__c; d.field=e.Field__c;
            d.startDate=e.Start_Date__c; d.endDate=e.End_Date__c; d.location=e.Location__c;
            out.add(d);
        }
        return out;
    }

    @AuraEnabled(cacheable=true)
    public static List<ExperienceDTO> getExperiences() {
        List<Experience__c> q = [
            SELECT Id, Name, Company__c, Role__c, Start_Date__c, End_Date__c, Is_Current__c,
                Responsibilities__c, Key_Achievements__c
            FROM Experience__c
            ORDER BY Is_Current__c DESC, Start_Date__c DESC NULLS LAST
            LIMIT 200
        ];
        List<SObject> tmp = new List<SObject>(); tmp.addAll(q);
        List<SObject> cleaned = scrub(tmp);
        List<Experience__c> safe = new List<Experience__c>();
        for (SObject so : cleaned) safe.add((Experience__c)so);

        List<ExperienceDTO> out = new List<ExperienceDTO>();
        for (Experience__c x : safe) {
            ExperienceDTO d = new ExperienceDTO();
            d.id=x.Id; d.name=x.Name; d.company=x.Company__c; d.role=x.Role__c;
            d.startDate=x.Start_Date__c; d.endDate=x.End_Date__c; d.isCurrent=x.Is_Current__c;
            d.responsibilities=x.Responsibilities__c; d.keyAchievements=x.Key_Achievements__c;
            out.add(d);
        }
        return out;
    }

    @AuraEnabled(cacheable=true)
    public static List<ProjectDTO> getProjects(Integer limitSize) {
        System.debug('### Running user: ' + UserInfo.getUserName());
        if (limitSize == null || limitSize <= 0 || limitSize > 200) limitSize = 50;

        List<Project__c> q = [
            SELECT Id, Name, Tech_Stack__c, Description__c, Impact__c,
                GitHub_URL__c, Start_Date__c, End_Date__c, Thumbnail_URL__c
            FROM Project__c
            ORDER BY Start_Date__c DESC NULLS LAST
            LIMIT :limitSize
        ];
        List<SObject> tmp = new List<SObject>(); tmp.addAll(q);
        List<SObject> cleaned = scrub(tmp);
        List<Project__c> safe = new List<Project__c>();
        for (SObject so : cleaned) safe.add((Project__c)so);

        List<ProjectDTO> out = new List<ProjectDTO>();
        for (Project__c p : safe) {
            ProjectDTO d = new ProjectDTO();
            d.id=p.Id; d.name=p.Name; d.techStack=p.Tech_Stack__c; d.description=p.Description__c; d.impact=p.Impact__c;
            d.githubUrl=p.GitHub_URL__c; d.startDate=p.Start_Date__c; d.endDate=p.End_Date__c;
            d.thumbnailUrl=p.Thumbnail_URL__c;
            out.add(d);
        }
        return out;
    }

    @AuraEnabled(cacheable=true)
    public static List<SkillDTO> getSkills() {
        List<Skill__c> q = [
            SELECT Id, Name, Category__c, Level__c
            FROM Skill__c
            ORDER BY Category__c, Name
            LIMIT 300
        ];
        List<SObject> tmp = new List<SObject>(); tmp.addAll(q);
        List<SObject> cleaned = scrub(tmp);
        List<Skill__c> safe = new List<Skill__c>();
        for (SObject so : cleaned) safe.add((Skill__c)so);

        List<SkillDTO> out = new List<SkillDTO>();
        for (Skill__c s : safe) {
            SkillDTO d = new SkillDTO();
            d.id=s.Id; d.name=s.Name; d.category=s.Category__c; d.level=s.Level__c;
            out.add(d);
        }
        return out;
    }

    @AuraEnabled(cacheable=true)
    public static List<CertificateDTO> getCertificates() {
        List<CertificateDTO> out = new List<CertificateDTO>();
        try {
            List<Certificate__c> q = [
                SELECT Id, Name, Issuer__c, Date__c, Type__c, Credential_URL__c
                FROM Certificate__c
                ORDER BY Date__c DESC NULLS LAST, Name
                LIMIT 200
            ];
            List<SObject> certS = new List<SObject>(); certS.addAll(q);
            List<Certificate__c> safe = (List<Certificate__c>) scrub(certS);

            for (Certificate__c c : safe) {
                CertificateDTO d = new CertificateDTO();
                d.id           = c.Id;
                d.name         = c.Name;
                d.issuer       = c.Issuer__c;
                d.issuedDate   = c.Date__c;
                d.type         = c.Type__c;
                d.credentialUrl= c.Credential_URL__c;
                out.add(d);
            }
        } catch (Exception e) {
            // Optional: swallow error if object/fields missing
        }
        return out;
    }


    // ---- One-shot fetch: everything at once (fewer round trips) ----
    @AuraEnabled(cacheable=true)
    public static PortfolioDTO getPortfolio(Boolean publishedOnly, Integer projectLimit) {
        if (projectLimit == null || projectLimit <= 0 || projectLimit > 200) projectLimit = 50;

        PortfolioDTO r = new PortfolioDTO();
        r.profile        = getProfile();
        r.education      = getEducation();
        r.experience     = getExperiences();
        r.projects       = getProjects(projectLimit);
        r.skills         = getSkills();
        r.certificates = getCertificates();
        return r;
    }

}
