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

The dev enviroment can be used on Windows by calling the `weblnp.bat` file inside the Command Prompt or via the PowerShell.

</details>

<details><summary><b>Development without the dev enviroment</b></summary>

If you prefer to not use the dev enviroment or your OS is not supported, you can directly run the web server with `python -m "http.server"`.

> **Note**<br/>
> You can also use other static web servers if required.<br>
> But please add any dotfiles or configs<br>
> which might be generated to the `.gitignore`.

</details>

<details><summary>Contributing</summary>

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

</details>

## Meta

### Contributors
- [Sam M.](https://www.github.com/samuel-302) – [@sam302](https://zug.network/@sam302)
- Ebou B. – [@ebou.bobb](https://www.instagram.com/ebou.bobb/)
- Justin O. – [@\_justin\_oltmann\_](https://www.instagram.com/_justin_oltmann_/)
- [Mario C.](https://github.com/marioboss56) - [@Mariology](https://soundcloud.com/riomusic01)

Distributed under the MIT license. See [``LICENSE``](https://github.com/samuel-302/weblnp/blob/main/LICENSE) for more information.

> **Warning**<br/>
> The license does **not** apply to the [`kml`](https://github.com/samuel-302/weblnp/tree/main/kml) folder and it's subfolders!
