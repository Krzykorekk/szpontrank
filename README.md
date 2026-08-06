# SzpontRank — szkielet projektu

## Co tu jest
- Strona WWW (React + Vite), zainstalowalna jako PWA (na Androidzie i desktopie prawdziwy przycisk "Zainstaluj", na iOS podpowiedź "Dodaj do ekranu głównego").
- Podłączenie do Supabase (baza danych + logowanie) — na razie tylko sprawdza połączenie, tabel jeszcze nie ma.
- Logo i kolorystyka SzpontRank już wpięte.

## Krok 1 — wrzuć to na GitHub
1. Wejdź na github.com, kliknij zielony przycisk **"New"** (nowe repozytorium).
2. Nazwa repozytorium: `szpontrank`. Zostaw "Public" albo "Private" — oba działają z Vercelem za darmo.
3. Kliknij **"Create repository"**.
4. Na następnej stronie kliknij link **"uploading an existing file"**.
5. Przeciągnij tu **całą zawartość tego folderu** (WSZYSTKIE pliki i podfoldery, oprócz pliku `.env` — jego NIE wgrywaj, zawiera Twoje klucze).
6. Kliknij **"Commit changes"**.

## Krok 2 — połącz z Vercelem
1. Wejdź na vercel.com (jesteś już zalogowany przez GitHub).
2. Kliknij **"Add New" → "Project"**.
3. Wybierz repozytorium `szpontrank` z listy → **"Import"**.
4. Vercel sam rozpozna, że to projekt Vite — nic nie zmieniaj w ustawieniach budowania.
5. **Zanim klikniesz "Deploy"**, rozwiń sekcję **"Environment Variables"** i dodaj dwie zmienne (wartości masz w pliku `.env` w tym folderze):
   - `VITE_SUPABASE_URL` → Twój Project URL
   - `VITE_SUPABASE_ANON_KEY` → Twój anon key
6. Kliknij **"Deploy"**. Po ok. minucie appka będzie online pod adresem typu `szpontrank.vercel.app`.

## Krok 3 — sprawdź, czy działa
- Otwórz link od Vercela na telefonie i na komputerze.
- Na dole strony powinno pojawić się "Status Supabase: połączono".
- Na Androidzie/Chrome powinien pojawić się przycisk "Zainstaluj appkę".
- Na iOS/Safari powinna pojawić się podpowiedź "Dodaj do ekranu głównego".

## Uwaga o bezpieczeństwie
Plik `.env` zawiera Twój `anon key` — jest bezpieczny do użycia w przeglądarce (Supabase go tak projektuje), ale mimo to nie ma potrzeby wrzucać go na GitHub — wartości wpisujesz bezpośrednio w Vercelu jako Environment Variables (krok 2.5).

## Co dalej
Po potwierdzeniu, że to działa online, kolejne kroki to: struktura bazy danych w Supabase (tabele użytkowników, Topek, pytań, głosów) i budowa rejestracji + pierwszych ekranów appki.
