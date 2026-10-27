import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Layers } from 'lucide-react';
import type { Project } from '../data/projects';
import { ExternalLink, Tags } from './ui';
import ProjectVideo from './ProjectVideo';
export default function ProjectCard({ project }: { project: Project; index?: number }) {
  return (
    <article className="project-card">
      {project.videoEmbedUrl ? (
        <ProjectVideo project={project} />
      ) : (
        <Link
          to={`/projects/${project.slug}`}
          className={`project-art art-${project.id}`}
          aria-label={`Explore ${project.title}`}
        >
          {project.id === 'next-chapter' ? (
            <BookOpen size={76} strokeWidth={1} />
          ) : (
            <Layers size={76} strokeWidth={1} />
          )}
          <span className="art-title">
            {project.id === 'next-chapter' ? 'Next Chapter' : 'ASP.NET'}
            <small>
              {project.id === 'next-chapter'
                ? 'Discover your next read'
                : 'Controllers, services, and data.'}
            </small>
          </span>
          {project.id === 'asp-net-project' && (
            <div className="mvc-flow" aria-label="MVC request flow">
              <span>Request</span>
              <ArrowRight size={18} />
              <span>Controller</span>
              <ArrowRight size={18} />
              <span>View</span>
            </div>
          )}
          <span className="art-caption">
            {project.id === 'asp-net-project'
              ? '.NET 8 / Entity Framework Core / SQL Server'
              : 'Project identity · conceptual visual'}
          </span>
        </Link>
      )}
      <div className="project-body">
        <h3>
          <Link to={`/projects/${project.slug}`}>
            {project.id === 'asp-net-project' ? 'ASP.NET MVC sample' : project.title}
          </Link>
        </h3>
        <p className="project-category">{project.category}</p>
        <p>
          {project.id === 'next-chapter'
            ? 'Discover books, organize reading lists, and explore recommendations powered by Google Books.'
            : 'An MVC learning sample with service and repository layers, EF Core data access, and PDF generation.'}
        </p>
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
