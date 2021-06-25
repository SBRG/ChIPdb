    // fs.readdir(path(,options],callback)
    // fs.readdirSync(path[, options])
    const fs = require("fs");

    let directory = "data"
    let dirBuf = Buffer.from(directory);

    let files = fs.readdirSync(directory);
    var TFfiles=[];
    for (var i = 0; i < files.length; i++) {
        TFfiles.push(files[i].replace('_venn.json',''));
    }
    console.log(TFfiles)