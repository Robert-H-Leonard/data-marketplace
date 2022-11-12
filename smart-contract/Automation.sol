// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";

abstract contract JobRequest {
    uint256 public numOfBidsPendingValidation;
    function validatePendingBids() virtual external returns (bool);
}

contract Automation is AutomationCompatibleInterface {

    JobRequest jobRequestContract;

    address private jobRequestContractAddress;

    constructor(address _jobRequestContractAddress) {
      jobRequestContractAddress = _jobRequestContractAddress;
      jobRequestContract = JobRequest(jobRequestContractAddress);
    }

    function checkUpkeep(bytes calldata) external view override returns (bool upkeepNeeded, bytes memory) {
        upkeepNeeded = jobRequestContract.numOfBidsPendingValidation() > 0;
    }

    function performUpkeep(bytes calldata) external override {
        jobRequestContract.validatePendingBids();
    }
}
