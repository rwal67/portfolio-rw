'use client'

import React, { useState } from 'react';

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
const INK       = '#1c1510';
const INK_MID   = 'rgba(28,21,16,0.5)';
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
    galleryImages: ["exxxey.png"],
    award: "Featured — 2025 Pitt Digital Media & Design Showcase"
  },
  {
    id: 3, title: "Pitt UX Hub", link: "https://rwal67.github.io/UX_hub_Pitt/index.html", inProgress: true,
    preview: "Pitt, though having many opportunities for students to get involved in UX and HCI, has no dedicated UX major. We are developing a student-facing directory pulling together coursework, career pathways, and opportunities across departments into one place.",
    process: "Collaborating with faculty stakeholders to map Pitt's UX and HCI landscape into a navigable taxonomy of career domains. Responsible for frontend development, stakeholder managment, content categorization, and original UI design.",
    galleryImages: ["uxsnap1.png"],
    tags: ["UX", "WordPress", "Web Development"], date: "2024", roles: ["strategy", "design"]
  },
];


export default function PortfolioHome() {
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);

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
        .media-frame { width: 100%; aspect-ratio: 16/9; overflow: hidden; border-radius: 2px; }
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
                { href: '/RoryWalsh_Resume.pdf', label: 'Resume', bg: SAGE, text: '#f5ede0', download: true },
              ] as const).map(({ href, label, bg, text, download }) => (
                <a key={label} href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  download={download ? 'RoryWalsh_Resume.pdf' : undefined}
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
              >Rory</span>.
            </span>
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
          </p>

          {/* Project pills */}
          <div style={{
            overflow: 'hidden',
            maxHeight: activeRole ? '200px' : '0',
            opacity: activeRole ? 1 : 0,
            transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease',
          }}>
            <div style={{ height: '1px', backgroundColor: RULE, margin: '0.45rem 0' }} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {visibleProjects.map(p => {
                const isSelected = selectedProject?.id === p.id;
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
                {/* FIX 3: removed paddingTop from all three about paragraphs */}
               <p style={{ fontSize: '0.9rem', lineHeight: '1.8', color: INK, marginBottom: '0.75rem', paddingTop: '0.75rem' }}>
                  Studying Digital Narrative and Interactive Design taught me that every product touchpoint is a beat in a larger story. I build from that, making users feel like the main character.</p>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.8', color: INK, marginBottom: '0.75rem' }}>
                  Whether I'm grounding sales and product adoption in UX principles, bringing technical writing into shareholder communications, or using SQL to classify Moby Dick, no tool is off limits in building solutions.</p>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.8', color: INK }}>
                  And, in my free time, I'm always experimenting across prose, poetry, and the kitchen.
                </p>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.8', color: INK, marginTop: '0.75rem' }}>
                  For conversations, complaints, or collaborations, I can be reached at{' '}
                  <a href="mailto:rorywalsh425@gmail.com" style={{ color: INK, textDecoration: 'underline' }}>
                    rorywalsh425@gmail.com
                  </a>.
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
                      *Under construction
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

            {/* FIX 1: only render media-frame when there is actually media to show */}
            {selectedProject && (selectedProject.previewVideo || selectedProject.galleryImages) && (
              <div className="media-frame">
                {selectedProject.previewVideo ? (
                  <video key={selectedProject.id} autoPlay loop muted playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}>
                    <source src={selectedProject.previewVideo} type="video/quicktime" />
                    <source src={selectedProject.previewVideo} type="video/mp4" />
                  </video>
                ) : selectedProject.galleryImages ? (
                  // FIX 2: removed white background and arrow navigation bar entirely
                  <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                    <img
                      src={selectedProject.galleryImages[galleryIndex]}
                      alt={`${selectedProject.title} slide ${galleryIndex + 1}`}
                      style={{
                        position: 'absolute', top: 0, left: 0,
                        width: '100%', height: '100%',
                        objectFit: 'contain', display: 'block',
                      }}
                    />
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}