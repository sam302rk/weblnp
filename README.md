[<img align="left" src="meta/icon.png" width="120" alt="WebLNP's icon">](https://weblnp.gamingcraft.de/)

# [WebLNP](https://weblnp.gamingcraft.de/)
> Leaflet-based line network map viewer 

WebLNP is a client-sided and Leaflet-based web viewer for line network maps using OpenStreetMaps
with the ability to add historic maps and/or different transit maps per city.

[![](meta/header.png)](https://weblnp.gamingcraft.de/)
> 📍 Albtalbahnhof, Karlsruhe – 2018

## Development

<details><summary><h3>CLI Command Overview</h3></summary>

Action | Linux/MacOS | Windows | Description
------ | ----------- | ------- | -----------
View Command Overview | `./weblnp help` | `weblnp help` | Display a list with commands available on your platform.
Start WebLNP | `./weblnp serve` | `weblnp serve` | Starts a minimal static web server for Testing.<br>Runs on `localhost:8000`.<br>Requires Python 3.
Sort KML files | `./weblnp sort` | `weblnp sort` | All KML files in the root `kml` directory get their own directory named after the file<br>and the file itself gets moved inside renamed to `main.kml`.<br>Requires Python 3.
View License | `./weblnp license` | `weblnp license` | Prints the license of WebLNP.<br>Requires GNU `cat` when using the Bash version.
Reload Enviroment | `./weblnp reload` | (not included) | Rebinds the WebLNP CLI to the enviroment.
Exit Enviroment | `./weblnp exit` | (not included) | Removes the WebLNP CLI from the enviroment.

</details>

<details><summary><h3>Contributing</h3></summary>

```sh
# 1. Fork it
# https://github.com/sam302rk/weblnp/fork

# 2. Create your feature branch
$ git checkout -b feature/fooBar

# 3. Commit your changes
$ git commit -a

# 4. Push to the branch
$ git push origin feature/fooBar

# 5. Create a new pull request
# https://github.com/samuel-302/weblnp/compare
```

</details>

<details><summary><h3>WebLNP as enviroment function (Linux)</h3></summary>

For convenience you can also bind the function `weblnp()` running `./weblnp $1` under the hood into the enviroment.

```sh
# Expose function to the enviroment
$ source ./weblnp_env

# Calling the CLI via the enviroment instead of using the Bash file directly
$ weblnp <command>

# Reload
$ weblnp reload # ...or
$ ./weblnp reload

# Remove from enviroment
$ weblnp exit # or...
$ ./weblnp exit
```

</details>

## Meta

### Contributors
- [Sam M.](https://www.github.com/sam302rk) – [@sam302](https://zug.network/@sam302)
- Ebou B. – [@ebou.bobb](https://www.instagram.com/ebou.bobb/)
- Justin O. – [@\_justin\_oltmann\_](https://www.instagram.com/_justin_oltmann_/)
- [Mario C.](https://github.com/marioboss56) - [@Mariology](https://soundcloud.com/riomusic01)

Distributed under the MIT license. See [``LICENSE``](https://github.com/samuel-302/weblnp/blob/main/LICENSE) for more information.

> **Warning**<br/>
> The license does **not** apply to the [`kml`](https://github.com/samuel-302/weblnp/tree/main/kml) folder and it's subfolders!
