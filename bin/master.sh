#!/bin/bash

# Update to that version

echo "Updating Application Version ..."
npm install > /dev/null
npm run build

echo "Uploading StaticFiles to s3"

aws s3 sync ./dist/makemypaper s3://makemypaper --acl 'public-read' --delete

sleep 5
aws cloudfront create-invalidation --distribution-id=E3RG6PGU29TT6I --paths "/*"

echo "Done!"
