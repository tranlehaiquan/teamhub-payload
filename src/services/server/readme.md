# This services only can use in server layer

This services/server using for purpose of server layer. You can combine with other services to create a new service, or hide it from the client layer.
Example like `services/server/signup.ts` in this function I create User and Profile in the same time. But in the client layer.

## Key using services/server

- When you want to create a new service that only can use in the server layer.
- When you want to hide some logic from the client layer.

## Note

- Cookie will not auto pass to SDK (payload) or http request. In some case you need to pass it manually.



## Table of Contents
<!-- table localPayload, restful -->

| Feature | Local Payload | RESTful |
|---------|---------------|---------|
| Performance | Faster due to direct DB access | Network overhead, slower due to HTTP requests |
| Use Cases | Server-side operations, internal services | Client-server communication, external APIs |
| Authentication | Direct access to auth context | Requires auth headers/tokens passing |
| Data Format | Native JavaScript objects | JSON over HTTP |
| Error Handling | Direct access to error stack | HTTP status codes and error responses |
| Advantages | - Better performance<br>- Type safety<br>- Direct DB access<br>- No network latency | - Platform independent<br>- Widely adopted<br>- Cacheable<br>- Stateless |
| Disadvantages | - Only works server-side<br>- Tied to Payload CMS | - Network overhead<br>- Additional serialization<br>- More complex error handling |


## Todo

- [ ] Router permission protect
