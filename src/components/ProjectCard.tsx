import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Layers } from 'lucide-react';
import type { Project } from '../data/projects';
import { ExternalLink, Tags } from './ui';
import ProjectVideo from './ProjectVideo';
export default function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  return (
    <article className="project-card">
      {project.videoEmbedUrl ? (
        <ProjectVideo project={project} />
      ) : (
        <Link to={`/projects/${project.slug}`} className={`project-art art-${project.id}`}>
          <span className="project-index">PROJECT / 0{index + 1}</span>
          {project.id === 'next-chapter' ? (
            <BookOpen size={76} strokeWidth={1} />
          ) : (
            <Layers size={76} strokeWidth={1} />
          )}
          <span className="art-title">
            {project.id === 'next-chapter' ? 'Next Chapter' : 'ASP.NET'}
            <small>
              {project.id === 'next-chapter'
                ? 'DISCOVER YOUR NEXT READ'
                : 'AN EXPLORATION IN LAYERS'}
            </small>
          </span>
          <span className="art-caption">Project identity · conceptual visual</span>
        </Link>
      )}
      <div className="project-body">
        <div className="eyebrow">{project.category}</div>
        <h3>
          <Link to={`/projects/${project.slug}`}>{project.title}</Link>
        </h3>
        <p>{project.description}</p>
        <Tags items={project.cardTechnologies ?? project.technologies.slice(0, 4)} />
        <div className="project-links">
          <Link to={`/projects/${project.slug}`}>
            View details <ArrowRight size={17} />
          </Link>
          <ExternalLink href={project.githubUrl}>GitHub</ExternalLink>
          {project.liveUrl &&
            (project.liveUnavailable ? (
              <span className="demo-unavailable">Demo unavailable</span>
            ) : (
              <ExternalLink href={project.liveUrl}>Live demo</ExternalLink>
            ))}
        </div>
      </div>
    </article>
  );
}
