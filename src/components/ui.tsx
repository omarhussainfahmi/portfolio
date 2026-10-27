import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
export function ExternalLink({
  href,
  children,
  className = '',
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <ArrowUpRight size={16} aria-hidden="true" />
      <span className="sr-only"> (opens in new tab)</span>
    </a>
  );
}
export function Tags({ items }: { items: string[] }) {
  return (
    <div className="tags">
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}
export function Section({
  id,
  title,
  children,
  className = '',
}: {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!section.current || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          section.current?.classList.add('section-revealed');
          observer.disconnect();
        }
      },
      { threshold: 0.06 },
    );
    observer.observe(section.current);
    return () => observer.disconnect();
  }, []);
  return (
    <section
      ref={section}
      id={id}
      className={`section ${className}`}
      aria-labelledby={`${id}-title`}
    >
      <div className="section-heading">
        <h2 id={`${id}-title`}>{title}</h2>
      </div>
      {children}
    </section>
  );
}
export function Modal({
  title,
  onClose,
  children,
  className = '',
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    dialog?.showModal();
    const before = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      dialog?.close();
      document.body.style.overflow = before;
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-label={title}
      className={`modal ${className}`}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-inner">
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="icon-button" aria-label="Close dialog" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
export function SafeImage({
  src,
  alt,
  className = '',
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <div className="image-fallback">Image unavailable</div>
  ) : (
    <img
      className={className}
      src={src}
      alt={alt}
      loading="lazy"
      width="1200"
      height="800"
      onError={() => setFailed(true)}
    />
  );
}
