from flask import Flask, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from database import db
from flask_jwt_extended import JWTManager


from routes import create_user_blueprint

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@localhost:5432/postgres'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

jwt = JWTManager(app)

app.config['JWT_SECRET_KEY'] = 'your-secret-key' 

db.init_app(app)
migrate = Migrate(app, db)


CORS(app, supports_credentials=True, expose_headers='Authorization')


app.register_blueprint(create_user_blueprint(), url_prefix='/api')

@app.route('/api/<path:path>', methods=['OPTIONS'])
def options(path):
    response = jsonify({'message': 'success'})
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')  # Agregar 'Authorization' aquí
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    return response

if __name__ == '__main__':
    app.run(debug=True)
