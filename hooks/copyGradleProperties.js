var fs = require('fs');

console.log("****** gradle properties ");
let appId = `applicationId "org.sunbird.aiassistant"`;
let appendStr = '\t\tapplicationId app_id \n' +
    '\t\tresValue("string", "app_name", "${app_name}") \n' +  
    '\t\tresValue("string", "app_id", "${app_id}")'
let androidbuild = "android/app/build.gradle";

// update gradle.properties file
fs.readFile("android/gradle.properties", "utf-8", (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    if(data.match("# config.properties")) {
        console.log("exist ");
    } else {
        fs.readFile("configuration/config.properties", 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            fs.appendFileSync("android/gradle.properties", data);
        })
    }
})

 // build gardle fix
 fs.readFile(androidbuild, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    let arr = data.split('\n');
    let exists = false;
    arr.forEach((a, i)=> {
        if(a.match(appId)) {
            arr[i] = appendStr
        }
        if(a.match("signingConfigs {")) {
            exists = true;
        }
        if(a.match("minifyEnabled false")) {
            arr[i] = 
            `signingConfig signingConfigs.release
            minifyEnabled true`
        }
        if(a.match('buildTypes {') && !exists) {
            arr[i] = `signingConfigs {
                release {
                    storeFile = file("keystore/android_keystore.jks")
                    storePassword System.getenv("SIGNING_STORE_PASSWORD")
                    keyAlias System.getenv("SIGNING_KEY_ALIAS")
                    keyPassword System.getenv("SIGNING_KEY_PASSWORD")
                }
            }
            buildTypes {`
        }
    })
    fs.writeFile(androidbuild, arr.join("\n"), (err) => {
        if (err) {
        console.error("********* err", err);
        }
    });
});
