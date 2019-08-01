const path = require('path');
const express = require('express');
const xss = require('xss');
const CocktailsService = require('./cocktails-service');
const CocktailIngService = require('../cocktail_ing/cocktailing-service');
const { requireAuth } = require('../middleware/jwt-auth')

const cocktailsRouter = express.Router();
const jsonParser = express.json();

const serializeCocktail = cocktail => ({
    id: cocktail.id,
    name: xss(cocktail.name),
    description: xss(cocktail.description),
    created_by: xss(cocktail.created_by),
    instructions: xss(cocktail.instructions),
    garnish: xss(cocktail.garnish),
    glass: xss(cocktail.glass),
    notes: xss(cocktail.notes),
    ing_instructions: cocktail.ing_instructions,
    user_id: cocktail.user_id,
});

cocktailsRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        if ((!req.query.name) && (!req.query.ingredient)) {
            CocktailsService.getAllCocktails(knexInstance)
                .then(cocktails => {
                    res.json(cocktails.map(serializeCocktail))
                })
                .catch(next)
        }
        else if (req.query.name) {
            CocktailsService.getByName(knexInstance, req.query.name)
                .then(cocktails => {
                    res.json(cocktails.map(serializeCocktail))
                })
                .catch(next)
        }
        else if (req.query.ingredient) {
            CocktailsService.getByIngredient(knexInstance, req.query.ingredient)
                .then(cocktails => {
                    const cocktailsUnique = cocktails.filter((item, index) => {
                        return cocktails.indexOf(item) >= index;
                    })
                    res.json(cocktailsUnique.map(serializeCocktail))
                })
                .catch(next)
        }
    })
    .post(requireAuth, jsonParser, (req, res, next) => {
        const { name, description, created_by, instructions, garnish, glass, notes, ing_instructions } = req.body;
        const newCocktail = { name, description, created_by, instructions, garnish, glass, notes, ing_instructions };
        if (newCocktail.name == null)
            return res.status(400).json({
                error: { message: `Missing 'name' in request body.`}
            })

        newCocktail.user_id = req.user.id

        CocktailsService.insertCocktail(
            req.app.get('db'),
            newCocktail
        )
            .then(cocktail => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${cocktail.id}`))
                    .json(serializeCocktail(cocktail))
            })
            .catch(next)
    })

cocktailsRouter
    .route('/:id')
    .all((req, res, next) => {
        CocktailsService.getById(
            req.app.get('db'),
            req.params.id
        )
            .then(cocktail => {
                if (!cocktail) {
                    return res.status(404).json({
                        error: { message: `Cocktail not found.`}
                    })
                }
                res.cocktail = cocktail;
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeCocktail(res.cocktail))
    })
    .delete((req, res, next) => {
        CocktailsService.deleteCocktail(
            req.app.get('db'),
            req.params.id
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { name, description, created_by, instructions, garnish, glass, notes, ing_instructions, user_id } = req.body;
        const cocktailToUpdate = { name, description, created_by, instructions, garnish, glass, notes, ing_instructions, user_id };

        const numberOfValues = Object.values(cocktailToUpdate).filter(Boolean).length
            if (numberOfValues === 0)
                return res.status(400).json({
                    error: {
                        message: `Request body must contain a valid field to update.`
                    }
                })

        CocktailsService.updateCocktail(
            req.app.get('db'),
            req.params.id,
            cocktailToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

cocktailsRouter
    .route('/:id/ingredients')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        CocktailIngService.getByCocktailId(knexInstance, req.params.id)
            .then(ingredients => {
                res.json(ingredients)
            })
            .catch(next)
    })


module.exports = cocktailsRouter;