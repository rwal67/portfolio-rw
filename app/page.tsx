'use client'

import React, { useState, useEffect, useRef } from 'react';

interface Project {
  id: number;
  title: string;
  date: string;
  tags: string[];
  preview: string;
  process: string;
  link: string;
  roles: string[];
  inProgress?: boolean;
  previewVideo?: string;
  galleryImages?: string[];
  award?: string;
}

const ROLES = ['writing', 'design', 'strategy'] as const;
type Role = typeof ROLES[number];

const BG        = '#f5f1ea';
const SURFACE   = '#ede8de';
const INK       = '#1c1510';
const INK_MID   = 'rgba(28,21,16,0.5)';
const INK_FAINT = 'rgba(28,21,16,0.25)';
const RULE      = 'rgba(28,21,16,0.1)';

const TERRA  = '#b85c38';
const WALNUT = '#8c7055';
const SAGE   = '#5a7a5c';

const PALETTE: Record<Role, { bg: string; text: string }> = {
  writing:  { bg: TERRA,  text: '#f5ede0' },
  design:   { bg: WALNUT, text: '#f5ede0' },
  strategy: { bg: SAGE,   text: '#f5ede0' },
};

const ALL_PROJECTS: Project[] = [
  {
    id: 1, title: "OCD Visualizer", link: "https://ocd-visualizer.vercel.app/",
    preview: "A rendering of the recursive patterns of Obsessive-Compulsive Disorder. Uses ASCII characters to illustrate both the looping and recovery process for individuals with OCD.",
    process: "Built in Next.js. Leverages dynamically rendered particles which are navigable and scripted to move and cluster through an interactive experience.",
    tags: ["Next.js", "ASCII", "JS"], date: "2025", roles: ["design", "writing"],
    previewVideo: "/ocd_vid2.mov"
  },
  {
    id: 2, title: "Excerpter", link: "https://rwal67.github.io/Excerpter2/index.html",
    preview: "A prose generator iterating on the Cut-Up writing technique. 285 fragments of original writing, randomized in sequence and formatting, are juxtaposed with stock footage that shifts and distorts in tandem.",
    process: "Built in HTML, CSS, and JavaScript. The text engine randomizes typographic scale, indentation, and excerpt selection simultaneously, with no two outputs being the same.",
    tags: ["HTML", "CSS", "JS", "Writing"], date: "2024", roles: ["writing", "design"],
    previewVideo: "/excerpt_demo.mov",
    award: "Featured — 2025 Pitt Digital Media & Design Showcase"
  },
  {
    id: 4, title: "Proofpoint Sales Case", link: "#",
    preview: "A first-place B2B pitch for Proofpoint built for the Pitt Professional Sales Academy. We had to make a technical cybersecurity product legible and urgent to a non-technical room.",
    process: "Led creative direction, including original deck and one-pager materials. Collaborated on the narrative arc from problem framing to close.",
    tags: ["Sales", "B2B", "Narrative", "Presentation"], date: "2025", roles: ["strategy", "design"],
    galleryImages: ["/pp_2.png", "/pp_broch.png", "/pp_1.png"],
    award: "First Place Team — Pitt Professional Sales Academy 2025"
  },
  {
    id: 3, title: "Pitt UX Hub", link: "#", inProgress: true,
    preview: "Pitt, though having many opportunities for students to get involved in UX and HCI, has no dedicated UX major. We are developing a student-facing directory pulling together coursework, career pathways, and opportunities across departments into one place. Expected April 2026.",
    process: "Collaborating with faculty stakeholders to map Pitt's UX and HCI landscape into a navigable taxonomy of eight career domains. Responsible for information architecture, usability research, and content categorization.",
    tags: ["UX", "WordPress", "Web Development"], date: "2024", roles: ["design", "strategy"]
  },
];

const SLOP = "I'm a passionate storyteller and cross-functional creative catalyst, leveraging human-centered design thinking to architect scalable narrative ecosystems that drive engagement, foster community, and accelerate your brand's journey toward authentic, data-driven impact.";
const PUNCHLINE = "I'm here to make sure you don't sound like that.";

type Phase = 'typing-slop' | 'pausing' | 'crossing-out' | 'pause-after-cross' | 'typing-punchline' | 'done';

function useTypewriter() {
  const [slopText, setSlopText] = useState('');
  const [punchlineText, setPunchlineText] = useState('');
  const [phase, setPhase] = useState<Phase>('typing-slop');
  const [crossed, setCrossed] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const idx = useRef(0);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (phase === 'typing-slop') {
      if (idx.current < SLOP.length) {
        t = setTimeout(() => { setSlopText(SLOP.slice(0, idx.current + 1)); idx.current++; }, 2);
      } else { t = setTimeout(() => setPhase('pausing'), 200); }
    }
    if (phase === 'pausing') { t = setTimeout(() => setPhase('crossing-out'), 50); }
    if (phase === 'crossing-out') { setCrossed(true); t = setTimeout(() => setPhase('pause-after-cross'), 400); }
    if (phase === 'pause-after-cross') { t = setTimeout(() => { idx.current = 0; setPhase('typing-punchline'); }, 100); }
    if (phase === 'typing-punchline') {
      if (idx.current < PUNCHLINE.length) {
        t = setTimeout(() => { setPunchlineText(PUNCHLINE.slice(0, idx.current + 1)); idx.current++; }, 8);
      } else { t = setTimeout(() => setPhase('done'), 200); }
    }
    if (phase === 'done') {
      t = setTimeout(() => setCollapsed(true), 5000);
    }
    return () => clearTimeout(t);
  }, [phase, slopText, punchlineText]);

  return { slopText, punchlineText, phase, crossed, done: phase === 'done', collapsed, expanded, setExpanded };
}

export default function PortfolioHome() {
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const { slopText, punchlineText, phase, crossed, collapsed, expanded, setExpanded } = useTypewriter();

  const showAbout = !selectedProject;

  const handleRoleClick = (role: Role) => {
    if (activeRole === role) {
      setActiveRole(null);
      setSelectedProject(null);
      return;
    }
    setActiveRole(role);
    setSelectedProject(ALL_PROJECTS.filter(p => p.roles.includes(role))[0] ?? null);
    setGalleryIndex(0);
  };

  const visibleProjects = activeRole
    ? ALL_PROJECTS.filter(p => p.roles.includes(activeRole))
    : [];

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: BG, color: INK,
      fontFamily: '"Lora", Georgia, serif', padding: '1.5rem 1.5rem 2rem', boxSizing: 'border-box'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
        .nav-btn { transition: opacity 0.15s ease; }
        .nav-btn:hover { opacity: 0.75 !important; }
        .role-chip {
          cursor: pointer;
          transition: background-color 0.15s ease, color 0.15s ease, opacity 0.15s ease;
          padding: 0.05rem 0.35rem;
          border-radius: 2px;
        }
        .role-chip:hover { opacity: 0.8; }
        .rory-home { transition: opacity 0.15s ease; }
        .rory-home:hover { opacity: 0.7; }
        .proj-pill { transition: background-color 0.15s ease, color 0.15s ease; cursor: pointer; }
        .proj-pill:hover { opacity: 0.7; }
        .visit-btn { transition: opacity 0.15s ease; }
        .visit-btn:hover { opacity: 0.75 !important; }
        .gallery-arrow { transition: opacity 0.15s ease; cursor: pointer; user-select: none; }
        .gallery-arrow:hover { opacity: 0.6; }
        .cursor-blink::after {
          content: '|'; animation: blink 0.7s step-end infinite; margin-left: 1px;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .slide-reveal { overflow: hidden; max-height: 0; opacity: 0; transition: max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease; }
        .slide-reveal.open { max-height: 200px; opacity: 1; }
        .media-frame { width: 100%; aspect-ratio: 16/9; overflow: hidden; border-radius: 2px; border: 1px solid ${RULE}; background: ${INK}; }
        @media (max-width: 700px) {
          .main-cols { flex-direction: column !important; }
          .left-col, .right-col { width: 100% !important; flex: unset !important; }
          .photo-pair { height: 200px !important; }
        }
      `}</style>

      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>

        {/* ── HEADER ── */}
        <header style={{ marginBottom: '1.1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', paddingBottom: '0.9rem' }}>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '700', lineHeight: '1', margin: 0 }}>Rory Walsh</h1>
            <nav style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              {([
                { href: 'mailto:rorywalsh425@gmail.com', label: 'Email', bg: TERRA, text: '#f5ede0', download: undefined },
                { href: 'https://www.linkedin.com/in/rorypwalsh/', label: 'LinkedIn', bg: WALNUT, text: '#f5ede0', download: undefined },
                { href: '/Rory_Walsh_Resume.pdf', label: 'Resume', bg: SAGE, text: '#f5ede0', download: true },
              ] as const).map(({ href, label, bg, text, download }) => (
                <a key={label} href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  download={download ? 'Rory_Walsh_Resume.pdf' : undefined}
                  className="nav-btn"
                  style={{
                    backgroundColor: bg, color: text,
                    textDecoration: 'none', fontSize: '0.8rem', fontWeight: '600',
                    padding: '0.35rem 0.8rem', borderRadius: '2px',
                    fontFamily: '"Lora", Georgia, serif',
                  }}
                >{label}</a>
              ))}
            </nav>
          </div>
          <div style={{ height: '1px', backgroundColor: RULE }} />
        </header>

        {/* ── INTRO ── */}
        <div style={{ marginBottom: '0.85rem' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.05rem', marginBottom: '0.1rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: '700' }}>Hi!</span>
            <span style={{ fontSize: '1.75rem', fontWeight: '700' }}>
              I&apos;m{' '}
              <span
                className={selectedProject ? 'rory-home' : undefined}
                onClick={() => { if (selectedProject) { setSelectedProject(null); setActiveRole(null); } }}
                style={{
                  textDecoration: selectedProject ? 'underline' : 'none',
                  textUnderlineOffset: '3px',
                  cursor: selectedProject ? 'pointer' : 'default',
                }}
              >Rory</span>.{collapsed && (
                <sup
                  onClick={() => setExpanded(e => !e)}
                  style={{
                    fontSize: '0.55rem', color: INK, cursor: 'pointer',
                    userSelect: 'none', marginLeft: '3px', fontWeight: '400',
                    verticalAlign: 'super', lineHeight: 0,
                  }}
                >{expanded ? '∨' : '∧'}</sup>
              )}
            </span>
          </div>

          {/* Typewriter zone */}
          <div style={{
            maxWidth: '640px', marginBottom: '0.1rem',
            overflow: 'hidden',
            maxHeight: collapsed && !expanded ? '0' : '8rem',
            opacity: collapsed && !expanded ? 0 : 1,
            transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.35s ease',
          }}>
            <div style={{ minHeight: '1.2rem', marginBottom: '0.1rem' }}>
              {slopText && (
                <p style={{ margin: 0, fontSize: '0.78rem', lineHeight: '1.55', fontWeight: '400', color: INK }}>
                  <span style={{
                    textDecoration: crossed ? `line-through ${INK}` : 'none',
                    opacity: crossed ? 0.3 : 1,
                    transition: 'opacity 0.35s ease',
                  }}>{slopText}</span>
                  {phase === 'typing-slop' && <span className="cursor-blink" />}
                </p>
              )}
            </div>
            <div style={{ minHeight: '1.55rem' }}>
              {(phase === 'typing-punchline' || phase === 'done') && (
                <p style={{ margin: 0, fontSize: '1rem', lineHeight: '1.5', fontWeight: '400', color: INK_MID }}>
                  {punchlineText}
                  {phase === 'typing-punchline' && <span className="cursor-blink" />}
                </p>
              )}
            </div>
          </div>

          {/* Blurb */}
          <p style={{ margin: '0 0 0.3rem', fontSize: '1.75rem', lineHeight: '1.35', fontWeight: '700', maxWidth: '640px' }}>
            I tell stories through{' '}
            {ROLES.map((role, i) => (
              <React.Fragment key={role}>
                <span
                  className="role-chip"
                  onClick={() => handleRoleClick(role)}
                  style={{
                    backgroundColor: activeRole === role
                      ? PALETTE[role].bg
                      : role === 'writing' ? `${TERRA}22`
                      : role === 'design'  ? `${WALNUT}22`
                      : `${SAGE}22`,
                    color: activeRole === role ? PALETTE[role].text : INK,
                    fontWeight: '700',
                    textDecoration: activeRole === role ? 'none' : 'underline',
                    textUnderlineOffset: '3px',
                  }}
                >{role}</span>
                {i === 0 && ', '}
                {i === 1 && ' and '}
              </React.Fragment>
            ))}
            {' '}to connect with others through the products we use.
          </p>

          {/* Project pills */}
          <div className={`slide-reveal ${activeRole ? 'open' : ''}`}>
            <div style={{ height: '1px', backgroundColor: RULE, margin: '0.45rem 0' }} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {visibleProjects.map(p => {
                const isSelected = selectedProject?.id === p.id;
                const roleColors = isSelected && activeRole
                  ? [activeRole, ...p.roles.filter(r => r !== activeRole)].filter(r => p.roles.includes(r)).map(r => PALETTE[r as Role]?.bg).filter(Boolean)
                  : p.roles.map(r => PALETTE[r as Role]?.bg).filter(Boolean);
                const isMultiRole = roleColors.length > 1;
                const unselectedBg = isMultiRole
                  ? { background: `linear-gradient(to right, ${roleColors.map((c, i) => `${c}22 ${i * (100 / roleColors.length)}%, ${c}22 ${(i + 1) * (100 / roleColors.length)}%`).join(', ')})` }
                  : { backgroundColor: `${roleColors[0]}22` };
                return (
                  <button key={p.id} className="proj-pill"
                    onClick={() => { setSelectedProject(prev => prev?.id === p.id ? null : p); setGalleryIndex(0); }}
                    style={{
                      background: 'none',
                      color: INK,
                      border: 'none',
                      padding: '0.3rem 0.4rem 0.15rem', borderRadius: '0',
                      fontSize: '0.85rem', fontWeight: isSelected ? '600' : '400',
                      fontFamily: '"Lora", Georgia, serif', cursor: 'pointer',
                      textDecoration: isSelected ? 'none' : 'underline',
                      textUnderlineOffset: '3px',
                      display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.25rem',
                    }}
                  >
                    <span>{p.title}{p.inProgress && '*'}</span>
                    {isSelected && (
                      <span style={{ display: 'flex', gap: '0.3rem' }}>
                        {p.roles.map(r => (
                          <span key={r} style={{
                            width: '6px', height: '6px', borderRadius: '50%',
                            backgroundColor: PALETTE[r as Role]?.bg,
                            display: 'inline-block',
                          }} />
                        ))}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ height: '1px', backgroundColor: RULE, marginBottom: '1rem' }} />

        {/* ── MAIN TWO-COLUMN ── */}
        <div className="main-cols" style={{ display: 'flex', gap: '4.5rem', alignItems: 'flex-start' }}>

          {/* LEFT */}
          <div className="left-col" style={{ width: '38%', flexShrink: 0 }}>
            {showAbout && (
              <>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.8', color: INK, marginBottom: '0.75rem', paddingTop: '1.5rem' }}>
                  I have worked for 4 years grounding outreach, customer success, and strategy in UX principles. Studying Digital Narrative and Interactive Design taught me to treat users like protagonists, seeing every step of the product journey as part of a larger story.
                </p>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.8', color: INK }}>
                  Off the clock, I'm always experimenting across prose, poetry, and the kitchen.
                </p>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.8', color: INK, marginTop: '0.75rem' }}>
                  For conversations, complaints, or collaborations, I can be reached at{' '}
                  <a href="mailto:rorywalsh425@gmail.com" style={{ color: INK, textDecoration: 'underline' }}>
                    rorywalsh425@gmail.com
                  </a>{' '}or 570-687-7345.
                </p>
              </>
            )}

            {selectedProject && (
              <>
                <div style={{ marginBottom: '0.6rem' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '0.3rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>
                      {selectedProject.title}{selectedProject.inProgress && '*'}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: INK_MID }}>{selectedProject.date}</span>
                  </div>
                  {selectedProject.link !== '#' && activeRole && (
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="visit-btn"
                      style={{
                        display: 'inline-block',
                        backgroundColor: PALETTE[activeRole].bg,
                        color: PALETTE[activeRole].text,
                        textDecoration: 'none',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        padding: '0.25rem 0.7rem',
                        borderRadius: '2px',
                        fontFamily: '"Lora", Georgia, serif',
                        marginBottom: '0.35rem',
                      }}
                    >
                      Visit ↗
                    </a>
                  )}
                  {selectedProject.inProgress ? (
                    <p style={{ fontSize: '0.72rem', fontWeight: '700', color: INK, margin: 0 }}>
                      *Under construction: Expected April 2026
                    </p>
                  ) : selectedProject.award ? (
                    <p style={{ fontSize: '0.72rem', fontStyle: 'italic', color: INK_MID, margin: 0 }}>
                      {selectedProject.award}
                    </p>
                  ) : null}
                </div>
                <p style={{ fontSize: '0.85rem', lineHeight: '1.9', marginBottom: '0.9rem' }}>{selectedProject.preview}</p>
                <p style={{ fontSize: '0.78rem', lineHeight: '1.8', marginBottom: '0.9rem', color: INK_MID }}>{selectedProject.process}</p>
                <p style={{ fontSize: '0.68rem', color: INK_MID }}>{selectedProject.tags.join(', ')}</p>
              </>
            )}
          </div>

          {/* RIGHT */}
          <div className="right-col" style={{ flex: 1 }}>

            {showAbout && (
              <div
                className="photo-pair"
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  height: '276px',
                  position: 'relative',
                  paddingLeft: '8rem',
                }}
              >
                <img
                  src="/rory.png"
                  alt="Rory Walsh"
                  style={{
                    height: '246px',
                    width: 'auto',
                    objectFit: 'cover',
                    borderRadius: '2px',
                    display: 'block',
                    position: 'relative',
                    zIndex: 1,
                  }}
                />
                <img
                  src="/rory2.svg"
                  alt="Rory illustration"
                  style={{
                    height: '260px',
                    width: 'auto',
                    objectFit: 'contain',
                    display: 'block',
                    marginLeft: '-1.5rem',
                    position: 'relative',
                    zIndex: 2,
                  }}
                />
              </div>
            )}

            {selectedProject && (
              <div className="media-frame">
                {selectedProject.previewVideo ? (
                  <video key={selectedProject.id} autoPlay loop muted playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}>
                    <source src={selectedProject.previewVideo} type="video/quicktime" />
                    <source src={selectedProject.previewVideo} type="video/mp4" />
                  </video>
                ) : selectedProject.galleryImages ? (
                  <div style={{ width: '100%', height: '100%', position: 'relative', backgroundColor: '#fff' }}>
                    {/* Nav bar sits in normal flow at top, not overlaid */}
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '0.3rem 0.6rem', backgroundColor: BG,
                      borderBottom: `1px solid ${RULE}`,
                      position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
                    }}>
                      <span
                        className="gallery-arrow"
                        onClick={() => setGalleryIndex(i => Math.max(0, i - 1))}
                        style={{ fontSize: '0.75rem', fontWeight: '600', opacity: galleryIndex > 0 ? 1 : 0.2 }}
                      >{'<'}</span>
                      <span style={{ fontSize: '0.65rem', color: INK_MID }}>
                        {galleryIndex + 1} / {selectedProject.galleryImages.length}
                      </span>
                      <span
                        className="gallery-arrow"
                        onClick={() => setGalleryIndex(i => Math.min(selectedProject.galleryImages!.length - 1, i + 1))}
                        style={{ fontSize: '0.75rem', fontWeight: '600', opacity: galleryIndex < selectedProject.galleryImages.length - 1 ? 1 : 0.2 }}
                      >{'>'}</span>
                    </div>
                    {/* Image offset by nav bar height (~2rem) */}
                    <img
                      src={selectedProject.galleryImages[galleryIndex]}
                      alt={`${selectedProject.title} slide ${galleryIndex + 1}`}
                      style={{
                        position: 'absolute', top: '2rem', left: '4%',
                        width: '92%', height: 'calc(100% - 2rem)',
                        objectFit: 'contain', display: 'block',
                      }}
                    />
                  </div>
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: INK_FAINT }}>[in progress]</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}