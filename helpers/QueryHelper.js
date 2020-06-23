import { AsyncStorage } from 'react-native';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';


export class QueryHelper {
    static db = SQLite.openDatabase('dict.db');
    static sqliteDirectory = `${FileSystem.documentDirectory}/SQLite`;
    static prepareDb = async() => {
      SQLite.openDatabase('dict.db');
      SQLite.openDatabase('kanji.db');
      SQLite.openDatabase('proverbs.db');
      //SQLite.openDatabase('kanjirad.db');
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
        await FileSystem.downloadAsync(Asset.fromModule(require('../assets/db/dict.db')).uri, `${this.sqliteDirectory}/dict.db`);
        await FileSystem.downloadAsync(Asset.fromModule(require('../assets/db/kanji.db')).uri, `${this.sqliteDirectory}/kanji.db`);
        await FileSystem.downloadAsync(Asset.fromModule(require('../assets/db/proverbs.db')).uri, `${this.sqliteDirectory}/proverbs.db`);
        await AsyncStorage.setItem('updateDb', 'false1.2.1');
      }
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
    static async fetchDailyProverbs(callback) {
      const fileInfo = await FileSystem.getInfoAsync(`${this.sqliteDirectory}/proverbs.db`);
      if (!fileInfo.exists)
        await FileSystem.downloadAsync(Asset.fromModule(require('../assets/db/proverbs.db')).uri, `${this.sqliteDirectory}/proverbs.db`);
      const proverbDb = SQLite.openDatabase('proverbs.db');
      const random1 = Math.trunc(Math.random() * 1313 + 1);
      const random2 = Math.trunc(Math.random() * 1313 + 1);
      const random3 = Math.trunc(Math.random() * 1313 + 1);
      console.log(random1);
      proverbDb.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM Proverbs WHERE Id = '${random1}' OR Id = '${random2}' OR Id = '${random3}';`,
          [],
          (_, { rows: { _array } }) => {
              callback(_array);
          });
      });
    }
}