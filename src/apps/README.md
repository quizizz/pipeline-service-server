# Applications

We might end up running multiple different kinds of application based on transport using the same
code base. For example, a macro service (servicing a bounded context) can serve a set of APIs as
http endpoints, some other as workers listening on kafka queue or RPC using protobufs.

The `apps` provides ways to initialize one or more types of these applications. For example, a SQS worker can also have an http endpoint for healthchecks. The `App` interface exposes a single
function called "start" which when invoked boots and starts the application.

## Application Factory

We can pass app type and it will return a new instance of desired type everytime.
