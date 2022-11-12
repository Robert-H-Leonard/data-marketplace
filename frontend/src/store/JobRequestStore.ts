/**
 * 1. Singleton pattern for store
 * 2. Use hooks for interacting with store
 */
import { Contract, ethers, providers } from "ethers";
import JobRequestAbi from "./jobRequestAbi.json";

type JobRequestState = 'OpenBid' | 'PendingValidation' | 'Validated';

export interface JobRequestData {
    id?: string;
    requestorAddress: string;
    currentState: JobRequestState;
    dataSource: any;
}

interface OperatorSubmission {
    jobRequestId: string;
    jobRequestName: string;
    apiUrl: string;
    dataResponse: string;
}

interface OperatorBid {
    nodeWalletAddress: string;
    dataFeedFee: number;
    jobRequestId: string;
    submissions: OperatorSubmission;
    id: string;
}

export interface IJobRequestStore {
    createJobRequest: (apiUrl: string) => Promise<boolean>;
    getJobRequests: () => Promise<any[]>;
    getJobRequestById: (id: number) => Promise<JobRequestData | undefined>;
    getBidsOnJobRequest: (id: number) => Promise<OperatorBid[]>;

    acceptBid: (jobRequestId: number, operatorBidId: number) => void;
    submitBid: (jobRequestId: number, operatorSubmission: OperatorSubmission) => void;
}

export class JobRequestStore implements IJobRequestStore {

    private contractAddress: string;
    private contractRpcProvider: providers.JsonRpcProvider;
    private jobRequestContract: Contract;

    private static instance?: IJobRequestStore;

    private constructor() {
        this.contractAddress = "0xF4E5B47Df038036995dF9c2baB5EED6CA5d060dC";
        this.contractRpcProvider = new ethers.providers.JsonRpcProvider("https://nd-077-762-934.p2pify.com/c0498f945c72c9e9ecb6e3c68313eaba");
        this.jobRequestContract = new ethers.Contract(this.contractAddress, JobRequestAbi, this.contractRpcProvider);
    }

    public static getInstance(usingMockData: boolean = false): IJobRequestStore {
        if(!this.instance) {
            if(usingMockData) {
                this.instance = new TestStore();
            } else {
                this.instance = new JobRequestStore();
            }
        }
        return this.instance;
    }

    public async createJobRequest(apiUrl: string): Promise<boolean> {
        return true;
    }

    public async getJobRequests(): Promise<any[]> {
        return await this.jobRequestContract.getJobRequests(1,5);
    }

    public async getJobRequestById(id: number): Promise<JobRequestData | undefined> {
        return;
    }

    public async getBidsOnJobRequest(id: number): Promise<OperatorBid[]> {
        return [];
    }

    public async acceptBid(jobRequestId: number, operatorBid: number): Promise<void> {

    }

    public async submitBid(jobRequestId: number, operatorSubmission: OperatorSubmission): Promise<void> {
        
    }

}

class TestStore implements IJobRequestStore {
    private testJobRequestData: JobRequestData[];
    private testOperatorSubmissions: OperatorSubmission[];

    constructor() {
        this.testJobRequestData = [
            {id: "1", requestorAddress: "0x34S52", currentState: 'OpenBid', dataSource: 'https://test-source.com'},
            {id: "2", requestorAddress: "0xA4Y2d", currentState: 'OpenBid', dataSource: 'https://test-source1.com'},
            {id: "3", requestorAddress: "0xPW62D", currentState: 'PendingValidation', dataSource: 'https://test-source2.com'},
            {id: "0", requestorAddress: "0x9W2TA", currentState: 'OpenBid', dataSource: 'https://test-source3.com'}
        ];

        this.testOperatorSubmissions = [
            {jobRequestId: "1", jobRequestName: "test-source-job", apiUrl: 'https://test-source.com', dataResponse: 'test-data'},
            {jobRequestId: "1", jobRequestName: "test-source-1-job", apiUrl: 'https://test-source1.com', dataResponse: 'test-data'},
            {jobRequestId: "3", jobRequestName: "test-source-2-job", apiUrl: 'https://test-source2.com', dataResponse: 'test-data'}
        ]
    }

    public async createJobRequest(apiUrl: string): Promise<boolean> {
        const nextIndex = this.testJobRequestData.length;
        this.testJobRequestData.push({id: nextIndex.toString(), requestorAddress: '0x9W2T', currentState: 'OpenBid', dataSource: apiUrl })
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
                .filter(submission => submission.jobRequestId === id.toString())
                .map((submission,index) => {
                    return {
                        nodeWalletAddress: "0x49Gae",
                        dataFeedFee: 0.25,
                        jobRequestId: submission.jobRequestId,
                        submissions: submission,
                        id: index.toString()
                    } as OperatorBid
                })
    }

    public async acceptBid(jobRequestId: number, operatorBidId: number): Promise<void> {
        if(jobRequestId < this.testJobRequestData.length) {
            this.testJobRequestData[jobRequestId].currentState = 'PendingValidation'
        }
    }

    public async submitBid(jobRequestId: number, operatorSubmission: OperatorSubmission): Promise<void> {
        if(jobRequestId < this.testJobRequestData.length) {
            this.testOperatorSubmissions.push(operatorSubmission)
        }
    }
}