const CollectionsService = {
    getAllCollections(knex) {
        return(knex).select('*').from('collections')
    },
    insertCollection(knex, newCollection) {
        return knex
            .insert(newCollection)
            .into('collections')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex
            .from('collections')
            .select('*')
            .where('id', id)
            .first()
    },
    deleteCollection(knex, id) {
        return knex('collections')
            .where({ id })
            .delete()
    },
    updateCollection(knex, id, newCollectionFields) {
        return knex('collections')
            .where({ id })
            .update(newCollectionFields)
    }
}

module.exports = CollectionsService