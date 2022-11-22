echo "Attaching commits to release ${commitId} on sentry"
echo "SENTRY_DSN => ${SENTRY_DSN}"
echo "SENTRY_AUTH_TOKEN => ${SENTRY_AUTH_TOKEN}"
echo "GIT REPO => ${SENTRY_GIT_REPO}"
echo "COMPONENT NAME => ${apiver}"

npm i @sentry/cli

git remote add github git@github.com:quizizz/classes-service.git
npx sentry-cli releases set-commits "$commitId" --auto
npx sentry-cli releases finalize "$commitId"