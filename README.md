# Eternal Demo Server

## Overview
This is a server setup to showcase my ability and considerations when working on a beackend server! It's pretty minimal, but should do the following:

- Registration
- Authentication
- Fetch/Update User Account Data
- Add/remove followers to a user

I plan to implement this using typescript and graphql, with a mongo backend. Will probs host this on heroku for demo purposes. 

This is just a plan, for now...


## Deployment
This app is deloyed on heroku at https://eternal-interveiw.herokuapp.com/graphql


## Testing
Below are some queries for testing the graphql endpoint

### HTTP Headers
Updated at the bottom left. These headers are used for non-login and registration requests. Fee free to replace the auth token (the jwt text after "Bearer ") with the `token` recieved from the login or registration requests.
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWNiZDVjYTdhMjdlYWM3YzQ5NGViNWIiLCJpYXQiOjE2NDEyODM0MDIsImV4cCI6MTY0MTM2OTgwMn0.yAQo5noHW2T5XV0EpVPo1ED78kS9OHVqQ4LX5h4cXYg"
}
```

### Login
```graphql
query {
  login(email:"skgbafa@gmail.com", password:"eternal123") {
    success
    token
    message
  }
}
```

### Register
```graphql
mutation {
  register(name: "sam", email:"skgbafa@gmail.com", password:"eternal123", walletAddress: "0x123f") {
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

