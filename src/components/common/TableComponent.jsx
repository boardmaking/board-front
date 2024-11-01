import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {getList} from "../../api/boardApi.js";
import useCustomMove from "../../hooks/useCustomMove.jsx";

const columns = [
    {id: 'id', label: '#', minWidth: 170},
    {id: 'title', label: '제목', minWidth: 100},
    {id: 'username', label: '작성자', minWidth: 170, align: 'right'},
    {id: 'createAt', label: '작성일', minWidth: 170, align: 'right'},
];

export default function TableComponent() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const navigate = useNavigate();
    const {category, search, refresh} = useCustomMove();
    const [totalItems, setTotalItems] = useState(0);

    const {data} = useQuery({
        queryKey: ['boardList', {category, search, refresh}],
        queryFn: () => getList({category, search}),
    });

    useEffect(() => {
        if (data?.data) {
            setTotalItems(data.data.length);
        }
    }, [data]);

    console.log(data)
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleClickRow = (title) => {
        navigate('/board/read', {
            state: {title}
        });
    };

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString();
        } catch (e) {
            return dateString;
        }
    };


    const getCurrentPageData = () => {
        if (!data?.data) return [];
        return data.data.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
    };

    return (
        <Paper sx={{width: '100%', overflow: 'hidden'}}>
            <TableContainer sx={{maxHeight: 440}}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{fontWeight: 'bold'}}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {getCurrentPageData().map((row) => (
                            <TableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={row.id}
                                onClick={() => handleClickRow(row.title)}
                                sx={{cursor: 'pointer'}}
                            >
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.title}</TableCell>
                                <TableCell align="right">{row.username}</TableCell>
                                <TableCell align="right">{formatDate(row.createAt)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={totalItems}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}