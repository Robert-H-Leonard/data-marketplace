import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { Chip } from '@mui/material';
import BidAccordian from '../components/bidAccordian';
import { TextField } from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button'
import { useLocation } from "react-router";
import {styled } from '@mui/material/styles';

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

function openToBidView({ requestorAddress, bids }) {

    return (
        <section className='open_to_bid'>
            {requestorAddress &&
                <div>
                    <h3> Bidding History </h3>
                    {
                        bids.map(bid => {
                            return <BidAccordian link={bid.dataFeedFee} expiration='11/30' user={bid.nodeWalletAddress} requestor={true} />
                        })
                    }
                </div>
            }
            {!requestorAddress &&
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
                        />
                        <Button variant="contained">BID</Button>
                    </form>
                    <h3>Bids</h3>
                    {
                        bids.map(bid => {
                            return <BidAccordian link={bid.dataFeedFee} expiration='11/30' user={bid.nodeWalletAddress} requestor={false} />
                        })
                    }
                </div>
            }
        </section>

    )
}

function validateView(bidder) {
    return (
        <section>
            {bidder &&
                <form className='pending_view_input'>
                    <StyledTextField
                        className='text_input'
                        label="Oracle Address"
                        helperText="Enter address of the Oracle contract"
                        fullWidth={true}
                        focused
                    />
                    <StyledTextField
                        className='text_input'
                        label="Job ID"
                        helperText="Enter the relevant job ID found in the Node Operators UI"
                        fullWidth={true}
                        focused
                    />
                    <Button variant="contained">Submit</Button>
                </form>}
                {!bidder && <p className='pending_view'> Job Request is currently pending ...</p>}
        </section>
    )
}

function fufilledView() {
    return (
        <div className='fufilled_view'>
            <h3>Validation Example</h3>
            <TextField disabled
                id="outlined-read-only-input"
                label="Returned Value"
                defaultValue="uint256: 53"
                fullWidth={true}
                InputProps={{
                    readOnly: true,
                }}
            />
        </div>)

}

export default function JobInfo() {
    const { state: { jobRequest } } = useLocation();
    const {currentState, id, network, requestorAddress, name, bids, description} = jobRequest;

    const steps = ['OpenBid', 'PendingValidation', 'Validated']

    return (
        <div className="job_info_page">
            <Stepper className='stepper' activeStep={steps.indexOf(currentState)} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <div className='job_info'>
                <div> {`Job request ${id}: ${requestorAddress}`}</div>
                <h2>{name}</h2>
                <p className='job_details'> {description}</p>
                <div className='chip_row'>
                    <Chip className="chip" label={`${network}`} />
                    <Chip className='chip' label="uint256" />
                </div>
                {currentState === 'OpenBid' && openToBidView({requestorAddress, bids})}
                {currentState === 'PendingValidation' && validateView("bidder")}
                {currentState === 'Validated' && fufilledView()}
            </div>
        </div>

    )
}