$ErrorActionPreference = "Stop"
$localDotnet = Join-Path $PSScriptRoot ".dotnet8\dotnet.exe"

if (Test-Path $localDotnet) {
    & $localDotnet run --project (Join-Path $PSScriptRoot "BookCircle.Api\BookCircle.Api.csproj")
    exit $LASTEXITCODE
}

$dotnet = Get-Command dotnet -ErrorAction SilentlyContinue
if (-not $dotnet) {
    throw "Neither a local .NET SDK at $localDotnet nor a system 'dotnet' command was found."
}

& $dotnet.Source run --project (Join-Path $PSScriptRoot "BookCircle.Api\BookCircle.Api.csproj")
