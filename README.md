# ROOTS Recruiting App

Dieses Repository enthält die App **als eine statische `index.html`** (gebündelter React-Build) und das **Supabase-Schema** in `supabase-schema.sql`.

## Supabase

- SQL im Supabase-Dashboard (SQL-Editor) ausführen: `supabase-schema.sql`
- In **`index.html`** ganz am Anfang im `<body>` den Block `window.__ROOTS__` mit **Projekt-URL** und **Anon-Key** füllen (dann committen, oder lokal in der Datei setzen, ohne die Keys öffentlich zu teilen, wenn das Repo öffentlich ist)

## Lokal testen

Im Projektordner:

```bash
python3 -m http.server 8080
```

Browser: `http://localhost:8080` — `index.html` wird als Startseite ausgeliefert.

## Anpassungen am Code

Falls du die App wieder entwickeln willst, nimm eine **separate Branch** mit der alten Vite-Struktur (oder ein Archiv) – dieses `main` ist bewusst **nur** die gebündelte `index.html`.
