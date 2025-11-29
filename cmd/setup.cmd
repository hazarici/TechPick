@echo off
echo ================================
echo TechPick Project Setup
echo ================================

:: Node.js kontrol
node -v >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Please install it from https://nodejs.org/
    pause
    exit /b
)

echo Starting backend dependencies installation...
start /wait cmd /c "cd ../backend && npm install"

echo Starting frontend dependencies installation...
start /wait cmd /c "cd ../client && npm install"

echo ================================
echo Setup completed successfully!
echo Press any key to exit...
pause