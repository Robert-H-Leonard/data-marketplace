
import { useState } from 'react'
import EnhancedTable from '../components/dataTable'
import FilterInput from '../components/FilterInput'
import { JobRequestDataWithBids } from '../store/JobRequestStore'

interface DashboardProps {
    jobRequests: JobRequestDataWithBids[]
}

export default function Dashboard(props: DashboardProps) {

    const { jobRequests } = props
    return (
        <div className='dashboard'>

            <h2 className='job_requests_title'> Job Requests</h2>

            <FilterInput />

            <EnhancedTable jobRequests={jobRequests}/>

        </div>
    )
}