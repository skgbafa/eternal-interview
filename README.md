# Eternal Demo Server

## Overview
This is a server setup to showcase my ability and considerations when working on a backend server. It's implemented with typescript and graphql, with a mongo backend (MongoDB Atlas). Hosted on Heroku. It's pretty minimal, but should do the following:

- [x] Registration
- [x] Authentication
- [x] Fetch User Account Data
- [ ] Update User Account Data
- [ ] Add followers to a user
- [ ] Remove followers to a user


## Deployment
This app is deloyed on heroku at https://eternal-interveiw.herokuapp.com/graphql. You can install and run it locally with `yarn` and `yarn start`. You need to have a `.env` file with the same credentials as the one in the `.env.example` file (reach out to me for a working example at skgbafa@gmail.com)


## Testing
Below are some queries for testing the graphql endpoint

### Query Variables
Updated at the bottom left corner. These are variables injected into the query. This set should work for `login`, `register`, and `getUser` queries.
```json
{
  "id": "61cbd5ca7a27eac7c494eb5b",
  "name": "Sam",
  "email": "skgbafa+1@gmail.com",
  "password": "eternal123",
  "walletAddress": "0xabc123"
}
```

### HTTP Headers
Updated at the bottom left. These headers are used for non-login and registration requests. Fee free to replace the auth token (the jwt text after "Bearer ") with the `token` recieved from the login or registration requests.
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWNiZDVjYTdhMjdlYWM3YzQ5NGViNWIiLCJpYXQiOjE2NDEyODM0MDIsImV4cCI6MTY0MTM2OTgwMn0.yAQo5noHW2T5XV0EpVPo1ED78kS9OHVqQ4LX5h4cXYg"
}
```

### Login
```graphql
query login($email: String!, $password: String!) {
  login(email: $email, password: $password) {

    success
    token
    message
  }
}
```

### Register
```graphql
mutation register($name: String!, $email: String!, $password: String!, $walletAddress: String!) {
  register (name: $name, email: $email, password: $password, walletAddress: $walletAddress) {
    success
    token
    message
    user {
      _id
      email
      name
      walletAddress
      followerCount
      followers{
        name
      }
    }
  }
}
```

### Get User Data
```graphql
query getUser($id: ID!){
  getUser(id: $id) {
    _id
    name
    email
    walletAddress
    followerCount
    followers {
        name
    }
  }
}
```

