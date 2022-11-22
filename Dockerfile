FROM 399771530480.dkr.ecr.us-east-1.amazonaws.com/node:16

ARG env
ARG kind
# component name, eg main
ARG apiver
# commit id or runversion
ARG version
ARG appType
ARG commitId
ARG componentType
ARG sentryDSN
ARG sentryAuthToken
ARG sentryGitRepo

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY src /usr/app/src
COPY scripts /usr/app/scripts

COPY package.json .
COPY tsconfig.json .
COPY tsconfig.build.json .
COPY .sentryclirc .

ENV SENTRY_DSN=${sentryDSN}
ENV SENTRY_AUTH_TOKEN=${sentryAuthToken}
ENV SENTRY_GIT_REPO=${sentryGitRepo}

RUN npm install --quiet
RUN npm run build:ci
RUN npm install @sentry/cli
RUN bash scripts/releaseOnSentry.sh

ENV NODE_ENV=${env}
ENV NODE_SERVER_PORT=8080
ENV NODE_APP_KIND=${kind}
ENV APP_TYPE=${kind}
ENV NODE_COMPONENT_TYPE=${componentType}
ENV SERVICE=${componentType}
ENV NODE_RUNVERSION=${version}
ENV NODE_APIVER=${apiver}
ENV NODE_COMMIT_ID=${commitId}

ENV AWS_REGION=us-east-1
ENV DEBUG=q:app:*

CMD ["bash", "scripts/start.sh"]