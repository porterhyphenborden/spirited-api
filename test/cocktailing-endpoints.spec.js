const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers')

describe('Ingredients Endpoints', function() {
    let db

    const { testUsers, testCocktails, testIngredients, testUnits, testCocktailIng } = helpers.makeCocktailsFixtures()
    const testUser = testUsers[0]

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

    describe(`GET /spirited/api/cocktail-ingredients`, () => {
        context(`Given no ingredients`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/spirited/api/cocktail-ingredients')
                    .expect(200, [])
            })
        })

        context(`Given there are ingredients in the database`, () => {
           
            beforeEach('insert ingredients', () => {
                return db
                    .into('users')
                    .insert(testUsers)
                    .then(() => {
                        return db
                            .into('cocktails')
                            .insert(testCocktails)
                            .then(() => {
                                return db
                                    .into('ingredients')
                                    .insert(testIngredients)
                                    .then(() => {
                                        return db
                                            .into('units')
                                            .insert(testUnits)
                                            .then(() => {
                                                return db
                                                    .into('cocktail_ing')
                                                    .insert(testCocktailIng)
                                            })
                                    })
                            })
                    })
            })

            it('responds with 200 and all of the ingredients', () => {
                return supertest(app)
                    .get('/spirited/api/cocktail-ingredients')
                    .expect(200, testCocktailIng)
            })
        })
    })

    describe(`GET /spirited/api/cocktail-ingredients/:id`, () => {
        context(`Given no ingredients`, () => {
            it(`responds with 404`, () => {
                const ingredientId = 100000;
                return supertest(app)
                    .get(`/spirited/api/cocktail-ingredients/${ingredientId}`)
                    .expect(404, { error: { message: `Cocktail ingredient not found.`}})
            })
        })

        context(`Given there are ingredients in the database`, () => {
           
            beforeEach('insert ingredients', () => {
                return db
                    .into('users')
                    .insert(testUsers)
                    .then(() => {
                        return db
                            .into('cocktails')
                            .insert(testCocktails)
                            .then(() => {
                                return db
                                    .into('ingredients')
                                    .insert(testIngredients)
                                    .then(() => {
                                        return db
                                            .into('units')
                                            .insert(testUnits)
                                            .then(() => {
                                                return db
                                                    .into('cocktail_ing')
                                                    .insert(testCocktailIng)
                                            })
                                    })
                            })
                    })
            })

            it('responds with 200 and the specified ingredient', () => {
                const ingredientId = 2;
                const expectedIngredient = testCocktailIng[ingredientId - 1];
                return supertest(app)
                    .get(`/spirited/api/cocktail-ingredients/${ingredientId}`)
                    .expect(200, expectedIngredient)
            })
        })
    })

    describe(`POST /spirited/api/cocktail-ingredients`, () => {
        beforeEach('insert ingredients', () => {
            return db
                .into('users')
                .insert(testUsers)
                .then(() => {
                    return db
                        .into('cocktails')
                        .insert(testCocktails)
                        .then(() => {
                            return db
                                .into('ingredients')
                                .insert(testIngredients)
                                .then(() => {
                                    return db
                                        .into('units')
                                        .insert(testUnits)
                                })
                        })
                })
        })

        it(`creates an ingredient, responding with 201 and the new ingredient`, () => {
            const newIngredient = {
                cocktail_id: testCocktails[0].id,
                ingredient_id: testIngredients[1].id,
                quantity: '1/2',
                unit: testUnits[0].id
            }
            return supertest(app)
                .post('/spirited/api/cocktail-ingredients')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send(newIngredient)
                .expect(201)
                .expect(res => {
                    expect(res.body.cocktail_id).to.eql(newIngredient.cocktail_id)
                    expect(res.body.ingredient_id).to.eql(newIngredient.ingredient_id)
                    expect(res.body.quantity).to.eql(newIngredient.quantity)
                    expect(res.body.unit).to.eql(newIngredient.unit)
                    expect(res.body).to.have.property('id')
                    expect(res.headers.location).to.eql(`/spirited/api/cocktail-ingredients/${res.body.id}`)
                })
                .then(res =>
                    supertest(app)
                    .get(`/spirited/api/cocktail-ingredients/${res.body.id}`)
                    .expect(res.body)
                )
        })

        const requiredFields = ['cocktail_id', 'ingredient_id', 'quantity', 'unit']

        requiredFields.forEach(field => {
            const newIngredient = {
                cocktail_id: testCocktails[1].id,
                ingredient_id: testIngredients[2].id,
                quantity: '1/2',
                unit: testUnits[0].id
            }

            it(`responds with 400 and an error message when the '${field}' is missing`, () => {
                delete newIngredient[field]

                return supertest(app)
                    .post('/spirited/api/cocktail-ingredients/')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .send(newIngredient)
                    .expect(400, { error: { message: `Missing '${field}' in request body.`}})
            })
        })
    })

    describe(`DELETE /spirited/api/cocktail-ingredients/:id`, () => {
        context(`Given no ingredients`, () => {
            it(`responds with 404`, () => {
                const ingredientId = 1000000;
                return supertest(app)
                    .delete(`/spirited/api/cocktail-ingredients/${ingredientId}`)
                    .expect(404, { error: { message: `Cocktail ingredient not found.` } })
            })
        })

        context(`Given there are ingredients in the database`, () => {

            beforeEach('insert ingredients', () => {
                return db
                    .into('users')
                    .insert(testUsers)
                    .then(() => {
                        return db
                            .into('cocktails')
                            .insert(testCocktails)
                            .then(() => {
                                return db
                                    .into('ingredients')
                                    .insert(testIngredients)
                                    .then(() => {
                                        return db
                                            .into('units')
                                            .insert(testUnits)
                                            .then(() => {
                                                return db
                                                    .into('cocktail_ing')
                                                    .insert(testCocktailIng)
                                            })
                                    })
                            })
                    })
            })

            it('responds with 204 and removes the ingredient', () => {
                const idToRemove = 2;
                const expectedIngredients = testCocktailIng.filter(ingredient => ingredient.id !== idToRemove)
                return supertest(app)
                    .delete(`/spirited/api/cocktail-ingredients/${idToRemove}`)
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get(`/spirited/api/cocktail-ingredients`)
                            .expect(expectedIngredients)
                    )
            })
        })
    })

    describe(`PATCH /spirited/api/cocktail-ingredients/:id`, () => {
        context(`Given no ingredients`, () => {
            it(`responds with 404`, () => {
                const ingredientId = 1000000;
                return supertest(app)
                    .patch(`/spirited/api/cocktail-ingredients/${ingredientId}`)
                    .expect(404, { error: { message: `Cocktail ingredient not found.` } })
            })
        })

        context(`Given there are ingredients in the database`, () => {

            beforeEach('insert ingredients', () => {
                return db
                    .into('users')
                    .insert(testUsers)
                    .then(() => {
                        return db
                            .into('cocktails')
                            .insert(testCocktails)
                            .then(() => {
                                return db
                                    .into('ingredients')
                                    .insert(testIngredients)
                                    .then(() => {
                                        return db
                                            .into('units')
                                            .insert(testUnits)
                                            .then(() => {
                                                return db
                                                    .into('cocktail_ing')
                                                    .insert(testCocktailIng)
                                            })
                                    })
                            })
                    })
            })

            it('responds with 204 and updates the ingredient', () => {
                const idToUpdate = 3;
                const updateIngredient = {
                    quantity: '4'
                };
                const expectedIngredient = {
                    ...testCocktailIng[idToUpdate - 1],
                    ...updateIngredient
                }
                return supertest(app)
                    .patch(`/spirited/api/cocktail-ingredients/${idToUpdate}`)
                    .send(updateIngredient)
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get(`/spirited/api/cocktail-ingredients/${idToUpdate}`)
                            .expect(expectedIngredient)
                    )
            })

            it('responds with 400 when no fields supplied', () => {
                const idToUpdate = 3;
                return supertest(app)
                    .patch(`/spirited/api/cocktail-ingredients/${idToUpdate}`)
                    .send({ irrelevantField: 'nonsense' })
                    .expect(400, {
                        error: { message: `Request body must contain a value to update.` }
                    })
            })
        })
    })
})