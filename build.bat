@echo off
setlocal
set BUILD_PATH=%~dp0docs
set PUBLIC_URL=https://cjmang.github.io/APBingoTracker
call npm run build
endlocal