const path = require('path');
const express = require('express');
const xss = require('xss');
const CocktailIngService = require('./cocktailing-service')
const { requireAuth } = require('../middleware/jwt-auth')

const cocktailIngRouter = express.Router();
const jsonParser = express.json();

const serializeCocktailIng = cocktailIng => ({
    id: cocktailIng.id,
    cocktail_id: cocktailIng.cocktail_id,
    ingredient_id: cocktailIng.ingredient_id,
    quantity: xss(cocktailIng.quantity),
    unit: cocktailIng.unit,
});

cocktailIngRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        CocktailIngService.getAllCocktailIng(knexInstance)
            .then(cocktailIngs => {
                res.json(cocktailIngs.map(serializeCocktailIng))
            })
            .catch(next)
    })
    .post(requireAuth, jsonParser, (req, res, next) => {
        const { cocktail_id, ingredient_id, quantity, unit } = req.body;
        const newCocktailIng = { cocktail_id, ingredient_id, quantity, unit };
        
        for (const [key, value] of Object.entries(newCocktailIng))
        if (value == null)
            return res.status(400).json({
                error: { message: `Missing '${key}' in request body.` }
            })
            CocktailIngService.insertCocktailIng(
                req.app.get('db'),
                newCocktailIng
        )
            .then(cocktailIng => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${cocktailIng.id}`))
                    .json(serializeCocktailIng(cocktailIng))
            })
            .catch(next)
    })

cocktailIngRouter
    .route('/:id')
    .all((req, res, next) => {
        CocktailIngService.getById(
            req.app.get('db'),
            req.params.id
        )
            .then(cocktailIng => {
                if (!cocktailIng) {
                    return res.status(404).json({
                        error: { message: `Cocktail ingredient not found.`}
                    })
                }
                res.cocktailIng = cocktailIng;
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeCocktailIng(res.cocktailIng))
    })
    .delete((req, res, next) => {
        CocktailIngService.deleteCocktailIng(
            req.app.get('db'),
            req.params.id
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { cocktail_id, ingredient_id, quantity, unit } = req.body;
        const cocktailIngToUpdate = { cocktail_id, ingredient_id, quantity, unit };

        const numberOfValues = Object.values(cocktailIngToUpdate).filter(Boolean).length
            if (numberOfValues === 0)
                return res.status(400).json({
                    error: {
                        message: `Request body must contain a value to update.`
                    }
                })

            CocktailIngService.updateCocktailIng(
                req.app.get('db'),
                req.params.id,
                cocktailIngToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = cocktailIngRouter;