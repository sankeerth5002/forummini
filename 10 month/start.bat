@echo off
setlocal
cd /d "%~dp0"

echo ======================================================
echo           For You - 10 Months Celebration
echo ======================================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo Starting Node.js JavaScript server...
    start "10-Month Server" cmd /c "node server.js"
    timeout /t 1 /nobreak >nul
    start http://localhost:3000
) else (
    echo Node.js not detected in PATH, opening HTML directly...
    start "" "index.html"
)

exit
