import * as icons from 'simple-icons';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('public/icons', { recursive: true });
for (const key of [
  'siHtml5',
  'siCss',
  'siJavascript',
  'siPhp',
  'siDotnet',
  'siMysql',
  'siSap',
  'siFlutter',
  'siDart',
  'siGithub',
]) {
  const icon = icons[key];
  await writeFile(`public/icons/${key}.svg`, icon.svg.replace('<svg ', '<svg fill="#7aa7ff" '));
}
