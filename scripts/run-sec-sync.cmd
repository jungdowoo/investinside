@echo off
cd /d "%~dp0.."
if not exist "logs" mkdir "logs"
call pnpm sync:sec:browser >> "logs\sec-sync.log" 2>&1
exit /b %errorlevel%
