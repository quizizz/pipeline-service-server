# Config

All config values are mapped from environment variables to `Config` attributes.
Note that you will have to add those config values in the remote vault before you can start using it.

## Mapping config values

A number of methods like `string`, `number`, `boolean`, `json` map env variables to config attributes. However, it is important to make sure the structures align. For example:

```js
{
  kafka: json({
    brokers: [],
  }),
}
```

will not match against Q_KAFKA_BROKERS. However, the one below will:

```js
{
  kafka: {
    brokers: json([]),
  }
}
```
