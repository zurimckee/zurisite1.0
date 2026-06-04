# Portfolio Enhancement Recommendations

## Architecture: React Islands with Vite (MPA Mode)

The core idea: your pages stay as **static HTML**, but you sprinkle in **self-contained React components** that "hydrate" into specific `<div>` targets. Each island is independent — no router, no global state, no SPA.

### Why This Approach?

- **No router complexity** — each page is its own HTML file, works with Netlify naturally
- **SEO/performance** — static HTML loads instantly, React only enhances specific spots
- **Keeps your vibe** — the hand-crafted feel of your site stays intact
- **Progressive** — if JS fails, the static content still renders
- **Incremental** — add one island at a time, no big rewrite

---

## Project Structure

```
your-site/
├── index.html              ← static, unchanged
├── about.html              ← static
├── projects.html           ← has a <div id="project-filter"></div>
├── contact.html            ← has a <div id="contact-form"></div>
├── src/
│   ├── islands/
│   │   ├── ProjectFilter.jsx
│   │   ├── ContactForm.jsx
│   │   ├── CursorTrail.jsx
│   │   └── ThemeToggle.jsx
│   └── mount.js            ← mounts each island
├── vite.config.js
└── styles.css
```

---

## Setup

### Vite Config (MPA Mode)

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        about: 'about.html',
        projects: 'projects.html',
        contact: 'contact.html',
        writings: 'writings.html',
        log: 'log.html',
        art: 'art.html',
      },
    },
  },
})
```

### HTML Integration

Each HTML file includes one script tag:

```html
<script type="module" src="/src/mount.js"></script>
```

### Mount Script

```js
// src/mount.js
import { createRoot } from 'react-dom/client'

// Only mount if the target element exists on this page
const projectEl = document.getElementById('project-filter')
if (projectEl) {
  import('./islands/ProjectFilter.jsx').then(({ default: Comp }) => {
    createRoot(projectEl).render(<Comp />)
  })
}

const contactEl = document.getElementById('contact-form')
if (contactEl) {
  import('./islands/ContactForm.jsx').then(({ default: Comp }) => {
    createRoot(contactEl).render(<Comp />)
  })
}

const cursorEl = document.getElementById('cursor-trail')
if (cursorEl) {
  import('./islands/CursorTrail.jsx').then(({ default: Comp }) => {
    createRoot(cursorEl).render(<Comp />)
  })
}

const themeEl = document.getElementById('theme-toggle')
if (themeEl) {
  import('./islands/ThemeToggle.jsx').then(({ default: Comp }) => {
    createRoot(themeEl).render(<Comp />)
  })
}
```

The **lazy `import()`** means each island's code only loads on pages that need it.

---

## Island Ideas

### 1. Project Filter/Sort (`/projects`)

Filter projects by tag with animated transitions. Mark a mount point in your HTML where you want it:

```html
<div id="project-filter"></div>
```

```jsx
// src/islands/ProjectFilter.jsx
import { useState } from 'react'

const tags = ['all', 'python', 'web dev', 'java', 'ai/ml', 'ui/ux', 'data']

const projects = [
  { title: 'parking+ dashboard', tags: ['python', 'data'], tech: 'python • streamlit • sqlalchemy', desc: 'a real-time parking management dashboard...', link: 'https://parkingplusdash.streamlit.app/' },
  { title: 'smart parking+', tags: ['web dev'], tech: 'javascript • vite • node/express', desc: 'The frontend for a full-stack web application...', link: 'https://smartparkplusapp.vercel.app/' },
  { title: 'aggiebot', tags: ['ai/ml', 'python'], tech: 'gemini api • python • streamlit', desc: 'an ai assistant meant to be an expert on all things nca&t.', link: 'https://aggiebot.streamlit.app/' },
  { title: 'spotify search', tags: ['python'], tech: 'python · spotify api · flask', desc: 'used the spotify API to power a search engine...', link: 'https://github.com/zurimckee/spotipi' },
  { title: 'wiki search engine', tags: ['python'], tech: 'python · json · wikimedia api', desc: 'created a simple search engine to comb through wikipedia pages...', link: 'https://github.com/zurimckee/pysearch' },
  { title: 'that damn dog', tags: ['python'], tech: 'python • pillow', desc: 'work with image manipulation...', link: 'https://github.com/zurimckee/thatdamndog' },
  { title: 'memory matching game', tags: ['java'], tech: 'java • javafx', desc: 'a memory matching game featuring a grid of interactive cards...', link: 'https://github.com/zurimckee/javamemorygame' },
  { title: 'budget tracker', tags: ['java'], tech: 'java • javafx', desc: 'a program allowing a user to input their budget...', link: 'https://github.com/zurimckee/javabudgetcalc' },
  { title: 'zurisite1.0', tags: ['web dev'], tech: 'html • css • javascript', desc: 'my first website ever!', link: 'https://projbyzuri.neocities.org/' },
  { title: 'realdealportfolio', tags: ['web dev'], tech: 'html • css • javascript', desc: 'a more professional portfolio site...', link: 'https://zurimckeepf.netlify.app/' },
  { title: 'bookit!', tags: ['ui/ux'], tech: 'figma • mural', desc: 'a mockup of a website made during a hackathon...', link: 'https://www.figma.com/proto/BtfmQGlGwOHvZrkhdOgjHx/Booking-Site' },
]

export default function ProjectFilter() {
  const [active, setActive] = useState('all')

  const filtered = active === 'all'
    ? projects
    : projects.filter(p => p.tags.includes(active))

  return (
    <div>
      <div className="filter-bar">
        {tags.map(tag => (
          <button
            key={tag}
            className={`filter-btn ${tag === active ? 'active' : ''}`}
            onClick={() => setActive(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="project-grid">
        {filtered.map(p => (
          <a key={p.title} href={p.link} className="project-card" target="_blank" rel="noopener">
            <h3>{p.title}</h3>
            <span className="tech">{p.tech}</span>
            <p>{p.desc}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
```

### 2. Contact Form (`/contact`)

A form with validation, loading states, and submission feedback.

```html
<div id="contact-form"></div>
```

```jsx
// src/islands/ContactForm.jsx
import { useState } from 'react'

export default function ContactForm() {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      // Replace with your form endpoint (Netlify Forms, Formspree, etc.)
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') return <p className="form-success">thanks for reaching out! 💌</p>

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <input
        type="text" placeholder="name" required
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />
      <input
        type="email" placeholder="email" required
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
      />
      <textarea
        placeholder="message" required rows={5}
        value={form.message}
        onChange={e => setForm({ ...form, message: e.target.value })}
      />
      <button type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'sending...' : 'send it ✉️'}
      </button>
      {status === 'error' && <p className="form-error">something went wrong, try again!</p>}
    </form>
  )
}
```

### 3. Cursor Trail (Global)

A fun sparkle/star trail that follows the mouse cursor. Mount on every page.

```html
<div id="cursor-trail"></div>
```

```jsx
// src/islands/CursorTrail.jsx
import { useEffect, useRef } from 'react'

export default function CursorTrail() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let particles = []
    let mouse = { x: 0, y: 0 }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const handleMouseMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      // Spawn a few particles at cursor position
      for (let i = 0; i < 3; i++) {
        particles.push({
          x: mouse.x,
          y: mouse.y,
          size: Math.random() * 4 + 1,
          life: 1,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          color: `hsl(${Math.random() * 60 + 200}, 80%, 70%)`, // pastel blues/purples
        })
      }
    }
    window.addEventListener('mousemove', handleMouseMove)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles = particles.filter(p => p.life > 0)
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.02
        ctx.globalAlpha = p.life
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1
      requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  )
}
```

### 4. Theme Toggle (Global)

Dark/light mode with a smooth transition.

```html
<div id="theme-toggle"></div>
```

```jsx
// src/islands/ThemeToggle.jsx
import { useState, useEffect } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark'
  })

  useEffect(() => {
    document.body.classList.toggle('dark-mode', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <button
      className="theme-toggle-btn"
      onClick={() => setDark(!dark)}
      aria-label="Toggle theme"
    >
      {dark ? '☀️' : '🌙'}
    </button>
  )
}
```

Then define your dark mode styles:

```css
body {
  transition: background-color 0.3s, color 0.3s;
}

body.dark-mode {
  background-color: #1a1a2e;
  color: #e0e0e0;
}
```

### 5. Art Lightbox (`/art`)

Click-to-expand image gallery with smooth zoom transitions.

```html
<div id="art-lightbox"></div>
```

```jsx
// src/islands/ArtLightbox.jsx
import { useState } from 'react'

const artworks = [
  { src: '/assets/art/piece1.jpg', title: 'piece 1' },
  { src: '/assets/art/piece2.jpg', title: 'piece 2' },
  // ...add your art here
]

export default function ArtLightbox() {
  const [selected, setSelected] = useState(null)

  return (
    <>
      <div className="art-grid">
        {artworks.map((art, i) => (
          <img
            key={i}
            src={art.src}
            alt={art.title}
            className="art-thumb"
            onClick={() => setSelected(art)}
          />
        ))}
      </div>
      {selected && (
        <div className="lightbox-overlay" onClick={() => setSelected(null)}>
          <img src={selected.src} alt={selected.title} className="lightbox-img" />
          <p className="lightbox-title">{selected.title}</p>
        </div>
      )}
    </>
  )
}
```

---

## UX Enhancement Ideas (CSS/Vanilla JS — No React Needed)

### Folder Hover Animations (Landing Page)

Animate folders opening on hover:

```css
.home-img {
  transition: transform 0.2s ease, filter 0.2s ease;
}

.home-img:hover {
  transform: scale(1.1) rotate(-3deg);
  filter: brightness(1.1) drop-shadow(0 4px 12px rgba(0,0,0,0.15));
}

.home-grid a {
  transition: transform 0.15s ease;
}

.home-grid a:active {
  transform: scale(0.95);
}
```

### Page Transitions (View Transitions API)

Add to each page's `<head>` — no SPA required, works with standard navigation:

```html
<meta name="view-transition" content="same-origin">
```

```css
@view-transition {
  navigation: auto;
}

::view-transition-old(root) {
  animation: fade-out 0.2s ease-in;
}

::view-transition-new(root) {
  animation: fade-in 0.3s ease-out;
}

@keyframes fade-out {
  from { opacity: 1; transform: scale(1); }
  to   { opacity: 0; transform: scale(0.98); }
}

@keyframes fade-in {
  from { opacity: 0; transform: scale(1.02); }
  to   { opacity: 1; transform: scale(1); }
}
```

### Scroll-Triggered Card Reveals

```css
.project-card {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.project-card.visible {
  opacity: 1;
  transform: translateY(0);
}
```

```js
// Add to your page script
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger the animation
      setTimeout(() => {
        entry.target.classList.add('visible')
      }, i * 100)
      observer.unobserve(entry.target)
    }
  })
}, { threshold: 0.1 })

document.querySelectorAll('.project-card').forEach(card => observer.observe(card))
```

### Typing Animation (About Page)

```js
const text = document.querySelector('.about-intro')
const fullText = text.textContent
text.textContent = ''

let i = 0
const type = () => {
  if (i < fullText.length) {
    text.textContent += fullText[i]
    i++
    setTimeout(type, 30 + Math.random() * 40)
  }
}
type()
```

---

## Visual Polish Suggestions

### Background Texture

```css
body {
  background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='0.5' fill='%23ddd' fill-opacity='0.3'/%3E%3C/svg%3E");
  background-repeat: repeat;
}
```

### Animated Gradient Background

```css
body {
  background: linear-gradient(-45deg, #ffeef8, #f0e6ff, #e6f0ff, #eefff0);
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
}

@keyframes gradient-shift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

### Glassmorphism Cards

```css
.project-card {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}
```

### Font Pairing Recommendation

```css
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@400;500;700&display=swap');

.card-tag, h1, h2, h3, code {
  font-family: 'Space Mono', monospace;
}

body, p, a {
  font-family: 'DM Sans', sans-serif;
}
```

---

## Recommended Stack Summary

| Tool | Purpose |
|---|---|
| **Vite (MPA mode)** | Build tool, dev server, HMR |
| **React** | Interactive islands only |
| **Framer Motion** | Smooth animations in React islands |
| **View Transitions API** | Page-to-page transitions (no SPA) |
| **Vanilla CSS** | Keep it simple, match your aesthetic |
| **Netlify** | Hosting (already using, works perfectly with MPA) |

---

## Getting Started Checklist

- [ ] Initialize Vite project with `npm create vite@latest . -- --template react`
- [ ] Configure `vite.config.js` for MPA (multiple HTML entry points)
- [ ] Add `<script type="module" src="/src/mount.js"></script>` to each HTML file
- [ ] Build first island (project filter is the most impactful)
- [ ] Add folder hover animations (quick CSS win)
- [ ] Add View Transitions API meta tag to each page
- [ ] Add scroll-triggered card reveals
- [ ] Experiment with background gradient or texture
- [ ] Add theme toggle island
- [ ] Add cursor trail for personality
