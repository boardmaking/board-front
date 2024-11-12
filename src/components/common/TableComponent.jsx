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
import {alpha, styled} from '@mui/material/styles';
import {useQuery} from "@tanstack/react-query";
import {getList} from "../../api/boardApi.js";
import useCustomMove from "../../hooks/useCustomMove.jsx";
import {Box, Button, Chip, Typography} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import TagIcon from '@mui/icons-material/Tag';

const StyledButton = styled(Button)(({theme}) => ({
    margin: theme.spacing(1),
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
    },
}));

const columns = [
    {id: 'id', label: '#', minWidth: 60},
    {id: 'title', label: '제목', minWidth: 300},
    {id: 'username', label: '작성자', minWidth: 120, align: 'center'},
    {id: 'createAt', label: '작성일', minWidth: 120, align: 'center'},
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

    const {moveToWrite} = useCustomMove()

    useEffect(() => {
        if (data?.data) {
            setTotalItems(data.data.length);
        }
    }, [data]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            if (date.toDateString() === today.toDateString()) {
                return `오늘 ${date.toLocaleTimeString('ko-KR', {hour: '2-digit', minute: '2-digit'})}`;
            } else if (date.toDateString() === yesterday.toDateString()) {
                return '어제';
            } else {
                return date.toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                });
            }
        } catch (e) {
            return dateString;
        }
    };

    const getCurrentPageData = () => {
        if (!data?.data) return [];
        return data.data.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
    };

    const handleClickRow = (seq, boardId, title, username, createAt, content) => {
        navigate(`/boards/read/${boardId}`, {
            state: {
                title, createAt, username, content
            }
        });
    };

    return (
        <Paper sx={{width: '100%', overflow: 'hidden', borderRadius: 2, boxShadow: 3}}>
            <TableContainer sx={{maxHeight: 630}}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    sx={{
                                        backgroundColor: '#f5f5f5',
                                        color: '#424242',
                                        fontWeight: 'bold',
                                        fontSize: '0.95rem'
                                    }}
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
                                key={row.boardId}
                                onClick={() => handleClickRow(row.id, row.boardId, row.title, row.username, row.createAt, row.content)}
                                sx={{
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: '#f8f9fa'
                                    }
                                }}
                            >
                                <TableCell>
                                    <Chip
                                        icon={<TagIcon sx={{fontSize: 16}}/>}
                                        label={row.id}
                                        size="small"
                                        sx={{
                                            backgroundColor: '#e9ecef',
                                            '& .MuiChip-label': {
                                                px: 1,
                                                color: '#495057'
                                            }
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body1" sx={{fontWeight: 500, color: '#2c3e50'}}>
                                        {row.title}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1}}>
                                        <PersonIcon sx={{fontSize: 16, color: '#757575'}}/>
                                        <Typography variant="body2" sx={{color: '#666'}}>
                                            {row.username}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="center">
                                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1}}>
                                        <AccessTimeIcon sx={{fontSize: 16, color: '#757575'}}/>
                                        <Typography variant="body2" sx={{color: '#666'}}>
                                            {formatDate(row.createAt)}
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <StyledButton variant="outlined"
                          onClick={moveToWrite}
            >글작성</StyledButton>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={totalItems}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                    borderTop: '1px solid #e0e0e0',
                    '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                        color: '#666'
                    }
                }}
            />
        </Paper>

    );
}