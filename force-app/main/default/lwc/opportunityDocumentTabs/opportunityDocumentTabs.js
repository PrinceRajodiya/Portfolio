import { LightningElement, api, track } from 'lwc';
import getDocumentsByOpportunity from '@salesforce/apex/OpportunityDocumentTabsController.getDocumentsByOpportunity';

export default class OpportunityDocumentTabs extends LightningElement {
    @api recordId;
    @track resumeDocUrl;
    @track coverLetterDocUrl;
    @track certificateUrls = [];

    connectedCallback() {
        if (this.recordId) {
            getDocumentsByOpportunity({ opportunityId: this.recordId })
                .then(data => {
                    this.certificateUrls = [];
                    data.forEach(link => {
                        const doc = link.Application_Document__r;
                        const previewUrl = this.getGooglePreviewUrl(doc.Google_Doc_URL__c);
                        if (doc.Type__c?.toLowerCase() === 'resume') {
                            this.resumeDocUrl = previewUrl;
                        } else if ((doc.Type__c?.toLowerCase() === 'cover letter')) {
                            this.coverLetterDocUrl = previewUrl;
                        } else if (doc.Type__c?.toLowerCase() === 'certificate') {
                            this.certificateUrls.push(previewUrl);
                        }
                    });
                })
                .catch(error => {
                    console.error('Error loading documents', error);
                });
        }
    }

    getGooglePreviewUrl(fullUrl) {
        return fullUrl?.includes('pub?embedded=true') ? fullUrl : null;
    }    
}