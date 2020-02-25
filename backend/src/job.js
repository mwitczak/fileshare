const cron = require('node-cron');
const db = require('./services/Database');
const compress = require('./services/Compression');

module.exports = () => {
  cron.schedule('* * * * *', async () => {
    console.log('Compression running...');

    const files = await db.query(
      'SELECT id, file, OCTET_LENGTH(file) as size, mimetype, originalname FROM files f WHERE zipped = false',
      { type: db.QueryTypes.SELECT });

    if (files.length > 0) {
      for (file of files) {
        const zippedFile = await compress(file.originalname, file.file);

        db.options.logging = false;
        await db.query(
          'UPDATE files f SET file = BINARY(?), zipped = true WHERE f.id = ?',
          {
            replacements: [zippedFile, file.id],
            type: db.QueryTypes.UPDATE,
          });
        db.options.logging = true;
      }
    }

    console.log('Processed ' + files.length + ' files.');
  });
  return cron;
};

