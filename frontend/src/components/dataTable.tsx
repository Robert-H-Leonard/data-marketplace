import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import Chip from '@mui/material/Chip';
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { JobRequestDataWithBids } from '../store/JobRequestStore';
import { Checkbox, FormControlLabel } from '@mui/material';
import { uniqueNamesGenerator, names } from 'unique-names-generator';



function createData(owner, name, network, fee, bids, accountStatus) {
    return {
        owner,
        name,
        network,
        fee,
        bids,
        accountStatus
    };
}

const rows = [
    createData('vitalik.eth', 'Price of corn', 'Optimism', '', 2, 'Open Bid'),
];

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'id',
        numeric: true,
        label: 'ID',
    },
    {
        id: 'owner',
        numeric: false,
        label: 'Owner',
    },
    {
        id: 'name',
        numeric: false,
        label: 'Name',
    },
    {
        id: 'network',
        numeric: false,
        label: 'Network',
    },
    {
        id: 'fee',
        numeric: true,
        label: 'Fee',
    },
    {
        id: 'bids',
        numeric: true,
        label: 'Bids',
    },
    {
        id: 'accountStatus',
        numeric: false,
        label: 'Account Status',
    },
];

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow className="table_headers">
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={'center'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

interface EnhancedTableProps {
    jobRequests: JobRequestDataWithBids[]
}

export default function EnhancedTable(props: EnhancedTableProps) {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const { jobRequests } = props;

    const [info, setInfo] = React.useState(jobRequests);

    const navigate = useNavigate()
    const handleRowClick = (row: JobRequestDataWithBids) => {
        navigate(`/jobRequest/${row.id}`, { state: { jobRequest: row } })
    }

    function createData(jobRequest: JobRequestDataWithBids) {
        let owner = jobRequest.requestorAddress;
        let accountStatus = jobRequest.currentState.toLowerCase();
        if (accountStatus.includes('open')) {
            accountStatus = 'Open Bid'
        } else if (accountStatus.includes(`fulfilled`)) {
            accountStatus = 'Success'
        } else {
            accountStatus = 'Pending'
        }
        let fee = Math.random().toFixed(2)
        let bids = 0
        let network = `(Mumbai) Polygon`

        return {
            id: jobRequest.id,
            owner,
            accountStatus,
            fee,
            bids,
            network
        };
    }

    const rows = jobRequests.map(job => createData(job))

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <Box className="data_table" sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.sort(getComparator(order, orderBy)).slice() */}
                            {stableSort(jobRequests, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((jobRequest: JobRequestDataWithBids, index) => {
                                    const isItemSelected = isSelected(jobRequest.id);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => handleRowClick(jobRequest)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={jobRequest.id}
                                            selected={isItemSelected}
                                        >
                                            <TableCell align={'center'}>
                                                {jobRequest.id}
                                            </TableCell>
                                            <TableCell align={'center'}>{`${uniqueNamesGenerator({ dictionaries: [names], seed: jobRequest.requestorAddress }).toLowerCase()}.eth`}</TableCell>
                                            <TableCell align={'center'}>{jobRequest.name}</TableCell>
                                            <TableCell align={'center'} >{jobRequest.network}</TableCell>
                                            <TableCell align={'center'}>{jobRequest.winningBid ? `${jobRequest.winningBid.dataFeedFee} LINK` : ""}</TableCell>
                                            <TableCell align={'center'}>{jobRequest.bids.length}</TableCell>
                                            <TableCell align={'center'}><Chip label={jobRequest.currentState} color={jobRequest.currentState === 'OpenBid' ? 'primary' : jobRequest.currentState === 'Validated' ? 'success' : 'warning'} /></TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}
