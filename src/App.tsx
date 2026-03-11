import { useState, useEffect, useRef, useCallback } from "react";

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "systems", label: "Systems Thinking", color: "#2563EB", bg: "#EFF6FF" },
  { id: "risk", label: "Integrated Risk Management", color: "#D97706", bg: "#FFFBEB" },
  { id: "resilience", label: "Resilience", color: "#16A34A", bg: "#F0FDF4" },
  { id: "ai", label: "AI & Analytics", color: "#DC2626", bg: "#FFF1F2" },
  { id: "leadership", label: "Real-Time Leadership", color: "#0891B2", bg: "#ECFEFF" },
];

const USERS = [
  { id: 1, name: "Alexandra Silva", email: "alex@asilvainnovations.com", role: "admin", avatar: "AS", joined: "2023-01-15", articles: 24 },
  { id: 2, name: "Marcus Chen", email: "m.chen@asilvainnovations.com", role: "editor", avatar: "MC", joined: "2023-03-22", articles: 18 },
  { id: 3, name: "Priya Nair", email: "p.nair@asilvainnovations.com", role: "author", avatar: "PN", joined: "2023-06-10", articles: 12 },
  { id: 4, name: "Jordan Blake", email: "j.blake@asilvainnovations.com", role: "contributor", avatar: "JB", joined: "2024-01-05", articles: 5 },
  { id: 5, name: "Sofia Mendez", email: "s.mendez@asilvainnovations.com", role: "author", avatar: "SM", joined: "2023-09-14", articles: 9 },
];

const ARTICLES_DATA = [
  {
    id: 1, title: "The Interconnected Organization: Systems Thinking in the Age of Disruption",
    excerpt: "How leading enterprises are redesigning their organizational architecture using systems thinking principles to navigate unprecedented complexity and create antifragile structures.",
    category: "systems", author: "Alexandra Silva", authorId: 1, date: "2024-12-15",
    status: "published", readTime: 8, views: 14200, comments: 34, featured: true,
    tags: ["systems-thinking", "organizational-design", "complexity"],
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    content: "Full article content here...", scheduledDate: null,
    versions: [{ id: 1, timestamp: "2024-12-14T10:00:00", author: "Alexandra Silva", note: "Initial draft" }, { id: 2, timestamp: "2024-12-15T08:30:00", author: "Marcus Chen", note: "Editorial review" }]
  },
  {
    id: 2, title: "Quantifying the Unquantifiable: Next-Generation Risk Frameworks",
    excerpt: "Traditional risk matrices are failing modern organizations. Discover how integrated risk management platforms are leveraging real-time data streams and ML models to predict cascading failure modes.",
    category: "risk", author: "Marcus Chen", authorId: 2, date: "2024-12-10",
    status: "published", readTime: 12, views: 9800, comments: 28, featured: false,
    tags: ["risk-management", "machine-learning", "enterprise"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    content: "Full article content here...", scheduledDate: null,
    versions: [{ id: 1, timestamp: "2024-12-09T14:00:00", author: "Marcus Chen", note: "First draft" }]
  },
  {
    id: 3, title: "Resilience Engineering: Building Organizations That Bounce Forward",
    excerpt: "Moving beyond recovery to transformation — how resilience engineering principles create organizations that don't just survive crises but emerge stronger and more capable.",
    category: "resilience", author: "Priya Nair", authorId: 3, date: "2024-12-05",
    status: "published", readTime: 10, views: 11500, comments: 41, featured: false,
    tags: ["resilience", "organizational-change", "antifragility"],
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    content: "Full article content here...", scheduledDate: null,
    versions: []
  },
  {
    id: 4, title: "Generative AI in Strategic Decision-Making: Beyond the Hype",
    excerpt: "A rigorous framework for evaluating where generative AI creates genuine strategic value versus operational noise, with case studies from Fortune 500 deployments.",
    category: "ai", author: "Alexandra Silva", authorId: 1, date: "2024-11-28",
    status: "published", readTime: 15, views: 22100, comments: 67, featured: false,
    tags: ["generative-ai", "strategy", "decision-making"],
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80",
    content: "Full article content here...", scheduledDate: null,
    versions: []
  },
  {
    id: 5, title: "The 4-Second Window: Real-Time Leadership in Crisis Scenarios",
    excerpt: "Neuroscience research reveals that leaders have a critical 4-second window to shift from reactive to responsive decision-making. Here's how to train that capacity at scale.",
    category: "leadership", author: "Jordan Blake", authorId: 4, date: "2024-11-20",
    status: "published", readTime: 7, views: 8300, comments: 19, featured: false,
    tags: ["leadership", "neuroscience", "crisis-management"],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    content: "Full article content here...", scheduledDate: null,
    versions: []
  },
  {
    id: 6, title: "Causal Loop Diagrams: The Executive's Guide to System Dynamics",
    excerpt: "Why every C-suite needs fluency in causal loop diagrams — and a practical methodology for mapping the feedback structures driving your most persistent business challenges.",
    category: "systems", author: "Sofia Mendez", authorId: 5, date: "2024-11-15",
    status: "published", readTime: 9, views: 7600, comments: 22, featured: false,
    tags: ["systems-dynamics", "causal-loops", "executive-education"],
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
    content: "Full article content here...", scheduledDate: null,
    versions: []
  },
  {
    id: 7, title: "Predictive Risk Intelligence: From Dashboards to Decision Support",
    excerpt: "The evolution from passive risk reporting to active risk intelligence — how AI-powered systems are transforming ERM into a competitive advantage.",
    category: "risk", author: "Marcus Chen", authorId: 2, date: "2024-11-08",
    status: "published", readTime: 11, views: 6900, comments: 15, featured: false,
    tags: ["predictive-analytics", "ERM", "risk-intelligence"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    content: "Full article content here...", scheduledDate: null,
    versions: []
  },
  {
    id: 8, title: "Adaptive Capacity: Designing for Resilience in Complex Supply Chains",
    excerpt: "Three years of disruption have exposed supply chain vulnerabilities worldwide. Leading organizations are now building adaptive capacity using dynamic network design principles.",
    category: "resilience", author: "Priya Nair", authorId: 3, date: "2024-10-30",
    status: "published", readTime: 13, views: 10200, comments: 38, featured: false,
    tags: ["supply-chain", "resilience", "network-design"],
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
    content: "Full article content here...", scheduledDate: null,
    versions: []
  },
  {
    id: 9, title: "Analytics Governance: The Foundation of Trustworthy AI in Organizations",
    excerpt: "Before deploying AI at scale, organizations must build robust analytics governance frameworks. This guide covers data lineage, model monitoring, and ethical AI protocols.",
    category: "ai", author: "Alexandra Silva", authorId: 1, date: "2024-10-22",
    status: "published", readTime: 14, views: 13400, comments: 51, featured: false,
    tags: ["ai-governance", "data-quality", "ethics"],
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&q=80",
    content: "Full article content here...", scheduledDate: null,
    versions: []
  },
  {
    id: 10, title: "Distributed Leadership in the Age of Remote Work",
    excerpt: "How organizations are redesigning leadership development programs for a world where influence flows through networks rather than hierarchies.",
    category: "leadership", author: "Jordan Blake", authorId: 4, date: "2024-10-15",
    status: "published", readTime: 8, views: 7100, comments: 29, featured: false,
    tags: ["distributed-leadership", "remote-work", "organizational-design"],
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
    content: "Full article content here...", scheduledDate: null,
    versions: []
  },
  {
    id: 11, title: "Emergence and Self-Organization: Lessons from Complex Adaptive Systems",
    excerpt: "What slime molds, ant colonies, and neural networks teach us about designing organizations that innovate without central control.",
    category: "systems", author: "Sofia Mendez", authorId: 5, date: "2024-10-08",
    status: "published", readTime: 11, views: 9100, comments: 33, featured: false,
    tags: ["complex-systems", "emergence", "self-organization"],
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80",
    content: "Full article content here...", scheduledDate: null,
    versions: []
  },
  {
    id: 12, title: "Climate Risk Integration: The New Frontier of Enterprise Risk Management",
    excerpt: "Regulatory pressure and physical climate impacts are forcing boards to integrate climate risk into core ERM frameworks. Here's a practical methodology for doing it right.",
    category: "risk", author: "Marcus Chen", authorId: 2, date: "2024-09-30",
    status: "published", readTime: 16, views: 11800, comments: 44, featured: false,
    tags: ["climate-risk", "ERM", "ESG"],
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80",
    content: "Full article content here...", scheduledDate: null,
    versions: []
  },
  {
    id: 13, title: "The Future of AI Strategy: Draft in Progress",
    excerpt: "Exploring how organizations will need to restructure their strategic planning processes around AI capabilities in the next decade.",
    category: "ai", author: "Alexandra Silva", authorId: 1, date: "2024-12-20",
    status: "draft", readTime: 10, views: 0, comments: 0, featured: false,
    tags: ["ai-strategy", "future-of-work"],
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
    content: "Draft content...", scheduledDate: null,
    versions: [{ id: 1, timestamp: "2024-12-18T09:00:00", author: "Alexandra Silva", note: "Initial outline" }, { id: 2, timestamp: "2024-12-19T14:30:00", author: "Alexandra Silva", note: "Added section 2" }, { id: 3, timestamp: "2024-12-20T11:00:00", author: "Alexandra Silva", note: "Expanded conclusion" }]
  },
  {
    id: 14, title: "Building Psychological Safety in High-Stakes Environments",
    excerpt: "Research-backed strategies for leaders to create environments where teams can speak up, experiment, and learn from failure without fear of repercussion.",
    category: "leadership", author: "Priya Nair", authorId: 3, date: "2024-12-25",
    status: "scheduled", readTime: 9, views: 0, comments: 0, featured: false,
    tags: ["psychological-safety", "team-dynamics"],
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80",
    content: "Scheduled content...", scheduledDate: "2024-12-25T09:00:00",
    versions: [{ id: 1, timestamp: "2024-12-17T10:00:00", author: "Priya Nair", note: "Complete draft" }]
  },
  {
    id: 15, title: "Resilience Metrics: Measuring What Matters in Complex Systems",
    excerpt: "A framework for quantifying organizational resilience beyond traditional continuity metrics.",
    category: "resilience", author: "Sofia Mendez", authorId: 5, date: "2024-12-22",
    status: "draft", readTime: 12, views: 0, comments: 0, featured: false,
    tags: ["metrics", "measurement", "resilience"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    content: "Draft in progress...", scheduledDate: null,
    versions: [{ id: 1, timestamp: "2024-12-20T16:00:00", author: "Sofia Mendez", note: "Research notes" }]
  },
];

const COMMENTS_DATA = [
  { id: 1, articleId: 1, articleTitle: "The Interconnected Organization", author: "David K.", email: "dk@example.com", content: "This fundamentally changed how I think about organizational design. The feedback loop diagrams were particularly illuminating.", date: "2024-12-16", status: "approved", replies: 2 },
  { id: 2, articleId: 2, articleTitle: "Quantifying the Unquantifiable", author: "Sarah M.", email: "sm@corp.com", content: "Would love to see a follow-up on how smaller organizations can implement these frameworks without massive data infrastructure.", date: "2024-12-12", status: "pending", replies: 0 },
  { id: 3, articleId: 4, articleTitle: "Generative AI in Strategic Decision-Making", author: "Anonymous User", email: "anon@temp.io", content: "Buy cheap AI tools at mysite.com!!!", date: "2024-12-11", status: "spam", replies: 0 },
  { id: 4, articleId: 3, articleTitle: "Resilience Engineering", author: "Thomas R.", email: "tr@example.org", content: "The distinction between bouncing back and bouncing forward is crucial. We've been using recovery metrics when we should be measuring transformation capacity.", date: "2024-12-07", status: "approved", replies: 1 },
  { id: 5, articleId: 5, articleTitle: "The 4-Second Window", author: "Dr. Amanda L.", email: "al@university.edu", content: "The neuroscience here is solid. I've been studying stress responses in executive teams and the 4-second window aligns with our amygdala response research.", date: "2024-11-22", status: "approved", replies: 3 },
  { id: 6, articleId: 1, articleTitle: "The Interconnected Organization", author: "Rob T.", email: "rt@consulting.com", content: "I'm not sure the examples translate to regulated industries. Would love more financial services case studies.", date: "2024-12-17", status: "pending", replies: 0 },
];

const SUBSCRIBERS = [
  { id: 1, email: "john.smith@techcorp.com", name: "John Smith", subscribed: "2024-11-01", status: "active", source: "Hero Banner" },
  { id: 2, email: "emily.chen@startup.io", name: "Emily Chen", subscribed: "2024-11-15", status: "active", source: "Article Modal" },
  { id: 3, email: "mark.johnson@enterprise.com", name: "Mark Johnson", subscribed: "2024-10-28", status: "active", source: "Footer" },
  { id: 4, email: "sarah.wilson@consulting.co", name: "Sarah Wilson", subscribed: "2024-09-14", status: "unsubscribed", source: "Article Modal" },
  { id: 5, email: "alex.kim@research.org", name: "Alex Kim", subscribed: "2024-12-01", status: "active", source: "Hero Banner" },
  { id: 6, email: "priya.patel@nonprofit.org", name: "Priya Patel", subscribed: "2024-12-10", status: "active", source: "Footer" },
  { id: 7, email: "carlos.rivera@media.com", name: "Carlos Rivera", subscribed: "2024-08-22", status: "active", source: "Article Modal" },
];

const ANALYTICS = {
  pageViews: [4200, 5100, 4800, 6200, 7800, 6900, 8100, 9200, 8700, 10200, 11500, 12800],
  subscribers: [120, 145, 160, 189, 210, 245, 280, 315, 350, 390, 430, 480],
  topArticles: ARTICLES_DATA.filter(a => a.status === "published").sort((a, b) => b.views - a.views).slice(0, 5),
  trafficSources: [{ source: "Organic Search", pct: 48 }, { source: "Direct", pct: 22 }, { source: "Social Media", pct: 18 }, { source: "Email Newsletter", pct: 8 }, { source: "Referral", pct: 4 }],
  webVitals: { lcp: 1.8, fid: 12, cls: 0.04, score: 94 },
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const getCat = (id) => CATEGORIES.find(c => c.id === id) || CATEGORIES[0];
const fmt = (n) => n >= 1000 ? `${(n/1000).toFixed(1)}k` : n;
const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const fmtTime = (d) => new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 16 }) => {
  const icons = {
    home: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    edit: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    mail: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    bar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    chat: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
    file: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
    clock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    eye: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    save: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
    history: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>,
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    globe: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>,
    menu: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    arrow: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    restore: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    trend: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
    shield: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    star: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    publish: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  };
  return icons[name] || null;
};

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────
const Badge = ({ cat }) => {
  const c = getCat(cat);
  return (
    <span style={{ background: c.bg, color: c.color, border: `1px solid ${c.color}22`, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, letterSpacing: 0.5, textTransform: "uppercase", whiteSpace: "nowrap" }}>
      {c.label}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const map = { published: ["#16A34A","#F0FDF4"], draft: ["#6B7280","#F9FAFB"], scheduled: ["#2563EB","#EFF6FF"], pending: ["#D97706","#FFFBEB"], approved: ["#16A34A","#F0FDF4"], spam: ["#DC2626","#FFF1F2"], rejected: ["#DC2626","#FFF1F2"], active: ["#16A34A","#F0FDF4"], unsubscribed: ["#6B7280","#F9FAFB"] };
  const [color, bg] = map[status] || ["#6B7280","#F9FAFB"];
  return <span style={{ background: bg, color, border: `1px solid ${color}33`, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, letterSpacing: 0.3, textTransform: "capitalize" }}>{status}</span>;
};

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("blog"); // blog | admin | editor | drafts
  const [currentUser] = useState(USERS[0]); // Always admin for demo
  const [articles, setArticles] = useState(ARTICLES_DATA);
  const [comments, setComments] = useState(COMMENTS_DATA);
  const [subscribers] = useState(SUBSCRIBERS);
  const [users, setUsers] = useState(USERS);
  const [editingId, setEditingId] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [adminTab, setAdminTab] = useState("articles");
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterDone, setNewsletterDone] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowNewsletter(true), 8000);
    return () => clearTimeout(t);
  }, []);

  const openEditor = (id = null) => { setEditingId(id); setView("editor"); };
  const openDrafts = () => setView("drafts");
  const publishArticle = (id) => setArticles(prev => prev.map(a => a.id === id ? { ...a, status: "published", date: new Date().toISOString().split("T")[0] } : a));
  const deleteArticle = (id) => setArticles(prev => prev.filter(a => a.id !== id));

  return (
    <div style={{ fontFamily: "'Poppins', 'Segoe UI', sans-serif", background: "#F8FAFC", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #f1f5f9; } ::-webkit-scrollbar-thumb { background: #94a3b8; border-radius: 3px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        @keyframes slideIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
        @keyframes rotateWords { 0%,20%{opacity:0;transform:translateY(10px)} 5%,15%{opacity:1;transform:translateY(0)} 25%{opacity:0;transform:translateY(-10px)} }
        .card-hover { transition: all 0.25s ease; cursor: pointer; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.12) !important; }
        .btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 18px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; border: none; transition: all 0.2s; font-family: inherit; }
        .btn:hover { transform: translateY(-1px); }
        .btn-primary { background: linear-gradient(135deg,#0F4C81,#0891B2); color: white; }
        .btn-secondary { background: white; color: #334155; border: 1.5px solid #e2e8f0; }
        .btn-danger { background: #FEF2F2; color: #DC2626; border: 1.5px solid #FECACA; }
        .btn-success { background: #F0FDF4; color: #16A34A; border: 1.5px solid #BBF7D0; }
        .input { width: 100%; padding: 10px 14px; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 14px; font-family: inherit; outline: none; transition: border 0.2s; background: white; }
        .input:focus { border-color: #0891B2; box-shadow: 0 0 0 3px #0891B233; }
        .nav-link { padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #64748b; background: none; border: none; font-family: inherit; }
        .nav-link:hover, .nav-link.active { background: #EFF6FF; color: #0F4C81; }
        .table-row:hover { background: #F8FAFC; }
        textarea.input { resize: vertical; min-height: 120px; }
        .select { padding: 9px 14px; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 14px; font-family: inherit; outline: none; background: white; cursor: pointer; }
        .select:focus { border-color: #0891B2; }
        .sidebar-link { display: flex; align-items: center; gap: 10px; padding: 11px 16px; border-radius: 10px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #64748b; border: none; background: none; font-family: inherit; width: 100%; text-align: left; }
        .sidebar-link:hover, .sidebar-link.active { background: linear-gradient(135deg,#EFF6FF,#ECFEFF); color: #0F4C81; }
        .anim { animation: fadeIn 0.4s ease forwards; }
        .chip { display: inline-flex; align-items: center; gap: 4px; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; background: #F1F5F9; color: #475569; cursor: pointer; border: none; transition: all 0.2s; }
        .chip:hover, .chip.active { background: #0F4C81; color: white; }
      `}</style>

      {/* NAV */}
      <nav style={{ background: "white", borderBottom: "1px solid #e2e8f0", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src="https://asilvainnovations.com/assets/apps/user_1097/app_13212/draft/icon/app_logo.png?1769949231" alt="ASilva Innovations" style={{ height: 40, width: 40, objectFit: "contain", borderRadius: 8 }} onError={e => { e.target.style.display = "none"; }} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#0F4C81", lineHeight: 1 }}>ASilva</div>
              <div style={{ fontSize: 11, color: "#64748b", letterSpacing: 1, fontWeight: 500 }}>INNOVATIONS</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {[["blog","Blog"], ["admin","Dashboard"], ["drafts","Drafts"]].map(([v,l]) => (
              <button key={v} className={`nav-link ${view === v ? "active" : ""}`} onClick={() => setView(v)}>{l}</button>
            ))}
            <button className="btn btn-primary" style={{ marginLeft: 8 }} onClick={() => openEditor(null)}>
              <Icon name="plus" size={14} /> New Article
            </button>
          </div>
        </div>
      </nav>

      {/* VIEWS */}
      {view === "blog" && <BlogView articles={articles} activeCategory={activeCategory} setActiveCategory={setActiveCategory} searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedArticle={selectedArticle} setSelectedArticle={setSelectedArticle} showNewsletter={showNewsletter} setShowNewsletter={setShowNewsletter} newsletterEmail={newsletterEmail} setNewsletterEmail={setNewsletterEmail} newsletterDone={newsletterDone} setNewsletterDone={setNewsletterDone} openEditor={openEditor} />}
      {view === "admin" && <AdminView articles={articles} comments={comments} setComments={setComments} subscribers={subscribers} users={users} setUsers={setUsers} analytics={ANALYTICS} currentUser={currentUser} tab={adminTab} setTab={setAdminTab} openEditor={openEditor} publishArticle={publishArticle} deleteArticle={deleteArticle} />}
      {view === "editor" && <EditorView articles={articles} setArticles={setArticles} editingId={editingId} onBack={() => setView("admin")} />}
      {view === "drafts" && <DraftsView articles={articles} openEditor={openEditor} publishArticle={publishArticle} deleteArticle={deleteArticle} onBack={() => setView("blog")} />}
    </div>
  );
}

// ─── BLOG VIEW ───────────────────────────────────────────────────────────────
function BlogView({ articles, activeCategory, setActiveCategory, searchQuery, setSearchQuery, selectedArticle, setSelectedArticle, showNewsletter, setShowNewsletter, newsletterEmail, setNewsletterEmail, newsletterDone, setNewsletterDone }) {
  const published = articles.filter(a => a.status === "published");
  const featured = published.find(a => a.featured);
  const [readingProgress, setReadingProgress] = useState(0);
  const [heroArticleIdx, setHeroArticleIdx] = useState(0);
  const heroArticles = published.slice(0, 4);

  useEffect(() => {
    const t = setInterval(() => setHeroArticleIdx(i => (i + 1) % heroArticles.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      setReadingProgress((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filtered = published.filter(a => {
    const matchCat = activeCategory === "all" || a.category === activeCategory;
    const matchSearch = !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const h = heroArticles[heroArticleIdx];

  return (
    <div>
      {/* Reading Progress */}
      <div style={{ position: "fixed", top: 64, left: 0, right: 0, height: 3, zIndex: 99, background: "#e2e8f0" }}>
        <div style={{ height: "100%", width: `${readingProgress}%`, background: "linear-gradient(90deg,#0F4C81,#0891B2)", transition: "width 0.1s" }} />
      </div>

      {/* HERO */}
      <div style={{ background: "linear-gradient(135deg,#0F4C81 0%,#0891B2 50%,#0D7C66 100%)", color: "white", padding: "72px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 40%)" }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", position: "relative" }}>
          <div style={{ animation: "fadeIn 0.8s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
              <img src="https://asilvainnovations.com/assets/apps/user_1097/app_13212/draft/icon/app_logo.png?1769949231" alt="Logo" style={{ height: 64, width: 64, objectFit: "contain", borderRadius: 12, background: "rgba(255,255,255,0.1)", padding: 8 }} onError={e => { e.target.style.display = "none"; }} />
              <div>
                <div style={{ fontSize: 13, letterSpacing: 3, fontWeight: 600, opacity: 0.8, textTransform: "uppercase" }}>ASilva Innovations</div>
                <div style={{ fontSize: 13, letterSpacing: 1, opacity: 0.6 }}>Thought Leadership Journal</div>
              </div>
            </div>
            <h1 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 16 }}>
              Transforming Systems,<br />
              <span style={{ background: "linear-gradient(135deg,#7DD3FC,#34D399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Empowering Resilience</span>
            </h1>
            <p style={{ fontSize: 17, opacity: 0.85, lineHeight: 1.7, marginBottom: 32, fontFamily: "'Lora', serif" }}>
              Expert insights at the intersection of systems thinking, integrated risk management, AI analytics, and real-time leadership.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {CATEGORIES.map(c => (
                <span key={c.id} style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.3)", fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 20, cursor: "pointer", backdropFilter: "blur(8px)" }}
                  onClick={() => { setActiveCategory(c.id); document.getElementById("articles")?.scrollIntoView({ behavior: "smooth" }); }}>
                  {c.label}
                </span>
              ))}
            </div>
          </div>

          {/* Featured Rotating Article */}
          {h && (
            <div key={heroArticleIdx} style={{ animation: "slideIn 0.5s ease" }}>
              <div style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(20px)", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer" }}
                onClick={() => setSelectedArticle(h)}>
                <img src={h.image} alt={h.title} style={{ width: "100%", height: 200, objectFit: "cover", opacity: 0.9 }} />
                <div style={{ padding: 24 }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                    <span style={{ background: "rgba(255,255,255,0.2)", color: "white", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, letterSpacing: 0.5 }}>{getCat(h.category).label}</span>
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4, marginBottom: 8, fontFamily: "'Lora', serif" }}>{h.title}</h3>
                  <p style={{ fontSize: 13, opacity: 0.8, lineHeight: 1.6 }}>{h.excerpt.substring(0, 120)}...</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 16, fontSize: 12, opacity: 0.7 }}>
                    <span>{h.author}</span>
                    <span>·</span>
                    <span>{h.readTime} min read</span>
                    <span>·</span>
                    <span>{fmt(h.views)} views</span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
                {heroArticles.map((_, i) => (
                  <div key={i} onClick={() => setHeroArticleIdx(i)} style={{ width: i === heroArticleIdx ? 24 : 8, height: 8, borderRadius: 4, background: i === heroArticleIdx ? "white" : "rgba(255,255,255,0.4)", cursor: "pointer", transition: "all 0.3s" }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* STATS BAR */}
      <div style={{ background: "white", borderBottom: "1px solid #e2e8f0", padding: "16px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap" }}>
          {[["📝", published.length, "Published Articles"], ["👁", fmt(published.reduce((s,a)=>s+a.views,0)), "Total Views"], ["💬", published.reduce((s,a)=>s+a.comments,0), "Reader Comments"], ["✉️", SUBSCRIBERS.filter(s=>s.status==="active").length, "Subscribers"]].map(([icon,val,label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#0F4C81" }}>{icon} {val}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ARTICLES */}
      <div id="articles" style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px" }}>
        {/* Filters */}
        <div style={{ display: "flex", gap: 12, marginBottom: 32, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 240 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}><Icon name="search" size={16} /></span>
            <input className="input" placeholder="Search articles..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ paddingLeft: 40 }} />
          </div>
          <button className={`chip ${activeCategory === "all" ? "active" : ""}`} onClick={() => setActiveCategory("all")}>All</button>
          {CATEGORIES.map(c => (
            <button key={c.id} className={`chip ${activeCategory === c.id ? "active" : ""}`} onClick={() => setActiveCategory(c.id)}>{c.label}</button>
          ))}
        </div>

        {/* Featured Article */}
        {!searchQuery && activeCategory === "all" && featured && (
          <div className="card-hover" style={{ background: "white", borderRadius: 20, overflow: "hidden", border: "1px solid #e2e8f0", marginBottom: 40, display: "grid", gridTemplateColumns: "1.2fr 1fr", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }} onClick={() => setSelectedArticle(featured)}>
            <img src={featured.image} alt={featured.title} style={{ width: "100%", height: 360, objectFit: "cover" }} />
            <div style={{ padding: 48, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <Badge cat={featured.category} />
                <span style={{ background: "#FEF3C7", color: "#D97706", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>⭐ Featured</span>
              </div>
              <h2 style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.35, color: "#0F172A", marginBottom: 16, fontFamily: "'Lora', serif" }}>{featured.title}</h2>
              <p style={{ color: "#475569", lineHeight: 1.7, marginBottom: 24, fontSize: 15, fontFamily: "'Lora', serif" }}>{featured.excerpt}</p>
              <div style={{ display: "flex", gap: 20, color: "#64748b", fontSize: 13 }}>
                <span style={{ fontWeight: 600, color: "#0F4C81" }}>{featured.author}</span>
                <span>{fmtDate(featured.date)}</span>
                <span>📖 {featured.readTime} min</span>
                <span>👁 {fmt(featured.views)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px,1fr))", gap: 28 }}>
          {filtered.filter(a => !a.featured || searchQuery || activeCategory !== "all").map((a, i) => (
            <ArticleCard key={a.id} article={a} onClick={() => setSelectedArticle(a)} delay={i * 50} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 24px", color: "#94a3b8" }}>
            <div style={{ fontSize: 48 }}>🔍</div>
            <div style={{ fontSize: 18, fontWeight: 600, marginTop: 16 }}>No articles found</div>
            <div style={{ fontSize: 14, marginTop: 8 }}>Try a different search or category</div>
          </div>
        )}
      </div>

      {/* ARTICLE MODAL */}
      {selectedArticle && <ArticleModal article={selectedArticle} articles={articles.filter(a=>a.status==="published")} onClose={() => setSelectedArticle(null)} setSelectedArticle={setSelectedArticle} />}

      {/* NEWSLETTER MODAL */}
      {showNewsletter && !newsletterDone && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,76,129,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }} onClick={() => setShowNewsletter(false)}>
          <div style={{ background: "white", borderRadius: 24, padding: 48, maxWidth: 480, width: "90%", animation: "fadeIn 0.3s ease" }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowNewsletter(false)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><Icon name="x" size={20} /></button>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✉️</div>
            <h3 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", marginBottom: 8 }}>Stay Ahead of the Curve</h3>
            <p style={{ color: "#64748b", lineHeight: 1.6, marginBottom: 24 }}>Join 480+ leaders receiving weekly insights on systems thinking, risk management, and AI strategy.</p>
            <input className="input" placeholder="Your email address" value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)} style={{ marginBottom: 12 }} />
            <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => { setNewsletterDone(true); setShowNewsletter(false); }}>
              Subscribe — It's Free
            </button>
            <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 12, textAlign: "center" }}>No spam, ever. Unsubscribe anytime.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function ArticleCard({ article: a, onClick, delay }) {
  const c = getCat(a.category);
  return (
    <div className="card-hover anim" style={{ background: "white", borderRadius: 16, overflow: "hidden", border: "1px solid #e2e8f0", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", animationDelay: `${delay}ms` }} onClick={onClick}>
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img src={a.image} alt={a.title} style={{ width: "100%", height: 200, objectFit: "cover", transition: "transform 0.4s" }} onMouseOver={e => e.target.style.transform = "scale(1.05)"} onMouseOut={e => e.target.style.transform = "scale(1)"} />
        <div style={{ position: "absolute", top: 12, left: 12 }}><Badge cat={a.category} /></div>
      </div>
      <div style={{ padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.45, color: "#0F172A", marginBottom: 10, fontFamily: "'Lora', serif" }}>{a.title}</h3>
        <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.65, marginBottom: 16 }}>{a.excerpt.substring(0, 120)}...</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#94a3b8", fontSize: 12 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <span style={{ color: "#0F4C81", fontWeight: 600 }}>{a.author}</span>
            <span>📖 {a.readTime}m</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <span>👁 {fmt(a.views)}</span>
            <span>💬 {a.comments}</span>
          </div>
        </div>
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #f1f5f9", fontSize: 12, color: "#94a3b8" }}>{fmtDate(a.date)}</div>
      </div>
    </div>
  );
}

function ArticleModal({ article: a, articles, onClose, setSelectedArticle }) {
  const c = getCat(a.category);
  const related = articles.filter(x => x.category === a.category && x.id !== a.id).slice(0, 3);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200, overflowY: "auto", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div style={{ maxWidth: 900, margin: "48px auto", background: "white", borderRadius: 24, overflow: "hidden", animation: "fadeIn 0.3s ease" }} onClick={e => e.stopPropagation()}>
        <img src={a.image} alt={a.title} style={{ width: "100%", height: 320, objectFit: "cover" }} />
        <div style={{ padding: "40px 48px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 8 }}><Badge cat={a.category} /></div>
            <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, padding: "8px 12px", cursor: "pointer", color: "#475569" }}><Icon name="x" size={16} /></button>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#0F172A", lineHeight: 1.3, marginBottom: 16, fontFamily: "'Lora', serif" }}>{a.title}</h1>
          <div style={{ display: "flex", gap: 20, color: "#64748b", fontSize: 14, marginBottom: 32, paddingBottom: 32, borderBottom: "1px solid #e2e8f0" }}>
            <span style={{ fontWeight: 700, color: "#0F4C81" }}>{a.author}</span>
            <span>{fmtDate(a.date)}</span>
            <span>📖 {a.readTime} min read</span>
            <span>👁 {fmt(a.views)} views</span>
            <span>💬 {a.comments} comments</span>
          </div>
          <div style={{ fontFamily: "'Lora', serif", fontSize: 17, lineHeight: 1.9, color: "#334155" }}>
            <p style={{ marginBottom: 20 }}>{a.excerpt}</p>
            <p style={{ marginBottom: 20 }}>Organizations navigating today's complex environments face a fundamental challenge: traditional management approaches were designed for predictable, linear cause-and-effect relationships. But modern challenges — from climate disruption to digital transformation to geopolitical uncertainty — operate as complex adaptive systems where outcomes emerge from intricate feedback loops.</p>
            <blockquote style={{ borderLeft: `4px solid ${c.color}`, paddingLeft: 24, color: c.color, fontStyle: "italic", fontSize: 19, marginBottom: 20 }}>
              "The key insight is that you cannot solve a systems problem with a systems-unaware solution. You need to see the whole to change any part."
            </blockquote>
            <p style={{ marginBottom: 20 }}>This is where {c.label} principles provide a transformative lens. Rather than optimizing individual components, we learn to see the patterns, feedback loops, and emergent behaviors that create the outcomes we observe.</p>
            <p>Implementation requires both conceptual fluency and practical methodology. Leaders need tools for mapping system structure, identifying leverage points, and designing interventions that work with system dynamics rather than against them.</p>
          </div>
          <div style={{ marginTop: 32, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {a.tags.map(t => <span key={t} style={{ background: "#F1F5F9", color: "#475569", fontSize: 12, padding: "4px 12px", borderRadius: 20 }}>#{t}</span>)}
          </div>
          {related.length > 0 && (
            <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid #e2e8f0" }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: "#0F172A" }}>Related Articles</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
                {related.map(r => (
                  <div key={r.id} className="card-hover" style={{ border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", cursor: "pointer" }} onClick={() => setSelectedArticle(r)}>
                    <img src={r.image} alt={r.title} style={{ width: "100%", height: 100, objectFit: "cover" }} />
                    <div style={{ padding: 12 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", lineHeight: 1.4, marginBottom: 6 }}>{r.title.substring(0, 60)}...</div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>📖 {r.readTime} min</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN VIEW ──────────────────────────────────────────────────────────────
function AdminView({ articles, comments, setComments, subscribers, users, setUsers, analytics, currentUser, tab, setTab, openEditor, publishArticle, deleteArticle }) {
  const tabs = [
    { id: "overview", icon: "bar", label: "Overview" },
    { id: "articles", icon: "file", label: "Articles" },
    { id: "comments", icon: "chat", label: "Comments" },
    { id: "users", icon: "users", label: "Users" },
    { id: "subscribers", icon: "mail", label: "Subscribers" },
    { id: "analytics", icon: "trend", label: "Analytics" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>
      {/* Sidebar */}
      <div style={{ width: 240, background: "white", borderRight: "1px solid #e2e8f0", padding: 20, flexShrink: 0 }}>
        <div style={{ marginBottom: 24, padding: "12px 16px", background: "linear-gradient(135deg,#EFF6FF,#ECFEFF)", borderRadius: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#0F4C81,#0891B2)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: 14, marginBottom: 8 }}>{currentUser.avatar}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{currentUser.name}</div>
          <StatusBadge status={currentUser.role} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {tabs.map(t => (
            <button key={t.id} className={`sidebar-link ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
              <Icon name={t.icon} size={16} /> {t.label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "auto", paddingTop: 24 }}>
          <div style={{ background: "#F0FDF4", borderRadius: 10, padding: 12, fontSize: 12 }}>
            <div style={{ fontWeight: 700, color: "#16A34A", marginBottom: 4 }}>🟢 System Status</div>
            <div style={{ color: "#166534" }}>All services operational</div>
            <div style={{ color: "#166534", marginTop: 4 }}>Core Web Vitals: {analytics.webVitals.score}/100</div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: 32, overflowY: "auto" }}>
        {tab === "overview" && <OverviewTab analytics={analytics} articles={articles} comments={comments} subscribers={subscribers} />}
        {tab === "articles" && <ArticlesTab articles={articles} openEditor={openEditor} publishArticle={publishArticle} deleteArticle={deleteArticle} />}
        {tab === "comments" && <CommentsTab comments={comments} setComments={setComments} />}
        {tab === "users" && <UsersTab users={users} setUsers={setUsers} />}
        {tab === "subscribers" && <SubscribersTab subscribers={subscribers} />}
        {tab === "analytics" && <AnalyticsTab analytics={analytics} articles={articles} />}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, delta, color = "#0F4C81" }) {
  return (
    <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500, marginBottom: 8 }}>{label}</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#0F172A" }}>{value}</div>
          {delta && <div style={{ fontSize: 12, color: "#16A34A", marginTop: 4, fontWeight: 600 }}>↑ {delta}</div>}
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", color }}><Icon name={icon} size={20} /></div>
      </div>
    </div>
  );
}

function OverviewTab({ analytics, articles, comments, subscribers }) {
  const pub = articles.filter(a => a.status === "published");
  const pending = comments.filter(c => c.status === "pending");
  const active = subscribers.filter(s => s.status === "active");
  return (
    <div className="anim">
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A" }}>Dashboard Overview</h2>
        <p style={{ color: "#64748b", marginTop: 4 }}>Welcome back, {" "}
          <span style={{ color: "#0F4C81", fontWeight: 600 }}>Alexandra</span>. Here's what's happening.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 32 }}>
        <StatCard icon="file" label="Published Articles" value={pub.length} delta="3 this month" color="#0F4C81" />
        <StatCard icon="eye" label="Total Views" value={fmt(pub.reduce((s,a)=>s+a.views,0))} delta="12% vs last month" color="#0891B2" />
        <StatCard icon="chat" label="Pending Comments" value={pending.length} color="#D97706" />
        <StatCard icon="mail" label="Active Subscribers" value={active.length} delta="18 this month" color="#16A34A" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontWeight: 700, color: "#0F172A", marginBottom: 20 }}>Top Articles This Month</h3>
          {analytics.topArticles.map((a, i) => (
            <div key={a.id} style={{ display: "flex", gap: 16, alignItems: "center", padding: "12px 0", borderBottom: i < analytics.topArticles.length - 1 ? "1px solid #f1f5f9" : "none" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${getCat(a.category).color}20`, display: "flex", alignItems: "center", justifyContent: "center", color: getCat(a.category).color, fontWeight: 800, fontSize: 13 }}>#{i+1}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{a.author} · <Badge cat={a.category} /></div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{fmt(a.views)}</div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>views</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontWeight: 700, color: "#0F172A", marginBottom: 20 }}>Traffic Sources</h3>
          {analytics.trafficSources.map(s => (
            <div key={s.source} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                <span style={{ color: "#475569", fontWeight: 500 }}>{s.source}</span>
                <span style={{ fontWeight: 700, color: "#0F172A" }}>{s.pct}%</span>
              </div>
              <div style={{ height: 6, background: "#F1F5F9", borderRadius: 3 }}>
                <div style={{ height: "100%", width: `${s.pct}%`, background: "linear-gradient(90deg,#0F4C81,#0891B2)", borderRadius: 3, transition: "width 1s ease" }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop: 24, background: "#F0FDF4", borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#16A34A", marginBottom: 8 }}>Core Web Vitals</div>
            {[["LCP", `${analytics.webVitals.lcp}s`, "Good"], ["FID", `${analytics.webVitals.fid}ms`, "Good"], ["CLS", `${analytics.webVitals.cls}`, "Good"]].map(([k,v,s]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: "#475569" }}>{k}</span>
                <span style={{ fontWeight: 600, color: "#0F172A" }}>{v}</span>
                <span style={{ color: "#16A34A", fontWeight: 600 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ArticlesTab({ articles, openEditor, publishArticle, deleteArticle }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? articles : articles.filter(a => a.status === filter);
  return (
    <div className="anim">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A" }}>Article Management</h2>
        <button className="btn btn-primary" onClick={() => openEditor(null)}><Icon name="plus" size={14} /> New Article</button>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["all","published","draft","scheduled"].map(s => (
          <button key={s} className={`chip ${filter === s ? "active" : ""}`} onClick={() => setFilter(s)} style={{ textTransform: "capitalize" }}>{s} ({(s === "all" ? articles : articles.filter(a=>a.status===s)).length})</button>
        ))}
      </div>
      <div style={{ background: "white", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #e2e8f0" }}>
              {["Title","Category","Author","Date","Status","Views","Actions"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#64748b", letterSpacing: 0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a, i) => (
              <tr key={a.id} className="table-row" style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                <td style={{ padding: "14px 16px", maxWidth: 280 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>📖 {a.readTime} min · 💬 {a.comments}</div>
                </td>
                <td style={{ padding: "14px 16px" }}><Badge cat={a.category} /></td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#475569" }}>{a.author}</td>
                <td style={{ padding: "14px 16px", fontSize: 12, color: "#94a3b8" }}>{fmtDate(a.date)}</td>
                <td style={{ padding: "14px 16px" }}><StatusBadge status={a.status} /></td>
                <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{fmt(a.views)}</td>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-secondary" style={{ padding: "6px 10px" }} onClick={() => openEditor(a.id)}><Icon name="edit" size={13} /></button>
                    {a.status !== "published" && <button className="btn btn-success" style={{ padding: "6px 10px" }} onClick={() => publishArticle(a.id)}><Icon name="publish" size={13} /></button>}
                    <button className="btn btn-danger" style={{ padding: "6px 10px" }} onClick={() => deleteArticle(a.id)}><Icon name="trash" size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CommentsTab({ comments, setComments }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? comments : comments.filter(c => c.status === filter);
  const updateStatus = (id, status) => setComments(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  const del = (id) => setComments(prev => prev.filter(c => c.id !== id));
  return (
    <div className="anim">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A" }}>Comment Moderation</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{ background: "#FEF3C7", color: "#D97706", padding: "6px 12px", borderRadius: 8, fontSize: 13, fontWeight: 600 }}>⚠️ {comments.filter(c=>c.status==="pending").length} Pending</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["all","pending","approved","spam"].map(s => (
          <button key={s} className={`chip ${filter === s ? "active" : ""}`} onClick={() => setFilter(s)} style={{ textTransform: "capitalize" }}>{s} ({(s==="all"?comments:comments.filter(c=>c.status===s)).length})</button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map(c => (
          <div key={c.id} style={{ background: "white", borderRadius: 14, padding: 20, border: "1px solid #e2e8f0", borderLeft: `4px solid ${c.status==="approved"?"#16A34A":c.status==="spam"?"#DC2626":"#D97706"}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{c.author}</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{c.email} · on <span style={{ color: "#0F4C81" }}>{c.articleTitle}</span> · {fmtDate(c.date)}</div>
              </div>
              <StatusBadge status={c.status} />
            </div>
            <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, marginBottom: 14, fontStyle: c.status==="spam"?"italic":"normal", textDecoration: c.status==="spam"?"line-through":"none" }}>{c.content}</p>
            <div style={{ display: "flex", gap: 8 }}>
              {c.status !== "approved" && <button className="btn btn-success" style={{ padding: "6px 14px", fontSize: 12 }} onClick={() => updateStatus(c.id, "approved")}><Icon name="check" size={13} /> Approve</button>}
              {c.status !== "spam" && <button className="btn btn-danger" style={{ padding: "6px 14px", fontSize: 12 }} onClick={() => updateStatus(c.id, "spam")}><Icon name="shield" size={13} /> Spam</button>}
              {c.status !== "rejected" && <button className="btn btn-secondary" style={{ padding: "6px 14px", fontSize: 12 }} onClick={() => updateStatus(c.id, "rejected")}><Icon name="x" size={13} /> Reject</button>}
              <button className="btn btn-danger" style={{ padding: "6px 14px", fontSize: 12, marginLeft: "auto" }} onClick={() => del(c.id)}><Icon name="trash" size={13} /> Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UsersTab({ users, setUsers }) {
  const roles = ["admin","editor","author","contributor"];
  const updateRole = (id, role) => setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
  const roleColor = { admin: "#DC2626", editor: "#2563EB", author: "#16A34A", contributor: "#D97706" };
  return (
    <div className="anim">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A" }}>User Management</h2>
        <button className="btn btn-primary"><Icon name="plus" size={14} /> Invite User</button>
      </div>
      <div style={{ background: "white", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #e2e8f0" }}>
              {["User","Email","Role","Articles","Joined","Actions"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#64748b" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id} className="table-row" style={{ borderBottom: i < users.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${roleColor[u.role]}20`, display: "flex", alignItems: "center", justifyContent: "center", color: roleColor[u.role], fontWeight: 800, fontSize: 13 }}>{u.avatar}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{u.name}</div>
                  </div>
                </td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#64748b" }}>{u.email}</td>
                <td style={{ padding: "14px 16px" }}>
                  <select className="select" value={u.role} onChange={e => updateRole(u.id, e.target.value)} style={{ fontSize: 12, padding: "5px 10px", color: roleColor[u.role], fontWeight: 700 }}>
                    {roles.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                  </select>
                </td>
                <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{u.articles}</td>
                <td style={{ padding: "14px 16px", fontSize: 12, color: "#94a3b8" }}>{fmtDate(u.joined)}</td>
                <td style={{ padding: "14px 16px" }}>
                  <button className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: 12 }}><Icon name="edit" size={13} /> Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginTop: 24 }}>
        {roles.map(r => (
          <div key={r} style={{ background: "white", borderRadius: 12, padding: 16, border: "1px solid #e2e8f0", textAlign: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${roleColor[r]}15`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", color: roleColor[r] }}><Icon name="shield" size={18} /></div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", textTransform: "capitalize" }}>{r}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: roleColor[r], marginTop: 4 }}>{users.filter(u=>u.role===r).length}</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>users</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SubscribersTab({ subscribers }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? subscribers : subscribers.filter(s => s.status === filter);
  return (
    <div className="anim">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A" }}>Newsletter Subscribers</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-secondary"><Icon name="save" size={14} /> Export CSV</button>
          <button className="btn btn-primary"><Icon name="mail" size={14} /> Send Newsletter</button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard icon="users" label="Total Subscribers" value={subscribers.length} color="#0F4C81" />
        <StatCard icon="check" label="Active" value={subscribers.filter(s=>s.status==="active").length} color="#16A34A" />
        <StatCard icon="x" label="Unsubscribed" value={subscribers.filter(s=>s.status==="unsubscribed").length} color="#DC2626" />
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["all","active","unsubscribed"].map(s => (
          <button key={s} className={`chip ${filter === s ? "active" : ""}`} onClick={() => setFilter(s)} style={{ textTransform: "capitalize" }}>{s}</button>
        ))}
      </div>
      <div style={{ background: "white", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #e2e8f0" }}>
              {["Name","Email","Status","Source","Subscribed"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#64748b" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s.id} className="table-row" style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{s.name}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "#64748b" }}>{s.email}</td>
                <td style={{ padding: "12px 16px" }}><StatusBadge status={s.status} /></td>
                <td style={{ padding: "12px 16px", fontSize: 12, color: "#94a3b8" }}>{s.source}</td>
                <td style={{ padding: "12px 16px", fontSize: 12, color: "#94a3b8" }}>{fmtDate(s.subscribed)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AnalyticsTab({ analytics, articles }) {
  const maxViews = Math.max(...analytics.pageViews);
  const maxSubs = Math.max(...analytics.subscribers);
  return (
    <div className="anim">
      <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", marginBottom: 24 }}>Analytics Dashboard</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
        {/* Page Views Chart */}
        <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700, color: "#0F172A" }}>Monthly Page Views</h3>
            <span style={{ fontSize: 13, color: "#16A34A", fontWeight: 600 }}>↑ 11.3% YoY</span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 140 }}>
            {analytics.pageViews.map((v, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ width: "100%", background: `linear-gradient(180deg,#0F4C81,#0891B2)`, borderRadius: "4px 4px 0 0", height: `${(v/maxViews)*120}px`, transition: "height 0.5s ease", cursor: "pointer" }} title={`${MONTHS[i]}: ${v.toLocaleString()} views`} />
                <div style={{ fontSize: 9, color: "#94a3b8" }}>{MONTHS[i]}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Subscribers Chart */}
        <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700, color: "#0F172A" }}>Subscriber Growth</h3>
            <span style={{ fontSize: 13, color: "#16A34A", fontWeight: 600 }}>+{analytics.subscribers[11] - analytics.subscribers[0]} this year</span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 140 }}>
            {analytics.subscribers.map((v, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ width: "100%", background: `linear-gradient(180deg,#16A34A,#34D399)`, borderRadius: "4px 4px 0 0", height: `${(v/maxSubs)*120}px`, transition: "height 0.5s ease" }} title={`${MONTHS[i]}: ${v} subscribers`} />
                <div style={{ fontSize: 9, color: "#94a3b8" }}>{MONTHS[i]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>Performance by Category</h3>
          {CATEGORIES.map(c => {
            const catArticles = articles.filter(a => a.category === c.id && a.status === "published");
            const views = catArticles.reduce((s,a) => s + a.views, 0);
            const maxCatViews = CATEGORIES.map(cc => articles.filter(a=>a.category===cc.id&&a.status==="published").reduce((s,a)=>s+a.views,0));
            const maxV = Math.max(...maxCatViews);
            return (
              <div key={c.id} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                  <span style={{ fontWeight: 600, color: c.color }}>{c.label}</span>
                  <span style={{ color: "#64748b" }}>{fmt(views)} views · {catArticles.length} articles</span>
                </div>
                <div style={{ height: 8, background: "#F1F5F9", borderRadius: 4 }}>
                  <div style={{ height: "100%", width: `${(views/maxV)*100}%`, background: c.color, borderRadius: 4, transition: "width 1s ease" }} />
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>Core Web Vitals</h3>
          {[
            { label: "Largest Contentful Paint", key: "lcp", value: `${analytics.webVitals.lcp}s`, good: analytics.webVitals.lcp < 2.5 },
            { label: "First Input Delay", key: "fid", value: `${analytics.webVitals.fid}ms`, good: analytics.webVitals.fid < 100 },
            { label: "Cumulative Layout Shift", key: "cls", value: analytics.webVitals.cls, good: analytics.webVitals.cls < 0.1 },
          ].map(m => (
            <div key={m.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #f1f5f9" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{m.label}</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{m.good ? "✅ Good" : "⚠️ Needs Improvement"}</div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: m.good ? "#16A34A" : "#D97706" }}>{m.value}</div>
            </div>
          ))}
          <div style={{ marginTop: 20, background: "linear-gradient(135deg,#EFF6FF,#ECFEFF)", borderRadius: 12, padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 4 }}>Overall Performance Score</div>
            <div style={{ fontSize: 48, fontWeight: 900, color: "#16A34A" }}>{analytics.webVitals.score}</div>
            <div style={{ fontSize: 12, color: "#16A34A", fontWeight: 600 }}>/ 100 — Excellent</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── EDITOR VIEW ─────────────────────────────────────────────────────────────
function EditorView({ articles, setArticles, editingId, onBack }) {
  const existing = editingId ? articles.find(a => a.id === editingId) : null;
  const [title, setTitle] = useState(existing?.title || "");
  const [excerpt, setExcerpt] = useState(existing?.excerpt || "");
  const [content, setContent] = useState(existing?.content || "");
  const [category, setCategory] = useState(existing?.category || "systems");
  const [tags, setTags] = useState(existing?.tags?.join(", ") || "");
  const [status, setStatus] = useState(existing?.status || "draft");
  const [scheduledDate, setScheduledDate] = useState(existing?.scheduledDate ? existing.scheduledDate.split("T")[0] : "");
  const [scheduledTime, setScheduledTime] = useState(existing?.scheduledDate ? existing.scheduledDate.split("T")[1]?.substring(0,5) : "09:00");
  const [tz, setTz] = useState("America/New_York");
  const [versions, setVersions] = useState(existing?.versions || []);
  const [lastSaved, setLastSaved] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [activeBlock, setActiveBlock] = useState("text");
  const autoSaveRef = useRef(null);
  const titleRef = useRef(title);
  const contentRef = useRef(content);

  titleRef.current = title;
  contentRef.current = content;

  const save = useCallback((isAuto = false) => {
    setSaving(true);
    setTimeout(() => {
      const newVersion = { id: Date.now(), timestamp: new Date().toISOString(), author: "Alexandra Silva", note: isAuto ? "Auto-save" : "Manual save" };
      setVersions(prev => [...prev, newVersion]);
      setLastSaved(new Date());
      setSaving(false);

      setArticles(prev => {
        const upd = {
          id: editingId || Date.now(),
          title: titleRef.current,
          excerpt,
          content: contentRef.current,
          category,
          tags: tags.split(",").map(t => t.trim()).filter(Boolean),
          status,
          author: "Alexandra Silva",
          authorId: 1,
          date: new Date().toISOString().split("T")[0],
          readTime: Math.max(1, Math.ceil((contentRef.current.split(" ").length) / 200)),
          views: existing?.views || 0,
          comments: existing?.comments || 0,
          featured: existing?.featured || false,
          image: existing?.image || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
          scheduledDate: status === "scheduled" && scheduledDate ? `${scheduledDate}T${scheduledTime}:00` : null,
          versions: [...(existing?.versions || []), newVersion],
        };
        if (editingId) return prev.map(a => a.id === editingId ? upd : a);
        return [...prev, upd];
      });
    }, 600);
  }, [excerpt, category, tags, status, scheduledDate, scheduledTime, editingId, existing]);

  useEffect(() => {
    autoSaveRef.current = setInterval(() => save(true), 30000);
    return () => clearInterval(autoSaveRef.current);
  }, [save]);

  const restoreVersion = (v) => {
    alert(`Restored version from ${fmtDate(v.timestamp)} at ${fmtTime(v.timestamp)}`);
    setShowHistory(false);
  };

  const publish = () => {
    setStatus("published");
    save(false);
    setTimeout(onBack, 700);
  };

  const schedule = () => {
    if (!scheduledDate) { alert("Please set a scheduled date"); return; }
    setStatus("scheduled");
    save(false);
    setTimeout(onBack, 700);
  };

  const BLOCKS = [
    { id: "text", label: "📝 Paragraph" },
    { id: "heading", label: "H2 Heading" },
    { id: "quote", label: "❝ Pull Quote" },
    { id: "callout", label: "📌 Callout Box" },
    { id: "image", label: "🖼 Image" },
    { id: "video", label: "▶️ Video Embed" },
    { id: "code", label: "💻 Code Block" },
    { id: "table", label: "📊 Table" },
    { id: "faq", label: "❓ FAQ Accordion" },
    { id: "list", label: "• List" },
  ];

  const insertBlock = (type) => {
    const inserts = {
      text: "\n\nYour paragraph text here...",
      heading: "\n\n## Your Heading Here",
      quote: "\n\n> \"Your compelling pull quote here\" — Author Name",
      callout: "\n\n[CALLOUT] Key insight or important note goes here. [/CALLOUT]",
      code: "\n\n```javascript\n// Your code here\nconsole.log('Hello World');\n```",
      faq: "\n\n**Q: Your question here?**\nA: Your answer here.",
      list: "\n\n- Item one\n- Item two\n- Item three",
    };
    setContent(prev => prev + (inserts[type] || `\n\n[${type.toUpperCase()} BLOCK]`));
  };

  if (previewMode) {
    return (
      <div style={{ maxWidth: 800, margin: "0 auto", padding: 40 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
          <button className="btn btn-secondary" onClick={() => setPreviewMode(false)}><Icon name="x" size={14} /> Exit Preview</button>
          <span style={{ background: "#EFF6FF", color: "#0F4C81", padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600 }}>👁 Preview Mode</span>
        </div>
        <div style={{ background: "white", borderRadius: 20, overflow: "hidden", border: "1px solid #e2e8f0", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
          <div style={{ height: 280, background: "linear-gradient(135deg,#0F4C81,#0891B2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center", color: "white", padding: 32 }}>
              <Badge cat={category} />
              <h1 style={{ fontSize: 32, fontWeight: 800, marginTop: 16, fontFamily: "'Lora',serif", lineHeight: 1.3 }}>{title || "Article Title"}</h1>
            </div>
          </div>
          <div style={{ padding: "40px 48px" }}>
            <div style={{ display: "flex", gap: 20, color: "#64748b", fontSize: 14, marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid #e2e8f0" }}>
              <span style={{ fontWeight: 700, color: "#0F4C81" }}>Alexandra Silva</span>
              <span>{fmtDate(new Date())}</span>
              <span>📖 {Math.max(1, Math.ceil(content.split(" ").length / 200))} min read</span>
            </div>
            <p style={{ fontFamily: "'Lora',serif", fontSize: 18, lineHeight: 1.8, color: "#334155", marginBottom: 24 }}>{excerpt || "Article excerpt will appear here..."}</p>
            <div style={{ fontFamily: "'Lora',serif", fontSize: 16, lineHeight: 1.9, color: "#475569", whiteSpace: "pre-wrap" }}>{content || "Article content will appear here..."}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr 280px", minHeight: "calc(100vh - 64px)" }}>
      {/* Block Toolbar */}
      <div style={{ background: "white", borderRight: "1px solid #e2e8f0", padding: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: 1, marginBottom: 12, textTransform: "uppercase" }}>Content Blocks</div>
        {BLOCKS.map(b => (
          <button key={b.id} onClick={() => insertBlock(b.id)} style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: 8, marginBottom: 6, cursor: "pointer", fontSize: 13, background: "white", transition: "all 0.2s", fontFamily: "inherit" }}
            onMouseOver={e => { e.target.style.background="#EFF6FF"; e.target.style.borderColor="#0891B2"; }}
            onMouseOut={e => { e.target.style.background="white"; e.target.style.borderColor="#e2e8f0"; }}>
            {b.label}
          </button>
        ))}
        <div style={{ marginTop: 20, padding: 12, background: "#F8FAFC", borderRadius: 10, fontSize: 12 }}>
          <div style={{ fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>SEO Preview</div>
          <div style={{ color: "#1a73e8", fontWeight: 600, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title.substring(0, 60) || "Article Title"}</div>
          <div style={{ color: "#16A34A", fontSize: 11, margin: "2px 0" }}>asilvainnovations.com/blog/...</div>
          <div style={{ color: "#475569", fontSize: 11, lineHeight: 1.5 }}>{excerpt.substring(0, 120) || "Meta description..."}</div>
        </div>
      </div>

      {/* Editor */}
      <div style={{ padding: "32px 40px", background: "#F8FAFC", overflowY: "auto" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-secondary" onClick={onBack}><Icon name="arrow" size={14} style={{ transform: "rotate(180deg)" }} /> Back</button>
              <button className="btn btn-secondary" onClick={() => setPreviewMode(true)}><Icon name="eye" size={14} /> Preview</button>
              <button className="btn btn-secondary" onClick={() => setShowHistory(true)}><Icon name="history" size={14} /> History ({versions.length})</button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {saving && <span style={{ fontSize: 12, color: "#94a3b8", animation: "pulse 1s infinite" }}>💾 Saving...</span>}
              {lastSaved && !saving && <span style={{ fontSize: 12, color: "#16A34A" }}>✅ Saved {fmtTime(lastSaved)}</span>}
              <span style={{ fontSize: 11, color: "#94a3b8" }}>Auto-saves every 30s</span>
            </div>
          </div>

          <input className="input" placeholder="Article Title..." value={title} onChange={e => setTitle(e.target.value)} style={{ fontSize: 24, fontWeight: 800, border: "none", background: "transparent", padding: "8px 0", marginBottom: 16, color: "#0F172A", fontFamily: "'Poppins',sans-serif" }} />

          <textarea className="input" placeholder="Write a compelling excerpt (appears in article cards and search results)..." value={excerpt} onChange={e => setExcerpt(e.target.value)} style={{ marginBottom: 16, minHeight: 80, resize: "none", fontFamily: "'Lora',serif", fontSize: 15 }} />

          <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", background: "#F8FAFC", borderBottom: "1px solid #e2e8f0", display: "flex", gap: 8 }}>
              {["B","I","U","H2","H3","• List","❝"].map(f => (
                <button key={f} style={{ padding: "4px 10px", border: "1px solid #e2e8f0", borderRadius: 6, background: "white", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>{f}</button>
              ))}
            </div>
            <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Start writing your article... Use the blocks on the left to insert rich content elements, or write in Markdown." style={{ width: "100%", minHeight: 400, padding: 24, border: "none", outline: "none", fontSize: 16, lineHeight: 1.9, fontFamily: "'Lora',serif", color: "#334155", resize: "vertical" }} />
          </div>

          <div style={{ marginTop: 16, padding: 16, background: "white", borderRadius: 12, border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>
              Words: {content.split(/\s+/).filter(Boolean).length} · Estimated read time: {Math.max(1, Math.ceil(content.split(" ").length/200))} min · Characters: {content.length}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      <div style={{ background: "white", borderLeft: "1px solid #e2e8f0", padding: 24, overflowY: "auto" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: 1, marginBottom: 16, textTransform: "uppercase" }}>Publish Settings</div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>Category</label>
          <select className="select" value={category} onChange={e => setCategory(e.target.value)} style={{ width: "100%" }}>
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>Tags (comma-separated)</label>
          <input className="input" value={tags} onChange={e => setTags(e.target.value)} placeholder="systems-thinking, leadership..." />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>Status</label>
          <select className="select" value={status} onChange={e => setStatus(e.target.value)} style={{ width: "100%" }}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>

        {/* Schedule Settings */}
        <div style={{ background: "#EFF6FF", borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0F4C81", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="calendar" size={14} /> Schedule Publishing
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 12, color: "#475569", display: "block", marginBottom: 4 }}>Publish Date</label>
            <input type="date" className="input" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} style={{ fontSize: 13 }} />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 12, color: "#475569", display: "block", marginBottom: 4 }}>Publish Time</label>
            <input type="time" className="input" value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} style={{ fontSize: 13 }} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: "#475569", display: "block", marginBottom: 4 }}>Timezone</label>
            <select className="select" value={tz} onChange={e => setTz(e.target.value)} style={{ width: "100%", fontSize: 12 }}>
              {["America/New_York","America/Chicago","America/Denver","America/Los_Angeles","UTC","Europe/London","Europe/Paris","Asia/Tokyo","Asia/Singapore"].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button className="btn btn-secondary" style={{ justifyContent: "center" }} onClick={() => save(false)}>
            <Icon name="save" size={14} /> Save Draft
          </button>
          <button className="btn" style={{ background: "#FFFBEB", color: "#D97706", border: "1.5px solid #FEF3C7", justifyContent: "center" }} onClick={schedule}>
            <Icon name="calendar" size={14} /> Schedule
          </button>
          <button className="btn btn-primary" style={{ justifyContent: "center" }} onClick={publish}>
            <Icon name="publish" size={14} /> Publish Now
          </button>
        </div>

        {/* TOC Preview */}
        {content && (
          <div style={{ marginTop: 24, background: "#F8FAFC", borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", marginBottom: 10 }}>Table of Contents</div>
            {content.split("\n").filter(l => l.startsWith("##")).map((h, i) => (
              <div key={i} style={{ fontSize: 12, color: "#0891B2", padding: "3px 0", borderLeft: "2px solid #0891B2", paddingLeft: 8, marginBottom: 4 }}>{h.replace(/^#+\s/, "")}</div>
            ))}
            {!content.includes("##") && <div style={{ fontSize: 12, color: "#94a3b8" }}>Add ## headings to generate TOC</div>}
          </div>
        )}
      </div>

      {/* Version History Modal */}
      {showHistory && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setShowHistory(false)}>
          <div style={{ background: "white", borderRadius: 20, padding: 32, maxWidth: 500, width: "90%", maxHeight: "70vh", overflowY: "auto", animation: "fadeIn 0.3s ease" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0F172A" }}>Version History</h3>
              <button onClick={() => setShowHistory(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><Icon name="x" size={18} /></button>
            </div>
            {versions.length === 0 && <div style={{ textAlign: "center", color: "#94a3b8", padding: 32 }}>No versions yet. Save your article to create the first version.</div>}
            {[...versions].reverse().map((v, i) => (
              <div key={v.id} style={{ display: "flex", gap: 16, alignItems: "center", padding: "14px 0", borderBottom: "1px solid #f1f5f9" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: i === 0 ? "#16A34A" : "#CBD5E1", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{v.note}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>{v.author} · {fmtDate(v.timestamp)} at {fmtTime(v.timestamp)}</div>
                </div>
                {i === 0 ? (
                  <span style={{ fontSize: 11, background: "#F0FDF4", color: "#16A34A", padding: "3px 8px", borderRadius: 6, fontWeight: 600 }}>Current</span>
                ) : (
                  <button className="btn btn-secondary" style={{ padding: "5px 12px", fontSize: 12 }} onClick={() => restoreVersion(v)}>
                    <Icon name="restore" size={12} /> Restore
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DRAFTS VIEW ─────────────────────────────────────────────────────────────
function DraftsView({ articles, openEditor, publishArticle, deleteArticle, onBack }) {
  const drafts = articles.filter(a => a.status !== "published");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = drafts.filter(a => {
    const matchStatus = filter === "all" || a.status === filter;
    const matchSearch = !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0F172A" }}>Draft Management</h1>
          <p style={{ color: "#64748b", marginTop: 4 }}>Manage your unpublished articles, scheduled posts, and drafts.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-secondary" onClick={onBack}><Icon name="home" size={14} /> Blog</button>
          <button className="btn btn-primary" onClick={() => openEditor(null)}><Icon name="plus" size={14} /> New Draft</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 32, marginTop: 24 }}>
        {[["draft","📝","Drafts","#64748b"],["scheduled","📅","Scheduled","#2563EB"],["all","📄","Total Unpublished","#0F4C81"]].map(([s,icon,label,color]) => {
          const count = s === "all" ? drafts.length : drafts.filter(a=>a.status===s).length;
          return (
            <div key={s} style={{ background: "white", borderRadius: 14, padding: 20, border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 16, cursor: "pointer" }} onClick={() => setFilter(s)}>
              <div style={{ fontSize: 28 }}>{icon}</div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 800, color }}>{count}</div>
                <div style={{ fontSize: 13, color: "#64748b" }}>{label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters + Search */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}><Icon name="search" size={15} /></span>
          <input className="input" placeholder="Search drafts..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ paddingLeft: 38 }} />
        </div>
        {["all","draft","scheduled"].map(s => (
          <button key={s} className={`chip ${filter === s ? "active" : ""}`} onClick={() => setFilter(s)} style={{ textTransform: "capitalize" }}>{s}</button>
        ))}
      </div>

      {/* Drafts List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {filtered.map(a => (
          <DraftCard key={a.id} article={a} onEdit={() => openEditor(a.id)} onPublish={() => publishArticle(a.id)} onDelete={() => deleteArticle(a.id)} />
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 24px", background: "white", borderRadius: 16, border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 48 }}>📝</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#0F172A", marginTop: 16 }}>No drafts found</div>
            <div style={{ fontSize: 14, color: "#94a3b8", marginTop: 8 }}>Start writing your next article</div>
            <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => openEditor(null)}><Icon name="plus" size={14} /> Create New Draft</button>
          </div>
        )}
      </div>
    </div>
  );
}

function DraftCard({ article: a, onEdit, onPublish, onDelete }) {
  const [showVersions, setShowVersions] = useState(false);
  const c = getCat(a.category);
  return (
    <div style={{ background: "white", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "180px 1fr auto", gap: 0 }}>
        <img src={a.image} alt={a.title} style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: 140 }} />
        <div style={{ padding: "24px 28px" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <Badge cat={a.category} />
            <StatusBadge status={a.status} />
          </div>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0F172A", lineHeight: 1.4, marginBottom: 8, fontFamily: "'Lora',serif" }}>{a.title}</h3>
          <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, marginBottom: 12 }}>{a.excerpt?.substring(0, 150)}...</p>
          <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#94a3b8" }}>
            <span>✍️ {a.author}</span>
            <span>📖 {a.readTime} min read</span>
            <span>🏷 {a.tags?.length || 0} tags</span>
            {a.scheduledDate && <span style={{ color: "#2563EB", fontWeight: 600 }}>📅 Scheduled: {fmtDate(a.scheduledDate)} at {fmtTime(a.scheduledDate)}</span>}
          </div>
          {a.versions?.length > 0 && (
            <button onClick={() => setShowVersions(!showVersions)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#0891B2", fontWeight: 600, marginTop: 10, padding: 0, fontFamily: "inherit" }}>
              <Icon name="history" size={12} /> {a.versions.length} version{a.versions.length > 1 ? "s" : ""} · Last: {fmtTime(a.versions[a.versions.length-1]?.timestamp)}
            </button>
          )}
          {showVersions && a.versions?.length > 0 && (
            <div style={{ marginTop: 10, padding: 12, background: "#F8FAFC", borderRadius: 8 }}>
              {[...a.versions].reverse().slice(0, 4).map((v, i) => (
                <div key={v.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748b", padding: "4px 0", borderBottom: i < Math.min(a.versions.length,4)-1 ? "1px solid #e2e8f0" : "none" }}>
                  <span>{v.note}</span>
                  <span>{fmtDate(v.timestamp)} {fmtTime(v.timestamp)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: 8, justifyContent: "center", borderLeft: "1px solid #f1f5f9" }}>
          <button className="btn btn-secondary" style={{ justifyContent: "center", minWidth: 110 }} onClick={onEdit}>
            <Icon name="edit" size={13} /> Edit
          </button>
          <button className="btn btn-success" style={{ justifyContent: "center" }} onClick={onPublish}>
            <Icon name="publish" size={13} /> Publish
          </button>
          <button className="btn btn-danger" style={{ justifyContent: "center" }} onClick={onDelete}>
            <Icon name="trash" size={13} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}