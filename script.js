// ===== Skills data =====
const skills = [
  { icon: "💻", title: "Languages", items: ["PHP", "JavaScript", "Python", "SQL"] },
  { icon: "⚙️", title: "Backend", items: ["Laravel", "REST APIs", "MVC", "Eloquent ORM", "Queues", "Jobs", "Events", "Middleware", "Task Scheduling"] },
  { icon: "🎨", title: "Frontend", items: ["React.js", "JSX", "React Hooks", "State Management", "Tailwind CSS", "Bootstrap", "HTML5", "CSS3"] },
  { icon: "🤖", title: "Artificial Intelligence", items: ["Agentic AI", "AI Agents", "LLMs", "Prompt Engineering", "OpenAI API", "Claude API", "GitHub Copilot", "Claude Code"] },
  { icon: "🗄️", title: "Databases & Storage", items: ["MySQL", "Redis", "File Storage"] },
  { icon: "🔐", title: "Auth & Security", items: ["OAuth 2.0", "JWT", "Laravel Passport", "Google SSO"] },
  { icon: "💳", title: "Payments & Analytics", items: ["Payment Gateways", "Payment Routing", "Apple Pay", "PostHog"] },
  { icon: "🧪", title: "Testing & Automation", items: ["Playwright", "E2E Testing", "Unit Testing", "Automated Testing"] },
  { icon: "🚀", title: "DevOps & Tools", items: ["Git", "CI/CD Pipelines", "Jira", "Agile / Scrum"] },
];

const grid = document.getElementById("skillsGrid");
grid.innerHTML = skills
  .map(
    (s) => `
  <div class="skill-card reveal">
    <div class="skill-head"><div class="skill-ico">${s.icon}</div><h3>${s.title}</h3></div>
    <div class="chips">${s.items.map((i) => `<span>${i}</span>`).join("")}</div>
  </div>`
  )
  .join("");

// Spotlight hover on skill cards
grid.querySelectorAll(".skill-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
});

// ===== Theme =====
const root = document.documentElement;
try {
  const saved = localStorage.getItem("theme");
  if (saved) root.dataset.theme = saved;
  else if (window.matchMedia("(prefers-color-scheme: light)").matches) root.dataset.theme = "light";
} catch (_) {}
document.getElementById("themeToggle").addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  try { localStorage.setItem("theme", root.dataset.theme); } catch (_) {}
});

// ===== Nav =====
const nav = document.getElementById("nav");
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
window.addEventListener("scroll", () => nav.classList.toggle("scrolled", window.scrollY > 20), { passive: true });
menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("open");
  navLinks.classList.toggle("open");
});
navLinks.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    menuBtn.classList.remove("open");
    navLinks.classList.remove("open");
  })
);

// Active section highlight
const sections = [...document.querySelectorAll("main section[id]")];
const linkFor = (id) => navLinks.querySelector(`a[href="#${id}"]`);
function updateActive() {
  const mid = window.innerHeight * 0.4;
  let current = null;
  for (const s of sections) if (s.getBoundingClientRect().top <= mid) current = s.id;
  navLinks.querySelectorAll("a").forEach((a) => a.classList.remove("active"));
  if (current) linkFor(current)?.classList.add("active");
}
window.addEventListener("scroll", updateActive, { passive: true });
updateActive();

// ===== Reveal on scroll =====
const revealObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("in");
        revealObserver.unobserve(en.target);
      }
    }),
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 70}ms`;
  revealObserver.observe(el);
});

// ===== Counters =====
const countObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = parseFloat(el.dataset.count);
      const dec = parseInt(el.dataset.decimals || "0", 10);
      const suffix = el.dataset.suffix || "";
      const start = performance.now();
      const dur = 1400;
      const tick = (t) => {
        const p = Math.min((t - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(dec) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    }),
  { threshold: 0.6 }
);
document.querySelectorAll("[data-count]").forEach((el) => countObserver.observe(el));

// ===== Typing effect =====
const phrases = [
  "full-stack web apps",
  "payment routing systems",
  "Laravel APIs that scale",
  "React interfaces",
  "AI-powered features",
];
const typedEl = document.getElementById("typed");
let pi = 0, ci = phrases[0].length, deleting = true;
function type() {
  const word = phrases[pi];
  typedEl.textContent = word.slice(0, ci);
  if (deleting) {
    ci--;
    if (ci < 0) { deleting = false; pi = (pi + 1) % phrases.length; ci = 0; }
  } else {
    ci++;
    if (ci > phrases[pi].length) { deleting = true; setTimeout(type, 1600); return; }
  }
  setTimeout(type, deleting ? 35 : 70);
}
setTimeout(type, 2200);

// ===== Project filters =====
const filterBtns = document.querySelectorAll("#filters button");
const cards = document.querySelectorAll("#projectsGrid .p-card");
filterBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;
    cards.forEach((c) => {
      const show = f === "all" || c.dataset.cat.split(" ").includes(f);
      c.classList.toggle("hidden", !show);
      if (show) c.classList.add("in");
    });
  })
);

// ===== Cursor glow =====
const glow = document.querySelector(".cursor-glow");
if (window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("mousemove", (e) => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  }, { passive: true });
}

// ===== Copy email =====
const toast = document.getElementById("toast");
document.getElementById("copyEmail").addEventListener("click", async (e) => {
  const email = e.currentTarget.dataset.email;
  try { await navigator.clipboard.writeText(email); } catch (_) {}
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
});

document.getElementById("year").textContent = new Date().getFullYear();
