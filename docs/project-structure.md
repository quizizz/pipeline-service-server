# Project Structure

.\
├── `apps`: Types of Apps we're going to run - this can be http server, sqs worker, kafka worker\
├── `bootstrap`\
│   ├── bootstrap.ts\
│   ├── `resources`: Various resources we need at application boot time, eg database connection\
│   └── secrets-manager.ts\
├── `config`\
├── `controllers`: All controllers for servicing requests. These are app agnostic.\
│   ├── base.controller.ts\
│   ├── http.controller.ts\
│   ├── kafka.controller.ts\
├── `core`\
│   ├── beans\
│   │   ├── container.ts: Container factory to store all dependencies\
│   │   └── index.ts: Symbols identifiers for all dependencies\
│   ├── emitter.ts\
│   ├── `events`: Event bus for local usage\
│   ├── logger.ts\
│   ├── process.env.ts\
│   ├── `secrets-vault`: Utilities to load and .env.dev and .env.local files\
│   └── service-locator.ts\
├── `domains`: All bounded context definitions\
│   ├── README.md\
├── `errors`: All types of errors\
│   ├── base-error.ts\
├── main.ts\
├── `middlewares`: App agnostic middlewares\
│   ├── base.middleware.ts\
│   └── http.middleware.ts\
├── `others`: Non JS/TS files (which might not be compiled and moved to dist) eg lua, json etc.\
│   └── README.md\
├── `repository`: Data access layer with helper methods for each entity\
├── `routes`: Listed routes\
│   ├── `http`: All http routes\
│   └── `kafka`: All kafka routes\
├── `services`: All business logic\
├── types.ts: Types required frequently across the application\
└── `utils`: Utility methods like time functions, global reflections etc
