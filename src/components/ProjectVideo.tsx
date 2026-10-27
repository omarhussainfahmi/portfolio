import { useState } from 'react';
import { Play, Film } from 'lucide-react';
import type { Project } from '../data/projects';
import { ExternalLink } from './ui';

export default function ProjectVideo({ project }: { project: Project }) {
  const [loaded, setLoaded] = useState(false);
  if (!project.videoUrl || !project.videoEmbedUrl) return null;
  return (
    <div className="video-showcase">
      {loaded ? (
        <iframe
          src={project.videoEmbedUrl}
          title={`${project.title} website walkthrough on LinkedIn`}
          allow="fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button
          className="video-launch"
          onClick={() => setLoaded(true)}
          aria-describedby={`video-privacy-${project.id}`}
        >
          <span className="eyebrow">
            <Film size={16} /> PROJECT WALKTHROUGH
          </span>
          <span className="video-play">
            <Play size={30} />
          </span>
          <strong>{project.title} in action</strong>
          <span>Watch the website walkthrough</span>
          <small id={`video-privacy-${project.id}`} className="video-privacy">
            Loads LinkedIn content, which may use cookies.
          </small>
        </button>
      )}
      <div className="video-caption">
        <span>Team demonstration shared in Omar’s LinkedIn post.</span>
        <ExternalLink href={project.videoUrl}>Watch on LinkedIn</ExternalLink>
      </div>
      {loaded && (
        <p className="data-note">
          If LinkedIn does not display the player, use “Watch on LinkedIn” to open the original
          post.
        </p>
      )}
    </div>
  );
}
