import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { ArrowUpRight, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { projects, getCaseSections } from '../data/projects';
import type { GalleryImage } from '../data/projects';
import { Tags, ExternalLink, Modal, SafeImage } from '../components/ui';
import ProjectCard from '../components/ProjectCard';
import ProjectVideo from '../components/ProjectVideo';
import { NotFound } from '../App';
export default function Detail({ caseStudy = false }: { caseStudy?: boolean }) {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);
  const caseSections = getCaseSections(slug || '');
  if (!project || (caseStudy && (!project.caseStudy || !caseSections.length)))
    return (
      <NotFound
        message={caseStudy ? 'This case study is not available.' : 'This project is not available.'}
      />
    );
  return (
    <article className="detail-page">
      <Link className="text-link" to="/#projects">
        <ArrowLeft size={17} /> All projects
      </Link>
      <header className="detail-hero">
        <div className="eyebrow">
          {caseStudy ? 'CASE STUDY' : project.category.toUpperCase()} /{' '}
          {project.status.toUpperCase()}
        </div>
        <h1>
          {project.title}
          {caseStudy && <span>Behind the build.</span>}
        </h1>
        <p>{project.longDescription}</p>
        {project.dates && <p className="detail-date">{project.dates} · University of Jordan</p>}
        <Tags items={project.technologies} />
        <div className="detail-actions">
          {project.liveUrl &&
            (project.liveUnavailable ? (
              <button
                className="button secondary"
                disabled
                title="The supplied demo returned HTTP 404 on 27 September 2026"
              >
                Live demo unavailable
              </button>
            ) : (
              <ExternalLink className="button primary" href={project.liveUrl}>
                Live demo
              </ExternalLink>
            ))}
          <ExternalLink className="button secondary" href={project.githubUrl}>
            GitHub repository
          </ExternalLink>
          {project.videoUrl && (
            <ExternalLink className="button secondary" href={project.videoUrl}>
              LinkedIn video
            </ExternalLink>
          )}
          {project.documentationUrl && (
            <a className="button secondary" href={project.documentationUrl} download>
              Download project report (DOCX, 15.6 MB)
            </a>
          )}
          {!caseStudy && project.caseStudy && (
            <Link className="button secondary" to={project.caseStudy}>
              View case study <ArrowRight size={18} />
            </Link>
          )}
        </div>
      </header>
      {caseStudy && project.documentationUrl && (
        <p className="data-note">
          Based on the team’s original graduation report. Download it for the full requirements,
          diagrams, evaluation, and user manual.
        </p>
      )}
      {project.videoEmbedUrl && (
        <section id="walkthrough" className="detail-video">
          <h2>See Next Chapter in action</h2>
          <ProjectVideo project={project} />
        </section>
      )}
      {caseStudy ? (
        <div className="case-layout">
          <nav className="case-toc" aria-label="Case study contents">
            <span className="eyebrow">IN THIS CASE STUDY</span>
            {caseSections.map(([title], i) => (
              <a key={title} href={`#case-${i}`}>
                {String(i + 1).padStart(2, '0')} {title}
              </a>
            ))}
          </nav>
          <div className="case-content">
            {caseSections.map(([title, body], i) => (
              <section id={`case-${i}`} key={title}>
                <span className="eyebrow">{String(i + 1).padStart(2, '0')} /</span>
                <h2>{title}</h2>
                <p>{body}</p>
              </section>
            ))}
          </div>
        </div>
      ) : (
        <div className="detail-columns">
          <section>
            <h2>What’s inside</h2>
            <ul className="feature-list">
              {project.features.map((f) => (
                <li key={f}>
                  <Check size={18} />
                  {f}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2>Technical notes</h2>
            {project.technical.map((t) => (
              <p key={t}>{t}</p>
            ))}
            <p className="data-note">
              {project.documentationUrl
                ? 'Source: the original Next Chapter project report and repository. Reported findings describe the graduation project.'
                : 'Source: project repository inspected on 27 September 2026. This portfolio does not certify the sample’s runtime behavior or security.'}
            </p>
          </section>
        </div>
      )}
      {!caseStudy && project.challenges && (
        <div className="detail-columns">
          <section>
            <h2>Challenges</h2>
            <p className="data-note">
              Technical assessment of the design challenges in this sample, rather than a record of
              specific issues encountered during development.
            </p>
            {project.challenges.map((item) => (
              <div key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            ))}
          </section>
          <section>
            <h2>Future improvements</h2>
            <p className="data-note">
              Suggested next steps for extending the sample. These features are not presented as
              completed work.
            </p>
            {project.futureImprovements?.map((item) => (
              <div key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            ))}
          </section>
        </div>
      )}
      <section className="project-gallery">
        <h2>Project gallery</h2>
        {project.gallery.length ? (
          project.gallery.map((item) => (
            <figure key={item.src}>
              <button
                onClick={(event) => {
                  event.currentTarget.focus({ preventScroll: true });
                  setLightbox(item);
                }}
                aria-label={`Enlarge: ${item.alt}`}
              >
                <SafeImage src={item.src} alt={item.alt} />
              </button>
              <figcaption>{item.caption}</figcaption>
            </figure>
          ))
        ) : (
          <div className="quiet-empty">
            <p>
              Project screenshots are not currently available. Explore the source repository for the
              views and application structure.
            </p>
          </div>
        )}
      </section>
      <section className="related-projects">
        <h2>Keep exploring</h2>
        <div className="project-grid">
          {projects
            .filter((p) => p.id !== project.id)
            .map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
        </div>
      </section>
      {lightbox && (
        <Modal title="Project wireframe" onClose={() => setLightbox(null)} className="lightbox">
          <SafeImage src={lightbox.src} alt={lightbox.alt} />
          <p>{lightbox.caption}</p>
          <a className="text-link" href={lightbox.src} target="_blank" rel="noopener noreferrer">
            Open full-size image <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </Modal>
      )}
    </article>
  );
}
