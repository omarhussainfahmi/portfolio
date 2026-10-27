import { ArrowRight, Download, Github, Linkedin, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../data/siteConfig';
import { projects } from '../data/projects';
import ProjectCard from '../components/ProjectCard';
import { ExternalLink, Section } from '../components/ui';
export default function Home({ recruiter = false }: { recruiter?: boolean }) {
  return (
    <>
      <section className="hero" id="home" aria-labelledby="portfolio-title">
        <figure className="hero-work">
          <img
            src="/images/next-chapter-landing.webp"
            width="1400"
            height="750"
            alt="Next Chapter book discovery landing page, from the team's project report"
            fetchPriority="high"
          />
          <figcaption>
            <Link to="/case-studies/next-chapter">
              Next Chapter - University of Jordan team project <ArrowRight size={16} />
            </Link>
          </figcaption>
        </figure>
        <div className="hero-copy">
          <h1 id="portfolio-title">Omar Hussain Fahmi</h1>
          <div className="hero-introduction">
            <div>
              <p className="hero-description">
                {recruiter
                  ? siteConfig.recruiterSummary
                  : 'Full-stack development, SAP Fiori and ABAP Cloud, grounded in Computer Information Systems.'}
              </p>
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
          <figure className="about-evidence">
            <img
              src="/images/next-chapter-genres.webp"
              width="1200"
              height="675"
              alt="Genre preferences in the Next Chapter onboarding interface"
              loading="lazy"
            />
            <figcaption>Interface design shared with the Next Chapter team.</figcaption>
          </figure>
          <div>
            <h3>From people to systems</h3>
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
