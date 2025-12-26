# Workflow immagini (Prompt2Image → sito)

Questa repo è un sito statico: le pagine HTML puntano a file in `assets/` e `assets/story/`.
Per vedere davvero le nuove immagini, devi **salvarle con gli stessi nomi** che l’HTML sta caricando.

> Nota importante: molti `<picture>` caricano prima il `.webp` (non il `.jpg`). Quindi conviene sempre avere **JPG + WEBP** aggiornati.


## Metodo consigliato (zero rinomine a mano)

### 1) Genera le immagini con Prompt2Image

- Apri la Command Palette: `Ctrl+Shift+P`
- Cerca: `Prompt2Image` → genera l’immagine

Quando ti chiede dove salvare, salva ogni output dentro:

- `assets/_inbox/`

Vanno bene PNG, JPG, WEBP (lo script converte).

Suggerimento: per controllare meglio l’ordine, rinomina i file generati tipo:

- `001.png`, `002.png`, `003.png`…


### 2) Import automatico nel progetto (scrive i filename corretti)

Lo script legge la lista in `notes/assets-to-generate.md` e assegna le immagini in ordine ai target.

Esegui con il Python del venv:

- `\.venv\Scripts\python.exe scripts\import_generated_images.py --dry-run`

Se la mappatura ti piace:

- `\.venv\Scripts\python.exe scripts\import_generated_images.py`

Per riprendere da un punto specifico (0-based):

- `\.venv\Scripts\python.exe scripts\import_generated_images.py --start 10`


### 3) Verifica

Apri il sito via server (evita `file://`), poi fai hard refresh:

- `http://localhost:5500/festive.html`
- `Ctrl+F5`


## Se vuoi sostituire anche le “immagini vecchie”

Alcune pagine usano ancora file storici (es. `assets/churro-cover.*`, `assets/panettone.*`, `assets/pandoro.*`).
Se vuoi che siano nuove anche quelle, devi rimpiazzare quei file con nuovi export (stesso nome) oppure rinominarle e aggiornare l’HTML.
