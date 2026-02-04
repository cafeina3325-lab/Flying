@echo off
echo ==========================================
echo    Flying Studio - GitHub Upload Script
echo ==========================================

echo [1/5] Initializing Git...
git init

echo [2/5] Adding all files...
git add .

echo [3/5] Committing changes...
git commit -m "feat: implement FAQ, Contact page and update Home consultation flow"

echo [4/5] Configuring Remote...
:: Try adding, if fails (already exists), try setting url
git remote add origin https://github.com/cafeina3325-lab/Flying3.git 2>nul
git remote set-url origin https://github.com/cafeina3325-lab/Flying3.git

echo [5/5] Pushing to GitHub (main branch)...
git branch -M main
git push -u origin main

echo.
echo ==========================================
echo    Done! Press any key to close.
echo ==========================================
pause
