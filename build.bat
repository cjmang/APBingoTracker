@echo off
setlocal
set BUILD_PATH=%~dp0docs
call npm run build
endlocal