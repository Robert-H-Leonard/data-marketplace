pragma solidity 0.8.0;

// statuses: open to bid, pending validation, and fulfilled
// For open to bid: new job requests should automatically get this status
// For open to bid -> pending validation, the user/owner of the job request will trigger this transition after they "accept" a bid
// For pending validation -> fulfilled, the automation contract will trigger this transition after validating a node operators submittion

enum JobRequestState {
    OpenBid,
    PendingValidation,
    Validated
}

// https://docs.chain.link/docs/jobs/

struct Datasource {
    string requestType; // Should probs be an enum. Valid values are "http", ...
    string method; // GET, POST, etc..
    string url; // url to get data
}

struct OperatorSubmission {
    string jobRequestId;
    string jobRequestName;
    Datasource datasource;
    string dataResponse; // serialized json object
}

struct OperatorBid {
    uint256 id;
    address nodeOperator;
    uint256 dataFeedFee;
    OperatorSubmission submission;
}

struct JobRequestData {
    uint256 id;
    address requestor; // address of person requesting data feed
    Datasource requestedDataSource;
    OperatorBid[] bids;
    JobRequestState currentState;
}

interface JobRequestInterface {
    // Data store functions ///////////////////

    // See example pagination here: https://programtheblockchain.com/posts/2018/04/20/storage-patterns-pagination/
    function getJobRequests(uint256 cursor, uint256 pageSize)
        external
        view
        returns (JobRequestData[] memory, uint256 new_cursor);

    function getJobRequestById(uint256 jobRequestId)
        external
        view
        returns (JobRequestData memory);

    function createJobRequest(Datasource calldata dataSource)
        external
        returns (bool);

    // Require caller to be requestor in OperatorRequestData
    function acceptBid(uint256 jobRequestId, uint256 operatorBidId) external;

    function submitBid(uint256 jobRequestId, OperatorBid calldata operatorBid)
        external;

    // Validation functions ///////////////////

    // Method that `performUpkeep` method in the automation contract will call
    function validatePendingBids() external returns (bool);
}

// Contract to be implemented
contract JobRequest is JobRequestInterface {
    event JobRequestCreated(
        address indexed _createdBy,
        uint256 indexed requestId
    );
    event JobRequestUpdated(
        address indexed _createdBy,
        uint256 indexed requestId,
        string previousState,
        string currentState
    );
    event OperatorSubmissionValidated(
        int256 indexed operatorBidId,
        int256 indexed jobRequestId,
        address indexed nodeOperator
    );

    // Hashmap we are using as a database to manage job request
    mapping(uint256 => JobRequestData) public jobRequests;
    uint256 private numOfJobRequests;
    uint256 private numSubmittedOfBids;

    // Hashmap acting as a cache to know which bids we need to validate with automation contract
    mapping(uint256 => OperatorBid) private bidsPendingValidation;
    uint256 private numOfBidsPendingValidation;

    ////////// Data store functions ///////////

    function createJobRequest(Datasource calldata dataSource)
        external
        override
        returns (bool)
    {
        // Add new jobRequest to mapping
        return true;
    }

    function getJobRequests(uint256 cursor, uint256 requestAmount)
        external
        view
        override
        returns (JobRequestData[] memory, uint256 new_cursor)
    {
        // Paginate through jobrequest mapping to return a slice to a caller
        // there must be jobs in order to send request
        require(requestAmount > 0, "There are currently no jobs to request.");

        // make sure request amount is less than or equal 10
        require(requestAmount <= 10, "Only can request 10 max at a time.");

        // we initilize size with job amount and we check if the size is inbounds
        // if so we want to reduce the size
        uint256 size = requestAmount;
        if (size > numOfJobRequests - cursor) {
            size = numOfJobRequests - cursor;
        }

        // we initilize an array with the size of jobs
        JobRequestData[] memory jobs = new JobRequestData[](size);

        // we iterate using until we've reached our desired size add the jobs that we plan to return in a jobs array
        for (uint256 idx = 0; idx < size; idx++) {
            jobs[idx] = jobRequests[cursor + idx];
        }

        // we return the jobs array and the new cursor size
        return (jobs, cursor + size);
    }

    function getJobRequestById(uint256 jobRequestId)
        external
        view
        override
        returns (JobRequestData memory)
    {
        return jobRequests[jobRequestId];
    }

    function submitBid(uint256 jobRequestId, OperatorBid memory operatorBid)
        public
        override
    {
        // check to job request exists
        require(
            jobRequests[jobRequestId].id > 0,
            "Job request id doesn't exist."
        );

        // loop to check if bid already exists
        for (uint256 idx = 0; idx < numSubmittedOfBids; idx++) {
            require(
                jobRequests[jobRequestId].bids[idx].id != operatorBid.id,
                "Bid already exists."
            );
        }

        // updates jobRequest bids with new element
        jobRequests[jobRequestId].bids.push(operatorBid);
        numSubmittedOfBids += 1;
    }

    function acceptBid(uint256 jobRequestId, uint256 operatorBidId)
        public
        override
    {
        // check if job request id exists
        require(
            jobRequests[jobRequestId].id > 0,
            "Job request id doesn't exist."
        );
        // check if there is atleast one bid to accept
        require(
            jobRequests[jobRequestId].bids.length >= 1,
            "There are no bids for this job request."
        );
        // check to see if bid is in validated state
        require(
            jobRequests[jobRequestId].currentState != JobRequestState.Validated,
            "Bid is already in validated state."
        );

        // loops through number of bids to find matching operator bid id
        for (uint256 idx = 0; idx < numSubmittedOfBids; idx++) {
            if (jobRequests[jobRequestId].bids[idx].id == operatorBidId) {
                // update bid state to Pending Validation
                jobRequests[jobRequestId].currentState = JobRequestState
                    .PendingValidation;
                // increment numOfBidsPendingValidation by 1
                numOfBidsPendingValidation += 1;
            }
        }
    }

    ////////// Validation functions //////////
    function validatePendingBids() external override returns (bool) {
        // Called by `upKeepFunction`
        //Gets up to five bids from bidsPendingValidation
        // call validateBidSubmission on them
        // decrement numOfBidsPendingValidation
        // decrement numSubmittedOfBids
        return true;
    }

    // Data validation function.
    // When `validatePendingBids` is called that method will attemot to call this method at least once (the first non zero address retreived from bidsPendingValidation)
    function validateBidSubmission(uint256 jobRequestId, uint256 operatorBidId)
        private
        returns (bool)
    {
        return true;
    }
}
