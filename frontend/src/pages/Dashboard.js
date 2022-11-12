
import { useState } from 'react'
import EnhancedTable from '../components/dataTable'
import FilterInput from '../components/FilterInput'

export default function Dashboard({jobs}) {


    return (
        <div className='dashboard'>

            <h2 className='job_requests_title'> Job Requests</h2>

            <FilterInput />

            <EnhancedTable jobs={jobs} />

        </div>
    )
}