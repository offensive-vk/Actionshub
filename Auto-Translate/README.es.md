# Traducción automática 📘

Traduzca automáticamente un archivo Markdown (por ejemplo, README.md) a otros idiomas y envíe la versión traducida a su repositorio.

## Traducción actual

[No](./README.hi.md)-[Francés](./README.fr.md)-[árabe](./README.ar.md)-[Chino](./README.zh-CN.md)-[Espanol](./README.es.md)-

## 📖 Descripción general

**Traducción automática**es una acción de GitHub que utiliza Google Translate para crear copias traducidas de archivos Markdown en su repositorio. Esto es especialmente útil para repositorios con una audiencia global, ya que hace que la documentación sea accesible en varios idiomas.

## ✨ Características

-   Traduce archivos Markdown a cualquier idioma especificado.
-   Envía el archivo traducido al repositorio.
-   Mensaje de confirmación configurable, confirmador y opciones de confirmación adicionales.

## 🚀 Uso

Para una prueba de fuego real, haga clic[aquí](https://github.com/offensive-vk/auto-translate/tree/master/.github/workflows/test.yml)para ver un ejemplo perfecto de esta Acción.

Añade lo siguiente a tu`.github/workflows/translate.yml`archivo de flujo de trabajo para configurar**Traducción automática**en tu repositorio:

```yaml
name: Translate Action
on:
  push:
    branches:
      - main

jobs:
  translate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Auto Translate
        uses: offensive-vk/auto-translate-action@master
        with:
          file: 'README.md'
          language: 'es'

      - name: Commit and Push
        uses: offensive-vk/auto-commit-push@v7
        with: 
          branch: 'master'
          name: 'TheHamsterBot'
          email: 'TheHamsterBot@outlook.com'
          github-token: ${{ secrets.BOT_TOKEN }}
          message: 'CI: Translated Markdown Files.'
```

Este ejemplo traduce el`README.md`archivo al español (`es`) y el archivo traducido`README.es.md`al repositorio.

### Entradas

| Nombre de entrada | Descripción                                                                                                          | Requerido | Por defecto                                                          |
| ----------------- | -------------------------------------------------------------------------------------------------------------------- | --------- | -------------------------------------------------------------------- |
| `file`            | Ruta del archivo a traducir (relativa a la raíz del repositorio).                                                    | No        | `README.md`                                                          |
| `repo-token`      | Token de GitHub utilizado para autenticar confirmaciones. Usar`${{ secrets.GITHUB_TOKEN }}`en los flujos de trabajo. | No        |                                                                      |
| `committer`       | El nombre del confirmador para la confirmación.                                                                      | No        | `github-actions[bot] <github-actions[bot]@users.noreply.github.com>` |
| `commit-options`  | Opciones adicionales para el`git commit`dominio.                                                                     | No        |                                                                      |
| `language`        | El código del idioma de destino para la traducción (p. ej.,`es`,`zh-CN`,`fr`).                                       | No        | `es`                                                                 |

### Flujo de trabajo de ejemplo

```yaml
name: Translate Multilingual Readme
on:
  workflow_dispatch:

jobs:
  translate:
    strategy:
      matrix:
        lang: ['es', 'hi', 'fr', 'zh-CN', 'ar']
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Auto Translate README to French
        uses: offensive-vk/auto-translate@master
        with:
          file: 'README.md'
          language: ${{ matrix.lang }}

      - name: Commit and Push
        uses: offensive-vk/auto-commit-push@v7
        with: 
          branch: 'master'
          name: 'TheHamsterBot'
          email: 'TheHamsterBot@outlook.com'
          github-token: ${{ secrets.BOT_TOKEN }}
          message: 'Translated Markdown ${{ matrix.lang }} File.'
```

## ⚙️ Idiomas admitidos

Utilice cualquier código de idioma admitido por Google Translate (p. ej.,`es`para español,`zh-CN`para chino simplificado,`fr`para francés). Para obtener una lista completa, consulte[Códigos de idioma del Traductor de Google](https://cloud.google.com/translate/docs/languages).

## 🛠 Desarrollo

Si desea compilar y probar la acción localmente, puede usar[acto](https://github.com/nektos/act)para ejecutar GitHub Actions en su entorno local.

```bash
# Install dependencies
pnpm i

# Run action locally
act -j translate
```

## 📝 Notas

-   Asegúrese de agregar un válido`github-token`en su flujo de trabajo para la autenticación de confirmación.
-   La calidad de la traducción depende de Google Translate y puede variar según el idioma.

## 🤝 Contribuyendo

¡Las contribuciones son bienvenidas! No dude en enviar problemas, solicitudes de funciones o solicitudes de extracción.

## 🧑‍💻 Autor

Creado por Vedansh ([ofensivo-vk](https://github.com/offensive-vk)).

## 📜 Licencia

Este proyecto está bajo la licencia MIT.
