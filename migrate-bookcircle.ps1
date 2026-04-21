$ErrorActionPreference = "Stop"
$localDotnet = Join-Path $PSScriptRoot ".dotnet8\dotnet.exe"

if (Test-Path $localDotnet) {
    $dotnetCmd = $localDotnet
}
else {
    $dotnet = Get-Command dotnet -ErrorAction SilentlyContinue
    if (-not $dotnet) {
        throw "Neither a local .NET SDK at $localDotnet nor a system 'dotnet' command was found."
    }

    $dotnetCmd = $dotnet.Source
}

Push-Location $PSScriptRoot
try {
    & $dotnetCmd tool restore
    & $dotnetCmd tool run dotnet-ef database update --project ".\BookCircle.Api\BookCircle.Api.csproj" --startup-project ".\BookCircle.Api\BookCircle.Api.csproj"
}
finally {
    Pop-Location
}
