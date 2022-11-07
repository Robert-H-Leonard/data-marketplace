import { TextField } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

export default function JobRequestForm() {
    function handleChange() {

    }
    return (
        <div className='job_request_form_page'>
            <TextField
                className='disabled_input'
                label="ID"
                defaultValue="Default Value"
            />
            <TextField
                className='disabled_input'
                label="Owner"
                defaultValue="Default Value"
            />
            <TextField
                className='text_input'
                label="Name"
                defaultValue="Default Value"
            />
            <TextField
                className='text_input'
                label="Data Source&#40;API Link&#41;"
                defaultValue="Default Value"
            />
            <TextField
                className='text_input'
                label="API Key"
                defaultValue="Default Value"
            />
            <FormControl className='dropdown'>
                <InputLabel id="demo-simple-select-helper-label">Network</InputLabel>
                <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={1}
                    label="Status"
                    fullWidth={true}
                    onChange={handleChange}
                >
                    <MenuItem value={1}>Optimism</MenuItem>
                </Select>
            </FormControl>
            <FormControl className='dropdown'>
                <InputLabel id="demo-simple-select-helper-label">Data Format</InputLabel>
                <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={1}
                    label="Status"
                    fullWidth={true}
                    onChange={handleChange}
                >
                    <MenuItem value={1}>uint256</MenuItem>
                </Select>
            </FormControl>
            <TextField
                className='text_input'
                label="Network"
                defaultValue="Default Value"
            />
            <TextField
                className='text_input'
                label="Data Format"
                defaultValue="Default Value"
            />
            <TextField
                className='text_input'
                label="Requested Data"
                defaultValue="Default Value"
            />
        </div>
    )
}