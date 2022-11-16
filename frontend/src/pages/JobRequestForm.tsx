import { TextField } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import { useState } from 'react'
import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { JobRequestStore } from '../store/JobRequestStore'
import { alpha, styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'

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

interface JobRequestFormProps {
    jobRequestStore: JobRequestStore;
}

export interface JobRequestSubmission {
    name?: string,
    datasource?: string,
    auth?: string,
    network: string,
    dataFormat?: string,
    dataDescription?: string
}

export default function JobRequestForm(props: JobRequestFormProps) {

    const { jobRequestStore } = props;

    const [jobRequestSubmission, setJobRequestSubmission] = useState<JobRequestSubmission>({ network: "goerli" })
    const [canSubmit, setCanSubmit] = useState(false);
    const [shouldRedirect, setShouldRedirect] = useState(false);

    useEffect(() => {
        if (jobRequestSubmission.name && jobRequestSubmission.datasource && jobRequestSubmission.network && jobRequestSubmission.dataFormat && jobRequestSubmission.dataDescription) {
            setCanSubmit(true)
        } else {
            setCanSubmit(false)
        }
    }, [jobRequestSubmission])

    const submitRequest = async () => {

        const finalAuth = jobRequestSubmission.auth ? jobRequestSubmission.auth : " ";
        const result = await jobRequestStore.createJobRequest({ ...jobRequestSubmission, auth: finalAuth });

        if (result) {
            setShouldRedirect(true)
        }
    }

    return (
        <div className='job_request_form_page'>
            {
                shouldRedirect ? <Navigate to="/" /> : <></>
            }
            <StyledTextField
                required
                className='text_input'
                label="Name"
                focused
                value={jobRequestSubmission.name}
                onChange={(event) => { setJobRequestSubmission({ ...jobRequestSubmission, name: event.target.value }) }}
            />
            <StyledTextField
                required
                focused
                className='text_input'
                label="Data Source &#40;API Url&#41;"
                value={jobRequestSubmission.datasource}
                onChange={(event) => { setJobRequestSubmission({ ...jobRequestSubmission, datasource: event.target.value }) }}
            />
            <StyledTextField
                className='text_input'
                helperText='optional'
                label="Auth Token / API Key"
                focused
                value={jobRequestSubmission.auth}
                onChange={(event) => { setJobRequestSubmission({ ...jobRequestSubmission, auth: event.target.value }) }}
            />
            <div className='dropdown_row' >
                <FormControl className='dropdown'>
                    <InputLabel>Network</InputLabel>
                    <Select
                        labelId="demo-simple-select-helper-label"
                        value={1}
                        label="Status"
                        fullWidth={true}
                        required
                        onChange={() => { }}
                    >
                        <MenuItem value={1}> &#40;Goerli&#41; Ethereum </MenuItem>
                        <MenuItem disabled value={2}>Optimism</MenuItem>
                    </Select>
                </FormControl>
                <FormControl className='dropdown'>
                    <InputLabel id="demo-simple-select-helper-label">Data Format</InputLabel>
                    <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        required
                        label="Status"
                        fullWidth={true}
                        value={jobRequestSubmission.dataFormat}
                        onChange={(event) => { setJobRequestSubmission({ ...jobRequestSubmission, dataFormat: event.target.value }) }}
                    >
                        <MenuItem value={1}>uint</MenuItem>
                        <MenuItem value={2}>string</MenuItem>
                        <MenuItem value={3}>int</MenuItem>
                        <MenuItem value={4}>byte</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <StyledTextField
                required
                focused
                className='text_input'
                label="Requested Data Description"
                value={jobRequestSubmission.dataDescription}
                onChange={(event) => { setJobRequestSubmission({ ...jobRequestSubmission, dataDescription: event.target.value }) }}
            />
            <div className='button_row'>
                <Button className='save' variant="contained" disabled={!canSubmit} onClick={() => { submitRequest() }}> Submit Request</Button>
                <a href='/'> <Button className='cancel' variant="contained">Cancel</Button> </a>
            </div>

        </div>
    )
}