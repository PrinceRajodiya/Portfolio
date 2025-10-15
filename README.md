# 🌐 Salesforce Experience Cloud Portfolio Website

A **fully dynamic personal portfolio website** built on **Salesforce Experience Cloud**, showcasing my professional journey, education, experience, projects, and certifications — all fetched dynamically from Salesforce data models using Lightning Web Components (LWC) and Apex.

🔗 **Live Demo:** [Salesforce Experience Cloud Portfolio](https://orgfarm-3715d27de6-dev-ed.develop.my.site.com/princePortfolio)

---

## 🧠 Overview

This project demonstrates how to leverage **Salesforce Experience Cloud** to build a **personalized, data-driven portfolio** powered entirely by Salesforce backend logic.  
The content — Profile, Education, Experience, Skills, Projects, and Certificates — is fetched dynamically from Salesforce records and displayed using reusable LWC components.

The site is mobile responsive, guest-accessible, and designed with modern UI/UX principles.  
It serves as both a **personal branding website** and a **Salesforce technical showcase**.

---

## 🚀 Key Features

✅ **Built 100% on Salesforce Experience Cloud**  
✅ **Dynamic Content Rendering** using Apex SOQL queries  
✅ **Custom Lightning Web Components** for each section  
✅ **Integrated Resume, LinkedIn & Trailhead links**  
✅ **Secure guest access** via Site Guest User permissions  
✅ **Modern responsive design** with smooth animations  

---

## 🧩 Tech Stack

| Layer | Technology Used |
|-------|------------------|
| Frontend | Lightning Web Components (LWC), HTML, CSS |
| Backend | Apex Controllers, SOQL |
| Platform | Salesforce Experience Cloud |
| Data | Salesforce Custom & Standard Objects |
| UI | Responsive Grid, Flexbox, CSS Animations |

---

## 🧱 Architecture

```
Experience Cloud Site: princePortfolio
│
├── Lightning Web Components
│   ├── portfolioShell          # Main layout component
│   ├── profileSection          # Shows profile summary, photo, resume links
│   ├── educationSection        # Education timeline
│   ├── experienceSection       # Work experience cards
│   ├── projectSection          # Portfolio projects gallery
│   ├── skillSection            # Skills grid with animations
│   ├── certificateSection      # Certifications carousel
│   └── contactSection          # Contact form + links
│
├── Apex Controllers
│   ├── PortfolioService.cls    # Fetches records from Salesforce
│
└── Salesforce Data Models
    ├── Profile__c
    ├── Education__c
    ├── Experience__c
    ├── Project__c
    ├── Skill__c
    └── Certificate__c
```

---

## ⚙️ Setup Instructions

### 1. Prerequisites
- Salesforce Developer Org
- Enabled **Experience Cloud Sites**
- Salesforce CLI (for deployment)
- Access to **LWC & Apex development tools**

### 2. Clone the Repository

```bash
git clone https://github.com/PrinceRajodiya/Portfolio.git
cd salesforce-experience-portfolio
```

### 3. Deploy to Salesforce

If using Salesforce CLI:

```bash
sfdx force:source:deploy -p force-app/main/default
```

Or manually copy the LWC and Apex code into your **Developer Console**.

### 4. Configure Guest Access

1. Go to **Setup → Digital Experiences → All Sites → Workspaces → Administration → Members**
2. Add **Guest User** profile.
3. Grant **read access** to `Profile__c`, `Experience__c`, `Education__c`, etc.
4. Make Apex class `PortfolioService` accessible to Guest Users.

### 5. Publish the Site
- From Experience Builder → **Publish**
- Share your live site URL

---

## 🎨 UI Highlights

- **Animated Hero Section** with typewriter effect  
- **Glassmorphism cards** for education & experience  
- **Hover transitions** on project cards  
- **Dynamic skill grid** based on category  
- **Contact section** with embedded form and social links  

---

## 🧑‍💻 Author

**Prince Rajodiya**  
🎓 M.S. Computer Science @ Illinois Institute of Technology  
💼 Salesforce & Full Stack Developer  

🔗 [LinkedIn](https://www.linkedin.com/in/princerajodiya)  
🧭 [Trailhead](https://trailblazer.me/id/princerajodiya)  
💻 [Portfolio Live](https://orgfarm-3715d27de6-dev-ed.develop.my.site.com/princePortfolio)

---

## 🪪 License

This project is licensed under the **MIT License** — feel free to fork, modify, and use for your own Salesforce portfolio projects.

---

⭐ **If you found this project inspiring, please give it a star on GitHub!**
