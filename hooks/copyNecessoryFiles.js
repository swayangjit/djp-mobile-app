var fs = require('fs');

let srcPath = 'configuration/icon.png';
let destPath = 'assets/icon.png';

let environmentSrcPath = 'configuration/environment.prod.ts';
let environmentDestPath = 'src/environments/environment.prod.ts';

copyNecessoryFiles();

function copyNecessoryFiles(){
    checkFileAndUploadAppIcon();
    checkFileAndCopyEnvironmentFile();

}

function checkFileAndUploadAppIcon() {
    if (fs.existsSync(destPath)) {
        fs.rm(destPath, (err, data) => {
            if(err) {
                console.log('err ', err )
            } else {
                fs.copyFile(srcPath, destPath, (err, data) => {
                    if(err) {
                        console.log('err cpy', err )
                    } 
                    console.log('data cpy ', data )
                })
            }

        })
    } else {
        fs.copyFile(srcPath, destPath, (err, data) => {
            if(err) {
                console.log('err cpy', err )
            } 
            console.log('data cpy ', data )
        })
    }
}

function checkFileAndCopyEnvironmentFile() {
    if (fs.existsSync(environmentDestPath)) {
        fs.rm(environmentDestPath, (err, data) => {
            if(err) {
                console.log('err ', err )
            } else {
                fs.copyFile(environmentSrcPath, environmentDestPath, (err, data) => {
                    if(err) {
                        console.log('err cpy', err )
                    } 
                    console.log('data cpy ', data )
                })
            }

        })
    } else {
        fs.copyFile(environmentSrcPath, environmentDestPath, (err, data) => {
            if(err) {
                console.log('err cpy', err )
            } 
            console.log('data cpy ', data )
        })
    }
}