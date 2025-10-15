import { LightningElement } from 'lwc';

const LINKS = {
  GTU: 'https://drive.google.com/file/d/1KWPRS28FG9hlz-UxCwtrxbIgYf0DxJem/view?usp=drive_link',
  IIT: 'https://drive.google.com/file/d/1gcFSDHs5hi-wviGPtvv74xn4QO1YaEIF/view?usp=drive_link',
};

// Prefer the thumbnail domain (lh3.googleusercontent.com) for Salesforce
function driveToDirect(url, size = 1200) {
  const m = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  const id = m ? m[1] : '';
  return {
    primary: id ? `https://drive.google.com/thumbnail?id=${id}&sz=w${size}` : url, // fast + CSP-friendly
    fallback: id ? `https://drive.google.com/uc?export=view&id=${id}` : url,       // inline view
  };
}

export default class EducationSection extends LightningElement {
  education = [
    {
      id: 1,
      title: 'Bachelor of Engineering in Computer Engineering',
      school: 'Gujarat Technological University (GTU)',
      degree: 'Bachelor of Engineering',
      field: 'Computer Engineering',
      range: '2018 — 2022',
      location: 'Gujarat, India',
      driveUrl: LINKS.GTU,
      themeColor: '#0052CC',           // GTU Blue
      imagePosition: 'center center',  // adjust if you want
      imageFit: 'contain',             // contain shows full logo nicely
    },
    {
      id: 2,
      title: 'Master of Science in Computer Science',
      school: 'Illinois Institute of Technology (IIT)',
      degree: 'Master of Science',
      field: 'Computer Science',
      range: '2023 — Present',
      location: 'Chicago, USA',
      driveUrl: LINKS.IIT,
      themeColor: '#B60000',           // IIT Red
      imagePosition: 'center center',
      imageFit: 'contain',
    },
  ];

  get rows() {
    return this.education.map((r, i) => {
      const { primary, fallback } = driveToDirect(r.driveUrl);
      return {
        key: `edu-${i}`,
        ...r,
        imagePrimary: primary,
        imageFallback: fallback,
        cardTheme: `--theme-color:${r.themeColor};`,
        imgStyle: `object-fit:${r.imageFit || 'cover'};object-position:${r.imagePosition || 'center center'};`,
        btnPrimaryStyle: `background:#fff;color:${r.themeColor};box-shadow:0 8px 18px rgba(0,0,0,.15);`,
        btnSecondaryStyle: `background:linear-gradient(135deg,${r.themeColor},${this.shade(r.themeColor,-30)});color:#fff;box-shadow:0 8px 18px rgba(0,0,0,.25);`,
      };
    });
  }

  handleImgErr = (evt) => {
    const idx = Number(evt.target.dataset.index);
    const row = this.rows[idx];
    if (!row) return;
    if (evt.target.dataset.swapped === '1') return;
    evt.target.src = row.imageFallback;         // switch to uc? view if thumbnail blocked
    evt.target.dataset.swapped = '1';
  };

  shade(hex, percent) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    r = Math.min(255, Math.max(0, (r * (100 + percent)) / 100));
    g = Math.min(255, Math.max(0, (g * (100 + percent)) / 100));
    b = Math.min(255, Math.max(0, (b * (100 + percent)) / 100));
    return '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
  }

  _didInit = false;

  connectedCallback() {
    // (Optional) if you want to delay until next frame for ultra-smoothness
    // nothing required here for the basic load animation
  }

  renderedCallback() {
    if (this._didInit) return;
    this._didInit = true;

    // Mark the host as ready so CSS animations start (no layout thrash).
    // Use rAF to ensure the initial hidden state is painted first.
    requestAnimationFrame(() => {
      this.template.host.classList.add('ready');
    });
  }
}
