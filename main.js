import sqlite3 from "sqlite3";
import { open } from "sqlite";

// create filename for db seconds since the epoche
const timestamp   = Math.floor( Date.now() / 1000 );
const dbDateiname = `Playlist_${timestamp}.db`;

const db = await open({ filename: dbDateiname, driver: sqlite3.Database });
//const db = await open({ filename: ":memory:", driver: sqlite3.Database });

sqlite3.verbose();
await db.exec( "PRAGMA foreign_keys = ON;" );

await db.exec(
    `CREATE TABLE lieder (
        lied_id   INTEGER PRIMARY KEY AUTOINCREMENT,
        titel     TEXT,
        interpret TEXT,
        UNIQUE (titel, interpret)
    )`
);

await db.exec(
    `INSERT INTO lieder (lied_id, titel, interpret) VALUES
        ( 1, "Enter Sandman", "Metallica"     ),
        ( 2, "Back in Black", "AC/DC"         ),
        ( 3, "Crazy Train"  , "Ozzy Osbourne" ),
        ( 4, "Take On Me"   , "a-ha"          ),
        ( 5, "Wild Boys"    , "Duran Duran"   )`
);


const ergebnisArray1 = await db.all( "SELECT titel, interpret FROM lieder ORDER by titel" );
ergebnisArray1.forEach( (zeile) => {

    console.log( `Lied "${zeile.titel}" von "${zeile.interpret}".` );
});

await db.exec(
    `CREATE TABLE playlists (
        playlist_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name        TEXT UNIQUE
    )`
);

await db.exec(
    `INSERT INTO playlists (playlist_id, name) VALUES
        ( 1, "Hard'n'Heavy" ),
        ( 2, "80er Pop"     )`
);

await db.exec(
    `CREATE TABLE song2playlist (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        lied_id     INTEGER,
        playlist_id INTEGER,
        UNIQUE ( lied_id, playlist_id ),
        FOREIGN KEY ( lied_id     ) REFERENCES lieder(    lied_id     ),
        FOREIGN KEY ( playlist_id ) REFERENCES playlists( playlist_id )
    )`
);

await db.exec(
    `INSERT INTO song2playlist ( playlist_id, lied_id ) VALUES
        ( 1, 1 ),
        ( 1, 2 ),
        ( 2, 4 ),
        ( 2, 5 )`
);

console.log();

const ergebnisArray2 =
    await db.all(
      `
        SELECT name, interpret, titel
          FROM lieder, playlists, song2playlist
          WHERE song2playlist.lied_id     == lieder.lied_id
            AND song2playlist.playlist_id == playlists.playlist_id;

      `
     );
ergebnisArray2.forEach( (zeile) => {

    console.log( `Playlist "${zeile.name}": "${zeile.titel}" von "${zeile.interpret}"`);
});

console.log();

await db.run( "DELETE FROM lieder WHERE lied_id == 3" );

try {
  await db.run( "DELETE FROM lieder WHERE lied_id == 4" );
}
catch ( fehler ) {

  console.error( "Noch in Playlist referenziertes Lied konnte nicht gelöscht werden: " + fehler );
}


await db.close();
