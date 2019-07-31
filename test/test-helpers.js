const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
    return [
        {
            id: 1,
            full_name: 'Test User1',
            username: 'test1user1',
            password: 'secret'
        },
        {
            id: 2,
            full_name: 'Test User2',
            username: 'test2user2',
            password: 'secret'
        },
        {
            id: 3,
            full_name: 'Test User3',
            username: 'test3user3',
            password: 'secret'
        }
    ]
}

function makeCocktailsArray() {
    return [
        {
            id: 1,
            name: "Manhattan",
            description: "A great cocktail.",
            created_by: "Me",
            instructions: "Shake with ice.",
            garnish: "orange peel",
            glass: "rocks",
            notes: "Traditionalists use rye whiskey.",
            ing_instructions: "",
            user_id: 1
        },
        {
            id: 2,
            name: "Margarita",
            description: "A tasty treat.",
            created_by: "Joe Schmoe",
            instructions: "Shake with ice.",
            garnish: "lime",
            glass: 'rocks',
            notes: "Use 100% agave tequila.",
            ing_instructions: "",
            user_id: 1
        },
        {
            id: 3,
            name: "Old Fashioned",
            description: "Delicous classic cocktail.",
            created_by: "Bartender",
            instructions: "Add ice and stir.",
            garnish: "orange peel",
            glass: "old fashioned glass",
            notes: "Don't use brandy unless you are from Wisconsin.",
            ing_instructions: "",
            user_id: 2
        },
    ]
}

function makeIngredientsArray() {
    return [
        {
            id: 1,
            name: "Lime Juice",
            instructions: "None"
        },
        {
            id: 2,
            name: "Simple Syrup",
            instructions: "None"
        },
        {
            id: 3,
            name: "Gin",
            instructions: "None"
        }
    ]
}

function makeUnitsArray() {
    return [
        {
            id: 1,
            unit_name: "oz"
        },
        {
            id: 2,
            unit_name: "tbsp"
        },
        {
            id: 3,
            unit_name: "dash"
        }
    ]
}

function makeCocktailIng(cocktails, ingredients, units) {
    return [
        {
            id: 1,
            cocktail_id: cocktails[0].id,
            ingredient_id: ingredients[0].id,
            quantity: "2",
            unit: units[0].id
        },
        {
            id: 2,
            cocktail_id: cocktails[1].id,
            ingredient_id: ingredients[1].id,
            quantity: "1",
            unit: units[1].id
        },
        {
            id: 3,
            cocktail_id: cocktails[2].id,
            ingredient_id: ingredients[2].id,
            quantity: "1/2",
            unit: units[2].id
        }
    ]
}

function makeCocktailsFixtures() {
    const testUsers = makeUsersArray()
    const testCocktails = makeCocktailsArray()
    const testIngredients = makeIngredientsArray()
    const testUnits = makeUnitsArray()
    const testCocktailIng = makeCocktailIng(testCocktails, testIngredients, testUnits)
    return { testUsers, testCocktails, testIngredients, testUnits, testCocktailIng }
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }))
    return db.into('users').insert(preppedUsers)
        .then(() =>
            // update the auto sequence to stay in sync
            db.raw(
                `SELECT setval('users_id_seq', ?)`,
                [users[users.length - 1].id],
            )
        )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
        subject: user.username,
        algorithm: 'HS256',
    })
    return `Bearer ${token}`
}


module.exports = {
    makeUsersArray,
    makeCocktailsArray,
    makeIngredientsArray,
    makeUnitsArray,
    makeCocktailIng,
    makeCocktailsFixtures,
    makeAuthHeader,
    seedUsers,
  }