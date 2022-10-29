# Hackathon Project
Checkout the high level details of this project in this notion doc: https://www.notion.so/Data-Marketplace-fa4541243d9849a9bdc76b8dcbb8a1bf


# App Architecture
Link to miro board: https://miro.com/app/board/uXjVPKqjxQM=/

<img width="1107" alt="image" src="https://user-images.githubusercontent.com/40375385/198289055-4c404fcb-3ad2-4c85-b94c-f7e46cfbcc70.png">

# Development
Please create a new branch and open pull request for any code additions
# Deployment

## Frontend
We are using Vercel to deploy our front end. Whenever there is a change to master it will trigger a deployment to our apps public url:

https://chainlink-data-marketplace.vercel.app/

When adding new merge request vercel will create preview deployments for each merge request so we can test everything before merging to master.


## Backend
We are using Digital Ocean for our chainlink node.

Chainlink node repo: https://github.com/KITTLABS/chainlink-node



