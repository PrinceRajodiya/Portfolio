import { LightningElement, wire, track } from 'lwc';
import getPortfolio from '@salesforce/apex/PortfolioService.getPortfolio';
import BG from '@salesforce/resourceUrl/PortfolioBg';

export default class PortfolioShell extends LightningElement {
  @track selectedTab = 'profile';
  @track isMenuOpen = false;           // mobile drawer state
  data;
  error;

  mql; // matchMedia listener for <1200px

  @wire(getPortfolio, { publishedOnly: true, projectLimit: 12 })
  wiredPortfolio({ data, error }) {
    if (data) { this.data = data; this.error = undefined; }
    if (error) { this.error = error; this.data = undefined; }
  }

  handleTabChange(event) {
    this.selectedTab = event.detail; // ensures left tab highlight syncs
  }

  connectedCallback() {
    this.mql = window.matchMedia('(max-width: 1200px)');
    this._onMedia = () => { if (!this.mql.matches) this.isMenuOpen = false; };
    if (this.mql.addEventListener) this.mql.addEventListener('change', this._onMedia);
    else this.mql.addListener(this._onMedia);

    this._esc = (e) => { if (e.key === 'Escape' && this.isMenuOpen) this.closeMenu(); };
    window.addEventListener('keydown', this._esc);
  }
  disconnectedCallback() {
    if (this.mql) {
      if (this.mql.removeEventListener) this.mql.removeEventListener('change', this._onMedia);
      else this.mql.removeListener(this._onMedia);
    }
    window.removeEventListener('keydown', this._esc);
  }

  // Background image
  get wrapStyle() {
    return `background-image:url('${BG}');
            background-position:center;
            background-size:cover;
            background-repeat:no-repeat;`;
  }

  // Layout helpers
  get isReady() { return !!(this.data && this.data.profile); }
  get profile()      { return this.data ? this.data.profile      : null; }
  get education()    { return this.data ? this.data.education    : []; }
  get experience()   { return this.data ? this.data.experience   : []; }
  get projects()     { return this.data ? this.data.projects     : []; }
  get skills()       { return this.data ? this.data.skills       : []; }
  get certificates() { return this.data ? this.data.certificates : []; }

  // Classes/ARIA for drawer
  get containerClass() { return `container${this.isMenuOpen ? ' is-dimmed' : ''}`; }
  get leftClass()      { return `left glass${this.isMenuOpen ? ' is-open' : ''}`; }
  get leftAriaHidden() { return this._isMobile() ? String(!this.isMenuOpen) : 'false'; }
  get isMenuOpenString(){ return String(this.isMenuOpen); }

  toggleMenu = () => { if (this._isMobile()) this.isMenuOpen = !this.isMenuOpen; };
  closeMenu  = () => { if (this._isMobile()) this.isMenuOpen = false; };

  handleTabSelect = (evt) => {
    this.selectedTab = evt.detail;
    // Auto-close drawer after selection on mobile
    if (this._isMobile()) this.isMenuOpen = false;
  };

  _isMobile() { return window.matchMedia('(max-width: 1200px)').matches; }

  // (kept from your original; not used in template here but harmless)
  get experienceYears() {
    try {
      const items = this.experience || [];
      if (!items.length) return null;
      const earliest = items
        .map(x => new Date(x.startDate))
        .filter(d => !isNaN(d))
        .sort((a,b) => a - b)[0];
      if (!earliest) return null;
      const years = (Date.now() - earliest.getTime()) / (1000*60*60*24*365.25);
      return Math.max(1, Math.round(years));
    } catch(e) { return null; }
  }
}
