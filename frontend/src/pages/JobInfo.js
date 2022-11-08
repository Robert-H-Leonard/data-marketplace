import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { Chip } from '@mui/material';
import BidAccordian from '../components/bidAccordian';

export default function JobInfo() {
    const steps = ['Open to Bid', 'Validate', 'Fufilled']
    return (
        <div className="job_info_page">
            <Stepper className='stepper' activeStep={1} alternativeLabel>
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
                <h3> Bidding History </h3>
                <BidAccordian link='0.5 LINK' expiration='08/24' user='0xDC%%9AE02--**5%7022' />
                <BidAccordian link='0.25 LINK' expiration='08/24' user='0x6--.7432ffE%%%6e7C786..EA' />

            </div>


        </div>

    )
}