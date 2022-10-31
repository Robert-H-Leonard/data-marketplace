pragma solidity 0.8.0;

// statuses: open to bid, pending validation, and fulfilled
// For open to bid: new job requests should automatically get this status
// For open to bid -> pending validation, the user/owner of the job request will trigger this transition after they "accept" a bid
// For pending validation -> fulfilled, the automation contract will trigger this transition after validating a node operators submittion

enum JobRequestState { OpenBid, BidAccepted, PendingValidation, Validated }

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
    uint id;
    address nodeOperator;
    uint dataFeedFee;
    OperatorSubmission submission; 
}

struct JobRequestData {
    uint id;
    address requestor; // address of person requesting data feed
    Datasource requestedDataSource;
    OperatorBid[] bids;
    JobRequestState currentState;
}


interface JobRequestInterface {

    // Data store functions ///////////////////

    // See example pagination here: https://programtheblockchain.com/posts/2018/04/20/storage-patterns-pagination/
    function getJobRequests(uint cursor, uint pageSize) external view returns (JobRequestData[] memory);

    function getJobRequestById(uint jobRequestId) external view returns (JobRequestData memory);

    // Require caller to be requestor in OperatorRequestData
    function acceptBid(uint jobRequestId, uint operatorBidId) external returns (bool);

    function submitBid(uint jobRequestId, OperatorBid calldata operatorBid) external returns (OperatorBid memory);


    // Validation functions ///////////////////

    // Method that `performUpkeep` method in the automation contract will call
    function validatePendingBids() external returns (bool);
}



// Contract to be implemented
contract JobRequest is JobRequestInterface {

    event JobRequestCreated(address indexed _createdBy, uint indexed requestId);
    event JobRequestUpdated(address indexed _createdBy, uint indexed requestId, string previousState, string currentState);
    event OperatorSubmissionValidated(int indexed operatorBidId, int indexed jobRequestId, address indexed nodeOperator);

    // Hashmap we are using as a database to manage job request
    mapping (uint => JobRequestData) public jobRequests;

    // Hashmap acting as a cache to know which bids we need to validate with automation contract
    mapping (uint => OperatorBid) private bidsPendingValidation;

    // Data validation function. 
    // When `validatePendingBids` is called that method will attemot to call this method at least once (the first non zero address retreived from bidsPendingValidation)
    function validateBidSubmission(uint jobRequestId, uint operatorBidId) private returns (bool);
}
