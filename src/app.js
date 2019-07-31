require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const cocktailsRouter = require('./cocktails/cocktails-router');
const ingredientsRouter = require('./ingredients/ingredients-router');
const usersRouter = require('./users/users-router');
const cocktailIngRouter = require('./cocktail_ing/cocktailing-router');
const unitsRouter = require('./units/units-router');
const authRouter = require('./auth/auth-router')
const myCocktailsRouter = require('./my-cocktails/mycocktails-router')

const app = express();

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());

app.use('/cocktails', cocktailsRouter)
app.use('/ingredients', ingredientsRouter)
app.use('/users', usersRouter)
app.use('/cocktail-ingredients', cocktailIngRouter)
app.use('/units', unitsRouter)
app.use('/my-cocktails', myCocktailsRouter)
app.use('/auth', authRouter)


app.get('/', (req, res) => {
    res.send('Hello, world!');
})

app.use(function errorHandler(error, req, res, next) {
    let response;
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' }}
    } else {
        console.error(error);
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app;