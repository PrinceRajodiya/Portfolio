import { LightningElement, api, track } from 'lwc';

export default class PortfolioLeftNav extends LightningElement {
    @api profile;
    @track active = 'profile';

    tabs = [
        { key: 'profile', label: 'Profile' },
        { key: 'education', label: 'Education' },
        { key: 'experience', label: 'Experience' },
        { key: 'projects', label: 'Projects' },
        { key: 'skills', label: 'Skills' },
        { key: 'certificates', label: 'Certificates' },
        { key: 'contact', label: 'Contact' }
    ];

    get viewTabs() {
        return this.tabs.map(t => ({ ...t, cls: t.key === this.active ? 'tab active' : 'tab' }));
    }

    select(evt) {
        this.active = evt.currentTarget.dataset.key;
        this.dispatchEvent(new CustomEvent('tabselect', { detail: this.active }));
    }

    get initials() {
        const n = (this.profile && this.profile.name) ? this.profile.name : '';
        return n.split(/\s+/).filter(Boolean).map(p => p[0]).slice(0,2).join('').toUpperCase();
    }
}
