#!/bin/bash

# Update to that version

echo "Updating Application Version ..."
npm install > /dev/null
npm run build

echo "Uploading StaticFiles to s3"

aws s3 sync ./dist/makemypaper s3://makemypapertest --acl 'public-read' --delete

sleep 5
aws cloudfront create-invalidation --distribution-id=E3J5MJ36AEWFS3 --paths "/*"

echo "Done!"

