#!/bin/bash

# Replace these with your actual values
USER_ID="TQSmATePdoee1lDApA7RZppt6Ui2"
APP_ID="oNOMxeLbL3vYe8ZI4Lid"
API_KEY="H8VYgyjgjFaiQoHXGgG2BUTrk0oEDmbt"
VERSION=$(jq -r .version package.json)

# Get the platform from the command line arguments
PLATFORM=$1

# Find the APK file in the root directory
APK_FILE=$(ls *.apk)

# Get the signed upload URL
UPLOAD_URL=$(curl -s "https://appho.st/api/get_upload_url?user_id=$USER_ID&app_id=$APP_ID&key=$API_KEY&platform=$PLATFORM&version=$VERSION")

# Upload the APK file to the signed URL
curl -X PUT $UPLOAD_URL -H 'content-type: application/octet-stream' --data-binary "@$APK_FILE" > /dev/null

# Remove the APK file after it has been uploaded
# rm $APK_FILE

echo "App uploaded successfully"