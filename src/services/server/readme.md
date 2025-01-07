# This services only can use in server layer

This services/server using for purpose of server layer. You can combine with other services to create a new service, or hide it from the client layer.
Example like `services/server/signup.ts` in this function I create User and Profile in the same time. But in the client layer.

## Key using services/server

- When you want to create a new service that only can use in the server layer.
- When you want to hide some logic from the client layer.

## Note

- Cookie will not auto pass to SDK (payload) or http request. In some case you need to pass it manually.
