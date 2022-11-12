/**
 * 1. Singleton pattern for store
 * 2. Use hooks for interacting with store
 */
import { Contract, ethers, providers } from "ethers";
import JobRequestAbi from "./jobRequestAbi.json";

type JobRequestState = 'OpenBid' | 'PendingValidation' | 'Validated';

const getCurrentStateFromNumber = (num: number): JobRequestState | undefined => {
    if(num == 0) return 'OpenBid'

    if(num == 1) return 'PendingValidation'

    if(num == 2) return 'Validated'
}

export interface JobRequestData {
    id?: number;
    requestorAddress: string;
    currentState: JobRequestState;
    dataSource: any;
}

interface OperatorSubmission {
    jobRequestId: number;
    jobRequestName: string;
    apiUrl: string;
    dataResponse: string;
}

interface OperatorBid {
    nodeWalletAddress: string;
    dataFeedFee: number;
    jobRequestId: number;
    submission: OperatorSubmission;
    id: number;
}

export interface IJobRequestStore {
    createJobRequest: (apiUrl: string) => Promise<boolean>;
    getJobRequests: () => Promise<JobRequestData[]>;
    getJobRequestById: (id: number) => Promise<JobRequestData | undefined>;
    getBidsOnJobRequest: (id: number) => Promise<OperatorBid[]>;

    acceptBid: (jobRequestId: number, operatorBidId: number) => void;
    submitBid: (jobRequestId: number, operatorSubmission: OperatorSubmission, dataFee: number) => void;
}

export class JobRequestStore implements IJobRequestStore {

    private contractAddress: string;
    private contractRpcProvider: providers.JsonRpcProvider;
    private jobRequestContract: Contract;

    private static instance?: IJobRequestStore;

    private constructor(signer?: providers.JsonRpcSigner) {
        this.contractAddress = "0x63F8b4e803A631fAFC6482610D697Cd026e10419";
        this.contractRpcProvider = new ethers.providers.JsonRpcProvider("https://nd-077-762-934.p2pify.com/c0498f945c72c9e9ecb6e3c68313eaba");
        this.jobRequestContract = new ethers.Contract(this.contractAddress, JobRequestAbi, signer ? signer : this.contractRpcProvider);
    }

    public static getInstance(usingMockData: boolean = false, signer?: providers.JsonRpcSigner): IJobRequestStore {
        if(!this.instance || signer) {
            if(usingMockData) {
                this.instance = new TestStore();
            } else {
                this.instance = new JobRequestStore(signer);
            }
        }
        return this.instance;
    }

    public async createJobRequest(apiUrl: string): Promise<boolean> {
        const result = await this.jobRequestContract.createJobRequest(["HTTP","GET",apiUrl]);
        return result[0] as boolean;
    }

    public async getJobRequests(): Promise<JobRequestData[]> {
        const result = await this.jobRequestContract.getJobRequests(0,5);
        const jobReqs = result[0];
        return jobReqs.map((jobRequest: {
            [x: string]: any; id: { toString: () => string; }; requestor: any; currentState: any; 
}) => {
            const datasource = `https://${jobRequest.requestedDataSource.url}`
            return {
                id: parseInt(jobRequest.id.toString()),
                requestorAddress: jobRequest.requestor,
                currentState: getCurrentStateFromNumber(jobRequest.currentState),
                dataSource: datasource
            } as JobRequestData
        })
    }

    public async getJobRequestById(id: number): Promise<JobRequestData | undefined> {
        const jobReq = await this.jobRequestContract.getJobRequestById(id);
        const datasource = `https://${jobReq.requestedDataSource.url}`
        return {
            id: parseInt(jobReq.id.toString()),
            requestorAddress: jobReq.requestor,
            currentState: getCurrentStateFromNumber(jobReq.currentState),
            dataSource: datasource
        } as JobRequestData;
    }

    public async getBidsOnJobRequest(id: number): Promise<OperatorBid[]> {
        const result = await this.jobRequestContract.getBidsOnJobRequest(id);
        //@ts-ignore
        return result.map((bid) => {
            return {
                dataFeedFee: parseInt(bid.dataFeedFee.toString()),
                nodeWalletAddress: bid.nodeOperator,
                jobRequestId: parseInt(bid.jobRequestId.toString()),
                submission: {
                    jobRequestId: bid.submission.jobRequestId,
                    jobRequestName: bid.submission.jobRequestName,
                    apiUrl: `https://${bid.submission.datasource.url}`,
                    dataResponse: bid.submission.dataResponse
                },
                id: parseInt(bid.id.toString())
            } as OperatorBid 
        });
    }

    public async acceptBid(jobRequestId: number, operatorBid: number): Promise<void> {
        const result = await this.jobRequestContract.acceptBid(jobRequestId, operatorBid);
        return;
    }

    // Example submission: ["1deof322","get-fake-data",["http","GET","test-source-3.com"],"data-response"]
    public async submitBid(jobRequestId: number, operatorSubmission: OperatorSubmission, dataFee: number): Promise<void> {
        const sub = [operatorSubmission.jobRequestName, operatorSubmission.jobRequestName, ["http","GET",operatorSubmission.apiUrl], operatorSubmission.dataResponse]
        const result = await this.jobRequestContract.submit(jobRequestId, sub, dataFee);
        return;
    }

}

class TestStore implements IJobRequestStore {
    private testJobRequestData: JobRequestData[];
    private testOperatorSubmissions: OperatorSubmission[];

    constructor() {
        this.testJobRequestData = [
            {id: 1, requestorAddress: "0x34S52", currentState: 'OpenBid', dataSource: 'https://test-source.com'},
            {id: 2, requestorAddress: "0xA4Y2d", currentState: 'OpenBid', dataSource: 'https://test-source1.com'},
            {id: 3, requestorAddress: "0xPW62D", currentState: 'PendingValidation', dataSource: 'https://test-source2.com'},
            {id: 0, requestorAddress: "0x9W2TA", currentState: 'OpenBid', dataSource: 'https://test-source3.com'}
        ];

        this.testOperatorSubmissions = [
            {jobRequestId: 1, jobRequestName: "test-source-job", apiUrl: 'https://test-source.com', dataResponse: 'test-data'},
            {jobRequestId: 1, jobRequestName: "test-source-1-job", apiUrl: 'https://test-source1.com', dataResponse: 'test-data'},
            {jobRequestId: 3, jobRequestName: "test-source-2-job", apiUrl: 'https://test-source2.com', dataResponse: 'test-data'}
        ]
    }

    public async createJobRequest(apiUrl: string): Promise<boolean> {
        const nextIndex = this.testJobRequestData.length;
        this.testJobRequestData.push({id: nextIndex, requestorAddress: '0x9W2T', currentState: 'OpenBid', dataSource: apiUrl })
        return true;
    }

    public async getJobRequests(): Promise<JobRequestData[]> {
        return this.testJobRequestData
    }

    public async getJobRequestById(id: number): Promise<JobRequestData | undefined> {
        if(id < this.testJobRequestData.length) {
            return this.testJobRequestData[id] 
        }
        return;
    }

    public async getBidsOnJobRequest(id: number): Promise<OperatorBid[]> {
        return this.testOperatorSubmissions
                .filter(submission => submission.jobRequestId === id)
                .map((submission,index) => {
                    return {
                        nodeWalletAddress: "0x49Gae",
                        dataFeedFee: 0.25,
                        jobRequestId: submission.jobRequestId,
                        submission: submission,
                        id: index
                    } as OperatorBid
                })
    }

    public async acceptBid(jobRequestId: number, operatorBidId: number): Promise<void> {
        if(jobRequestId < this.testJobRequestData.length) {
            this.testJobRequestData[jobRequestId].currentState = 'PendingValidation'
        }
    }

    public async submitBid(jobRequestId: number, operatorSubmission: OperatorSubmission, dataFee: number): Promise<void> {
        if(jobRequestId < this.testJobRequestData.length) {
            this.testOperatorSubmissions.push(operatorSubmission)
        }
    }
}