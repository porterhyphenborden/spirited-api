const CocktailsService = {
    getAllCocktails(knex) {
        return(knex).select('*').from('cocktails')
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