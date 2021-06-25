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
<<<<<<< HEAD

// generate all divs:
    for (var i = 0; i < numPlots; i++) {
        $('#main_div').append('<h4>'+tfList[i]+'</h4>')
        $('#main_div').append($('<div/>', {id: 'fig'+tfList[i], style: "width: 80%;height: 250px;"}));
    }
=======
    console.log(TFfiles)
>>>>>>> main
