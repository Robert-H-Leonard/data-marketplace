
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

  - Contract: https://mumbai.polygonscan.com/address/0x4B464136CCBb709E1b238E00e8C40975C6A32e8c

- `Automation.sol`: Smart contract used to register Chainlink Automation.

  - Contract: https://mumbai.polygonscan.com/address/0x7E954307CB634B1885c3b0cFdB0e359f09E7dbF6



