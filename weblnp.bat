@echo off
goto %1

REM COMMAND NOT FOUND
echo "Command unknown. Run 'weblnp help' for a list with commands."
exit

Rem SERVE
:serve
echo "Starting local web server..."
python -m http.server
exit

REM SORT
:sort
echo "Running sort script..."
cd kml
python sort.python
cd ..
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
REM echo weblnp reload     Reloads the dev enviroment.
REM echo weblnp exit       Exits out of the dev enviroment and disables the weblnp command
echo.
    
exit