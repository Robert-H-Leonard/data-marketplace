
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import { TextField } from '@mui/material'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'



export default function FilterInput() {
    function handleChange() {

    }
    return (
        <div className='filter_input'>

            <form>
                <FormControl className='search_input' >
                    <TextField
                        id="outlined-helperText"
                        label="Search"
                        defaultValue="Name, email, etc..."
                        fullWidth={true}
                    />
                </FormControl>
                <FormControl className='status_input' >
                    <InputLabel id="demo-simple-select-helper-label">Status</InputLabel>
                    <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={10}
                        label="Status"
                        fullWidth={true}
                        onChange={handleChange}
                    >
                        <MenuItem value={10}>Open to Bid</MenuItem>
                        <MenuItem value={20}>Pending</MenuItem>
                        <MenuItem value={30}>Fufilled</MenuItem>
                    </Select>
                </FormControl>


            </form>
            <div className='button_row'>
                <Button variant="contained"> + Add Job </Button>
            </div>

        </div>
    )
}