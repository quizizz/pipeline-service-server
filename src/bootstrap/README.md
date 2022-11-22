# Bootstrap

Bootstrap is used load all resourced required before application can get online. This include multiple resources like datastore connection pools, setting up config etc

Every resource is decoupled from the point of it's actual loading. What this means is booting of resources is tightly coupled with bootstrap method itself - bootstrap method offers a single way to load a bunch of resources concurrently. This can be helpful as different application might need different resources, and sometime not all resources are required - for example when writing some utility scripts.

Every resource must implement the `Resource` interface, which exposes a "load" method which can be invoked to boot it.

## Secrets Manager

Loading secrets is a common step before bootstrapping any application. Secrets manager does precisely this - it loads secrets from relevent source and populates them as environment variables.

### Note about local secret management

When running server in local, it is helpful to cache them in a local file with some expiry instead of fetching the secrets on every boot. We are caching all secrets into the .env.dev file for 24 hours.

For prod, all secrets in the namespace of:

1. `/prod`
2. `/prod/$SERVICE`

are fetched.

Similarly for dev, all secrets in namespace of

1. `/dev`
2. `/dev/$SERVICE`

are fetched.

For local, in addition to all dev secrets, we also pull some local configs which include namespaces:

1. `/local`
2. `/local/$SERVICE`

This is critical, as sometime secrets for dev and local are not same. In that case we can effectively override dev secrets fetched from remote with local secrets also fetched from remote.

### Overriding secrets

Sometimes we might want to override some secrets while working on local (change a kafka topic, sqs queue name etc). In that case, we can copy relevant key from `.env.dev` and overwrite them in the `.env.local` file. All secrets in `.env.local` take precendence. Note this is only applicable for local.

Note that comments are allowed in `.env.local` - all lines starting with `#` are ignored.
