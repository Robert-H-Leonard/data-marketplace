
# Description
# Hackathon Project Demo
This project is deployed here: https://chainlink-data-marketplace.vercel.app/

The project is structured into 2 components:

1. Frontend

2. Contract

# Local Development
In order to run locally follow these commands:

1. Clone this repository `git clone https://github.com/KITTLABS/chainlink-data-marketplace.git`.

2. Navigate to the frontend folder `cd frontend`.

3. Install dependencies `yarn install` or `npm run install`.

3. Run app `yarn start` or `npm run start`.

## Frontend
We use vercel to deploy our front end. Whenever there is a change to master it will trigger a deployment to our apps public url.

When adding new merge request vercel will create preview deployments for each merge request so we can test everything before merging to master.


## Backend
- `JobRequest.sol`: Smart contract that acts as a data store for the app + an oracle client to validate node operator jobs.

  - Contract: https://mumbai.polygonscan.com/address/0xf75421F63B76AA083E09A46349233480B88c96a8

- `Automation.sol`: Smart contract used to register Chainlink Automation.

  - Contract: https://mumbai.polygonscan.com/address/0x493AC21073D1d501e27F4eE617D966097176d0da



