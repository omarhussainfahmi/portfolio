import { ArrowRight, Download, Github, Linkedin, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { siteConfig } from '../data/siteConfig';
import { projects } from '../data/projects';
import ProjectCard from '../components/ProjectCard';
import { ExternalLink, Section } from '../components/ui';
export default function Home({ recruiter = false }: { recruiter?: boolean }) {
  const [focus, setFocus] = useState('Web development');
  const perspectives = {
    'Web development': {
      title: 'From search to bookshelf.',
      description:
        'Next Chapter brings book discovery, reading lists, and Google Books data into one PHP and MySQL application.',
      image: '/images/next-chapter-library.webp',
      alt: 'The Next Chapter reading library, from the team project report',
      href: '/case-studies/next-chapter',
      action: 'Inside Next Chapter',
    },
    SAP: {
      title: 'Beyond the interface.',
      description:
        'My enterprise learning covers SAP Fiori application development, ABAP Cloud back-end development, and project learning and enablement.',
      image: null,
      alt: '',
      href: '/#certifications',
      action: 'Explore my learning',
    },
    'UI/UX': {
      title: 'Start with the person.',
      description:
        'On Next Chapter, I contributed to objectives, functionality, shared interface design, and testing with users.',
      image: '/images/next-chapter-genres.webp',
      alt: 'Genre selection in the Next Chapter interface, from the team project report',
      href: '/case-studies/next-chapter',
      action: 'Read the design decisions',
    },
  };
  const perspective = perspectives[focus as keyof typeof perspectives];
  return (
    <>
      <section className="hero" id="home" aria-labelledby="portfolio-title">
        <div className="hero-copy">
          <h1 id="portfolio-title">
            Omar Hussain <span>Fahmi.</span>
          </h1>
          {recruiter && (
            <p className="hero-role">Full-stack development, SAP Fiori and ABAP Cloud.</p>
          )}
          <div className="hero-introduction">
            <div>
              {!recruiter && (
                <p className="hero-description">
                  I build for the web, with a background in Computer Information Systems and a
                  growing focus on SAP Fiori and ABAP Cloud.
                </p>
              )}
              <p className="availability">
                {siteConfig.available ? 'Open to opportunities' : 'Let’s connect'} -{' '}
                {siteConfig.location}
              </p>
            </div>
            <div className="hero-actions">
              <a href="#projects" className="button primary">
                View projects <ArrowRight size={18} />
              </a>
              <a href={siteConfig.cv} download className="text-link">
                <Download size={18} /> Download CV
              </a>
            </div>
          </div>
          {recruiter && (
            <p className="hero-description recruiter-summary">{siteConfig.recruiterSummary}</p>
          )}
          <div className="hero-meta">
            <span>
              <MapPin size={16} /> Arabic / English
            </span>
            <div className="socials">
              <ExternalLink href={siteConfig.github}>
                <Github size={18} /> GitHub
              </ExternalLink>
              <ExternalLink href={siteConfig.linkedin}>
                <Linkedin size={18} /> LinkedIn
              </ExternalLink>
            </div>
          </div>
        </div>
        <aside className="hero-focus" aria-label="Explore my work and skills">
          <div className="focus-options" aria-label="Skill perspectives">
            {Object.keys(perspectives).map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={focus === item}
                onClick={() => setFocus(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="focus-content" key={focus}>
            <h2>{perspective.title}</h2>
            <p>{perspective.description}</p>
            {perspective.image ? (
              <img src={perspective.image} width="1200" height="675" alt={perspective.alt} />
            ) : (
              <div className="enterprise-topics">
                <span>SAP Fiori</span>
                <span>ABAP Cloud</span>
                <span>SQL + OOP</span>
              </div>
            )}
            <Link to={perspective.href} className="text-link">
              {perspective.action} <ArrowRight size={18} />
            </Link>
          </div>
        </aside>
      </section>
      <Section id="projects" title="Selected work">
        <div className="section-intro">
          <p>
            Book discovery, from interface to database. An MVC sample, from request to response.
          </p>
        </div>
        <div className="project-grid">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </Section>
      <Section id="about" title="A little about me">
        <div className="about-layout">
          <div className="about-profile">
            <dl className="about-facts">
              <div>
                <dt>Based in</dt>
                <dd>Jeddah, Saudi Arabia</dd>
              </div>
              <div>
                <dt>Education</dt>
                <dd>
                  Computer Information Systems
                  <br />
                  University of Jordan
                </dd>
              </div>
              <div>
                <dt>Languages</dt>
                <dd>Arabic / English</dd>
              </div>
            </dl>
            <figure className="about-evidence">
              <img
                src="/images/next-chapter-genres.webp"
                width="1200"
                height="675"
                alt="Genre preferences, part of the shared Next Chapter interface design"
                loading="lazy"
              />
              <figcaption>Shared interface work for Next Chapter.</figcaption>
            </figure>
          </div>
          <div>
            <p>{siteConfig.about}</p>
            <p>
              For Next Chapter, my documented contribution included defining objectives, designing
              functionality, shared interface design, and testing with users.
            </p>
            <Link className="text-link" to="/case-studies/next-chapter">
              Explore my process <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
