import { LightningElement, track } from 'lwc';
import getDocumentsByType from '@salesforce/apex/JobApplicationDocumentController.getDocumentsByType';
import createOpportunityAndLinkDocuments from '@salesforce/apex/JobApplicationDocumentController.createOpportunityAndLinkDocuments';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class JobApplicationWithDocuments extends LightningElement {
    @track jobTitle = '';
    @track companyName = '';
    @track applicationDate = '';
    @track location = '';
    @track pay = '';
    @track jobDescription = '';
    @track stage = '';
    @track selectedResumeId = '';
    @track selectedCoverLetterId = '';
    @track selectedCertificateIds = [];

    resumeOptions = [];
    coverLetterOptions = [];
    certificateOptions = [];

    get stageOptions() {
        return [
            { label: 'Applied', value: 'Applied' },
            { label: 'Interviewing', value: 'Interviewing' },
            { label: 'Offer Received', value: 'Offer Received' },
            { label: 'Rejected', value: 'Rejected' }
        ];
    }

    connectedCallback() {
        this.loadDocuments();
    }

    loadDocuments() {
        getDocumentsByType({ type: 'Resume' })
            .then(data => {
                this.resumeOptions = data.map(doc => ({ label: doc.Name, value: doc.Id }));
            });
        getDocumentsByType({ type: 'Cover Letter' })
            .then(data => {
                this.coverLetterOptions = data.map(doc => ({ label: doc.Name, value: doc.Id }));
            });
        getDocumentsByType({ type: 'Certificate' })
            .then(data => {
                this.certificateOptions = data.map(doc => ({ label: doc.Name, value: doc.Id }));
            });
    }

    handleChange(event) {
        const { name, value } = event.target;
        this[name] = value;
    }

    handleSubmit() {
        const selectedDocumentIds = [
            this.selectedResumeId,
            this.selectedCoverLetterId,
            ...this.selectedCertificateIds
        ].filter(Boolean);

        createOpportunityAndLinkDocuments({
            jobTitle: this.jobTitle,
            companyName: this.companyName,
            applicationDate: this.applicationDate,
            location: this.location,
            pay: this.pay,
            jobDescription: this.jobDescription,
            stage: this.stage,
            documentIds: selectedDocumentIds
        }).then(result => {
            this.showToast('Success', 'Opportunity created and documents linked!', 'success');
            this.resetForm();
            this.loadDocuments(); // Refresh picklists if needed
        }).catch(error => {
            console.error(error);
            this.showToast('Error', error.body.message, 'error');
        });
    }

    @track showForm = true;
    resetForm() {
        this.jobTitle = '';
        this.companyName = '';
        this.applicationDate = '';
        this.location = '';
        this.pay = '';
        this.jobDescription = '';
        this.stage = '';
        this.selectedResumeId = '';
        this.selectedCoverLetterId = '';
        this.selectedCertificateIds = [];

        // Force re-render
        this.showForm = false;
        setTimeout(() => {
            this.showForm = true;
        }, 10);
    }

    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message,
                variant: variant,
            })
        );
    }
}
