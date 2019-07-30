const CocktailIngService = {
    getAllCocktailIng(knex) {
        return(knex).select('*').from('cocktail_ing')
    },
    insertCocktailIng(knex, newCocktailIng) {
        return knex
            .insert(newCocktailIng)
            .into('cocktail_ing')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex
            .from('cocktail_ing')
            .select('*')
            .where('id', id)
            .first()
    },
    getByCocktailId(knex, id) {
        return knex
            .select(
                'i.id AS id',
                'ci.id AS ciID',
                'ci.quantity AS quantity',
                'u.unit_name AS unit',
                'i.name AS name'
            )
            .from('ingredients AS i')
            .join('cocktail_ing AS ci', 'i.id', 'ci.ingredient_id')
            .join('units AS u', 'ci.unit', 'u.id')
            .where('cocktail_id', id)
    },
    deleteCocktailIng(knex, id) {
        return knex('cocktail_ing')
            .where({ id })
            .delete()
    },
    updateCocktailIng(knex, id, newCocktailIngFields) {
        return knex('cocktail_ing')
            .where({ id })
            .update(newCocktailIngFields)
    }
}

module.exports = CocktailIngService;