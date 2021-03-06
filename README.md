# Eternal Demo Server

## Overview
This is a server setup to showcase my ability and considerations when working on a backend server. It's implemented with typescript and graphql, with a mongo backend (MongoDB Atlas). Hosted on Heroku. It's pretty minimal, but should do the following:

- [x] Registration
- [x] Authentication
- [x] Fetch User Account Data
- [x] Update User Account Data
- [x] Add followers to a user
- [x] Remove followers to a user
- [x] Populate followers on a user

## Known Issues
There is an issue where all folowers are not being populated. Was discovered when testing the simulator. Will fix in the future.
## Deployment
This app is deloyed on heroku at https://eternal-interveiw.herokuapp.com/graphql.

You can install and run it locally with `yarn` and `yarn start`.

You need to have a `.env` file with the same credentials as the one in the `.env.example` file (reach out to me for a working example at skgbafa@gmail.com)

## Simulation
You can run a small simulation of the app by running `yarn simulation`. This will create multiple users and have them follow each other. It runs against the public API. It generates a `sim.csv` with the account data, which you can use to login and make additonal requests.

## Testing
Below are some queries for testing the graphql endpoint

### Query Variables
Updated at the bottom left corner. These are variables injected into the query. This set should work for `login`, `register`, and `getUser` queries.
```json
{
  "id": "61dc6174a62ec7d3dfec0569",
  "name": "Sam",
  "email": "skgbafa+1@gmail.com",
  "password": "eternal123",
  "walletAddress": "0xabc123"
}
```

### HTTP Headers
Updated at the bottom left. These headers are used for non-login and registration requests. Fee free to replace the auth token (the jwt text after "Bearer ") with the `token` recieved from the login or registration requests. The auth token is used to identify the user in other operations (like `updateName`).
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWRjNjE3NGE2MmVjN2QzZGZlYzA1NjkiLCJpYXQiOjE2NDE4MzMyMjQsImV4cCI6MTY0MTkxOTYyNH0.o4j7xFGVVZY8Z11Nn21u_tEwVhXa9dYmi6XB0spjCpM"
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
    success
    message
    user {
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
}
```
### Update User Data
This is comprised of 3 mutations. They need the related query variables to work.
#### Example Query Variables
```json
{
  "newName": "Samuel",
	"newEmail": "skgbafa+1@gmail.com",
  "newWalletAddress": "0x0f0f0f"
}
```

#### Update User Name
```graphql
mutation updateName($newName:String!) {
  updateName(name: $newName) {
    success
    message
    user {
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
}
```

#### Update User Email
```graphql
mutation updateEmail($newEmail:String!) {
  updateEmail(email: $newEmail) {
    success
    message
    user {
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
}
```

#### Update User Wallet Address
```graphql
mutation updateWalletAddress($newWalletAddress:String!) {
  updateWalletAddress(walletAddress: $newWalletAddress) {
    success
    message
    user {
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
}
```

### Add/Remove Follower
Adding and removing followers has 2 query variables, defined below. You can add and remove followers as well as request a list of followers directly.
#### Example Query Variables
```json
{
  "personToFollow": "61dc8a7d0ff87420c440b2a9",
  "personToUnfollow": "61dc8a7d0ff87420c440b2a9"
}
```

#### Add Follower
```graphql
mutation followUser($personToFollow:ID!) {
  followUser(userId: $personToFollow) {
    success
    message
  }
}
```

#### Remove Follower
```graphql
mutation unfollowUser($personToUnfollow:ID!) {
  unfollowUser(userId: $personToUnfollow) {
    success
    message
  }
}
```

#### Get Followers
```graphql
query getFollowers($id: ID!){
  getFollowers(userId: $id) {
    followerCount
    followers {
      name
    }
  }
}
```
