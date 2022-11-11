import { TextField } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'

export default function JobRequestForm() {
    function handleChange() {

    }
    return (
        <div className='job_request_form_page'>
            <TextField
                className='text_input'
                label="Name"
                defaultValue="Corn price"
            />
            <TextField
                className='text_input'
                helperText='optional'
                label="Data Source&#40;API Link&#41;"
                defaultValue="https://api.coin**sk.com/**/**/currentprice.json"
            />
            <TextField
                className='text_input'
                label="API Key"
                defaultValue="AI*****4JsXZ-H-G###33"
            />
            <FormControl className='dropdown margin_right'>
                <InputLabel>Network</InputLabel>
                <Select
                    labelId="demo-simple-select-helper-label"
                    value={1}
                    label="Status"
                    fullWidth={true}
                    onChange={handleChange}
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
                    value={1}
                    label="Status"
                    fullWidth={true}
                    onChange={handleChange}
                >
                    <MenuItem value={1}>uint</MenuItem>
                    <MenuItem value={1}>string</MenuItem>
                    <MenuItem value={1}>int</MenuItem>
                    <MenuItem value={1}>byte</MenuItem>
                </Select>
            </FormControl>
            <TextField
                className='text_input'
                label="Requested Data"
                defaultValue="Corn spot price"
            />
            <Button className='save' variant="contained"> Save Changes</Button>
            <Button className='cancel' variant="text">Cancel</Button>
        </div>



    )
}