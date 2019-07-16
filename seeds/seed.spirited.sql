INSERT INTO units (unit_name)
VALUES
    ('oz'),
    ('tsp'),
    ('tbsp'),
    ('ml'),
    ('cup'),
    ('cups'),
    ('qt'),
    ('dash'),
    ('dashes'),
    ('drop'),
    ('drops'),
    ('barspoon'),
    ('part'),
    ('parts'),
    ('slice'),
    ('slices');

INSERT INTO cocktails (name, description, created_by, instructions, garnish, glass, notes, ing_instructions)
VALUES
    ('Manhattan', 'A classic cocktail invented sometime around 1880, at the Manhattan Club in New York City.', '', 'Add all the ingredients into a mixing glass with ice, and stir until well-chilled. Serve on the rocks or strain and serve up.', 'orange peel or brandied cherry', '', 'Purists insist that rye whiskey is the proper choice, as it was more common when the drink was invented.  Rye will add spice, bourbon makes for a more mellow drink. Angostura bitters can be used, but many other producers make more nuanced bitters--try aromatic bitters from The Bitter Truth or Scrappy"s.', ''),
    ('World Famous Margarita', 'A not-quite-classic margarita recipe that is quite tasty!', 'Eldorado Grill, Madison, WI', 'Add all the ingredients into a mixing glass and shake it like you mean it.', 'salt rim and lime wedge', '', 'Make sure to use a 100% agave tequila. A blanco will be fresh and crisp, whereas a reposado will deepen the flavor. High quality triple sec or other orange liqueur may be substituted for Patron Citronge.', ''),
    ('Bennett', 'A twist on the class gimlet.', '', 'Shake all ingredients with ice. Serve up or on the rocks.', 'lime wheel', '', '', ''),
    ('Hemingway Daiquiri', 'Created for Ernest Hemingway at one of his frequent haunts in Cuba. Make a double and it"s a Papa Doble.', 'La Floridita, Cuba', 'Shake all ingredients with ice and strain into a glass.', 'grapefruit peel', 'coupe', '', '');

INSERT INTO ingredients (name)
VALUES
    ('whiskey'),
    ('sweet vermouth'),
    ('bitters'),
    ('tequila'),
    ('Patron Citronge'),
    ('fresh lime juice'),
    ('simple syrup'),
    ('gin'),
    ('white rum'),
    ('fresh grapefruit juice'),
    ('maraschino liqueur');