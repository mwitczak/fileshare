'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db, callback) {
  db.createTable('files', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    user: {
      type: 'int', foreignKey: {
        name: 'files_user_fk',
        table: 'users',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        mapping: 'id',
      },
    },
    file: {
      type: 'longblob',
    },
    originalname: {
      type: 'string'
    },
    mimetype: {
      type: 'string'
    }
  }, callback);
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  'version': 1,
};
