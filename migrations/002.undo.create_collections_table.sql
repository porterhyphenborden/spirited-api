ALTER TABLE cocktails
    DROP COLUMN collection,
    DROP COLUMN image_src;

DROP TABLE IF EXISTS collections;