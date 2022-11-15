import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

export default function bidAccordian({ link, expiration, user, requestor, jobRequestStore, bidId, jobRequestId }) {

    const onAcceptBid = async () => {
        await jobRequestStore.acceptBid(jobRequestId,bidId)
    }

    return (
        <div className='bid_accordian'>

            {requestor &&
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography className='typography_component'>
                            <div className='collapsed_accordian_row'>
                                <div className='collapsed_column'>
                                    <span className='bid_amount'>{`${link} LINK`} </span>
                                    <span className='expiration_date'>Expires at {expiration}</span>
                                </div>
                                <Button className="accept_button" variant="text" onClick={() => onAcceptBid()}>Accept</Button>
                            </div>
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            <div className='more_details'>
                                <Avatar src="" />
                                {user}
                            </div>
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            }


            {!requestor &&
                <section>
                    <Accordion disabled>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel3a-content"
                            id="panel3a-header"
                        >
                            <Typography className='typography_component'>
                                <div className='collapsed_accordian_row'>
                                    <div className='collapsed_column'>
                                        <span className='bid_amount'>{link} </span>
                                    </div>
                                    <Button className="accept_button" variant="text" disabled>Accept</Button>
                                </div>
                            </Typography>
                        </AccordionSummary>
                    </Accordion>

                </section>
            }

        </div>
    )
}