$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$projectRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$desktopRoot = Split-Path $projectRoot -Parent
$historyRoot = Join-Path $projectRoot 'backups'
New-Item -ItemType Directory -Path $historyRoot -Force | Out-Null
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss-fff'
$sourcePath = Join-Path $desktopRoot 'Omar-Hussain-Fahmi-Portfolio-Source.zip'
$websitePath = Join-Path $desktopRoot 'Omar-Hussain-Fahmi-Portfolio-Website.zip'
if (-not (Test-Path -LiteralPath (Join-Path $projectRoot 'dist/index.html'))) { throw 'Build the website before backing up.' }
foreach ($backup in @(@{Path=$sourcePath;Name='source'}, @{Path=$websitePath;Name='website'})) {
  if (Test-Path -LiteralPath $backup.Path) { Copy-Item -LiteralPath $backup.Path -Destination (Join-Path $historyRoot "$stamp-previous-$($backup.Name).zip") }
}
Compress-Archive -Path (Join-Path $projectRoot 'dist/*') -DestinationPath $websitePath -Force
$temporaryZip = Join-Path ([System.IO.Path]::GetTempPath()) ('portfolio-source-' + [guid]::NewGuid().ToString('N') + '.zip')
$files = @(git -C $projectRoot ls-files --cached --others --exclude-standard)
$files += @('public/OmarHussainCV.pdf', 'public/documents/next-chapter-documentation.docx', '.openai/hosting.json', 'docs/READINESS-AUDIT.md', 'docs/VERIFICATION.md')
foreach ($privateDirectory in @('docs/internal', 'docs/qa')) {
  $privatePath = Join-Path $projectRoot $privateDirectory
  if (Test-Path -LiteralPath $privatePath) { $files += Get-ChildItem -LiteralPath $privatePath -Recurse -File | ForEach-Object { [System.IO.Path]::GetRelativePath($projectRoot, $_.FullName) } }
}
$files = $files | Sort-Object -Unique
if ($LASTEXITCODE -ne 0) { throw 'Cannot enumerate source files safely.' }
$archive = [System.IO.Compression.ZipFile]::Open($temporaryZip, [System.IO.Compression.ZipArchiveMode]::Create)
try {
  foreach ($file in $files) {
    $full = Join-Path $projectRoot $file
    if (Test-Path -LiteralPath $full -PathType Leaf) {
      [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive,$full,$file.Replace('\','/'),[System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
    }
  }
} finally { $archive.Dispose() }
Move-Item -LiteralPath $temporaryZip -Destination $sourcePath -Force
$manifest = @{
  createdAt = (Get-Date).ToUniversalTime().ToString('o')
  source = @{name=(Split-Path $sourcePath -Leaf);sha256=(Get-FileHash -LiteralPath $sourcePath -Algorithm SHA256).Hash}
  website = @{name=(Split-Path $websitePath -Leaf);sha256=(Get-FileHash -LiteralPath $websitePath -Algorithm SHA256).Hash}
}
$manifest | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath (Join-Path $historyRoot "$stamp-manifest.json")
Write-Output 'Updated desktop source and website ZIPs. Previous copies and checksums are preserved in portfolio/backups.'
