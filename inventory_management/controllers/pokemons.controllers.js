import { getPokemonsByType, getPokemonsByTrainer, getAllTrainers, getAllTypes, insertPokemon, insertTrainer } from "../db/queries.js";

const renderTypeAndTrainer = async (req, res) => {
    const types = await getAllTypes();
    const trainers = await getAllTrainers();

    res.render('index', { types, trainers });
}

const showPokemonsByTypes = async (req, res) => {
    const { id } = req.params;

    const pokemons = await getPokemonsByType(id);
    res.render('pokemon', { pokemons, filter: `Type` });
}

const showPokemonsByTrainer = async (req, res) => {
    const { id } = req.params;

    const pokemons = await getPokemonsByTrainer(id)
    res.render('pokemon', { pokemons, filter: `Trainer` });
}

const addPokemon = async (req, res) => {
    const { name, type_id, trainer_id } = req.body;

    await insertPokemon(name, type_id, trainer_id);
    res.redirect('/');
}

const addTrainer = async (req, res) => {
    const { name } = req.body;

    await insertTrainer(name);
    res.redirect('/')
}

export { addTrainer, addPokemon, showPokemonsByTypes, showPokemonsByTrainer, renderTypeAndTrainer }
