@echo off
mkdir  .\platforms\android\app\src\main\res\mipmap
cd resources
copy icon.png ..\platforms\android\app\src\main\res\mipmap\
cd ..
rmdir  www /s /q
set NODE_OPTIONS="--max-old-space-size=8192" && ionic cordova build android --prod --release
@pause