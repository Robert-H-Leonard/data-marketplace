pragma solidity 0.8.0;

enum OperatorRequestState { OpenBid, BidAccepted, PendingValidation, Validated }

struct Datasource {
    string requestType; // Should probs be an enum. Valid values are "http", ...
    string method; // GET, POST, etc..
    string url; // url to get data
}

struct OperatorBid {
    uint id;
    address nodeOperator;
    uint dataFeedFee;
    string submission; // Not sure what this looks like yet
}

struct OperatorRequestData {
    uint id;
    Datasource datasource; // url
    address requestor;
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




contract OperatorRequest is OperatorRequestInterface {

    event OperatorRequestCreated(address indexed _createdBy, uint indexed requestId);
    event OperatorRequestUpdated(address indexed _createdBy, uint indexed requestId);

    mapping (uint => OperatorRequestData) public operatorRequests;
}