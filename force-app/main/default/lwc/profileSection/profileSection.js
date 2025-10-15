import { LightningElement, api, track } from 'lwc';

export default class ProfileSection extends LightningElement {
  /** Optional inputs from parent */
    @api photoUrl = '';
    @api contactUrl = '';
    @api profile;
    @api resumeUrl;

    // allow passing name directly OR via profile.name
    _name;
    @api
    get name() {                  // <-- this is what your template uses: {name}
        return this._name ?? (this.profile?.name || '');
    }
    set name(v) {
        this._name = v;
    }

    // typed state
    @track typedText = '';
    _timer;
    _isReduced = false;

    // parsed roles
    _roles = [];
    _roleIndex = 0;
    _charIndex = 0;
    _deleting = false;

    get contactHref() { return this.contactUrl || '#'; }

    // Fallback avatar initials
    get initials() {
        const n = this.name?.trim();
        if (n) return n.split(/\s+/).map(w => w[0]).slice(0,2).join('').toUpperCase();
        const t = (this._roles[0] || '').trim();
        return t ? t.split(/\s+/).map(w => w[0]).slice(0,2).join('').toUpperCase() : 'ME';
    }

    get hasProfile() {
        // render when we at least have a name or something to show
        return Boolean(this.name || this.photoUrl || this.resumeUrl || this.contactUrl);
    }

    connectedCallback() {
        this._isReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches || false;
    }

    renderedCallback() {
        // Parse roles from the hidden source only once
        if (!this._roles.length) {
        const src = this.template.querySelector('.roles-src');
        if (src) {
            const text = (src.textContent || '').trim();
            this._roles = text.split(',').map(s => s.trim()).filter(Boolean);
            if (!this._roles.length) this._roles = ['Salesforce Developer'];
        }
        }

        // Start typewriter once
        if (!this._timer && this._roles.length) {
        if (this._isReduced) {
            this.typedText = this._roles[0];
            return;
        }
        this._startTypeLoop();
        }
    }

    disconnectedCallback() {
        clearTimeout(this._timer);
    }

    goToContact() {
        // Dispatch a custom event the parent listens to
        this.dispatchEvent(new CustomEvent('opencontact'));
    }

    _startTypeLoop() {
        const typeSpeed = 65;     // ms per char when typing
        const deleteSpeed = 42;   // ms per char when deleting
        const holdTime = 1100;    // ms to hold fully-typed word
        const gapTime = 220;      // ms gap before next word begins

        const tick = () => {
        const roles = this._roles.length ? this._roles : ['Role'];
        const current = roles[this._roleIndex % roles.length];

        if (!this._deleting && this._charIndex < current.length) {
            this.typedText = current.slice(0, this._charIndex + 1);
            this._charIndex++;
            this._timer = setTimeout(tick, typeSpeed);
            return;
        }

        if (!this._deleting && this._charIndex === current.length) {
            this._deleting = true;
            this._timer = setTimeout(tick, holdTime);
            return;
        }

        if (this._deleting && this._charIndex > 0) {
            this.typedText = current.slice(0, this._charIndex - 1);
            this._charIndex--;
            this._timer = setTimeout(tick, deleteSpeed);
            return;
        }

        if (this._deleting && this._charIndex === 0) {
            this._deleting = false;
            this._roleIndex = (this._roleIndex + 1) % roles.length;
            this._timer = setTimeout(tick, gapTime);
        }
        };

        tick();
    }
}
