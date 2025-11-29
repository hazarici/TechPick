@echo off
echo Starting backend...
start cmd /k "cd ../backend && node server.js"

echo Starting frontend...
start cmd /k "cd ../client && npm start"

echo All processes started!
pause
