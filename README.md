# Quizizz Application

## Text Editor

We use VSCode as our primary text editor. Please ensure you have the following extentions for VSCode
(or equivalent ones for the editor you are using) installed:

1. prettier: For opiniated formatting
2. eslint: For linting errors

## Installation

Intallation can be done using:

```sh
npm install
# or
yarn
```

## Local Development (regular)

You can start the local server by running the command below. As we're using nodemon, you can type
`rs` anytime (while the process is running) to re-compile and restart the server.

```sh
npm run local:server
# or
yarn local:server
```

## Clearing previous builds

We can run server locally

Clear previous build (Optional):

```sh
npm run prebuild
# or
yarn prebuild
```

### Misc: Incremental Compilation

Typescript incremental compilation. It can be helpful for running a separate process focussed on
fast compilation.

```sh
npm run watch
# or
yarn watch
```
