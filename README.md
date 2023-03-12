
# Description

# App Architecture
Link to miro board: https://miro.com/app/board/uXjVPKqjxQM=/

<img width="1107" alt="image" src="https://user-images.githubusercontent.com/40375385/198289055-4c404fcb-3ad2-4c85-b94c-f7e46cfbcc70.png">

# Hackathon Project Demo
This project is deployed here: https://chainlink-data-marketplace.vercel.app/

The project is structured into 2 components:

1. Frontend

2. Contract

# Local Development
In order to run locally follow these commands:

1. Clone this repository `git clone https://github.com/Robert-H-Leonard/data-marketplace.git`.

2. Navigate to the frontend folder `cd frontend`.

3. Install dependencies `yarn install` or `npm run install`.

3. Run app `yarn start` or `npm run start`.


## Backend
- `JobRequest.sol`: Smart contract that acts as a data store for the app + an oracle client to validate node operator jobs.

  - Contract: https://mumbai.polygonscan.com/address/0x4B464136CCBb709E1b238E00e8C40975C6A32e8c

- `Automation.sol`: Smart contract used to register Chainlink Automation.

  - Contract: https://mumbai.polygonscan.com/address/0x7E954307CB634B1885c3b0cFdB0e359f09E7dbF6
  - Automation: https://automation.chain.link/mumbai/79616312988537092179866366291075391444640142700716884656781977912678455043062



