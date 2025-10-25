@echo off
echo Checking database content...
echo.

cd /d "%~dp0"

echo Running database check...
npx tsx check-database.ts

echo.
echo Press any key to exit...
pause >nul
