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
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import BugReportIcon from '@mui/icons-material/BugReport';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import encryptUtil from "../../util/encryptUtil.js";

const StyledButton = styled(Button)(({theme}) => ({
    margin: theme.spacing(1),
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
    },
}));

const columns = [
    {id: 'classification', label: '구분', minWidth: 100},
    {id: 'title', label: '제목', minWidth: 300},
    {id: 'username', label: '작성자', minWidth: 120, align: 'center'},
    {id: 'createdAt', label: '작성일', minWidth: 120, align: 'center'},
];

const categoryConfig = {
    'NEW': {
        icon: <NewReleasesIcon sx={{fontSize: 16}}/>,
        label: '새소식',
        color: '#4CAF50',
        bgColor: '#E8F5E9'
    },
    'BUG': {
        icon: <BugReportIcon sx={{fontSize: 16}}/>,
        label: '버그',
        color: '#F44336',
        bgColor: '#FFEBEE'
    },
    'QUESTION': {
        icon: <HelpOutlineIcon sx={{fontSize: 16}}/>,
        label: '질문',
        color: '#2196F3',
        bgColor: '#E3F2FD'
    },
    'SOLVED': {
        icon: <CheckCircleOutlineIcon sx={{fontSize: 16}}/>,
        label: '해결됨',
        color: '#673AB7',
        bgColor: '#EDE7F6'
    },
    'INFO': {
        icon: <InfoOutlinedIcon sx={{fontSize: 16}}/>,
        label: '정보',
        color: '#FF9800',
        bgColor: '#FFF3E0'
    }
};

export default function TableComponent() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const navigate = useNavigate();
    const {category, search, refresh} = useCustomMove();
    const [totalItems, setTotalItems] = useState(0);
    const {encodedEncryptedData} = encryptUtil(search,category)
    const {data} = useQuery({
        queryKey: ['boardList', {category, search, refresh,page,rowsPerPage}],
        queryFn: () => getList({category, search,page:page,size:rowsPerPage}),
    });

    const {moveToWrite} = useCustomMove()


    useEffect(() => {
        if (data?.data) {
            setPage(data.data.number)
            setRowsPerPage(data.data.size)
            setTotalItems(data.data.totalElements)

        }
    }, [data]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value)
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
        return data.data.content;
    };

    const handleClickRow = (seq, boardId, title, username, createdAt, content) => {
        navigate(`/boards/read/${boardId}`, {
            state: {
                title, createdAt, username, content
            }
        });
    };

    const getCategoryInfo = (category) => {
        if (!category) return {
            icon: <HelpOutlineIcon sx={{fontSize: 16}} />,
            label: '알 수 없음',
            color: '#757575',
            bgColor: '#f0f0f0'
        };

        const categoryKey = typeof category === 'string' ? category : category.toString();

        return categoryConfig[categoryKey] || {
            icon: <HelpOutlineIcon sx={{fontSize: 16}} />,
            label: '알 수 없음',
            color: '#757575',
            bgColor: '#f0f0f0'
        };
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
                        {getCurrentPageData().map((row) => {
                            const categoryInfo = getCategoryInfo(row.classification);

                            return (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    tabIndex={-1}
                                    key={row.boardId}
                                    onClick={() => handleClickRow(row.id, row.boardId, row.title, row.username, row.createdAt, row.content)}
                                    sx={{
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: '#f8f9fa'
                                        }
                                    }}
                                >
                                    <TableCell>
                                        <Chip
                                            icon={categoryInfo.icon}
                                            label={categoryInfo.label}
                                            size="small"
                                            sx={{
                                                backgroundColor: categoryInfo.bgColor,
                                                color: categoryInfo.color,
                                                borderRadius: '4px',
                                                '& .MuiChip-icon': {
                                                    color: categoryInfo.color
                                                },
                                                '& .MuiChip-label': {
                                                    px: 1,
                                                    fontWeight: 500
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
                                                {formatDate(row.createdAt)}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <StyledButton variant="outlined" onClick={moveToWrite}>
                글작성
            </StyledButton>
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