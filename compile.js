"use strict";

/**
 * This is a node script that will crawl a directory of node scripts
 * determine their dependency trees, and bundle those files in the
 * correct sequence for browser use.
 *
 * Intent was to meet the requirement of "browserify"-ing
 * ES6 Node CommonJS modules into browser compatiable ES6
 */

var fs = require('fs');

class File {
    constructor(options){
        this.name = options.name || "";
        this.path = options.path || "";
        this.qualified = options.qualified || "";
        this.dependencies = [];
        this.isTop = false;
    }

    setDependencies(){
        if ( skipFiles.indexOf(this.name) == -1 ) {
            this.dependencies = getDeps(this.qualified);
        }
    }

    getFlatDependencies(){
        var d = [];

        // get a flat list of my deps
        // get a flat list of each of their deps
        if ( this.dependencies.length > 0 ){
            this.dependencies.forEach((subtree)=>{
                d = d.concat(subtree);
            });
        }
        // files
        if ( d.length > 0 ){
            d.forEach((file)=>{
                d = d.concat(file.getFlatDependencies());
            });
        }

        return d;
    }
}

function stripPath(fullFilePath){
    var out = fullFilePath;
    if ( fullFilePath.indexOf("/") > -1 ){
        out = fullFilePath.split("/");
        out = out[out.length-1];
    }
    return out;
}

function formatFileData(FileName){
    // open the file and get the contents as a buffer and array of strings / line by line
    var fc = fs.readFileSync(FileName);
    return {
        fileContents: fc,
        fileArray: fc.toString().split("\n")
    };
}

// Return array of this files dependencies only
function getDeps(QualifiedName){
    // open a file and get the array of lines
    var out = [];
    // for every line find the requires
    formatFileData(QualifiedName).fileArray.forEach((line, index, set)=>{
        var lineString = line.toString(),
            startNeedle = "require('",
            finishNeedle = ".class.js'",
            start = lineString.indexOf(startNeedle),
            finish = lineString.indexOf(finishNeedle);
        if ( start > -1 ){

            var depName = lineString.substr(
                    start + startNeedle.length,
                    finish + finishNeedle.length - 1 - (start + startNeedle.length)
                );

            depName = stripPath(depName);

            var tempFile = new File({
                name: depName,
                path: path,
                qualified: path + "/" + depName
            });

            tempFile.setDependencies();

            out.push(
                tempFile
            );
        }
    });
    return out;
}


// recursively count all dependencies - not unique
function getDependencyCount(depsArray) {
    var count = 0;
    depsArray.forEach((tree)=>{
        if ( tree.dependencies.length > 0 ){
            count += tree.dependencies.length;
            tree.dependencies.forEach((file)=>{
                count += file.dependencies.length;
            });
        }
    });
    return count;
}

// get the first dependency set that isnt empty
function getFileWithDeps() {
    for(var i=0; i<flatDeps.length; i++){
        if ( flatDeps[i].dependencies.length > 0 ){
            var temp = flatDeps[i].dependencies;
            flatDeps[i].dependencies = [];
            flatDeps[i].refs = temp;
            return temp;
        }
    }
}


// TODO: Main

var path = "./lib",
    deps = [],
    classList = fs.readdirSync(path),
    outputContent = '',
    outputFile = './bundle.js',
    skipFiles = ['GameServer.class.js'];

//TODO: remove temp list of classes
//classList = ['PhysicsEntity.class.js'];

// build the dep tree
classList.forEach((className)=>{
    if ( skipFiles.indexOf(className) === -1 ){
        var tempFile = new File({
            name: className,
            path: path,
            qualified: path + "/" + className
        });
        tempFile.setDependencies();
        deps.push(tempFile);
    }
});

//TODO: determine the sequence
var sequence = [],
    uniqueNames = [],
    flatDeps = deps,
    reliedOnCounts = {};

// set the levels
flatDeps.forEach((el, index, set)=>{
    flatDeps[index].isTop = true;
});

// build the flat dependencies list
while ( getDependencyCount(flatDeps) > 0 ){
    flatDeps = flatDeps.concat(getFileWithDeps());
}

// build a list of unique names
flatDeps.forEach((file)=>{
    uniqueNames.push(file.qualified);
});
uniqueNames = uniqueNames.filter((el, index, set)=>{
    return set.lastIndexOf(el) === index;
});

// count the utilization and dependants
flatDeps.forEach((el, i, set)=>{
    if ( el.refs != undefined ){
        flatDeps[i].depCount = el.refs.length;
    } else {
        flatDeps[i].refs = [];
        flatDeps[i].depCount = 0;
    }
    if ( reliedOnCounts[el.name] == undefined ){
        if ( el.isTop ){
            reliedOnCounts[el.name] = 0;
        } else {
            reliedOnCounts[el.name] = 1;
        }
    } else {
        reliedOnCounts[el.name]++;
    }
});

var countsArray = [];

// rebuild the counts in a format we can sort
for (var key in reliedOnCounts){
    if (reliedOnCounts.hasOwnProperty(key)) {
        countsArray.push({name:key, count: reliedOnCounts[key]});
    }
}

// sort it descending based on the amount this file is referenced
countsArray = countsArray.sort((a, b)=>{
    return b.count - a.count;
});

console.log(countsArray);

// WRITE to clear
fs.writeFileSync("bundle.js", '"use strict";\n');

countsArray.forEach((file)=>{

    var {fileContents, fileArray} = formatFileData(path+"/"+file.name);

    fs.appendFileSync("bundle.js", "// "+file.name+" ------------------------------\n");

    //console.log(fileArray);

    fileArray.forEach((line, index, set)=>{
        if (    line.indexOf("use strict") > -1 ||
                line.indexOf("require") > -1 ||
                line.indexOf("module.exports") > -1 ){
            //delete fileArray[index];
        } else {
            fs.appendFileSync("bundle.js", fileArray[index]+'\n');
        }
    });

    fs.appendFileSync("bundle.js", "\n\n");

});