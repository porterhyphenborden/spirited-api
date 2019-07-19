const knex = require('knex');
const app = require('../src/app');
const { makeCocktailsArray } = require('./cocktails.fixtures');
const { makeUsersArray } = require('./users.fixtures');

describe('Cocktails Endpoints', function() {
    let db

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

    describe(`GET /spirited/api/cocktails`, () => {
        context(`Given no cocktails`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/spirited/api/cocktails')
                    .expect(200, [])
            })
        })

        context(`Given there are cocktails in the database`, () => {
            const testUsers = makeUsersArray();
            const testCocktails = makeCocktailsArray();

            beforeEach('insert cocktails', () => {
                return db
                    .into('users')
                    .insert(testUsers)
                    .then(() => {
                        return db
                            .into('cocktails')
                            .insert(testCocktails)
                    })
            })

            it('responds with 200 and all of the cocktails', () => {
                return supertest(app)
                    .get('/spirited/api/cocktails')
                    .expect(200, testCocktails)
            })
        })
    })

    describe(`GET /spirited/api/cocktails/:cocktail_id`, () => {
        context(`Given no cocktails`, () => {
            it(`responds with 404`, () => {
                const cocktailId = 100000;
                return supertest(app)
                    .get(`/spirited/api/cocktails/${cocktailId}`)
                    .expect(404, { error: { message: `Cocktail not found.`}})
            })
        })

        context(`Given there are cocktails in the database`, () => {
            const testUsers = makeUsersArray();
            const testCocktails = makeCocktailsArray();

            beforeEach('insert cocktails', () => {
                return db
                    .into('users')
                    .insert(testUsers)
                    .then(() => {
                        return db
                            .into('cocktails')
                            .insert(testCocktails)
                    })
            })

            it('responds with 200 and the specified cocktial', () => {
                const cocktailId = 2;
                const expectedCocktail = testCocktails[cocktailId - 1];
                return supertest(app)
                    .get(`/spirited/api/cocktails/${cocktailId}`)
                    .expect(200, expectedCocktail)
            })
        })
    })

    describe(`POST /spirited/api/cocktails`, () => {
        const testUsers = makeUsersArray();
        beforeEach('insert users', () => {
            return db
                .into('users')
                .insert(testUsers)
        })

        it(`creates a cocktail, responding with 201 and the new cocktail`, () => {
            const newCocktail = {
                name: "Long Island Iced Tea",
                description: "Who drinks this?",
                created_by: "Who knows",
                instructions: "Shake with ice.",
                garnish: "lime",
                glass: "",
                notes: "Very boozy",
                ing_instructions: "",
                user_id: 1
            }
            return supertest(app)
                .post('/spirited/api/cocktails')
                .send(newCocktail)
                .expect(201)
                .expect(res => {
                    expect(res.body.name).to.eql(newCocktail.name)
                    expect(res.body.description).to.eql(newCocktail.description)
                    expect(res.body.created_by).to.eql(newCocktail.created_by)
                    expect(res.body.instructions).to.eql(newCocktail.instructions)
                    expect(res.body.garnish).to.eql(newCocktail.garnish)
                    expect(res.body.glass).to.eql(newCocktail.glass)
                    expect(res.body.notes).to.eql(newCocktail.notes)
                    expect(res.body.ing_instructions).to.eql(newCocktail.ing_instructions)
                    expect(res.body).to.have.property('id')
                    expect(res.headers.location).to.eql(`/spirited/api/cocktails/${res.body.id}`)
                })
                .then(res =>
                    supertest(app)
                    .get(`/spirited/api/cocktails/${res.body.id}`)
                    .expect(res.body)
                )
        })

        it(`responds with 400 and en error message when the name field is missing`, () => {
            const newCocktail = {
                description: "Who drinks this?",
                created_by: "Who knows",
                instructions: "Shake with ice.",
                garnish: "lime",
                glass: "",
                notes: "Very boozy",
                ing_instructions: "",
                user_id: 1
            }

            return supertest(app)
                .post('/spirited/api/cocktails')
                .send(newCocktail)
                .expect(400, {
                    error: { message: `Missing 'name' in request body.` }
                })
        })
    })

    describe(`DELETE /spirited/api/cocktails/:cocktail_id`, () => {
        context(`Given no cocktails`, () => {
            it(`responds with 404`, () => {
                const cocktailId = 1000000;
                return supertest(app)
                    .delete(`/spirited/api/cocktails/${cocktailId}`)
                    .expect(404, { error: { message: `Cocktail not found.` } })
            })
        })

        context(`Given there are cocktails in the database`, () => {
            const testUsers = makeUsersArray();
            const testCocktails = makeCocktailsArray();

            beforeEach('insert cocktails', () => {
                return db
                    .into('users')
                    .insert(testUsers)
                    .then(() => {
                        return db
                            .into('cocktails')
                            .insert(testCocktails)
                    })
            })

            it('responds with 204 and removes the cocktail', () => {
                const idToRemove = 2;
                const expectedCocktails = testCocktails.filter(cocktail => cocktail.id !== idToRemove)
                return supertest(app)
                    .delete(`/spirited/api/cocktails/${idToRemove}`)
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get(`/spirited/api/cocktails`)
                            .expect(expectedCocktails)
                    )
            })
        })
    })

    describe(`PATCH /spirited/api/cocktails/:cocktail_id`, () => {
        context(`Given no cocktails`, () => {
            it(`responds with 404`, () => {
                const cocktailId = 1000000;
                return supertest(app)
                    .patch(`/spirited/api/cocktails/${cocktailId}`)
                    .expect(404, { error: { message: `Cocktail not found.` } })
            })
        })

        context(`Given there are cocktails in the database`, () => {
            const testUsers = makeUsersArray();
            const testCocktails = makeCocktailsArray();

            beforeEach('insert cocktails', () => {
                return db
                    .into('users')
                    .insert(testUsers)
                    .then(() => {
                        return db
                            .into('cocktails')
                            .insert(testCocktails)
                    })
            })

            it('responds with 204 and updates the cocktail', () => {
                const idToUpdate = 3;
                const updateCocktail = {
                    name: 'New Fashioned',
                    description: 'Even better than the original.'
                };
                const expectedCocktail = {
                    ...testCocktails[idToUpdate - 1],
                    ...updateCocktail
                }
                return supertest(app)
                    .patch(`/spirited/api/cocktails/${idToUpdate}`)
                    .send(updateCocktail)
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get(`/spirited/api/cocktails/${idToUpdate}`)
                            .expect(expectedCocktail)
                    )
            })

            it('responds with 400 when no fields supplied', () => {
                const idToUpdate = 3;
                return supertest(app)
                    .patch(`/spirited/api/cocktails/${idToUpdate}`)
                    .send({ irrelevantField: 'nonsense' })
                    .expect(400, {
                        error: { message: `Request body must contain a valid field to update.` }
                    })
            })
        })
    })
})