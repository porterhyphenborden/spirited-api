const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Units Endpoints', function() {
    let db

    const { testUnits } = helpers.makeCocktailsFixtures()

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db.raw('TRUNCATE users, units, cocktails, ingredients, cocktail_ing RESTART IDENTITY CASCADE'))

    afterEach('cleanup', () => db.raw('TRUNCATE users, units, cocktails, ingredients, cocktail_ing RESTART IDENTITY CASCADE'))

    describe(`GET /spirited/api/units`, () => {
        context(`Given no units`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/spirited/api/units')
                    .expect(200, [])
            })
        })

        context(`Given there are units in the database`, () => {
           
            beforeEach('insert units', () => {
                return db
                    .into('units')
                    .insert(testUnits)
            })

            it('responds with 200 and all of the units', () => {
                return supertest(app)
                    .get('/spirited/api/units')
                    .expect(200, testUnits)
            })
        })
    })

    describe(`GET /spirited/api/units/:unit_id`, () => {
        context(`Given no units`, () => {
            it(`responds with 404`, () => {
                const unitId = 100000
                return supertest(app)
                    .get(`/spirited/api/units/${unitId}`)
                    .expect(404, { error: { message: `Unit not found.`}})
            })
        })

        context(`Given there are units in the database`, () => {
           
            beforeEach('insert units', () => {
                return db
                    .into('units')
                    .insert(testUnits)
            })

            it('responds with 200 and the specified unit', () => {
                const unitId = 2
                const expectedUnit = testUnits[unitId - 1]
                return supertest(app)
                    .get(`/spirited/api/units/${unitId}`)
                    .expect(200, expectedUnit)
            })
        })
    })

    describe(`POST /spirited/api/units`, () => {
        it(`creates an unit, responding with 201 and the new unit`, () => {
            const newUnit = {
                unit_name: "barspoon"
            }
            return supertest(app)
                .post('/spirited/api/units')
                .send(newUnit)
                .expect(201)
                .expect(res => {
                    expect(res.body.name).to.eql(newUnit.name)
                    expect(res.body).to.have.property('id')
                    expect(res.headers.location).to.eql(`/spirited/api/units/${res.body.id}`)
                })
                .then(res =>
                    supertest(app)
                    .get(`/spirited/api/units/${res.body.id}`)
                    .expect(res.body)
                )
        })
    })

    describe(`DELETE /spirited/api/units/:unit_id`, () => {
        context(`Given no units`, () => {
            it(`responds with 404`, () => {
                const unitId = 1000000
                return supertest(app)
                    .delete(`/spirited/api/units/${unitId}`)
                    .expect(404, { error: { message: `Unit not found.` } })
            })
        })

        context(`Given there are units in the database`, () => {

            beforeEach('insert units', () => {
                return db
                    .into('units')
                    .insert(testUnits)
            })

            it('responds with 204 and removes the unit', () => {
                const idToRemove = 2
                const expectedUnits = testUnits.filter(unit => unit.id !== idToRemove)
                return supertest(app)
                    .delete(`/spirited/api/units/${idToRemove}`)
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get(`/spirited/api/units`)
                            .expect(expectedUnits)
                    )
            })
        })
    })

    describe(`PATCH /spirited/api/units/:unit_id`, () => {
        context(`Given no units`, () => {
            it(`responds with 404`, () => {
                const unitId = 1000000
                return supertest(app)
                    .patch(`/spirited/api/units/${unitId}`)
                    .expect(404, { error: { message: `Unit not found.` } })
            })
        })

        context(`Given there are units in the database`, () => {

            beforeEach('insert units', () => {
                return db
                    .into('units')
                    .insert(testUnits)
            })

            it('responds with 204 and updates the unit', () => {
                const idToUpdate = 3
                const updateUnit = {
                    unit_name: 'dashes'
                }
                const expectedUnit = {
                    ...testUnits[idToUpdate - 1],
                    ...updateUnit
                }
                return supertest(app)
                    .patch(`/spirited/api/units/${idToUpdate}`)
                    .send(updateUnit)
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get(`/spirited/api/units/${idToUpdate}`)
                            .expect(expectedUnit)
                    )
            })

            it('responds with 400 when no fields supplied', () => {
                const idToUpdate = 3
                return supertest(app)
                    .patch(`/spirited/api/units/${idToUpdate}`)
                    .send({ irrelevantField: 'nonsense' })
                    .expect(400, {
                        error: { message: `Request body must contain a unit name to update.` }
                    })
            })
        })
    })
})