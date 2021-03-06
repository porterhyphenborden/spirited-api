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
    ('slices'),
    ('each'),
    ('whole'),
    ('handful'),
    ('leaves'),
    ('pieces');

INSERT INTO collections (name, description, image_src)
VALUES
    ('7 Inches From the Midday Sun', 'Try one of these refreshing cocktails, great for cooling down on a hot one!', 'https://i.imgur.com/GYxRTOF.png'),
    ('Mezcal Favorites', 'Whether you''re new to mezcal or swig it from the bottle on a Tuesday afternoon, these cocktails are sure to please.', 'https://i.imgur.com/YWVmU4m.png');

INSERT INTO cocktails (name, description, created_by, instructions, garnish, glass, notes, ing_instructions, collection, image_src)
VALUES
    ('Manhattan', 'A classic cocktail invented sometime around 1880, at the Manhattan Club in New York City.', '', 'Add all the ingredients into a mixing glass with ice, and stir until well-chilled. Serve on the rocks or strain and serve up.', 'orange peel or brandied cherry', '', 'Purists insist that rye whiskey is the proper choice, as it was more common when the drink was invented.  Rye will add spice, bourbon makes for a more mellow drink. Angostura bitters can be used, but many other producers make more nuanced bitters--try aromatic bitters from The Bitter Truth or Scrappy''s.', '', NULL, ''),
    ('World Famous Margarita', 'A not-quite-classic margarita recipe that is quite tasty!', 'Eldorado Grill, Madison, WI', 'Add all the ingredients into a mixing glass and shake it like you mean it.', 'salt rim and lime wedge', '', 'Make sure to use a 100% agave tequila. A blanco will be fresh and crisp, whereas a reposado will deepen the flavor. High quality triple sec or other orange liqueur may be substituted for Patron Citronge.', '', NULL, ''),
    ('Bennett', 'A twist on the class gimlet.', '', 'Shake all ingredients with ice. Serve up or on the rocks.', 'lime wheel', '', '', '', 1, ''),
    ('Hemingway Daiquiri', 'Created for Ernest Hemingway at one of his frequent haunts in Cuba. Make a double and it''s a Papa Doble.', 'La Floridita, Cuba', 'Shake all ingredients with ice and strain into a glass.', 'grapefruit peel', 'coupe', '', '', 1, ''),
    ('Corpse Reviver No. 2', 'Who cares about No. 1? This iconic cocktail is delicious.', '', 'Rinse chilled glass with absinthe. Shake all other ingredients with ice and strain into a glass.', 'orange peel', 'coupe', 'You may substitute a good-quality orange liqueur for the Cointreau, and Lillet Blanc for the Cocchi Americano.', '', NULL, ''),
    ('Last Word', 'A prohibition-era cocktail rehabilitated by Seattle-based bartender Murray Stenson.', '', 'Shake all ingredients with ice and strain into a glass.', '', 'coupe', '', '', NULL, ''),
    ('Aviation', 'This revitalized classic became popular when Creme de Violette returned to the US.', '', 'Rinse a chilled glass with the Creme de Violette. Shake all other ingredients with ice and strain into glass.', '', 'coupe', '', '', NULL, ''),
    ('Bijou', 'A rich, herbaceous gin classic.', '', 'Shake all ingredients with ice and strain into a glass.', '', 'coupe', '', '', NULL, ''),
    ('Mezcal Negroni', 'Gran Classico Bitters are the perfect match for mezcal in this Negroni riff.', 'Spirited Editor', 'Stir all ingredients with ice.', 'orange peel', '', 'Bittermens Xocolatl Mole Bitters are an excellent choice.', '', 2, ''),
    ('Mezcal Verde', 'Not for those poor individuals who think cilantro tastes like soap.', 'Spirited Editor', 'Muddle cilantro, cucumber, and jalapeno with simple syrup. Add all other ingredients, shake, and strain over ice. Add a splash of soda water if you like it spritzy.', 'cucumber wheel', '', '', '', 2, ''),
    ('Annie Oakley', 'Lightly sweet, with a whiff of smoke, like the legendary gunslinger herself.', 'Spirited Editor', 'Shake all ingredients with ice.', 'lemon wedge', '', '', 'For vanilla simple syrup: Slice one whole vanilla bean in half lengthwise, and scrape seeds out with knife into small saucepan. Add the bean, 1 cup sugar, and 1 cup water, heat and let simmer 10 minutes. Let cool and strain.', 2, ''),
    ('A Dram and a Smoke', 'Why not have some spice with your smoke? St. Elizabeths Allspice Dram makes adds an interesting element to the spirit-honey-lemon model.', 'Spirited Editor', 'Shake all ingredients with ice.', 'lemon peel', '', '', 'For honey syrup: Mix equal parts honey and hot water, shake or stir until combined.', 2, ''),
    ('Honey Ginger Margarita', 'This margarita riff is the cocktail equivalent of chicken soup when you''re feeling sick.', 'Spirited Editor', 'Shake all ingredients with ice.', 'ginger slice', '', 'Canton is a fantastic ginger liqueur but others can be had for less if you are thrifty.', 'For ginger tequila: Grate 3/4 cup of ginger and add to a bottle of tequila. Let infuse for 3+ days and then strain, squeezing out all liquid. For honey syrup: Mix equal parts honey and hot water, shake or stir until combined.', NULL, ''),
    ('Paloma Fresca', 'This paloma chooses to use fresh grapefruit juice instead of grapefruit soda, and we can''t complain.', 'Spirited Editor', 'Shake all ingredients with ice.', 'grapefruit peel', '', 'A blanco tequila is best here.', '', 1, ''),
    ('Painkiller', 'For when you''re feelin tiki, this drink is as island as it gets.', '', 'Shake all ingredients with ice.', 'grated nutmeg', '', '', '', 1, ''),
    ('Fresh Strawberry Daiquiri', 'To be made only when strawberries are in season, preferably picked by hand and still warm from the sun.', 'Spirited Editor', 'Muddle strawberries with sugar until dissolved. Add remaining ingredients and shake with ice.', 'more strawberries', '', 'A good quality, aged rum without too much funk is ideal.', '', NULL, ''),
    ('Whiskey Smash', 'Sure, mojitos are great, but let''s not forget how awesome mint is with whiskey!', '', 'Muddle mint with simple, add other ingredients and shake with ice.', 'mint sprig', '', '', '', 1, ''),
    ('Penicillin', 'A wee dram of Islay Scotch goes a long way in this smoky modern classic.', 'Sam Ross', 'Muddle fresh ginger and honey syrup, then add the remaining ingredients, except for the Islay whiskey. Shake with ice and then strain into an ice-filled glass. Float the scotch on top.', 'candied ginger', 'rocks', '', '', NULL, ''),
    ('Sazerac', 'A New Orleans classic.', '', 'Rinse a chilled glass with the absinthe. Stir all other ingredients with ice and then strain into the chilled glass.', 'lemon peel', '', '', '', NULL, '');

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
    ('maraschino liqueur'),
    ('Cointreau'),
    ('Cocchi Americano'),
    ('absinthe'),
    ('Green Chartreuse'),
    ('Creme de Violette'),
    ('orange bitters'),
    ('mezcal'),
    ('Gran Classico Bitters'),
    ('mole bitters'),
    ('cucumber'),
    ('jalapeno'),
    ('cilantro'),
    ('vanilla simple syrup'),
    ('Suze'),
    ('honey syrup'),
    ('St. Elizabeth''s Allspice Dram'),
    ('ginger tequila'),
    ('ginger liqueur'),
    ('fresh grapefruit juice'),
    ('fresh lemon juice'),
    ('rum'),
    ('pineapple juice'),
    ('coconut cream'),
    ('fresh orange juice'),
    ('strawberries'),
    ('sugar'),
    ('mint'),
    ('blended Scotch'),
    ('smoky Islay Scotch'),
    ('ginger'),
    ('rye whiskey'),
    ('Peychaud''s bitters');