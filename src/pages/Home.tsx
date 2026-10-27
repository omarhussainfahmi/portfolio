import {
  Asterisk,
  Sparkle,
  ArrowDown,
  ArrowRight,
  Download,
  Github,
  Linkedin,
  MapPin,
  Code2,
  Database,
  PanelsTopLeft,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { siteConfig } from '../data/siteConfig';
import { projects } from '../data/projects';
import ProjectCard from '../components/ProjectCard';
import { ExternalLink, Section } from '../components/ui';
export default function Home({ recruiter = false }: { recruiter?: boolean }) {
  const [role, setRole] = useState(0);
  useEffect(() => {
    if (recruiter || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => setRole((v) => (v + 1) % siteConfig.roles.length), 4000);
    return () => clearInterval(timer);
  }, [recruiter]);
  return (
    <>
      <section className="hero" id="home">
        <div className="hero-copy">
          <div className="availability">
            <span />
            {siteConfig.available ? 'Open to Opportunities' : 'Let’s connect'}
          </div>
          <p className="eyebrow hero-label">COMPUTER INFORMATION SYSTEMS SPECIALIST</p>
          <h1>
            <span>Hello, I’m</span> Omar Hussain
            <br /> <em>Fahmi.</em>
          </h1>
          <div className="role-line">
            <span className="role-dash" />
            <span key={role}>{siteConfig.roles[role]}</span>
          </div>
          <p className="hero-description">
            {recruiter ? siteConfig.recruiterSummary : siteConfig.summary}
          </p>
          <div className="hero-actions">
            <a href="#projects" className="button primary">
              View projects <ArrowRight size={18} />
            </a>
            <a href={siteConfig.cv} download className="button secondary">
              <Download size={18} /> Download CV
            </a>
          </div>
          <div className="hero-meta">
            <span>
              <MapPin size={15} />
              {siteConfig.location}
            </span>
            <span className="socials">
              <ExternalLink href={siteConfig.github}>
                <Github size={19} />
                <span className="sr-only">GitHub</span>
              </ExternalLink>
              <ExternalLink href={siteConfig.linkedin}>
                <Linkedin size={19} />
                <span className="sr-only">LinkedIn</span>
              </ExternalLink>
              <a href="#contact">
                Contact me <ArrowUp />
              </a>
            </span>
          </div>
        </div>
        <div className="hero-panel" aria-label="Development focus">
          <div className="panel-top">
            <span className="mini-logo">OF</span>
            <span>THE WAY I BUILD</span>
            <span className="panel-plus">+</span>
          </div>
          <div className="focus-card">
            <Code2 />
            <span>
              <small>01 / DEVELOPMENT</small>
              <strong>Practical by design.</strong>
              <p>From the interface to the database.</p>
            </span>
          </div>
          <div className="focus-card">
            <Database />
            <span>
              <small>02 / ENTERPRISE</small>
              <strong>Thinking in systems.</strong>
              <p>SAP Fiori & ABAP Cloud.</p>
            </span>
          </div>
          <div className="focus-card">
            <PanelsTopLeft />
            <span>
              <small>03 / EXPERIENCE</small>
              <strong>People come first.</strong>
              <p>Clear, considered user experiences.</p>
            </span>
          </div>
          <div className="panel-bottom">
            <span>
              Always learning.
              <br />
              Always building.
            </span>
            <Asterisk className="large-asterisk" size={64} aria-hidden="true" />
          </div>
        </div>
        <a className="scroll-cue" href="#projects">
          <ArrowDown size={15} /> EXPLORE MY WORK
        </a>
      </section>
      <div className="discipline-strip">
        <span>FULL-STACK DEVELOPMENT</span>
        <Sparkle size={13} aria-hidden="true" />
        <span>SAP FIORI</span>
        <Sparkle size={13} aria-hidden="true" />
        <span>ABAP CLOUD</span>
        <Sparkle size={13} aria-hidden="true" />
        <span>UI/UX DESIGN</span>
      </div>
      <Section id="projects" number="01" title="Selected work">
        <div className="section-intro">
          <p>
            Ideas made tangible.
            <br />A closer look at what I’ve built.
          </p>
          <span className="eyebrow">THOUGHTFUL SOLUTIONS. REAL PROJECTS.</span>
        </div>
        <div className="project-grid">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
        <p className="coming-inline">
          More projects are currently being prepared and will be added soon.
        </p>
      </Section>
      <Section id="about" number="02" title="A little about me">
        <div className="about-layout">
          <h3>
            Curiosity is where
            <br />
            good work begins.
          </h3>
          <div>
            <p>{siteConfig.about}</p>
            <p className="subtle">Based in Jeddah. Working in Arabic and English.</p>
            <Link className="text-link" to="/case-studies/next-chapter">
              Explore my process <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
function ArrowUp() {
  return <ArrowRight size={16} />;
}
