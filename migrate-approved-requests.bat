@echo off
echo Migrating Approved Join Requests...
echo.

cd /d "%~dp0"

npx tsx migrate-approved-requests.ts

echo.
echo Press any key to exit...
pause >nul
