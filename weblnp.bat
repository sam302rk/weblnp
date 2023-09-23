@echo off
goto %1

REM COMMAND NOT FOUND
echo Command unknown. Run 'weblnp help' for a list with commands.
goto exit

Rem SERVE
:serve
call :choose_python
echo Starting local web server...
%pyenv% -m http.server
goto exit

REM SORT
:sort
call :choose_python
echo Running sort script...
cd kml
%pyenv% sort.py
cd ..
goto exit

REM LICENSE
:license
type LICENSE
goto exit

REM HELP
:help
echo.
type meta\header.txt
echo  COMMAND           DESCRIPTION
echo =========         =============
echo weblnp help       Shows you a list with commands
echo weblnp serve      Runs the local web server
echo weblnp sort       Sorts KML files into city-folders
echo weblnp license    Displays the repository's license.
REM echo weblnp reload     Reloads the dev enviroment.
REM echo weblnp exit       Exits out of the dev enviroment and disables the weblnp command
echo.
goto exit

:choose_python
echo Enter a python enviroment of your choice:
echo (Leave blank for default 'python'.)
set /p pyenv= || set pyenv=python

:exit