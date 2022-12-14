/**
 * 1. Singleton pattern for store
 * 2. Use hooks for interacting with store
 */
import { Contract, ethers, providers } from "ethers";
import { JobRequestSubmission } from "../pages/JobRequestForm";
import JobRequestAbi from "./jobRequestAbi.json";

type JobRequestState = 'OpenBid' | 'PendingValidation' | 'Validated';

const getCurrentStateFromNumber = (num: number): JobRequestState | undefined => {
    if(num === 0) return 'OpenBid'

    if(num === 1) return 'PendingValidation'

    if(num === 2) return 'Validated'
}

export interface JobRequestData {
    id?: number;
    requestorAddress: string;
    currentState: JobRequestState;
    dataSource: any;
    network: string;
    name: string;
    auth: string;
    dataFormat: string;
    description: string;
    validatedBidId?: number;
}

export interface JobRequestDataWithBids extends JobRequestData {
    bids: OperatorBid[];
    winningBid?: OperatorBid;
}

interface OperatorSubmission {
    jobId: number;
    nodeWalletAddress: string;
}

interface OperatorBid {
    nodeWalletAddress: string;
    dataFeedFee: number;
    jobRequestId: number;
    submission: OperatorSubmission;
    id: number;
}

export interface IJobRequestStore {
    createJobRequest: (jobRequestSubmission: JobRequestSubmission) => Promise<boolean>;
    getJobRequests: () => Promise<JobRequestData[]>;
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
        this.contractAddress = "0x4B464136CCBb709E1b238E00e8C40975C6A32e8c";
        this.contractRpcProvider = new ethers.providers.JsonRpcProvider("https://special-side-mound.matic-testnet.discover.quiknode.pro/4df73953a32b2538e81811cb085b2bd64d6a953c/");
        this.jobRequestContract = new ethers.Contract(this.contractAddress, JobRequestAbi, signer ? signer : this.contractRpcProvider);
    }

    public static getInstance(usingMockData: boolean = false, signer?: providers.JsonRpcSigner): IJobRequestStore {
        if(!this.instance || signer) {
            this.instance = new JobRequestStore(signer);
        }
        return this.instance;
    }

    public async createJobRequest(jobRequestSubmission: JobRequestSubmission): Promise<boolean> {
        // Send name
        const { name, auth, dataFormat, dataDescription, datasource} = jobRequestSubmission;
        await this.jobRequestContract.createJobRequest(datasource,name,auth,dataFormat,dataDescription);
        return true;
    }

    public async getJobRequests(): Promise<JobRequestData[]> {
        const result = await this.jobRequestContract.getJobRequests(0,10);
        const jobReqs = result[0];
        return jobReqs.map((jobRequest: {
            [x: string]: any; id: { toString: () => string; }; requestor: any; currentState: any; 
}) => {
            const datasource = `https://${jobRequest.requestedDataSource[0]}`
            return {
                id: parseInt(jobRequest.id.toString()),
                requestorAddress: jobRequest.requestor,
                currentState: getCurrentStateFromNumber(jobRequest.currentState),
                dataSource: datasource,
                name: jobRequest.requestedDataSource[1],
                auth: jobRequest.requestedDataSource[2],
                dataFormat: jobRequest.description.description.dataFormat,
                description: jobRequest.description.description,
                network: "Polygon (Mumbai)"
            } as JobRequestData
        })
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
                    jobId: bid.submission.jobId,
                    nodeWalletAddress: bid.submission.nodeOperator,
                },
                id: parseInt(bid.id.toString())
            } as OperatorBid 
        });
    }

    public async getWinningBidId(jobRequestId: number): Promise<number> {
        const result = await this.jobRequestContract.getValidatedBidId(jobRequestId);
        //@ts-ignore
        return result.toNumber();
    }

    public async acceptBid(jobRequestId: number, operatorBid: number): Promise<void> {
        await this.jobRequestContract.acceptBid(jobRequestId, operatorBid);
        return;
    }

    public async submitBid(jobRequestId: number, operatorSubmission: OperatorSubmission, dataFee: number): Promise<void> {
        await this.jobRequestContract.submitBid(jobRequestId, [operatorSubmission.jobId,operatorSubmission.nodeWalletAddress], dataFee);
        return;
    }

    public async getPendingBid(jobRequestId: number): Promise<number | undefined> {
        await this.jobRequestContract.getPendingBidOnJobRequest(jobRequestId);
        return;
    }

}