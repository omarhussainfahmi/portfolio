import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Maximize2, Minimize2, Minus, Terminal, X } from 'lucide-react';
import { siteConfig, education } from '../data/siteConfig';
import { experience } from '../data/experience';
import { skills } from '../data/skills';
import { projects } from '../data/projects';
import { Modal } from './ui';
interface Props {
  mode: 'palette' | 'terminal';
  setMode: (mode: 'palette' | 'terminal' | null) => void;
  onClose: () => void;
  toggleTheme: () => void;
  toggleRecruiter: () => void;
}
interface Output {
  command: string;
  text: string;
  link?: string;
  label?: string;
}
const sections: Record<string, string> = {
  about: 'about',
  skills: 'skills',
  experience: 'experience',
  projects: 'projects',
  'case-studies': 'case-studies',
  certificates: 'certifications',
  education: 'education',
  contact: 'contact',
  'tech-stack': 'tech-stack',
  sap: 'skills',
};
const commands = [
  'help',
  ...Object.keys(sections),
  'github',
  'linkedin',
  'resume',
  'blog',
  'clear',
  'theme',
];
export default function CommandCenter(props: Props) {
  return props.mode === 'palette' ? <Palette {...props} /> : <TerminalWindow {...props} />;
}
function Palette({ onClose, toggleTheme, toggleRecruiter, setMode }: Props) {
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const items = [
    ...Object.entries(sections)
      .filter(([key]) => key !== 'sap')
      .map(([name, id]) => ({
        name:
          name === 'certificates'
            ? 'Certifications'
            : name.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase()),
        run: () => navigate(`/#${id}`),
      })),
    { name: 'GitHub', run: () => navigate('/#github') },
    { name: 'Blog', run: () => navigate('/blog') },
    { name: 'Recruiter Mode', run: toggleRecruiter },
    { name: 'Toggle Theme', run: toggleTheme },
    {
      name: 'Download CV',
      run: () => {
        const a = document.createElement('a');
        a.href = siteConfig.cv;
        a.download = 'OmarHussainCV.pdf';
        a.click();
      },
    },
    { name: 'Terminal', run: () => setMode('terminal') },
  ];
  const filtered = items.filter((i) => i.name.toLowerCase().includes(query.toLowerCase()));
  useEffect(() => {
    document
      .getElementById(`command-${index}`)
      ?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }, [index, query]);
  const choose = (i: number) => {
    const item = filtered[i];
    if (!item) return;
    if (item.name !== 'Terminal') onClose();
    item.run();
  };
  return (
    <Modal title="Go anywhere" onClose={onClose}>
      <label className="sr-only" htmlFor="command-search">
        Search commands
      </label>
      <input
        id="command-search"
        autoFocus
        className="command-input"
        role="combobox"
        aria-expanded={filtered.length > 0}
        aria-controls="command-results"
        aria-autocomplete="list"
        aria-activedescendant={filtered[index] ? `command-${index}` : undefined}
        value={query}
        placeholder="Search the portfolio…"
        onChange={(e) => {
          setQuery(e.target.value);
          setIndex(0);
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setIndex((i) => Math.max(0, Math.min(i + 1, filtered.length - 1)));
          }
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            setIndex((i) => Math.max(0, i - 1));
          }
          if (e.key === 'Home' || e.key === 'End') {
            e.preventDefault();
            setIndex(e.key === 'Home' ? 0 : Math.max(0, filtered.length - 1));
          }
          if (e.key === 'Enter') {
            e.preventDefault();
            choose(index);
          }
        }}
      />
      <div className="command-results" id="command-results" role="listbox" aria-label="Commands">
        {filtered.map((item, i) => (
          <button
            id={`command-${i}`}
            key={item.name}
            role="option"
            aria-selected={i === index}
            tabIndex={-1}
            onMouseEnter={() => setIndex(i)}
            onClick={() => choose(i)}
          >
            {item.name}
            <ArrowUpRight size={16} />
          </button>
        ))}
      </div>
      {filtered.length === 0 && <p role="status">No commands found.</p>}
      <p className="command-hint">Up / Down or Home / End · Enter Select · Esc Close</p>
    </Modal>
  );
}
function TerminalWindow({ onClose, toggleTheme }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(0);
  const [output, setOutput] = useState<Output[]>([]);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; startX: number; startY: number } | null>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!minimized) {
      dialog?.showModal();
      inputRef.current?.focus();
    }
    return () => dialog?.close();
  }, [minimized]);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    return () => previous?.focus();
  }, []);
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [output]);
  function run() {
    const command = input.trim().toLowerCase();
    if (!command) return;
    setHistory((h) => [...h, command]);
    setCursor(history.length + 1);
    setInput('');
    if (command === 'clear') {
      setOutput([]);
      return;
    }
    let result: Output = { command, text: 'Command not found. Type help for available commands.' };
    if (command === 'help') result.text = commands.join(' · ');
    if (sections[command]) {
      result = {
        command,
        text:
          command === 'about'
            ? siteConfig.summary
            : command === 'skills'
              ? Object.values(skills).flat().join(', ')
              : command === 'experience'
                ? experience.map((j) => `${j.role} - ${j.company} (${j.dates})`).join('\n')
                : command === 'projects'
                  ? projects.map((p) => p.title).join('\n')
                  : command === 'education'
                    ? `${education.degree} · ${education.school} · ${education.dates}`
                    : command === 'contact'
                      ? `${siteConfig.email}\n${siteConfig.phone}`
                      : command === 'sap'
                        ? 'SAP Fiori and ABAP Cloud training at Digital Excellence Company (Juffali Group), Jan - Apr 2026.'
                        : `Explore ${command.replace(/-/g, ' ')}.`,
        link: `/#${sections[command]}`,
        label: `Open ${command}`,
      };
    }
    if (command === 'github' || command === 'linkedin')
      result = {
        command,
        text: `Omar’s ${command} profile`,
        link: siteConfig[command],
        label: 'Open profile',
      };
    if (command === 'resume')
      result = {
        command,
        text: 'The original CV is available as a PDF.',
        link: siteConfig.cv,
        label: 'Download CV',
      };
    if (command === 'blog')
      result = { command, text: 'Articles Coming Soon', link: '/blog', label: 'Open articles' };
    if (command === 'theme') {
      toggleTheme();
      result.text = 'Theme switched.';
    }
    setOutput((o) => [...o, result]);
  }
  function keys(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.max(0, cursor - 1);
      setCursor(next);
      setInput(history[next] || '');
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.min(history.length, cursor + 1);
      setCursor(next);
      setInput(history[next] || '');
    }
    if (e.key === 'Tab' && input) {
      const matches = commands.filter((c) => c.startsWith(input.toLowerCase()));
      if (matches.length) {
        e.preventDefault();
        setInput(matches[0]);
      }
    }
  }
  function startDrag(e: PointerEvent<HTMLDivElement>) {
    if (maximized || (e.target as HTMLElement).closest('button')) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, startX: position.x, startY: position.y };
  }
  function moveDrag(e: PointerEvent<HTMLDivElement>) {
    if (!drag.current || !ref.current) return;
    const d = drag.current;
    const w = ref.current.offsetWidth,
      h = ref.current.offsetHeight;
    setPosition({
      x: Math.max(
        -(innerWidth - w) / 2,
        Math.min((innerWidth - w) / 2, d.startX + e.clientX - d.x),
      ),
      y: Math.max(
        -(innerHeight - h) / 2,
        Math.min((innerHeight - h) / 2, d.startY + e.clientY - d.y),
      ),
    });
  }
  if (minimized)
    return (
      <button
        className="terminal-minimized button secondary"
        onClick={() => {
          setPosition({ x: 0, y: 0 });
          setMinimized(false);
        }}
      >
        <Terminal size={18} /> Restore terminal
      </button>
    );
  return (
    <dialog
      ref={ref}
      aria-label="Portfolio terminal"
      onCancel={onClose}
      className={`terminal-window ${maximized ? 'maximized' : ''}`}
      style={{ transform: maximized ? 'none' : `translate(${position.x}px,${position.y}px)` }}
    >
      <div
        className="terminal-titlebar"
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={() => {
          drag.current = null;
        }}
      >
        <span>
          <Terminal size={17} /> omar@portfolio: ~
        </span>
        <div>
          <button
            className="icon-button"
            aria-label="Minimize terminal"
            onClick={() => setMinimized(true)}
          >
            <Minus size={17} />
          </button>
          <button
            className="icon-button"
            aria-label={maximized ? 'Restore terminal size' : 'Maximize terminal'}
            onClick={() => setMaximized((v) => !v)}
          >
            {maximized ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
          </button>
          <button className="icon-button" aria-label="Close terminal" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
      </div>
      <div className="terminal-body">
        <p>Omar Hussain Fahmi / interactive portfolio</p>
        <p className="subtle">
          Type <strong>help</strong> to explore. Up / Down history · Tab autocomplete.
          <br />
          Drag the title bar or resize the window from its corner.
        </p>
        <div ref={logRef} className="terminal-log" role="log" aria-live="polite">
          {output.map((o, i) => (
            <div key={i}>
              <p className="terminal-prompt">❯ {o.command}</p>
              <p>{o.text}</p>
              {o.link && (
                <a
                  className="text-link"
                  href={o.link}
                  download={o.command === 'resume' || undefined}
                  target={o.link.startsWith('https:') ? '_blank' : undefined}
                  rel={o.link.startsWith('https:') ? 'noopener noreferrer' : undefined}
                >
                  {o.label}
                </a>
              )}
            </div>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            run();
          }}
        >
          <label htmlFor="terminal-command">
            ❯ <span className="sr-only">Terminal command</span>
          </label>
          <input
            id="terminal-command"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={keys}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          <button type="submit" className="sr-only">
            Run command
          </button>
        </form>
      </div>
    </dialog>
  );
}
