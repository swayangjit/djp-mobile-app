var fs = require('fs');

// Example: Read properties from a file
const filePath = 'configuration/config.properties';
const properties = readPropertiesFile(filePath);

// Accessing property values
const appName = properties['app_name'];
const appid = properties['app_id'];
const verCode = properties['app_version_code'];

console.log("****** gradle properties ", properties);
let androidbuild = "android/app/build.gradle";
let appendStrCode = `\t\tversionCode ${verCode}`

// update gradle.properties file
fs.readFile("android/gradle.properties", "utf-8", (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    if (data.match("# config.properties")) {
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
    arr.forEach((a, i) => {
        if (a.match('versionCode') && !a.match(appendStrCode)) {
            arr[i] = appendStrCode
        }
    })
    fs.writeFile(androidbuild, arr.join("\n"), (err) => {
        if (err) {
            console.error("********* err", err);
        }
    });
});

function readPropertiesFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    const properties = {};

    for (const line of lines) {
        // Skip comments and empty lines
        if (line.trim() === '' || line.trim().startsWith('#') || line.trim().startsWith(';')) {
            continue;
        }

        const [key, value] = line.split('=');
        properties[key.trim()] = value.trim();
    }

    return properties;
}