@echo off
cls

call :%1
goto not_found

Rem SERVE
:serve
call :choose_python
echo Starting local web server...
%pyenv% -m http.server
goto :eof

REM SORT
:sort
call :choose_python
echo Running sort script...
cd kml
%pyenv% sort.py
cd ..
goto :eof

REM META
:meta
call :choose_python
cd kml
%pyenv% meta.py
cd ..
goto :eof

REM LICENSE
:license
type LICENSE
goto :eof

REM HELP
:help
echo.
type meta\header.txt
echo  COMMAND           DESCRIPTION
echo =========         =============
echo weblnp help       Shows you a list with commands
echo weblnp sort       Sorts KML files into city-folders
echo weblnp meta       Generate empty meta files for every KML layer.
echo weblnp serve      Runs the local web server
echo weblnp license    Displays the repository's license.
REM echo weblnp reload     Reloads the dev enviroment.
REM echo weblnp exit       Exits out of the dev enviroment and disables the weblnp command
echo.
goto :eof

:choose_python
echo Enter your Python executable:
echo (Leave blank for default 'python'.)
set /p pyenv= || set pyenv=python

:not_found
echo Command unknown. Run 'weblnp help' for a list with commands.
goto :eof