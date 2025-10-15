import { LightningElement, api, track } from 'lwc';

export default class ProjectSection extends LightningElement {
  // ---------- Input data ----------
  _projects = [];
  @api
  get projects() { return this._projects; }
  set projects(v) {
    this._projects = Array.isArray(v) ? v : [];
    // Reset open state whenever dataset changes
    this.expandedIndex = this.openFirst ? 0 : -1;
    if (!this.openFirst) this._openSet.clear();
  }

  // ---------- Public boolean props (default FALSE as requested) ----------
  _openFirst = false;   // do NOT open anything by default
  _multiOpen = false;   // single-open behavior by default

  @api
  get openFirst() { return this._openFirst; }
  set openFirst(v) { this._openFirst = this._coerceBool(v, false); }

  @api
  get multiOpen() { return this._multiOpen; }
  set multiOpen(v) { this._multiOpen = this._coerceBool(v, false); }

  // ---------- State ----------
  @track expandedIndex = -1;  // -1 = all collapsed
  _openSet = new Set();       // used when multiOpen = true

  // ---------- Derived ----------
  get hasProjects() { return (this._projects?.length ?? 0) > 0; }

  // ---------- View models ----------
  get rows() {
    const src = this._projects || [];
    return src.map((p, i) => {
      const get = (...ks) => { for (const k of ks) if (p[k] !== undefined && p[k] !== null) return p[k]; return null; };

      const name        = get('Name', 'name') || `Project ${i + 1}`;
      const description = get('Description', 'description', 'Description__c') || '';

      const techRaw = get('TechStack', 'techStack', 'Tech_Stack__c') || '';
      const tech    = String(techRaw).split(',').map(s => s.trim()).filter(Boolean);

      const startRaw = get('StartDate', 'startDate', 'Start_Date__c');
      const endRaw   = get('EndDate',   'endDate',   'End_Date__c');
      const start    = this.fmt(startRaw) || '—';
      const end      = this.fmt(endRaw)   || 'Ongoing';
      const dateRange= `${start} — ${end}`;

      const impactText   = get('Impact', 'impact', 'Impact__c') || '';
      const lines        = String(impactText).split('\n').map(s => s.trim()).filter(Boolean);
      const impactIsList = lines.length > 1 || (lines[0]?.startsWith('-') ?? false);
      const impactList   = lines.map(l => l.replace(/^[-•]\s?/, ''));
      const hasImpact    = Boolean(impactText && impactText.trim());

      const github       = get('githubUrl', 'GitHub_URL__c') || '';

      const isOpen = this.multiOpen ? this._openSet.has(i) : (this.expandedIndex === i);

      return {
        key: p.id || p.Id || `proj-${i}`,
        name, description, tech, dateRange, hasImpact, impactIsList, impactList, impactText, github,
        paneClass: `pane glass${isOpen ? ' is-open' : ''}`,
        ariaExpanded: String(isOpen)
      };
    });
  }

  // ---------- Handlers ----------
  handleToggle = (e) => {
    const i = Number(e.currentTarget.dataset.index);
    if (Number.isNaN(i)) return;

    if (this.multiOpen) {
      if (this._openSet.has(i)) {
        this._openSet.delete(i);
        this._collapseAt(i);
      } else {
        this._openSet.add(i);
        Promise.resolve().then(() => this._expandAt(i));
      }
      // trigger rows recompute
      this.expandedIndex = this.expandedIndex;
      return;
    }

    const old = this.expandedIndex;
    if (i === old) {
      this._collapseAt(i);
      this.expandedIndex = -1;
    } else {
      if (old >= 0) this._collapseAt(old);
      this.expandedIndex = i;
      Promise.resolve().then(() => this._expandAt(i));
    }
  };

  // ---------- DOM helpers ----------
  _panelByIndex(i) { return this.template.querySelector(`.panel[data-index="${i}"]`); }

  _collapseAt(i) {
    const panel = this._panelByIndex(i);
    if (!panel) return;
    panel.style.maxHeight = panel.scrollHeight + 'px';
    requestAnimationFrame(() => {
      panel.style.maxHeight = '0px';
      panel.style.opacity   = '0';
      panel.style.transform = 'translateY(-4px)';
    });
  }

  _expandAt(i) {
    const panel = this._panelByIndex(i);
    if (!panel) return;
    const h = panel.scrollHeight;
    panel.style.maxHeight = h + 'px';
    panel.style.opacity   = '1';
    panel.style.transform = 'none';
  }

  renderedCallback() {
    const panels = this.template.querySelectorAll('.panel');
    panels.forEach((p, idx) => {
      const isOpen = this.multiOpen ? this._openSet.has(idx) : (idx === this.expandedIndex);
      if (isOpen) {
        p.style.maxHeight = p.scrollHeight + 'px';
        p.style.opacity   = '1';
        p.style.transform = 'none';
      } else {
        p.style.maxHeight = '0px';
        p.style.opacity   = '0';
        p.style.transform = 'translateY(-4px)';
      }
    });

    if (this._didEntrance) return;
    this._didEntrance = true;

    // ensure first paint applies the hidden state, then start animations
    requestAnimationFrame(() => {
      this.template.host.classList.add('ready');
    });
  }

  // ---------- Utils ----------
  _coerceBool(v, def=false) {
    if (v === true || v === false) return v;
    if (typeof v === 'string') return v.toLowerCase() === 'true';
    return def;
  }

  fmt(val) {
    if (!val) return '';
    const d = val instanceof Date ? val : new Date(val);
    if (Number.isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(d);
  }
}
