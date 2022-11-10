
import { useState } from 'react'
import EnhancedTable from '../components/dataTable'
import FilterInput from '../components/FilterInput'
import LoginModal from '../components/loginModal'

export default function Dashboard() {

   const [loggedIn, setLogin ] = useState(false)

    return (
        <div className='dashboard'>

            {!loggedIn && <LoginModal/>}
            <h2 className='job_requests_title'> Job Requests</h2>

            <FilterInput />

            <EnhancedTable />

        </div>
    )
}