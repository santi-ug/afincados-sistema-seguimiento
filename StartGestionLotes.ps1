# GESTION LOTES RUN SCRIPT

# === CONFIGURACION ===
$projectPath = "C:\Users\Santi\Documents\PERSONAL\code\WORK\Afincados\system"
$backendPath = "$projectPath\server"
$frontendPath = "$projectPath\client"

# === CAMBIAR A DIRECTORIO BASE ===
Set-Location $projectPath

# === FUNCIONES DE LIMPIEZA ===
$backendJob = $null
$frontendJob = $null

function Cleanup {
  Write-Host "`nCerrando procesos..." -ForegroundColor Yellow
  if ($backendJob -and (Get-Job -Id $backendJob.Id -ErrorAction SilentlyContinue)) {
    Stop-Job $backendJob -Force
    Remove-Job $backendJob
  }
  if ($frontendJob -and (Get-Job -Id $frontendJob.Id -ErrorAction SilentlyContinue)) {
    Stop-Job $frontendJob -Force
    Remove-Job $frontendJob
  }
  Write-Host "Procesos detenidos. Puedes cerrar esta ventana." -ForegroundColor Green
}

# === REGISTRA EVENTO AL CERRAR POWERSHELL ===
Register-EngineEvent PowerShell.Exiting -Action { Cleanup }

# === INICIA BACKEND ===
Write-Host "Iniciando servidor backend..." -ForegroundColor Cyan
$backendJob = Start-Job -ScriptBlock {
  Set-Location $using:backendPath
  npm install
  npm run dev
}

# === ESPERA ===
Start-Sleep -Seconds 2

# === INICIA FRONTEND ===
Write-Host "Iniciando cliente frontend..." -ForegroundColor Cyan
$frontendJob = Start-Job -ScriptBlock {
  Set-Location $using:frontendPath
  npm install
  npm run dev
}

# === ABRE NAVEGADOR ===
Start-Sleep -Seconds 2
Start-Process "http://localhost:5173"

Write-Host "`nTodo listo. La aplicacion esta corriendo." -ForegroundColor Green
Write-Host "Cierra esta ventana para terminar los procesos." -ForegroundColor Gray

# === MANTIENE LA VENTANA ABIERTA ===
while ($true) {
  Start-Sleep -Seconds 1
}
