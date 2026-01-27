import sqlite3 from "sqlite3";
import { open } from "sqlite";;


//const db = await open({ filename: "Playlist.db", driver: sqlite3.Database });
const db = await open({ filename: ":memory:", driver: sqlite3.Database });

sqlite3.verbose();

await db.exec(
      `CREATE TABLE lieder (
        lied_id   INTEGER PRIMARY KEY AUTOINCREMENT,
        titel     TEXT,
        interpret TEXT
      )`
);

await db.exec(`
  INSERT INTO lieder (titel, interpret) VALUES
    ("Enter Sandman", "Metallica"    ),
    ("Back in Black", "AC/DC"        ),
    ("Crazy Train"  , "Ozzy Osbourne")
`);


const ergebnisArray = await db.all("SELECT titel, interpret FROM lieder ORDER by titel");
ergebnisArray.forEach( (zeile) => {

    console.log( `Lied "${zeile.titel}" von "${zeile.interpret}".`);
});
