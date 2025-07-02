#!/usr/bin/env bash

# Usage: ./db/populateDB.sh

echo "Populating the Pokemon management database with dummy data..."

# Adjust these if your DB, user, or password are different
DB_NAME="pokemons"
DB_USER="yashpratap"

# Insert dummy types
psql -U $DB_USER -d $DB_NAME -c "INSERT INTO type (name) VALUES ('Fire'), ('Water'), ('Grass'), ('Electric');"

# Insert dummy trainers
psql -U $DB_USER -d $DB_NAME -c "INSERT INTO trainer (name) VALUES ('Ash'), ('Misty'), ('Brock');"

# Insert dummy pokemons
psql -U $DB_USER -d $DB_NAME -c "INSERT INTO pokemon (name, type_id, trainer_id) VALUES
  ('Charmander', 1, 1),
  ('Squirtle', 2, 2),
  ('Bulbasaur', 3, 1),
  ('Pikachu', 4, 1),
  ('Staryu', 2, 2),
  ('Onix', 3, 3);"

echo "Dummy data inserted successfully!"
