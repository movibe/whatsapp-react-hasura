# WhatsApp Clone Docker Version
The react client is a forked version of [urigo/whatsapp-client-react](https://github.com/Urigo/WhatsApp-Clone-Client-React) and the server is backed by Hasura GraphQL Engine

# Run Docker container
```bash
  docker-compose up -d
```

# Run the react app

```bash
  cd site
  yarn install
  yarn start
```


## Commands
- Modify the codegen.yml to include the correct endpoint and headers

- Generate the graphql types by running

```bash
  gql-gen
```
This would generate the required types in `src/graphql/types`

- Run the app

```bash
  yarn start
```
