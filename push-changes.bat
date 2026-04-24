@echo off
cd /d "%~dp0"
git config user.email "clement@escape-kit.com"
git config user.name "Clement"
del /f .git\index.lock 2>nul
git add -A
git commit -m "feat: pricing fix, auth errors FR, settings, 404, blog, patient detail"
git push origin main
echo.
echo Done! Check Vercel for the new deployment.
pause
