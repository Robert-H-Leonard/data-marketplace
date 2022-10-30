pragma solidity 0.8.0;

// For open to bid -> bid accepted, the user/owner of the job request will trigger this transition after they "accept" a bid
// For bid accepted -> pending validation, the node operator of the accepted bid will trigger this transition after they "submit" a bid
// For pending validatipon -> validated, the automation contract will trigger this transition after validating a node operators submittion

enum OperatorRequestState { OpenBid, BidAccepted, PendingValidation, Validated }

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

struct OperatorRequestData {
    uint id;
    address requestor; // address of person requesting data feed
    Datasource requestedDataSource;
    OperatorBid[] bids;
    OperatorRequestState currentState;
}


interface OperatorRequestInterface {

    // Data store functions 

    // See example pagination here: https://programtheblockchain.com/posts/2018/04/20/storage-patterns-pagination/
    function getOperatoreRequests(uint cursor, uint pageSize) external view returns (OperatorRequestData[] memory);

    function getOperatorRequestById(uint operatorRequestId) external view returns (OperatorRequestData memory);

    // Require caller to be requestor in OperatorRequestData
    function acceptBid(uint OperatorRequestId, uint OperatorBidId) external returns (bool);

    function submitBid(uint operatorRequestId, OperatorBid calldata operatorBid) external returns (OperatorBid memory);

    // Data validation function (this is what the automation contract will call)
    function validateBidSubmission(uint operatorRequestId, address nodeOperator) external returns (bool);
}



// Contract to be implemented
contract OperatorRequest is OperatorRequestInterface {

    event OperatorRequestCreated(address indexed _createdBy, uint indexed requestId);
    event OperatorRequestUpdated(address indexed _createdBy, uint indexed requestId, string previousState, string currentState);
    event OperatorSubmissionValidated(int indexed operatorBidId, address indexed nodeOperator);

    mapping (uint => OperatorRequestData) public operatorRequests;
}