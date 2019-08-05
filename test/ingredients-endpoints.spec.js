const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Ingredients Endpoints', function() {
    let db

    const { testUsers, testIngredients } = helpers.makeCocktailsFixtures()

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

    describe(`GET /spirited/api/ingredients`, () => {
        context(`Given no ingredients`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/spirited/api/ingredients')
                    .expect(200, [])
            })
        })

        context(`Given there are ingredients in the database`, () => {
           
            beforeEach('insert ingredients', () => {
                return db
                    .into('ingredients')
                    .insert(testIngredients)
            })

            it('responds with 200 and all of the ingredients', () => {
                return supertest(app)
                    .get('/spirited/api/ingredients')
                    .expect(200, testIngredients)
            })
        })
    })

    describe(`GET /spirited/api/ingredients/:ingredient_id`, () => {
        context(`Given no ingredients`, () => {
            it(`responds with 404`, () => {
                const ingredientId = 100000
                return supertest(app)
                    .get(`/spirited/api/ingredients/${ingredientId}`)
                    .expect(404, { error: { message: `Ingredient not found.`}})
            })
        })

        context(`Given there are ingredients in the database`, () => {
           
            beforeEach('insert ingredients', () => {
                return db
                    .into('ingredients')
                    .insert(testIngredients)
            })

            it('responds with 200 and the specified ingredient', () => {
                const ingredientId = 2
                const expectedIngredient = testIngredients[ingredientId - 1]
                return supertest(app)
                    .get(`/spirited/api/ingredients/${ingredientId}`)
                    .expect(200, expectedIngredient)
            })
        })
    })

    describe(`POST /spirited/api/ingredients`, () => {
        beforeEach('insert users', () => {
            return db
                .into('users')
                .insert(testUsers)
        })

        it(`creates an ingredient, responding with 201 and the new ingredient`, () => {
            const newIngredient = {
                name: "mezcal",
                instructions: "none"
            }
            return supertest(app)
                .post('/spirited/api/ingredients')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send(newIngredient)
                .expect(201)
                .expect(res => {
                    expect(res.body.name).to.eql(newIngredient.name)
                    expect(res.body.instructions).to.eql(newIngredient.instructions)
                    expect(res.body).to.have.property('id')
                    expect(res.headers.location).to.eql(`/spirited/api/ingredients/${res.body.id}`)
                })
                .then(res =>
                    supertest(app)
                    .get(`/spirited/api/ingredients/${res.body.id}`)
                    .expect(res.body)
                )
        })

        it(`responds with 400 and en error message when the name field is missing`, () => {
            const newIngredient = {
                instructions: "Simmer for 10 minutes"
            }

            return supertest(app)
                .post('/spirited/api/ingredients')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send(newIngredient)
                .expect(400, {
                    error: { message: `Missing 'name' in request body.` }
                })
        })
    })

    describe(`DELETE /spirited/api/ingredients/:ingredient_id`, () => {
        context(`Given no ingredients`, () => {
            it(`responds with 404`, () => {
                const ingredientId = 1000000
                return supertest(app)
                    .delete(`/spirited/api/ingredients/${ingredientId}`)
                    .expect(404, { error: { message: `Ingredient not found.` } })
            })
        })

        context(`Given there are ingredients in the database`, () => {

            beforeEach('insert ingredients', () => {
                return db
                    .into('ingredients')
                    .insert(testIngredients)
            })

            it('responds with 204 and removes the ingredient', () => {
                const idToRemove = 2
                const expectedIngredients = testIngredients.filter(ingredient => ingredient.id !== idToRemove)
                return supertest(app)
                    .delete(`/spirited/api/ingredients/${idToRemove}`)
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get(`/spirited/api/ingredients`)
                            .expect(expectedIngredients)
                    )
            })
        })
    })

    describe(`PATCH /spirited/api/ingredients/:ingredient_id`, () => {
        context(`Given no ingredients`, () => {
            it(`responds with 404`, () => {
                const ingredientId = 1000000
                return supertest(app)
                    .patch(`/spirited/api/ingredients/${ingredientId}`)
                    .expect(404, { error: { message: `Ingredient not found.` } })
            })
        })

        context(`Given there are ingredients in the database`, () => {

            beforeEach('insert ingredients', () => {
                return db
                .into('users')
                .insert(testUsers)
                .then(() => {
                    return db
                        .into('ingredients')
                        .insert(testIngredients)
                })
            })

            it('responds with 204 and updates the ingredient', () => {
                const idToUpdate = 3
                const updateIngredient = {
                    name: 'rum',
                    instructions: 'none'
                }
                const expectedIngredient = {
                    ...testIngredients[idToUpdate - 1],
                    ...updateIngredient
                }
                return supertest(app)
                    .patch(`/spirited/api/ingredients/${idToUpdate}`)
                    .send(updateIngredient)
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get(`/spirited/api/ingredients/${idToUpdate}`)
                            .expect(expectedIngredient)
                    )
            })

            it('responds with 400 when no fields supplied', () => {
                const idToUpdate = 3
                return supertest(app)
                    .patch(`/spirited/api/ingredients/${idToUpdate}`)
                    .send({ irrelevantField: 'nonsense' })
                    .expect(400, {
                        error: { message: `Request body must contain a value to update.` }
                    })
            })
        })
    })
})