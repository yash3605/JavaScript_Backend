import db from "./pool.js";

async function getAllTypes() {
    const { rows } = await db.query('SELECT * FROM type');
    return rows;
}

async function getAllTrainers() {
    const { rows } = await db.query('SELECT * FROM trainer');
    return rows;
}

async function getPokemonsByType(typeId) {
    const { rows } = await db.query(`
    SELECT p.id, p.name, t.name AS type, tr.name AS trainer
    FROM pokemon p
    LEFT JOIN type t ON p.type_id = t.id
    LEFT JOIN trainer tr ON p.trainer_id = tr.id
    WHERE p.type_id = $1
  `, [typeId]);
    return rows;
}

async function getPokemonsByTrainer(trainerId) {
    const { rows } = await db.query(`
    SELECT p.id, p.name, t.name AS type, tr.name AS trainer
    FROM pokemon p
    LEFT JOIN type t ON p.type_id = t.id
    LEFT JOIN trainer tr ON p.trainer_id = tr.id
    WHERE p.trainer_id = $1
  `, [trainerId]);
    return rows;
}

async function insertTrainer(trainerName) {
    await db.query('INSERT INTO trainer (name) VALUES ($1)', [trainerName]);
}

async function insertPokemon(pokemonName, typeId, trainerId) {
    await db.query(
        'INSERT INTO pokemon (name, type_id, trainer_id) VALUES ($1, $2, $3)',
        [pokemonName, typeId, trainerId]
    );
}

export { getAllTypes, getAllTrainers, getPokemonsByTrainer, getPokemonsByType, insertTrainer, insertPokemon };
