from app import create_app, db

app = create_app()
app.app_context().push()

# Usuń wszystkie tabele i stwórz je ponownie
db.drop_all()
db.create_all()

print("Baza danych została zresetowana.")
