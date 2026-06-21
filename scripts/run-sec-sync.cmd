@echo off
cd /d "%~dp0.."
if not exist "logs" mkdir "logs"
call pnpm sync:sec:browser >> "logs\sec-sync.log" 2>&1
if errorlevel 1 exit /b %errorlevel%
call pnpm collect:company-facts >> "logs\sec-sync.log" 2>&1
if errorlevel 1 exit /b %errorlevel%
call pnpm collect:exchange-rate >> "logs\sec-sync.log" 2>&1
exit /b %errorlevel%
