import { LightningElement, api, track } from 'lwc';
import PIC from '@salesforce/resourceUrl/YourProfilePic';

export default class PortfolioRightContent extends LightningElement {
    @track _selectedTab = 'profile';
    @api
    get selectedTab() { return this._selectedTab; }
    set selectedTab(v) { this._selectedTab = (v || 'experience'); }

    @api profile;
    @api education = [];
    @api experience = [];
    @api projects = [];
    @api skills = [];
    @api certificates = [];
    @api error;

    renderedCallback() {
    // runs on each render; fine for a one-time check
    // eslint-disable-next-line no-console
    console.log('projects length (right content):', Array.isArray(this.projects) ? this.projects.length : 'not array');
    }

    get resumeUrl() { return 'https://drive.google.com/file/d/1TjAb8THuG9o_N4gCuDaU6onTmS7wbWYL/view?usp=sharing'; }
    get profilePhotoUrl() { try { return PIC; } catch { return ''; } }

    handleOpenContact() {
        this.selectedTab = 'contact';           // still update local
        this.dispatchEvent(
            new CustomEvent('tabchange', {
            detail: 'contact', bubbles: true, composed: true
            })
        );
    }


    get hasExperience() { return Array.isArray(this.experience) && this.experience.length > 0; }

    get isProfile()      { return this._selectedTab === 'profile'; }
    get isEducation()    { return this._selectedTab === 'education'; }
    get isExperience()   { return this._selectedTab === 'experience'; }
    get isProjects()     { return this._selectedTab === 'projects'; }
    get isSkills()       { return this._selectedTab === 'skills'; }
    get isCertificates() { return this._selectedTab === 'certificates'; }
    get isContact()      { return this._selectedTab === 'contact'; }
}
