import { LightningElement, api } from 'lwc';

export default class ExperienceSection extends LightningElement {
    /** Array<ExperienceDTO>
     * { id, company, role, startDate, endDate, isCurrent, responsibilities, keyAchievements }
     */
    @api experience = [];

    @api subtitle = 'My Resume';
    @api title = 'Working Experience';

    // ---------- View models ----------
    get items() {
        const src = Array.isArray(this.experience) ? this.experience : [];
        return src.map((x, i) => {
        const responsibilities = this.splitLines(x.responsibilities);
        const achievements     = this.splitLines(x.keyAchievements);

        return {
            key: x.id || `${i}`,
            containerClass: i % 2 === 0 ? 'timeline-item left' : 'timeline-item right',
            date: this.range(x.startDate, x.endDate, x.isCurrent),
            h2: x.role || '',
            h4: x.company || '',
            responsibilities,
            achievements,
            hasResponsibilities: responsibilities.length > 0,
            hasAchievements: achievements.length > 0
        };
        });
    }

    // ---------- Helpers ----------
    formatDate(d) {
        if (!d) return '';
        const dt = d instanceof Date ? d : new Date(d);
        if (isNaN(dt)) return '';
        return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(dt);
    }

    range(start, end, current) {
        const s = this.formatDate(start);
        const e = current ? 'Present' : this.formatDate(end);
        if (s && e) return `${s} - ${e}`;
        if (s) return s;
        if (e) return e;
        return '';
    }

    /**
     * Split a text block into tidy bullet points.
     * Supports newline-, semicolon- or bullet-separated text.
     */
    splitLines(text) {
        if (!text) return [];
        const raw = String(text)
        .replace(/\r\n/g, '\n')        // normalize line breaks
        .split(/\n|;|•|- /g)           // break on newline, semicolon, bullets, or "- "
        .map(s => s.trim())
        .filter(Boolean);

        // Merge lines that are only dashes/bullets etc.
        return raw.map(s => s.replace(/^[-•]\s*/, ''));
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
