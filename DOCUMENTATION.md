# 📖 Portfolio Documentation

A simple, easy-to-understand guide to your portfolio project.

---

## 📁 Project Structure

```
portfolio/
├── public/                  # Static files (favicon, robots.txt)
├── src/
│   ├── components/          # All React components (explained below)
│   ├── App.tsx              # Main app — loads all sections in order
│   ├── main.tsx             # Entry point — renders <App />
│   └── index.css            # Global styles, colors, fonts, animations
├── index.html               # HTML shell (title, fonts, favicon)
├── package.json             # Dependencies and scripts
├── tailwind.config.ts       # Tailwind CSS configuration (v4)
├── tsconfig.json            # TypeScript settings
└── vite.config.ts           # Vite bundler settings
```

---

## 🧩 Components Guide

Each file in `src/components/` is a self-contained section of your site:

| Component | What It Does |
|---|---|
| **Navbar.tsx** | Floating pill navigation (desktop) + hamburger menu (mobile). Has scroll-spy to highlight the active section. |
| **Hero.tsx** | The big landing area — your name with the "Antigravity" text reveal animation, stats counters, and a CTA button. |
| **About.tsx** | Three bento-box cards: a headline statement, "What I Do" list, and "Background" paragraph. |
| **Experience.tsx** | Work timeline with S&P Global roles. Cards have a timeline dot, role details, and bullet points. |
| **Skills.tsx** | Two-row infinite scrolling marquee of tech skill icons (React, Java, Docker, etc.). |
| **Education.tsx** | Three cards showing your degree, higher secondary, and school. Each has a CGPA score. |
| **Contact.tsx** | Left card with email/location/social links + right card with a contact form (powered by FormSubmit). |

### ✨ Reusable / Utility Components

| Component | What It Does |
|---|---|
| **TiltCard.tsx** | Wraps any content in a 3D tilt effect that follows your mouse. Used by About, Experience, Education, Contact, Skills. |
| **AntigravityText.tsx** | The staggered letter-by-letter text reveal in the Hero section. Each letter drops in with blur → sharp. |
| **AnimatedCounter.tsx** | Counts from 0 to a target number (e.g., 0 → 2 for "2+ Years"). Used in the Hero stats. |
| **CanvasParticles.tsx** | The interactive starfield background. A custom Canvas API animation with mouse parallax. |
| **Skeleton.tsx** | Shimmer loading placeholder that shows before the real content loads (1.2 seconds). |
| **Cursor.tsx** | Custom cursor that follows your mouse. Only visible on desktop. |

---

## 🎨 How to Customize

### Change Your Name / Info
- **Hero heading**: Edit `src/components/Hero.tsx` — look for the `AntigravityText` component and change "Engineering"
- **Stats numbers**: In `Hero.tsx`, modify the `AnimatedCounter` values (years, projects, etc.)
- **About text**: Edit `src/components/About.tsx` — update the cards' text directly
- **Experience roles**: In `src/components/Experience.tsx` — edit the `experiences` array at the top
- **Education**: In `src/components/Education.tsx` — edit the `education` array at the top
- **Contact email**: In `src/components/Contact.tsx` — change the FormSubmit URL and displayed email
- **Social links**: In `Contact.tsx` — update the GitHub and LinkedIn URLs

### Change Colors
All colors are defined in `src/index.css` under the `@theme` block:

```css
--color-accent: #c6f135;    /* Neon green — main accent */
--color-sky: #7dd3fc;       /* Light blue */
--color-warm: #fbbf24;      /* Warm yellow/orange */
--color-lavender: #c4b5fd;  /* Light purple */
--color-dark: #0a0a0a;      /* Background black */
```

Change any of these hex values to update colors site-wide instantly.

### Change Fonts
Fonts are loaded in `index.html` via Google Fonts:
- **Display font** (headings): `Sora`
- **Body font** (paragraphs): `Inter`

To change them, update the Google Fonts `<link>` in `index.html` and the CSS variables in `index.css`.

### Add / Remove Skills
Edit the `skills` array at the top of `src/components/Skills.tsx`:

```tsx
const skills = [
    { name: 'Java', icon: 'https://cdn.jsdelivr.net/...', bg: '...', ring: '...' },
    // Add or remove items here
]
```

### Add a New Experience
Edit the `experiences` array at the top of `src/components/Experience.tsx`:

```tsx
const experiences = [
    {
        role: 'Your Role',
        company: 'Company Name',
        period: 'Start – End',
        duration: '1 year',
        location: 'City, Country',
        type: 'Full-time',
        description: ['Bullet point 1', 'Bullet point 2'],
        current: false,
        accent: 'sky',  // 'accent' for green, 'sky' for blue
    },
    // ...existing roles
]
```

---

## 🛠️ Commands

| Command | What It Does |
|---|---|
| `npm install` | Install all dependencies (run once after cloning) |
| `npm run dev` | Start local dev server (usually `http://localhost:5173`) |
| `npm run build` | Create production build in `dist/` folder |
| `npm run preview` | Preview the production build locally |

---

## 🚀 How to Deploy

### Option 1: Vercel (Recommended — Free)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click **"New Project"** → select your repository
4. Leave all settings as default → click **Deploy**
5. Done! You'll get a URL like `yourname.vercel.app`

### Option 2: Netlify (Free)
1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) and sign in with GitHub
3. Click **"Add new site"** → **"Import an existing project"**
4. Select your repository
5. Build command: `npm run build` | Publish directory: `dist`
6. Click **Deploy** — you'll get a URL like `yourname.netlify.app`

### Option 3: GitHub Pages (Free)
1. Run `npm run build` locally
2. Install deploy tool: `npm install -D gh-pages`
3. Add to `package.json` scripts: `"deploy": "gh-pages -d dist"`
4. Run `npm run deploy`

---

## 📧 Contact Form Setup

The contact form uses [FormSubmit.co](https://formsubmit.co) (free, no backend needed).

**How it works:**
1. The form `action` points to `https://formsubmit.co/YOUR_EMAIL`
2. When someone fills out the form and clicks "Send", FormSubmit emails you directly
3. No server, no database — it just works!

**First-time activation:**
- The first time someone submits, you'll receive a **verification email** from FormSubmit
- Click the verification link, and all future submissions will go straight to your inbox

**To change the email:** Update the URL in `Contact.tsx`:
```tsx
action="https://formsubmit.co/your-new-email@gmail.com"
```

---

## 📦 Libraries & Dependencies (What's Installed)

Everything your project uses is listed in `package.json`. Here's what each one does:

### Production Dependencies (ships to users)

| Package | Version | What It Is | Where It's Used |
|---|---|---|---|
| **react** | ^19.0.0 | The core UI framework. Everything you see is a React component. | Every file in `src/` |
| **react-dom** | ^19.0.0 | Connects React to the browser's DOM so it can render HTML. | `main.tsx` (the entry point) |
| **framer-motion** | ^12.34.3 | Animation library. Handles all scroll reveals, text animations, page transitions, and the 3D tilt spring physics. | `AntigravityText`, `Hero`, `Navbar`, `About`, `Experience`, `Education`, `Contact`, `Skills`, `TiltCard`, `Cursor`, `Skeleton` |
| **tailwindcss** | ^4.2.0 | Utility-first CSS framework. Instead of writing CSS files, you style with class names like `bg-dark`, `text-accent`, `rounded-2xl`. | Every component — all styling is Tailwind classes |
| **@tailwindcss/vite** | ^4.2.0 | Vite plugin for Tailwind v4. Makes Tailwind work with the Vite build system. | `vite.config.ts` (configured once, runs automatically) |
| **lucide-react** | ^0.575.0 | Icon library. Provides clean, consistent SVG icons (Terminal, Send, Menu, Github, etc.). | `Navbar` (Terminal, Menu, X), `Contact` (Mail, Github, Linkedin, Send), `Experience` (Briefcase, Calendar, MapPin), `About` (Zap, Wrench, Package), `Education` (GraduationCap, BookOpen, School) |

### Dev Dependencies (only used during development)

| Package | Version | What It Is | Why It's Needed |
|---|---|---|---|
| **vite** | ^6.1.0 | The build tool and dev server. Makes `npm run dev` work with instant hot-reload. | Powers the entire development workflow |
| **@vitejs/plugin-react** | ^4.3.0 | Vite plugin that enables React's JSX syntax and Fast Refresh (live updates without page reload). | `vite.config.ts` |
| **typescript** | ^5.7.0 | Adds type safety to JavaScript. Catches bugs like typos, wrong function arguments, and missing properties at compile time. | Every `.tsx` and `.ts` file |
| **@types/react** | ^19.0.0 | TypeScript type definitions for React. Tells TypeScript what `useState`, `useRef`, etc. look like. | Used automatically by TypeScript |
| **@types/react-dom** | ^19.0.0 | TypeScript type definitions for ReactDOM. | Used automatically by TypeScript |

### How They Work Together

```
You write code (.tsx files)
        ↓
TypeScript checks for errors
        ↓
Vite bundles everything super fast
        ↓
Tailwind scans your classes and generates only the CSS you use
        ↓
React renders your components to the browser
        ↓
Framer Motion animates them as they appear
        ↓
Lucide provides all the icons
```

### How to Add a New Library
```bash
npm install package-name        # For production dependencies
npm install -D package-name     # For dev-only dependencies
```

### How to Update Libraries
```bash
npm update                      # Update all packages to latest compatible versions
npm outdated                    # Check which packages have newer versions
```

---

## ❓ Common Questions

**Q: How do I change the favicon?**
Replace `public/portfolio-2.png` with your new image (keep the same filename).

**Q: How do I change the page title?**
Edit `index.html` — change the `<title>` tag.

**Q: The animations don't play on mobile?**
All sections use Framer Motion's `whileInView` — they animate when scrolled into view. Make sure you're scrolling down to them.

**Q: How do I add a new section?**
1. Create a new file in `src/components/` (e.g., `Projects.tsx`)
2. Build your component using the same patterns (motion.div, TiltCard, etc.)
3. Import and add it to `App.tsx` in the desired position

**Q: How do I remove the loading skeleton?**
In `App.tsx`, remove the `Skeleton` component and the `isLoading` state/useEffect. Render your content directly.
