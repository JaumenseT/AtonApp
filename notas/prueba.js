const TVDB = require('node-tvdb');
const tvdb = new TVDB('65bad5c8795f9d6e359b1b0c9b9b3145');
 
tvdb.getSeriesAllById('296762')
    .then(response => { console.log(response) })
    .catch(error => {  console.log(error)});