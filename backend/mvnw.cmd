@REM Maven Wrapper startup batch script
@REM Adapted from https://github.com/apache/maven-wrapper

@echo off
setlocal

set MAVEN_PROJECTBASEDIR=%~dp0
set WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.jar"
set WRAPPER_URL="https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar"

if exist %WRAPPER_JAR% goto runMvn

echo Downloading Maven Wrapper...
powershell -Command "Invoke-WebRequest -Uri %WRAPPER_URL% -OutFile %WRAPPER_JAR%"
if ERRORLEVEL 1 goto error

:runMvn
set MAVEN_CMD_LINE_ARGS=%*
java -jar %WRAPPER_JAR% %MAVEN_CMD_LINE_ARGS%
goto end

:error
echo Failed to download Maven Wrapper
exit /b 1

:end
endlocal
