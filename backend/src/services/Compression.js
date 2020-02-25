const JsZip = require('jszip');

module.exports = (originalname, file) => {
  var zip = new JsZip();
  zip.file(originalname, file);
  return zip.generateAsync({ type: 'nodebuffer' });
};