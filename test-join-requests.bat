@echo off
echo Checking Join Requests Detail...
echo.

cd /d "%~dp0"

npx tsx test-join-requests.ts

echo.
echo Press any key to exit...
pause >nul
