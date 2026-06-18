Write-Host "Setting up portable PostgreSQL..."

$BaseDir = "d:\Downloads\CineVerse\Backend"
$ZipPath = "$BaseDir\postgres.zip"
$PgsqlDir = "$BaseDir\pgsql"
$DataDir = "$BaseDir\pgdata"
$LogPath = "$BaseDir\pglog.txt"

# 1. Download
if (-not (Test-Path $PgsqlDir)) {
    if (-not (Test-Path $ZipPath)) {
        Write-Host "Downloading PostgreSQL zip binaries..."
        curl.exe -L "https://get.enterprisedb.com/postgresql/postgresql-16.2-1-windows-x64-binaries.zip" -o $ZipPath
    }
    
    Write-Host "Extracting PostgreSQL..."
    Expand-Archive -Path $ZipPath -DestinationPath $BaseDir -Force
    
    if (Test-Path $ZipPath) {
        Remove-Item $ZipPath
    }
} else {
    Write-Host "PostgreSQL binaries already exist at $PgsqlDir"
}

# 2. Initialize database cluster
if (-not (Test-Path $DataDir)) {
    Write-Host "Initializing PostgreSQL data directory at $DataDir..."
    & "$PgsqlDir\bin\initdb.exe" -D $DataDir -U postgres -E UTF8 --locale=C
} else {
    Write-Host "PostgreSQL data directory already initialized."
}

# 3. Create start/stop helper scripts
$StartScript = @"
& "$PgsqlDir\bin\pg_ctl.exe" -D "$DataDir" -l "$LogPath" start
"@

$StopScript = @"
& "$PgsqlDir\bin\pg_ctl.exe" -D "$DataDir" stop
"@

$CreateDbScript = @"
& "$PgsqlDir\bin\createdb.exe" -U postgres cineverse
"@

Set-Content -Path "$BaseDir\db_start.ps1" -Value $StartScript
Set-Content -Path "$BaseDir\db_stop.ps1" -Value $StopScript
Set-Content -Path "$BaseDir\db_createdb.ps1" -Value $CreateDbScript

Write-Host "PostgreSQL setup complete!"
