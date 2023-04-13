[<img align="left" src="meta/icon.png" width="120" alt="WebLNP's icon">](https://weblnp.gamingcraft.de/)

# [WebLNP](https://weblnp.gamingcraft.de/)
> Leaflet-based line network map viewer 

WebLNP is a client-sided and Leaflet-based web viewer for line network maps using OpenStreetMaps
with the ability to add historic maps and/or different transit maps per city.

[![](meta/header.png)](https://weblnp.gamingcraft.de/)
> 📍 Albtalbahnhof, Karlsruhe – 2018

## Development

<details><summary><b>Requirements</b></summary>

- Bash
- Python 3

</details>

<details><summary><b>Using the dev enviroment on Linux</b></summary>

You can either choose to run `source weblnp_env` to enable the `weblnp` command or you can run `./weblnp` directly, if you prefer to not modify your enviroment.

</details>

<details><summary><b>Using the dev enviroment on Windows</b></summary>

On Windows you currently either need a [WSL instance](https://learn.microsoft.com/en-us/windows/wsl/install), [Cygwin](https://en.wikipedia.org/wiki/Cygwin) or [MinGW](https://en.wikipedia.org/wiki/MinGW).
Alternatively you need to setup a Linux virtual machine.

If you don't want to install any of these solutions, you can also run the local web server without the script as shown below.

</details>

<details><summary><b>Development without the dev enviroment</b></summary>

If you prefer to not use the dev enviroment or your OS is not supported, you can directly run the web server with `python -m "http.server"`.

> **Note**<br/>
> You can also use other static web servers if required.<br>
> But please add any dotfiles or configs<br>
> which might be generated to the `.gitignore`.

</details>

## Meta

### Authors:
- [Samuel302](https://www.github.com/samuel-302) – [@sam302rk](https://instagram.com/sam302rk)
- [Ebou B.](https://www.instagram.com/ebou.bobb/) – [@ebou.bobb](https://www.instagram.com/ebou.bobb/)
- [Justin O.](https://www.instagram.com/_justin_oltmann_/) – [@\_justin\_oltmann\_](https://www.instagram.com/_justin_oltmann_/)

Distributed under the MIT license. See [``LICENSE``](https://github.com/samuel-302/weblnp/blob/main/LICENSE) for more information.

> **Warning**<br/>
> The license does **not** apply to the [`kml`](https://github.com/samuel-302/weblnp/tree/main/kml) folder and it's subfolders!

## Contributing

```sh
# 1. Fork it
# https://github.com/samuel-302/weblnp/fork

# 2. Create your feature branch
$ git checkout -b feature/fooBar

# 3. Commit your changes
$ git commit -a

# 4. Push to the branch
$ git push origin feature/fooBar

# 5. Create a new pull request
# https://github.com/samuel-302/weblnp/compare
```