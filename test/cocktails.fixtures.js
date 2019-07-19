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

module.exports = {
    makeCocktailsArray
}