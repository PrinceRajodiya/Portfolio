import { LightningElement, api } from 'lwc';

export default class CertificationSection extends LightningElement {
  /**
   * Accepts array with any of these keys:
   * id/Id, name/Name, issuer/Issuer__c, type/Type__c,
   * issuedDate/Date__c, credentialUrl/Credential_URL__c
   */
  @api certificates = [];

  get items() {
    const src = Array.isArray(this.certificates) ? this.certificates : [];
    return src.map((c, i) => {
      const name   = c.Name ?? c.name ?? '';
      const issuer = c.Issuer__c ?? c.issuer ?? '';
      const type   = c.Type__c ?? c.type ?? '';
      const url    = c.Credential_URL__c ?? c.credentialUrl ?? '';
      const date   = this.fmt(c.Date__c ?? c.issuedDate);

      return {
        key: c.Id ?? c.id ?? `cert-${i}`,
        containerClass: i % 2 === 0 ? 'timeline-item left' : 'timeline-item right',
        date,
        h2: name,
        h4: type ? `${issuer} • ${type}` : issuer,
        body: '', // put extra notes here if you have any
        url
      };
    });
  }

  fmt(val) {
    if (!val) return '';
    const d = val instanceof Date ? val : new Date(val);
    if (Number.isNaN(d)) return '';
    return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(d);
  }

  observer;

    renderedCallback() {
        if (this.observer) return;

        this.observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('play');
            }
            });
        },
        { threshold: 0.2 }
        );

        this.template.querySelectorAll('.timeline-item').forEach((item) => {
        this.observer.observe(item);
        });
    }
    
}
