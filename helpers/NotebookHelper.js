import Expo from 'expo';

import * as SQLite from 'expo-sqlite';

export class NotebookHelper {
    static db = SQLite.openDatabase('note.db');
    static add(item) {
        if(this.db != null) {
            this.db.transaction(tx => {
                tx.executeSql(
                    `CREATE TABLE IF NOT EXISTS 'Note' (
                        'Id'	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
                        'ItemId'	INTEGER UNIQUE,
                        'Definition'	TEXT,
                        'Pos'	TEXT,
                        'Keyword'	TEXT,
                        'Reading'	TEXT,
                        'Kanji'	TEXT,
                        'LoanWord'	TEXT,
                        'SeeAlso'	TEXT
                    );`
                );
                tx.executeSql(
                    `INSERT OR IGNORE INTO Note ('ItemId', 'Definition', 'Pos', 'Keyword', 'Reading', 'Kanji', 'LoanWord', 'SeeAlso') VALUES (${item.ItemId}, '${item.Definition}', '${item.Pos}', '${item.Keyword}', '${item.Reading}', '${item.Kanji}', '${item.LoanWord}', '${item.SeeAlso}');`
                );
            });
        }
    }
    static remove(item) {
        if(this.db != null) {
            this.db.transaction(tx => {
                tx.executeSql(`DELETE FROM Note WHERE ItemId = ${item.ItemId}`);
            });
        }
    }
    static isInNotebook(item, callback) {
        if(this.db != null) {
            this.db.transaction(tx => {
                tx.executeSql(`SELECT * FROM Note WHERE ItemId = ${item.ItemId};`,
                [],
                (_, { rows: { _array } }) => {
                    if(_array != null && _array.length > 0) {
                        callback();
                    }
                },
                (a,b) => console.log(b)
                )
            });
        }
    }
}