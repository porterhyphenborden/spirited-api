const MyCocktailsService = {
    getByUserId(knex, userId) {
        return knex
            .from('cocktails')
            .select('*')
            .where('user_id', userId)
    },
}

module.exports = MyCocktailsService;