echo "Creating release ${commitId} on sentry"
echo "SENTRY_DSN => ${SENTRY_DSN}"
echo "SENTRY_AUTH_TOKEN => ${SENTRY_AUTH_TOKEN}"
echo "GIT REPO => ${SENTRY_GIT_REPO}"
echo "COMPONENT NAME => ${apiver}"

npm i @sentry/cli

npx sentry-cli releases new "$commitId"
npx sentry-cli releases deploys "$commitId" new -e "$apiver"
npx sentry-cli releases files "$commitId" upload-sourcemaps dist/
npx sentry-cli releases files "$commitId" upload-sourcemaps --ext ts src/
