#!/bin/bash

# Update to that version

echo "Updating Application Version ..."
npm install > /dev/null

npm run build:sls

echo "Uploading StaticFiles to s3"

aws s3 sync ./dist/makemypaper/browser s3://makemypaperdev --acl 'public-read' --delete

sleep 5

serverless deploy --stage=development

sleep 2

aws cloudfront create-invalidation --distribution-id=E1P85I98SRO4N6 --paths "/*"

echo "Done!"
