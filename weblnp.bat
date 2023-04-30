@echo off
goto %1

REM COMMAND NOT FOUND
echo Command unknown. Run 'weblnp help' for a list with commands.
exit

Rem SERVE
:serve
call :choose_python
echo Starting local web server...
%pyenv% -m http.server
exit

REM SORT
:sort
call :choose_python
echo Running sort script...
cd kml
%pyenv% sort.py
cd ..
exit

REM LICENSE
:license
type LICENSE
exit

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
exit

:choose_python
echo Enter a python enviroment of your choice [default: python]:
set /p pyenv= || set pyenv=python