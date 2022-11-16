import Stepper from '@mui/material/Stepper';
import { useAccount } from "wagmi"
import { Navigate } from 'react-router-dom'
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { Chip } from '@mui/material';
import BidAccordian from '../components/bidAccordian';
import { TextField } from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button'
import { useLocation } from "react-router";
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { uniqueNamesGenerator, names } from 'unique-names-generator';


const StyledTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: 'rgba(0, 0, 0, 0.54)',
    },
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
            borderWidth: '1px',
            borderColor: 'rgba(0, 0, 0, 0.54)',
        },
    }
});

function OpenToBidView({ requestorAddress, bids, jobRequestStore, jobRequestId, shouldShowBidFields, setDesiredBid, showBidFields, submitBid }) {

    const showBid = () => {
        shouldShowBidFields(true);
    }

    const { address } = useAccount();

    const [submittedJobId, setSubmittedJobId] = useState("");
    const [submittedNodeAddress, setSubmittedNodeAdress] = useState("");
    const [submitFee, setSubmitFee] = useState("");

    return (
        <section className='open_to_bid'>
            {requestorAddress == address && !showBidFields &&
                <div>
                    <h3> Bidding History </h3>
                    {
                        bids.map(bid => {
                            return <BidAccordian link={bid.dataFeedFee} expiration='11/30' user={bid.nodeWalletAddress} requestor={true} jobRequestStore={jobRequestStore} bidId={bid.id} jobRequestId={jobRequestId} />
                        })
                    }
                </div>
            }
            {requestorAddress != address && !showBidFields &&
                <div>
                    <form className='bid_input'>
                        <TextField
                            label="New Bid"
                            id="outlined-start-adornment"
                            type="number"
                            sx={{ m: 1, width: '25ch' }}
                            InputProps={{
                                inputMode: 'numeric',
                                pattern: '[0-9]*',
                                endAdornment: <InputAdornment position="end">LINK</InputAdornment>,
                            }}
                            onChange={(event) => setSubmitFee(event.target.value)}
                        />
                        <Button variant="contained" onClick={() => showBid()}>BID</Button>
                    </form>
                    <h3>Bids</h3>
                    {
                        bids.map(bid => {
                            return <BidAccordian link={bid.dataFeedFee} expiration='11/30' user={bid.nodeWalletAddress} requestor={false} jobRequestStore={jobRequestStore} bidId={bid.id} jobRequestId={jobRequestId} />
                        })
                    }
                </div>
            }
            {
                showBidFields &&
                <form className='pending_view_input'>
                    <StyledTextField
                        className='text_input'
                        label="Oracle Address"
                        helperText="Enter address of the Oracle contract"
                        fullWidth={true}
                        focused
                        onChange={event => {
                            setSubmittedNodeAdress(event.target.value)
                            setDesiredBid({
                                id: submittedJobId,
                                address: submittedNodeAddress,
                                fee: submitFee
                            })
                        }}
                    />
                    <StyledTextField
                        className='text_input'
                        label="Job ID"
                        helperText="Enter the relevant job ID found in the Node Operators UI"
                        fullWidth={true}
                        focused
                        onChange={event => {
                            setSubmittedJobId(event.target.value)
                            setDesiredBid({
                                id: submittedJobId,
                                address: submittedNodeAddress,
                                fee: submitFee
                            })
                        }}
                    />
                    <Button variant="contained" onClick={async () => {
                        submitBid()
                    }}>Submit</Button>
                </form>
            }
        </section>

    )
}

function ValidateView() {
    return (
        <section>
            <p className='pending_view'> Job Request is currently pending ...</p>
        </section>
    )
}

function FufilledView(id, requestorAddres) {
    return (
        <div className='fufilled_view'>
            <h3>Validation Results</h3>
            <form>
                <TextField disabled
                    id="outlined-read-only-input"
                    label="Returned Value"
                    defaultValue="uint256: 53"
                    InputProps={{
                        readOnly: true,
                    }}
                />
                <TextField disabled
                    id="outlined-read-only-input"
                    label="Node Operator Address"
                    defaultValue="****"
                    InputProps={{
                        readOnly: true,
                    }}
                />
                <TextField disabled
                    id="outlined-read-only-input"
                    label="Job ID"
                    defaultValue={id}
                    InputProps={{
                        readOnly: true,
                    }}
                />
                <TextField disabled
                    id="outlined-read-only-input"
                    label="Data Fee"
                    defaultValue="**"
                    InputProps={{
                        readOnly: true,
                    }}
                />
            </form>
        </div>)

}

export default function JobInfo({ jobRequestStore }) {
    const { state: { jobRequest } } = useLocation();

    const { currentState, id, network, requestorAddress, name, bids, description } = jobRequest;

    const steps = ['OpenBid', 'PendingValidation', 'Validated']

    const [showBidFields, shouldShowBidFields] = useState(false);
    const [desiredBid, setDesiredBid] = useState(undefined);
    const [shouldRedirect, setShouldRedirect] = useState(false);

    const onSubmitBid = async () => {
        await jobRequestStore.submitBid(id, { jobId: desiredBid.id, nodeWalletAddress: desiredBid.address }, desiredBid.fee);
        setShouldRedirect(true);
    }

    return (
        <div className="job_info_page">
            {
                shouldRedirect ? <Navigate to="/" /> : <></>
            }
            <Stepper className='stepper' activeStep={steps.indexOf(currentState)} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label === "OpenBid" ? "Open to Bid" : label === "PendingValidation" ? "Pending" : "Validated"}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <div className='job_info'>
                <h4> {`Job request ${id} • ${`${uniqueNamesGenerator({ dictionaries: [names], seed: jobRequest.requestorAddress }).toLowerCase()}.eth`}`}</h4>
                <h2>{name}</h2>
                <p className='job_details'> {description}</p>
                <div className='chip_row'>
                    <Chip className="chip" label={`${network}`} />
                    <Chip className='chip' label="uint256" />
                </div>
                {currentState === 'OpenBid' && OpenToBidView({ requestorAddress, bids, jobRequestStore, jobRequestId: id, shouldShowBidFields, setDesiredBid, showBidFields, submitBid: onSubmitBid })}
                {currentState === 'PendingValidation' && ValidateView()}
                {currentState === 'Validated' && FufilledView(id, requestorAddress)}
            </div>
        </div>

    )
}