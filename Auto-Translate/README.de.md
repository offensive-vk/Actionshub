# Automatische Übersetzung 📘

Diese Aktion übersetzt eine Markdown-Datei (z. B. README.md) mithilfe von Optionen automatisch in eine andere Sprache. Diese Aktion verarbeitet jedoch nicht die HTML-Tags und andere komplexe Formatierungen in der Markdown-Datei.

## Aktuelle Übersetzung

[Englisch](./README.md)-[Nein](./README.hi.md)-[Französisch](./README.fr.md)-[Arabisch](./README.ar.md)-[chinesisch](./README.zh-CN.md)-[Spanisch](./README.es.md)

## 📖 Übersicht

**Automatische Übersetzung**ist eine GitHub-Aktion, die Google Translate verwendet, um übersetzte Kopien von Markdown-Dateien in Ihrem Repository zu erstellen. Dies ist besonders nützlich für Repositories mit einem globalen Publikum, da die Dokumentation in mehreren Sprachen zugänglich ist.

## ✨ Funktionen

-   Übersetzt Markdown-Dateien in jede angegebene Sprache.
-   Überträgt die übersetzte Datei im Repository.
-   Konfigurierbare Commit-Nachricht, Committer und zusätzliche Commit-Optionen.

## 🚀 Nutzung

Für einen Live-Brandtest klicken Sie bitte[Hier](https://github.com/offensive-vk/auto-translate/tree/master/.github/workflows/test.yml)um ein perfektes Beispiel dieser Aktion zu sehen.

Fügen Sie Folgendes zu Ihrem hinzu`.github/workflows/translate.yml`Workflowdatei zum Einrichten**Automatische Übersetzung**in Ihrem Repository:

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
        uses: offensive-vk/auto-translate@v7
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
          message: 'CI: Translated Markdown File.'
```

Dieses Beispiel übersetzt die`README.md`Datei auf Spanisch (`es`) und die übersetzte Datei`README.es.md`zum Repository.

### Eingaben

| Geben Sie den Namen ein | Beschreibung                                                                                              | Erforderlich | Standard                                                             |
| ----------------------- | --------------------------------------------------------------------------------------------------------- | ------------ | -------------------------------------------------------------------- |
| `file`                  | Pfad der zu übersetzenden Datei (relativ zum Repository-Stammverzeichnis).                                | NEIN         | `README.md`                                                          |
| `repo-token`            | GitHub-Token zur Authentifizierung von Commits. Verwenden`${{ secrets.GITHUB_TOKEN }}`in Arbeitsabläufen. | NEIN         |                                                                      |
| `committer`             | Der Name des Committers für den Commit.                                                                   | NEIN         | `github-actions[bot] <github-actions[bot]@users.noreply.github.com>` |
| `commit-options`        | Zusätzliche Optionen für die`git commit`Befehl.                                                           | NEIN         |                                                                      |
| `language`              | Der Zielsprachencode für die Übersetzung (z. B.`es`,`zh-CN`,`fr`).                                        | NEIN         | `es`                                                                 |

### Beispiel-Workflow

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

## ⚙️ Unterstützte Sprachen

Verwenden Sie einen beliebigen von Google Translate unterstützten Sprachcode (z. B.`es`für Spanisch,`zh-CN`für vereinfachtes Chinesisch,`fr`für Französisch). Eine vollständige Liste finden Sie unter[Google Translate-Sprachcodes](https://cloud.google.com/translate/docs/languages).

## 🛠 Entwicklung

Wenn Sie die Aktion lokal erstellen und testen möchten, können Sie sie verwenden[Akt](https://github.com/nektos/act)um GitHub-Aktionen in Ihrer lokalen Umgebung auszuführen.

```bash
# Install dependencies
pnpm i

# Run action locally
act -j translate
```

## 📝 Notizen

-   Stellen Sie sicher, dass Sie eine gültige Datei hinzufügen`github-token`in Ihrem Workflow für die Commit-Authentifizierung.
-   Die Übersetzungsqualität hängt von Google Translate ab und kann je nach Sprache variieren.

## 🤝 Mitmachen

Beiträge sind willkommen! Sie können gerne Probleme, Funktionsanfragen oder Pull-Anfragen einreichen.

## 🧑‍💻 Autor

Erstellt von Vedansh ([offensive-vk](https://github.com/offensive-vk)).

## 📜 Lizenz

Dieses Projekt ist unter der Lizenz lizenziert[MIT](LICENSE)Lizenz.

* * *

<p align="center">
  <i>&copy; <a href="https://github.com/offensive-vk/">Vedansh </a> 2020 - Present</i><br>
  <i>Licensed under <a href="https://github.com/offensive-vk/auto-translate?tab=MIT-1-ov-file">MIT</a></i><br>
  <a href="https://github.com/TheHamsterBot"><img src="https://i.ibb.co/4KtpYxb/octocat-clean-mini.png" alt="hamster"/></a><br>
  <sup>Thanks for visiting :)</sup>
</p>
