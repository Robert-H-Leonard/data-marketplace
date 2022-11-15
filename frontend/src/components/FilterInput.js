import { useAccount } from "wagmi"
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import { TextField, Button } from '@mui/material'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import AddIcon from '@mui/icons-material/Add';
import { Link } from "react-router-dom"



export default function FilterInput() {
    const { address } = useAccount();
    return (
        <div className='filter_input'>
            <div className='.filter_input_left'>
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
                            onChange={() => {}}
                        >
                            <MenuItem value={10}>Open to Bid</MenuItem>
                            <MenuItem value={20}>Pending</MenuItem>
                            <MenuItem value={30}>Fufilled</MenuItem>
                        </Select>
                    </FormControl>
                    <img  className="filterIcon" src='filterIcon.svg' alt='filterIcon' />
                </form>
            </div>
            {
                address 
                    ? 
                        <div className='.filter_input_right'>
                            <Link to="/createJob" style={{ textDecoration: 'none' }}>
                                <Button color="primary" size="medium" variant="contained" startIcon={<AddIcon/>}>
                                    Add Job
                                </Button>
                            </Link>
                        </div>
                    :
                    <></>
            }
        </div>
    )
}