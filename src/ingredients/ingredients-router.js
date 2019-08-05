const path = require('path')
const express = require('express')
const xss = require('xss')
const IngredientsService = require('./ingredients-service')
const { requireAuth } = require('../middleware/jwt-auth')

const ingredientsRouter = express.Router()
const jsonParser = express.json()

const serializeIngredient = ingredient => ({
    id: ingredient.id,
    name: xss(ingredient.name),
    instructions: xss(ingredient.instructions),
})

ingredientsRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        IngredientsService.getAllIngredients(knexInstance)
            .then(ingredients => {
                res.json(ingredients.map(serializeIngredient))
            })
            .catch(next)
    })
    .post(requireAuth, jsonParser, (req, res, next) => {
        const { name, instructions } = req.body
        const newIngredient = { name, instructions }
        if (newIngredient.name == null)
            return res.status(400).json({
                error: { message: `Missing 'name' in request body.`}
            })
        IngredientsService.insertIngredient(
            req.app.get('db'),
            newIngredient
        )
            .then(ingredient => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${ingredient.id}`))
                    .json(serializeIngredient(ingredient))
            })
            .catch(next)
    })

ingredientsRouter
    .route('/:id')
    .all((req, res, next) => {
        IngredientsService.getById(
            req.app.get('db'),
            req.params.id
        )
            .then(ingredient => {
                if (!ingredient) {
                    return res.status(404).json({
                        error: { message: `Ingredient not found.`}
                    })
                }
                res.ingredient = ingredient
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeIngredient(res.ingredient))
    })
    .delete((req, res, next) => {
        IngredientsService.deleteIngredient(
            req.app.get('db'),
            req.params.id
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { name, instructions } = req.body
        const ingredientToUpdate = { name, instructions }

        const numberOfValues = Object.values(ingredientToUpdate).filter(Boolean).length
            if (numberOfValues === 0)
                return res.status(400).json({
                    error: {
                        message: `Request body must contain a value to update.`
                    }
                })

        IngredientsService.updateIngredient(
            req.app.get('db'),
            req.params.id,
            ingredientToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = ingredientsRouter