const path = require('path');
const express = require('express');
const xss = require('xss');
const UnitsService = require('./units-service');

const unitsRouter = express.Router();
const jsonParser = express.json();

const serializeUnit = unit => ({
    id: unit.id,
    unit_name: xss(unit.unit_name),
});

unitsRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        UnitsService.getAllUnits(knexInstance)
            .then(units => {
                res.json(units.map(serializeUnit))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { unit_name } = req.body;
        const newUnit = { unit_name };
        if (newUnit.unit_name == null)
            return res.status(400).json({
                error: { message: `Missing 'unit name' in request body.`}
            })
        UnitsService.insertUnit(
            req.app.get('db'),
            newUnit
        )
            .then(unit => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${unit.id}`))
                    .json(serializeUnit(unit))
            })
            .catch(next)
    })

unitsRouter
    .route('/:id')
    .all((req, res, next) => {
        UnitsService.getById(
            req.app.get('db'),
            req.params.id
        )
            .then(unit => {
                if (!unit) {
                    return res.status(404).json({
                        error: { message: `Unit not found.`}
                    })
                }
                res.unit = unit;
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeUnit(res.unit))
    })
    .delete((req, res, next) => {
        UnitsService.deleteUnit(
            req.app.get('db'),
            req.params.id
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { unit_name } = req.body;
        const unitToUpdate = { unit_name };

        if (!unit_name) {
                return res.status(400).json({
                    error: {
                        message: `Request body must contain a unit name to update.`
                    }
                })
        }

        UnitsService.updateUnit(
            req.app.get('db'),
            req.params.id,
            unitToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = unitsRouter;