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

:: Backend dependencies
echo Installing backend dependencies...
cd ../backend
npm install
cd ..

:: Frontend dependencies
echo Installing frontend dependencies...
cd ../client
npm install
cd ..

echo Setup completed successfully!
pause
