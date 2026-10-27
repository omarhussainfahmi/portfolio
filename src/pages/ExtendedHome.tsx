import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  GraduationCap,
  Code2,
  Database,
  PanelsTopLeft,
  Mail,
  Phone,
  Github,
  Linkedin,
} from 'lucide-react';
import { Section, Tags, ExternalLink, Modal } from '../components/ui';
import { skills, techStack, techIcons } from '../data/skills';
import { experience } from '../data/experience';
import { certificates } from '../data/certificates';
import type { Certificate } from '../data/certificates';
import { siteConfig, education } from '../data/siteConfig';
import GithubSection from '../components/GithubSection';
export default function ExtendedHome() {
  const [tech, setTech] = useState('All');
  const [category, setCategory] = useState('All');
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [copied, setCopied] = useState('');
  const shown = certificates.filter((c) => category === 'All' || c.category === category);
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setCopied('Email copied.');
    } catch {
      setCopied('Copy unavailable. Please use the email link.');
    }
  }
  return (
    <>
      <Section id="skills" number="03" title="My toolkit">
        <p className="section-subtitle">A foundation in development. A focus on useful outcomes.</p>
        <div className="skills-grid">
          {Object.entries(skills).map(([label, items], i) => {
            const Icon = [Code2, Database, PanelsTopLeft][i];
            return (
              <article className="skill-card" key={label}>
                <Icon size={26} />
                <h3>{label}</h3>
                <Tags items={items} />
              </article>
            );
          })}
        </div>
        <div id="tech-stack" className="tech-stack advanced-section">
          <h3>Technologies I work with</h3>
          <div className="filters" aria-label="Technology categories">
            {['All', ...Object.keys(techStack)].map((t) => (
              <button key={t} aria-pressed={tech === t} onClick={() => setTech(t)}>
                {t}
              </button>
            ))}
          </div>
          <div className="tech-items">
            {[
              ...new Set(
                Object.entries(techStack)
                  .filter(([key]) => tech === 'All' || key === tech)
                  .flatMap(([, items]) => items),
              ),
            ].map((t) => (
              <span key={t}>
                {techIcons[t] ? (
                  <img
                    src={`/icons/${techIcons[t]}.svg`}
                    width="20"
                    height="20"
                    alt=""
                    loading="lazy"
                  />
                ) : (
                  <Code2 size={17} aria-hidden="true" />
                )}
                {t}
              </span>
            ))}
          </div>
        </div>
      </Section>
      <Section id="experience" number="04" title="Experience & growth">
        <div className="timeline">
          {experience.map((job, i) => (
            <article className="timeline-row" key={job.role}>
              <div className="timeline-date">
                <span className="timeline-dot" />
                {job.dates}
                <small>0{i + 1}</small>
              </div>
              <div>
                <h3>{job.role}</h3>
                <p className="company">{job.company}</p>
                <p>{job.description}</p>
                <Tags items={job.tags} />
              </div>
            </article>
          ))}
        </div>
      </Section>
      <Section id="case-studies" number="05" title="Behind the build" className="advanced-section">
        <Link className="case-promo" to="/case-studies/next-chapter">
          <div>
            <span className="eyebrow">CASE STUDY / NEXT CHAPTER</span>
            <h3>
              From an idea
              <br />
              to the next good read.
            </h3>
            <p>
              The project, the interface, and the implementation.
              <br />A transparent look at the documented work.
            </p>
            <span className="text-link">
              Read the case study <ArrowRight size={18} />
            </span>
          </div>
          <div className="case-type" aria-hidden="true">
            N<span>C</span>
            <small>PHP · JAVASCRIPT · MYSQL</small>
          </div>
        </Link>
      </Section>
      <Section id="certifications" number="06" title="Learning, continuously">
        <p className="section-subtitle">
          Specialized training across enterprise software, development, and design.
        </p>
        <div className="filters" aria-label="Certificate categories">
          {['All', ...new Set(certificates.map((c) => c.category))].map((c) => (
            <button key={c} aria-pressed={category === c} onClick={() => setCategory(c)}>
              {c}
            </button>
          ))}
        </div>
        <div className="certificate-grid">
          {shown.map((c) => (
            <button
              className="certificate-card"
              key={c.title}
              onClick={(event) => {
                event.currentTarget.focus({ preventScroll: true });
                setCertificate(c);
              }}
            >
              <Award size={24} />
              <span>
                <span className="eyebrow">
                  {c.category} / {c.year}
                </span>
                <strong>{c.title}</strong>
                <span className="certificate-meta">
                  {c.hours} hours{' '}
                  <span>
                    View details <ArrowUpRight size={16} aria-hidden="true" />
                  </span>
                </span>
              </span>
            </button>
          ))}
        </div>
        {shown.length === 0 && <p role="status">No selected certifications in this category.</p>}
      </Section>
      <Section id="education" number="07" title="The foundation">
        <article className="education-card">
          <GraduationCap size={38} />
          <div>
            <span className="eyebrow">{education.dates}</span>
            <h3>{education.degree}</h3>
            <p>
              {education.school} · {education.location}
            </p>
          </div>
          <span className="education-languages">Arabic / English</span>
        </article>
      </Section>
      <Section id="github" number="08" title="Code, out in the open" className="advanced-section">
        <GithubSection />
      </Section>
      <Section id="contact" number="09" title="Let’s build something useful.">
        <div className="contact-layout">
          <div>
            <p className="contact-lead">
              Have an opportunity in mind?
              <br />
              I’d be glad to hear from you.
            </p>
            <a className="button primary" href={`mailto:${siteConfig.email}`}>
              <Mail size={18} /> Email me
            </a>
            <p className="contact-note">
              Opens your email app so you can send your message directly.
            </p>
          </div>
          <div className="contact-list">
            <a href={`mailto:${siteConfig.email}`}>
              <Mail size={20} />
              <span>
                <small>EMAIL</small>
                {siteConfig.email}
              </span>
            </a>
            <a href={siteConfig.phoneHref}>
              <Phone size={20} />
              <span>
                <small>PHONE</small>
                {siteConfig.phone}
              </span>
            </a>
            <ExternalLink href={siteConfig.linkedin}>
              <Linkedin size={20} /> LinkedIn
            </ExternalLink>
            <ExternalLink href={siteConfig.github}>
              <Github size={20} /> GitHub
            </ExternalLink>
            <div>
              <button className="text-link" onClick={copyEmail}>
                Copy email address
              </button>
              <span className="copy-status" role="status">
                {copied}
              </span>
            </div>
          </div>
        </div>
      </Section>
      {certificate && (
        <Modal title="Certification details" onClose={() => setCertificate(null)}>
          <Award className="accent" size={36} />
          <h3 className="certificate-modal-title">{certificate.title}</h3>
          <p>
            {certificate.category} · {certificate.year} · {certificate.hours} training hours
          </p>
          {certificate.credentialUrl ? (
            <>
              {certificate.credentialNote && <p>{certificate.credentialNote}</p>}
              <ExternalLink href={certificate.credentialUrl}>
                {certificate.credentialLabel || 'View credential'}
              </ExternalLink>
            </>
          ) : (
            <p>Credential link not provided. Contact Omar for supporting documentation.</p>
          )}
        </Modal>
      )}
    </>
  );
}
