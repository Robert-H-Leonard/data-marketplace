/**
 * 1. Singleton pattern for store
 * 2. Use hooks for interacting with store
 */
import { Contract, ethers, providers } from "ethers";
import JobRequestAbi from "./jobRequestAbi.json";

type JobRequestState = 'OpenBid' | 'PendingValidation' | 'Validated';

interface JobRequestData {
    walletAddress: string;
    currentState: JobRequestState;
    apiUrl: string;
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

interface IJobRequestStore {
    createJobRequest: (apiUrl: string) => Promise<boolean>;
    getJobRequests: () => Promise<JobRequestData[]>;
    getJobRequestById: (id: number) => Promise<JobRequestData | undefined>;
    getBidsOnJobRequest: (id: number) => Promise<OperatorBid[]>;

    acceptBid: (jobRequestId: number, operatorBid: number) => void;
    submitBid: (jobRequestId: number, operatorSubmission: OperatorSubmission) => void;
}

export class JobRequestStore implements IJobRequestStore {

    private contractAddress: string;
    private contractRpcProvider: providers.JsonRpcProvider;
    private jobRequestContract: Contract;

    private static instance?: JobRequestStore;

    private constructor() {
        this.contractAddress = "0xF4E5B47Df038036995dF9c2baB5EED6CA5d060dC";
        this.contractRpcProvider = new ethers.providers.JsonRpcProvider("https://nd-077-762-934.p2pify.com/c0498f945c72c9e9ecb6e3c68313eaba");
        this.jobRequestContract = new ethers.Contract(this.contractAddress, JobRequestAbi, this.contractRpcProvider);
    }

    public static getInstance(): JobRequestStore {
        if(!this.instance) {
            this.instance = new JobRequestStore();
        }
        return this.instance;
    }

    public async createJobRequest(apiUrl: string): Promise<boolean> {
        return true;
    }

    public async getJobRequests(): Promise<JobRequestData[]> {
        return []
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