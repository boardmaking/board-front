import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {useQuery} from "@tanstack/react-query";
import {getList} from "../../api/boardApi.js";
import useCustomMove from "../../hooks/useCustomMove.jsx";

const rows = [
  { seq: 1, title: '첫 번째 게시물', writer: '작성자1', date: '2023-11-01' },
  { seq: 2, title: '두 번째 게시물', writer: '작성자2', date: '2023-11-01' },
  { seq: 3, title: '세 번째 게시물', writer: '작성자3', date: '2023-11-01' },
];

const columns = [
  { id: 'seq', label: '#', minWidth: 170 },
  { id: 'title', label: '제목', minWidth: 100 },
  { id: 'writer', label: '작성자', minWidth: 170, align: 'right' },
  { id: 'date', label: '작성일', minWidth: 170, align: 'right' },
];

export default function TableComponent() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();
  const {category,search,refresh} = useCustomMove();

  const {data} = useQuery({
    queryKey:['',{category,search,refresh}],
    queryFn:()=>getList({category,search}),
  });

  console.log(data)
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClickRow = (seq, title) => {
    navigate('/board/read', {
      state: { title }
    });
  };

  return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                    <TableCell
                        key={column.id}
                        align={column.align}
                    >
                      {column.label}
                    </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.seq}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                          <TableCell
                              key={column.id}
                              align={column.align}
                              onClick={() => column.id === 'title' && handleClickRow(row.seq, row.title)}
                          >
                            {value}
                          </TableCell>
                      );
                    })}
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
  );
}