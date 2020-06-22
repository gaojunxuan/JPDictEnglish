import { AsyncStorage } from 'react-native';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';


export class QueryHelper {
    static db = SQLite.openDatabase('dict.db');
    static prepareDb = async() => {
        SQLite.openDatabase('dict.db');
        SQLite.openDatabase('kanji.db');
        SQLite.openDatabase('kanjirad.db');
        var noteDb = SQLite.openDatabase('note.db');
        noteDb.transaction(tx => {
            tx.executeSql(
                `CREATE TABLE 'Note' (
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
        });
        var result = await AsyncStorage.getItem('updateDb');
        if(result == null || result === 'true') {
          console.log('update db');
          const sqliteDirectory = `${FileSystem.documentDirectory}/SQLite`;
          await FileSystem.downloadAsync(Asset.fromModule(require('../assets/db/dict.db')).uri, `${sqliteDirectory}/dict.db`);
          await FileSystem.downloadAsync(Asset.fromModule(require('../assets/db/kanji.db')).uri, `${sqliteDirectory}/kanji.db`);
          await AsyncStorage.setItem('updateDb', 'false1.2.1');
        }
        

        /*Expo.FileSystem.getInfoAsync(`${Expo.FileSystem.documentDirectory}SQLite/dict.db`).then(info => {
            if (info.exists == false || info.size < 100) {
                console.log(info.size);
                Expo.FileSystem.downloadAsync(
                    Expo.Asset.fromModule(require('../assets/dict.db')).uri,
                    `${Expo.FileSystem.documentDirectory}SQLite/dict.db`
                )
            }
        });*/
        //await FileSystem.downloadAsync(Expo.Asset.fromModule(require('../assets/dict.db')).uri, `${sqliteDirectory}/dict.db`);
/*
        const mainDictInfo = await FileSystem.getInfoAsync(`${sqliteDirectory}/dict.db`);
        if (mainDictInfo.exists == false || mainDictInfo.size < 1000) {
            await FileSystem.downloadAsync(Asset.fromModule(require('../assets/db/dict.db')).uri, `${sqliteDirectory}/dict.db`);
        }
        //console.log(mainDictInfo.uri);
        const kanjiDictInfo = await FileSystem.getInfoAsync(`${sqliteDirectory}/kanji.db`);
        if (kanjiDictInfo.exists == false || kanjiDictInfo.size < 1000) {
            await FileSystem.downloadAsync(Asset.fromModule(require('../assets/db/kanji.db')).uri, `${sqliteDirectory}/kanji.db`);
        }*/

        /*Expo.FileSystem.getInfoAsync(`${Expo.FileSystem.documentDirectory}SQLite/kanji.db`).then(info => {
            if (info.exists == false || info.size < 100) {
                console.log(info.size);
                Expo.FileSystem.downloadAsync(
                    Expo.Asset.fromModule(require('../assets/kanji.db')).uri,
                    `${Expo.FileSystem.documentDirectory}SQLite/kanji.db`
                )
            }
        });*/
        
        /*Expo.FileSystem.getInfoAsync(`${Expo.FileSystem.documentDirectory}SQLite/kanjirad.db`).then(info => {
            if (info.exists == false || info.size < 100) {
                console.log(info.size);
                Expo.FileSystem.downloadAsync(
                    Expo.Asset.fromModule(require('../assets/kanjirad.db')).uri,
                    `${Expo.FileSystem.documentDirectory}SQLite/kanjirad.db`
                )
            }
        });*/
    }
    static fuzzyQuery(keyword, callback) {
        this.db.transaction(tx => {
            tx.executeSql(
              `SELECT * FROM Dict WHERE Keyword LIKE '${keyword}%';`,
              [],
              (_, { rows: { _array } }) => {
                  callback(_array.slice(0, 20));
              },
              (a,b) => console.log(b));
        });
    }
    static query(id, keyword, callback) {
      var queryStatement = `WHERE ItemId = ${id}`;
      if(keyword != "")
        queryStatement += ` AND Reading = '${keyword}'`
      this.db.transaction(tx => {
          tx.executeSql(
            `SELECT * FROM Dict ${queryStatement};`,
            [],
            (_, { rows: { _array } }) => {
                callback(_array);
            });
      });
    }
    static kanjiDb = SQLite.openDatabase('kanji.db');
    static queryKanji(keyword, callback) {
        this.kanjiDb.transaction(tx => {
            tx.executeSql(
              `SELECT * FROM Kanjidict WHERE Kanji = '${keyword}';`,
              [],
              (_, { rows: { _array } }) => {
                  callback(_array);
              });
        });
    }
    //not implemented due to size limitation for assets file
    /*static radicalDb = SQLite.openDatabase("kanjirad.db");
    static queryRadical(keyword, callback) {
        this.radicalDb.transaction(tx => {
            tx.executeSql(
                `select * from KanjiRadical where Kanji = '${keyword}';`,
                [],
                (_, { rows: { _array } }) => {
                    callback(_array);
                }
            )
        });
    }*/
}