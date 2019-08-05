const express = require('express')
const MyCocktailsService = require('./mycocktails-service')
const { requireAuth } = require('../middleware/jwt-auth')

const myCocktailsRouter = express.Router()


myCocktailsRouter
.route('/')
.get(requireAuth, (req, res, next) => {
        const knexInstance = req.app.get('db')
        userId = req.user.id
        MyCocktailsService.getByUserId(knexInstance, userId)
            .then(cocktails => {
                res.json(cocktails)
            })
            .catch(next)
})

module.exports = myCocktailsRouter