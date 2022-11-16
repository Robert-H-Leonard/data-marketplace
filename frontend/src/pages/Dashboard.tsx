
import { Skeleton } from '@mui/material';
import EnhancedTable from '../components/dataTable'
import FilterInput from '../components/FilterInput'
import { JobRequestDataWithBids } from '../store/JobRequestStore'

interface DashboardProps {
    jobRequests: JobRequestDataWithBids[];
    isLoading: boolean
}

export default function Dashboard(props: DashboardProps) {

    const { jobRequests, isLoading } = props
    return (
        <div className='dashboard'>
            <title>
                <h2 className='job_requests_title'> Job Requests</h2>
            </title>

            {/* <FilterInput /> */}

            {isLoading
                ?
                <Skeleton>
                    <EnhancedTable jobRequests={jobRequests} />
                </Skeleton>
                :
                <EnhancedTable jobRequests={jobRequests} />}

        </div>
    )
}