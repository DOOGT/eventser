

# EventApp - Application de Gestion d'Événements

Application Full Stack de gestion d'événements avec Django REST Framework (backend) et React (frontend).

## Stack Technique

**Backend :** Python 3.10+, Django 5.0+, Django REST Framework 3.14+, django-cors-headers, SQLite

**Frontend :** React 18, React Router DOM 6, React Bootstrap 2.10, Axios, Bootstrap 5.3

---


## Installation

### Backend - Django


cd backend
python -m venv venv
# Windows : venv\Scripts\activate
# Linux/Mac : source venv/bin/activate
pip install django djangorestframework django-cors-headers
pip freeze > requirements.txt
python manage.py makemigrations
python manage.py migrate
Frontend - React
bash
cd frontend
npm install
npm install axios react-bootstrap bootstrap react-router-dom
Lancement
Terminal 1 - Backend
bash
cd backend
venv\Scripts\activate  # ou source venv/bin/activate
python manage.py runserver
➜ http://127.0.0.1:8000

Terminal 2 - Frontend
bash
cd frontend
npm start
➜ http://localhost:3000

API Endpoints
Événements
Méthode	URL	Description
GET	/api/events/	Liste (?search= & ?date=)
POST	/api/events/	Création
GET	/api/events/:id/	Détail
PUT	/api/events/:id/	Modification
DELETE	/api/events/:id/	Suppression
Inscriptions
Méthode	URL	Description
POST	/api/events/:id/register/	Inscription
GET	/api/events/:id/registrations/	Participants
DELETE	/api/registrations/:id/	Annulation
Tests cURL
Créer un événement
bash
curl -X POST http://127.0.0.1:8000/api/events/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Conférence Tech","description":"Description","date":"2025-12-15T14:00:00Z","location":"Ouagadougou","capacity":100}'
201 : {"id":"evt_...","title":"Conférence Tech",...,"availableSpots":100,"isFull":false}

Lister les événements
bash
curl http://127.0.0.1:8000/api/events/
curl "http://127.0.0.1:8000/api/events/?search=tech"
curl "http://127.0.0.1:8000/api/events/?date=2025-12-15"
Voir un événement
bash
curl http://127.0.0.1:8000/api/events/evt_ID/
404 : {"error":"NOT_FOUND","message":"Événement non trouvé"}

Modifier un événement
bash
curl -X PUT http://127.0.0.1:8000/api/events/evt_ID/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Nouveau titre","capacity":150}'
S'inscrire
bash
curl -X POST http://127.0.0.1:8000/api/events/evt_ID/register/ \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Aminata","lastName":"Ouedraogo","email":"aminata@example.com"}'
201 : {"id":"reg_...","eventId":"evt_...","firstName":"Aminata",...}

Email déjà inscrit → 409
bash
curl -X POST http://127.0.0.1:8000/api/events/evt_ID/register/ \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Aminata","lastName":"Ouedraogo","email":"aminata@example.com"}'
409 : {"error":"DUPLICATE_EMAIL","message":"Cette adresse email est déjà enregistrée pour cet événement."}

Événement complet → 422
bash
# Créer événement capacité=1
curl -X POST http://127.0.0.1:8000/api/events/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Mini","description":"Test","date":"2025-12-20T10:00:00Z","location":"Bobo","capacity":1}'

# 1ère inscription (OK)
curl -X POST http://127.0.0.1:8000/api/events/ID/register/ \
  -H "Content-Type: application/json" \
  -d '{"firstName":"User1","lastName":"Test","email":"u1@test.com"}'

# 2ème inscription (REFUSÉE)
curl -X POST http://127.0.0.1:8000/api/events/ID/register/ \
  -H "Content-Type: application/json" \
  -d '{"firstName":"User2","lastName":"Test","email":"u2@test.com"}'
422 : {"error":"CAPACITY_REACHED","message":"Cet événement est complet."}

Champs manquants → 400
bash
curl -X POST http://127.0.0.1:8000/api/events/evt_ID/register/ \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Aminata"}'
400 : {"error":"VALIDATION_ERROR","errors":{"lastName":"Le nom est requis","email":"L'email est requis"}}

Lister les inscriptions
bash
curl http://127.0.0.1:8000/api/events/evt_ID/registrations/
Annuler une inscription
bash
curl -X DELETE http://127.0.0.1:8000/api/registrations/reg_ID/
204 No Content

Supprimer un événement
bash
curl -X DELETE http://127.0.0.1:8000/api/events/evt_ID/
204 No Content

Règles Métier
Règle	HTTP	Message
Capacité atteinte	422	Cet événement est complet.
Email en double	409	Cette adresse email est déjà enregistrée pour cet événement.
Champs manquants	400	Liste des erreurs par champ
Codes HTTP
200 : GET, PUT réussis

201 : Création réussie

204 : Suppression réussie

400 : Données invalides

404 : Ressource non trouvée

409 : Email déjà inscrit

422 : Événement complet

Dépendances
Python (requirements.txt)
text
django>=5.0
djangorestframework>=3.14
django-cors-headers>=4.3
Node.js (package.json)
json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "react-bootstrap": "^2.10.0",
    "bootstrap": "^5.3.2",
    "axios": "^1.6.0"
  }
}
Résolution des Problèmes
L'API ne répond pas :

bash
curl http://127.0.0.1:8000/api/events/
Erreur CORS :
Vérifier que django-cors-headers est installé et CorsMiddleware en 1ère position dans MIDDLEWARE.

Erreur de migration :

bash
rm db.sqlite3
python manage.py makemigrations
python manage.py migrate
Frontend ne se connecte pas :
Vérifier API_BASE_URL dans frontend/src/services/api.js = http://127.0.0.1:8000

Auteur
Développé dans le cadre du test Full Stack - Gestion d'Événements

Licence
Usage interne - Ne pas diffuser

text

---

**Pour télécharger :**
1. Ouvre un éditeur de texte (VS Code, Notepad++)
2. Copie tout le contenu ci-dessus
3. Colle dans un nouveau fichier
4. Sauvegarde sous le nom `README.md`
5. Place-le à la racine de ton projet

