const path = require('path');
const express = require('express');
const xss = require('xss');
const CollectionsService = require('./collections-service')
const CocktailsService = require('../cocktails/cocktails-service')

const collectionsRouter = express.Router();
const jsonParser = express.json();

const serializeCollection = collection => ({
    id: collection.id,
    name: xss(collection.name),
    description: xss(collection.description)
})

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
    collection: cocktail.collection,
    image_src: xss(cocktail.image_src)
})

collectionsRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        CollectionsService.getAllCollections(knexInstance)
            .then(collections => {
                res.json(collections.map(serializeCollection))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { name, description } = req.body;
        const newCollection = { name, description };
        if (newCollection.name == null)
            return res.status(400).json({
                error: { message: `Missing 'name' in request body.`}
            })
        CollectionsService.insertCollection(
            req.app.get('db'),
            newCollection
        )
            .then(collection => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${collection.id}`))
                    .json(serializeCollection(collection))
            })
            .catch(next)
    })

collectionsRouter
    .route('/:id')
    .all((req, res, next) => {
        CollectionsService.getById(
            req.app.get('db'),
            req.params.id
        )
            .then(collection => {
                if (!collection) {
                    return res.status(404).json({
                        error: { message: `Collection not found.`}
                    })
                }
                res.collection = collection;
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeCollection(res.collection))
    })
    .delete((req, res, next) => {
        CollectionsService.deleteCollection(
            req.app.get('db'),
            req.params.id
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { name, description } = req.body;
        const collectionToUpdate = { name, description };

        const numberOfValues = Object.values(cocktailToUpdate).filter(Boolean).length
            if (numberOfValues === 0)
                return res.status(400).json({
                    error: {
                        message: `Request body must contain a valid field to update.`
                    }
                })

        CollectionsService.updateCollection(
            req.app.get('db'),
            req.params.id,
            collectionToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

collectionsRouter
    .route('/:id/cocktails')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        CocktailsService.getByCollectionsId(knexInstance, req.params.id)
            .then(cocktails => {
                res.json(cocktails.map(serializeCocktail))
            })
            .catch(next)
    })

module.exports = collectionsRouter;