const sqlite3 = require( "sqlite3").verbose();

//const db = new sqlite3.Database( "playlists.db" );
const db = new sqlite3.Database( ":memory:" );

db.serialize(() => {

    db.run(
      `CREATE TABLE lied (
        lied_id INTEGER PRIMARY KEY AUTOINCREMENT,
        titel TEXT,
        interpret TEXT
      ) 
      `);
    

    const preparedStmt = db.prepare( "INSERT INTO lied(titel,interpret) VALUES (?,?)" );
    preparedStmt.run( "Enter Sandman", "Metallica" );
    preparedStmt.run( "Back in Black", "AC/DC" );
    preparedStmt.finalize();

    db.each( "SELECT titel, interpret FROM lied ORDER by titel", (err, zeile) => {

      console.log( `Lied "${zeile.titel}" von "${zeile.interpret}".`);
    });

    /*


    db.each("SELECT rowid AS id, info FROM lorem", (err, row) => {
        console.log(row.id + ": " + row.info);
    });
    */
});