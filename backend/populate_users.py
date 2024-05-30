import os
from faker import Faker
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from flask_bcrypt import generate_password_hash
from random import choice

from database import db
from models import User

fake = Faker()

DATABASE_URI = 'postgresql://postgres:postgres@localhost:5432/postgres'
engine = create_engine(DATABASE_URI)
Session = sessionmaker(bind=engine)
session = Session()

capitals = [
    {"name": "Madrid", "lat": 40.4168, "lng": -3.7038},
    {"name": "Paris", "lat": 48.8566, "lng": 2.3522},
    {"name": "Berlin", "lat": 52.5200, "lng": 13.4050},
    {"name": "Rome", "lat": 41.9028, "lng": 12.4964},
    {"name": "London", "lat": 51.5074, "lng": -0.1278},
    {"name": "Moscow", "lat": 55.7558, "lng": 37.6176},
    {"name": "Athens", "lat": 37.9838, "lng": 23.7275},
    {"name": "Stockholm", "lat": 59.3293, "lng": 18.0686},
    {"name": "Oslo", "lat": 59.9139, "lng": 10.7522},
    {"name": "Prague", "lat": 50.0755, "lng": 14.4378},
    {"name": "Buenos Aires", "lat": -34.6037, "lng": -58.3816},
    {"name": "Brasilia", "lat": -15.8267, "lng": -47.9218},
    {"name": "Lima", "lat": -12.0464, "lng": -77.0428},
    {"name": "Santiago", "lat": -33.4489, "lng": -70.6693},
    {"name": "Bogotá", "lat": 4.711, "lng": -74.0721},
    {"name": "Quito", "lat": -0.1807, "lng": -78.4678},
    {"name": "Caracas", "lat": 10.4806, "lng": -66.9036},
    {"name": "La Paz", "lat": -16.4897, "lng": -68.1193},
    {"name": "Lisbon", "lat": 38.7223, "lng": -9.1393},
    {"name": "Montevideo", "lat": -34.9011, "lng": -56.1645},
    {"name": "Sucre", "lat": -19.0196, "lng": -65.2619},
    {"name": "Asuncion", "lat": -25.2637, "lng": -57.5759},
    {"name": "Georgetown", "lat": 6.8013, "lng": -58.1551},
    {"name": "Paramaribo", "lat": 5.8520, "lng": -55.2038},
    {"name": "Bridgetown", "lat": 13.1132, "lng": -59.5988},
    {"name": "Castries", "lat": 14.0101, "lng": -60.9870},
    {"name": "Kingston", "lat": 17.9712, "lng": -76.7922},
    {"name": "Havana", "lat": 23.1136, "lng": -82.3666},
    {"name": "Mexico City", "lat": 19.4326, "lng": -99.1332},
    {"name": "Washington D.C.", "lat": 38.9072, "lng": -77.0369},
    {"name": "Ottawa", "lat": 45.4215, "lng": -75.6919},
    {"name": "Ottawa", "lat": 45.4215, "lng": -75.6919},
    {"name": "Tokyo", "lat": 35.6895, "lng": 139.6917},
    {"name": "Seoul", "lat": 37.5665, "lng": 126.9780},
    {"name": "Beijing", "lat": 39.9042, "lng": 116.4074},
    {"name": "New Delhi", "lat": 28.6139, "lng": 77.2090},
    {"name": "Jakarta", "lat": -6.2088, "lng": 106.8456},
    {"name": "Bangkok", "lat": 13.7563, "lng": 100.5018},
    {"name": "Singapore", "lat": 1.3521, "lng": 103.8198},
    {"name": "Manila", "lat": 14.5995, "lng": 120.9842},
    {"name": "Riyadh", "lat": 24.7136, "lng": 46.6753},
    {"name": "Ankara", "lat": 39.9334, "lng": 32.8597}, 
]

def create_fake_user():
    username = fake.user_name()
    email = fake.email()
    password = generate_password_hash(fake.password()).decode('utf-8')
    programming_language = fake.random_element(elements=('JavaScript', 'Python', 'Java', 'C++', 'Ruby'))
    capital = choice(capitals)
    location = {'lat': capital['lat'], 'lng': capital['lng']}

    new_user = User(
        username=username,
        email=email,
        password=password,
        programming_language=programming_language,
        location=location
    )
    session.add(new_user)
    session.commit()

def populate_users(n):
    for _ in range(n):
        create_fake_user()
    print(f'{n} users created successfully!')

if __name__ == '__main__':
    populate_users(200)
