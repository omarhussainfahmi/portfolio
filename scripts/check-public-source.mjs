import { execFileSync } from 'node:child_process';
const files = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' })
  .split('\0')
  .filter(Boolean);
const forbidden =
  /^(?:\.openai\/|\.codex\/|\.sites-runtime\/|backups\/|docs\/(?:qa|internal)\/|public\/documents\/)|(?:^|\/)(?:\.env(?:\..+)?|credentials\.json|service-account[^/]*\.json|id_rsa|id_ed25519)$|\.(?:pem|key|p12|pfx|keystore|pdf|docx|zip|log)$/i;
const machinePath = /(?:[A-Za-z]:[\\/]+Users[\\/]+[A-Za-z0-9._-]+[\\/]|\/Users\/[A-Za-z0-9._-]+\/)/;
const publicEmails = new Set(['omarhussainfahmi@hotmail.com']);
const problems = [];
for (const file of files) {
  if (file !== '.env.example' && forbidden.test(file))
    problems.push({ file, rule: 'private-file' });
  if (!/\.(?:tsx?|jsx?|mjs|json|css|md|ya?ml|toml|txt|example|svg)$/.test(file)) continue;
  const contents = execFileSync('git', ['show', `:${file}`], {
    encoding: 'utf8',
    maxBuffer: 5 * 1024 * 1024,
  });
  if (machinePath.test(contents)) problems.push({ file, rule: 'personal-machine-path' });
  for (const email of contents.match(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g) || []) {
    if (!publicEmails.has(email) && !email.endsWith('@users.noreply.github.com'))
      problems.push({ file, rule: 'unreviewed-email' });
  }
}
if (problems.length) {
  console.error(JSON.stringify(problems, null, 2));
  process.exitCode = 1;
} else
  console.log(
    `Publication policy passed for ${files.length} tracked files. No excluded documents, machine paths, or unreviewed email addresses.`,
  );
