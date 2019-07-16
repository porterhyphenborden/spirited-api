const IngredientsService = {
    getAllIngredients(knex) {
        return(knex).select('*').from('ingredients')
    },
    insertIngredient(knex, newIngredient) {
        return knex
            .insert(newIngredient)
            .into('ingredients')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex
            .from('ingredients')
            .select('*')
            .where('id', id)
            .first()
    },
    deleteIngredient(knex, id) {
        return knex('ingredients')
            .where({ id })
            .delete()
    },
    updateIngredient(knex, id, newIngredientFields) {
        return knex('ingredients')
            .where({ id })
            .update(newIngredientFields)
    }
}

module.exports = IngredientsService;