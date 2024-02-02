#!/bin/bash

# Read properties from config.properties
if [[ "$(uname)" == "Darwin" ]]; then
    APP_NAME=$(grep 'app_name' configuration/config.properties | cut -d'=' -f2)
    APP_ID=$(grep 'app_id' configuration/config.properties | cut -d'=' -f2)
else
    APP_NAME=$(powershell -Command "Get-Content -Path 'configuration/config.properties' | ForEach-Object { \$_ -split '=' } | Where-Object { \$_.Trim() -eq 'app_name' } | Select-Object -Last 1")
    APP_ID=$(powershell -Command "Get-Content -Path 'configuration/config.properties' | ForEach-Object { \$_ -split '=' } | Where-Object { \$_.Trim() -eq 'app_id' } | Select-Object -Last 1")
fi

# Update capacitor.config.ts
sed -i'' -e "s/'app.name'/'$APP_NAME'/" capacitor.config.ts
sed -i'' -e "s/'app.id'/'$APP_ID'/" capacitor.config.ts

echo "updated appname and appid"

# Build your Ionic app
ionic build

# Build your Ionic app, add android, generate icons and build
npx cap add android
npx @capacitor/assets generate --iconBackgroundColor '#ffffff' --iconBackgroundColorDark '#222222'
npm run ionic-build
