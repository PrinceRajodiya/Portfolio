import { LightningElement, api } from 'lwc';

export default class SkillsSection extends LightningElement {
    @api skills = [];
    _ioInit = false;

    get hasGroups() {
        return this.groups.length > 0;
    }

    get groups() {
        const src = Array.isArray(this.skills) ? this.skills : [];
        if (!src.length) return [];

        // Normalize
        const rows = src.map((r, i) => {
        const name = r.name ?? r.Name ?? '';
        const category = r.category ?? r.Category ?? 'Other';
        const level = r.level ?? r.Level ?? '';
        return {
            key: r.id ?? r.Id ?? `s-${i}`,
            name,
            category,
            level,
            title: level ? `${name} — ${level}` : name
        };
        }).filter(x => x.name);

        // Group by category
        const map = new Map();
        rows.forEach(x => {
        const key = x.category || 'Other';
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(x);
        });

        // Sort within a category
        for (const [k, arr] of map) {
        arr.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
        map.set(k, arr);
        }

        // Category ordering
        const weight = (k) => {
        const key = (k || '').toLowerCase();
        if (key === 'featured') return 0;
        if (key === 'languages') return 1;
        if (key === 'frontend') return 2;
        if (key === 'backend') return 3;
        return 10;
        };

        const sortedCats = [...map.keys()].sort((a, b) => {
        const wa = weight(a), wb = weight(b);
        return wa === wb ? a.localeCompare(b) : wa - wb;
        });

        // Build groups; each item uses 'tile' class now
        return sortedCats.map((cat, i) => ({
        key: `cat-${i}`,
        label: cat,
        items: map.get(cat).map(x => ({
            ...x,
            cls: '',            // optional category marker if you want
            clsFull: 'tile'     // important: square tile class
        }))
        }));
    }

    renderedCallback() {
        if (this._ioInit) return;
        this._ioInit = true;

        const tiles = this.template.querySelectorAll('.tile');
        if (!tiles.length) return;

        // Stagger little delays for a pleasant cascade
        tiles.forEach((t, i) => {
            t.style.setProperty('--reveal-delay', `${Math.min(i * 70, 700)}ms`);
        });

        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('in');
                io.unobserve(e.target);
            }
            });
        }, { root: null, threshold: 0.15 });

        tiles.forEach(t => io.observe(t));
    }
}
