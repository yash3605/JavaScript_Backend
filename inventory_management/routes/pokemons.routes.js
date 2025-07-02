import { Router } from "express";
import { addPokemon, addTrainer, showPokemonsByTrainer, showPokemonsByTypes, renderTypeAndTrainer } from "../controllers/pokemons.controllers.js";

const pokemonRouter = Router();

pokemonRouter.get('/', renderTypeAndTrainer);
pokemonRouter.get('/types/:id', showPokemonsByTypes);
pokemonRouter.get('/trainer/:id', showPokemonsByTrainer);
pokemonRouter.get('/add-pokemon', (req, res) => {
    res.render('add-pokemon');
})
pokemonRouter.post('/add-pokemon', addPokemon);
pokemonRouter.get('/add-trainer', (req, res) => {
    res.render('add-trainer');
})
pokemonRouter.post('/add-trainer', addTrainer);

export default pokemonRouter;
