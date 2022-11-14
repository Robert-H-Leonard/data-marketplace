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
import { useState } from 'react';

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

function openToBidView({ requestor, info }) {

    return (
        <section className='open_to_bid'>
            {requestor &&
                <div>
                    <h3> Bidding History </h3>
                    <BidAccordian link='0.5 LINK' expiration='08/24' user='0xDC%%9AE02--**5%7022' requestor={true} />
                    <BidAccordian link='0.25 LINK' expiration='08/24' user='0x6--.7432ffE%%%6e7C786..EA' requestor={true} />
                </div>
            }
            {!requestor &&
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
                    <BidAccordian link='0.5 LINK' expiration='08/24' user='0xDC%%9AE02--**5%7022' requestor={false} />
                    <BidAccordian link='0.25 LINK' expiration='08/24' user='0x6--.7432ffE%%%6e7C786..EA' requestor={false} />
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
    let data = useLocation();
    console.log(data)
    // const [jobStatus, setStatus] = useState('Open to Bid')
    // const [jobStatus, setStatus] = useState('Validate')
    const [jobStatus, setStatus] = useState('Fufilled')
    const steps = ['Open to Bid', 'Validate', 'Fufilled']
    console.log(jobStatus);
    console.log(steps.indexOf(jobStatus))
    return (
        <div className="job_info_page">
            <Stepper className='stepper' activeStep={steps.indexOf(jobStatus)} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <div className='job_info'>
                <div> Job request 1 . vitalek</div>
                <h2> Corn Price </h2>
                <p className='job_details'> Corn spot price from https://api.coindesk.com/v1/bpi/currentprice.json
                    Authenticated with API Key: AIzaSyDaGmWKa4JsXZ-HjGw7ISLn_3namBGewQe</p>
                <div className='chip_row'>
                    <Chip className="chip" label="Optimism" />
                    <Chip className='chip' label="uint256" />
                </div>
                {jobStatus === 'Open to Bid' && openToBidView()}
                {jobStatus === 'Validate' && validateView("bidder")}
                {jobStatus === 'Fufilled' && fufilledView()}
            </div>
        </div>

    )
}