const CocktailsService = {
    getAllCocktails(knex) {
        return(knex).select('*').from('cocktails')
    },
    getAllPublicCocktails(knex) {
        return knex
            .from('cocktails')
            .select('*')
            .where('user_id', null)
    },
    insertCocktail(knex, newCocktail) {
        return knex
            .insert(newCocktail)
            .into('cocktails')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex
            .from('cocktails')
            .select('*')
            .where('id', id)
            .first()
    },
    getByUserId(knex, userId) {
        return knex
            .from('cocktails')
            .select('*')
            .where('user_id', userId)
    },
    getByName(knex, name) {
        return knex
            .from('cocktails')
            .select('*')
            .where('user_id', null)
            .where('name', 'ilike', `%${name}%`)
            .distinct('name')
    },
    getByIngredient(knex, ingredient) {
        return knex
            .select(
                'c.id AS id',
                'c.name AS name',
                'c.description AS description',
                'c.created_by AS created_by',
                'c.instructions AS instructions',
                'c.garnish AS garnish',
                'c.glass AS glass',
                'c.notes AS notes',
                'c.ing_instructions AS ing_instructions',
                'c.user_id AS user_id',
                'i.name AS ingredient'
            )
            .from('cocktails AS c')
            .join('cocktail_ing AS ci', 'c.id', 'ci.cocktail_id')
            .join('ingredients AS i', 'ci.ingredient_id', 'i.id')
            .where('c.user_id', null)
            .where('i.name', 'ilike', `%${ingredient}%`)
            .distinct('c.name')
    },
    deleteCocktail(knex, id) {
        return knex('cocktails')
            .where({ id })
            .delete()
    },
    updateCocktail(knex, id, newCocktailFields) {
        return knex('cocktails')
            .where({ id })
            .update(newCocktailFields)
    }
}

module.exports = CocktailsService;