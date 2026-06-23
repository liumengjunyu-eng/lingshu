@echo off
chcp 65001 >nul
echo ===================================
echo   灵枢 · 安装依赖脚本
echo ===================================
echo.

cd /d "%~dp0"

echo [1/2] 检查 Node.js...
node -v
if errorlevel 1 (
  echo [错误] 未找到 Node.js，请先安装 Node.js
  pause
  exit /b 1
)

echo.
echo [2/2] 安装 lunar-javascript...
npm install lunar-javascript --save

echo.
echo ===================================
echo 安装完成！
echo ===================================
pause
