import { TextField } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import { useState } from 'react'
import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'

const StyledTextField =  styled(TextField)({
    '& label.Mui-focused': {
        color: 'rgba(0, 0, 0, 0.54)',
      },
    '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
        borderWidth: '1px',
        borderColor: 'rgba(0, 0, 0, 0.54)',
      },}
  });

export default function JobRequestForm() {
    const [setName, name] = useState("")
    const [setDataSource, dataSource] = useState("")
    const [setKey, key] = useState("")
    const [setNetwork, network] = useState("")
    const [setFormat, format] = useState("1")
    const [setReqData, reqData] = useState("")
    const navigate = useNavigate()
    const handleChange = (event) => {
        switch (event.target.label) {
            case "Network":
                setNetwork(event.target.value);
                break;
            case "Data Format":
                setFormat(event.target.value);
                break;
        }
    }

    const formSubmit = () => {

    }

    const onCancel = () => { 
        navigate('/')
    }

    return (
        <div className='job_request_form_page'>
            <StyledTextField
                className='text_input'
                label="Name"
                focused
            />
            <StyledTextField
                className='text_input'
                helperText='optional'
                label="Data Source&#40;API Link&#41;"
                focused
            />
            <StyledTextField
                className='text_input'
                label="API Key"
                focused
            />
            <StyledTextField
                id="outlined-select-network"
                className='dropdown'
                select
                label="Network"
                value={1}
                onChange={handleChange}
                focused
            >
                <MenuItem value={1}> &#40;Goerli&#41; Ethereum </MenuItem>
                <MenuItem disabled value={2}>Optimism</MenuItem>
            </StyledTextField>
            <StyledTextField
                id="outlined-select-data-format"
                className='dropdown'
                select
                label="Data Format"
                defaultValue={format}
                onChange={handleChange}
                focused
            >
                <MenuItem value={1}>uint</MenuItem>
                <MenuItem value={2}>string</MenuItem>
                <MenuItem value={3}>int</MenuItem>
                <MenuItem value={4}>byte</MenuItem>
            </StyledTextField>
            <StyledTextField
                className='text_input'
                label="Requested Data"
                focused
            />
            <Button className='save' variant="contained" disabled={name === "" || dataSource === "" || key === "" || network === "" || format === "" || reqData === ""}> Save Changes</Button>
            <Button className='cancel' variant="text">Cancel</Button>
        </div>
    )
}