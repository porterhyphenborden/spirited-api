const path = require('path')
const express = require('express')
const xss = require('xss')
const UsersService = require('./users-service')

const usersRouter = express.Router()
const jsonParser = express.json()

const serializeUser = user => ({
    id: user.id,
    fullname: xss(user.full_name),
    username: xss(user.username),
})

usersRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        UsersService.getAllUsers(knexInstance)
        .then(users => {
            res.json(users.map(serializeUser))
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { full_name, username, password } = req.body;
        const newUser = { full_name, username };

        for (const [key, value] of Object.entries(newUser))
        if (value == null)
            return res.status(400).json({
            error: { message: `Missing '${key}' in request body.` }
            })

        newUser.password = password;    

        UsersService.insertUser(
            req.app.get('db'),
            newUser
        )
            .then(user => {
                res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${user.id}`))
                .json(serializeUser(user))
            })
            .catch(next)
    })

usersRouter
    .route('/:id')
    .all((req, res, next) => {
        UsersService.getById(
            req.app.get('db'),
            req.params.id
        )
            .then(user => {
                if (!user) {
                return res.status(404).json({
                    error: { message: `User not found.` }
                })
                }
                res.user = user;
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeUser(res.user))
    })
    .delete((req, res, next) => {
        UsersService.deleteUser(
            req.app.get('db'),
            req.params.id
        )
        .then(numRowsAffected => {
            res.status(204).end()
        })
        .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { full_name, username, password } = req.body;
        const userToUpdate = { full_name, username, password };

        const numberOfValues = Object.values(userToUpdate).filter(Boolean).length
        if (numberOfValues === 0)
            return res.status(400).json({
                error: {
                    message: `Request body must contain field to update.`
                }
        })

        UsersService.updateUser(
            req.app.get('db'),
            req.params.id,
            userToUpdate
        )
        .then(numRowsAffected => {
            res.status(204).end()
        })
        .catch(next)
    })

module.exports = usersRouter;