import {alpha, styled} from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import {Button, InputLabel, Select} from "@mui/material";
import {useState} from "react";
import useCustomMove from "../hooks/useCustomMove.jsx";
import {useLocation} from "react-router-dom";

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const initState = {
  category:'1',
  search:''
}

export default function BasicLayout({children}) {

  const [search, setSearch] = useState(initState)
  const {moveToList, moveToMain, moveToPath} = useCustomMove()
  const location = useLocation()
  const pathname = location.pathname
  const handleChangeSearch = (e) => {
    search[e.target.name] = e.target.value
    setSearch(search)
  }

  const handleClickSearch = (e) => {
    moveToList(search)
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleClickSearch(event);
    }
  };

  const handleClickLogin = () => {
      moveToPath('/users/login')
  }

  const handleClickJoin = () => {
    moveToPath('/users/join')
  }

  return (
      <Box sx={{ flexGrow: 1 }}>
        {pathname==='/users/login'?
        <></>
            :
        <Button onClick={handleClickLogin}>로그인하러 가기</Button>
      }
        {pathname==='/users/join'?
            <></>
            :
        <Button onClick={handleClickJoin}>회원가입하러 가기</Button>
        }
        <AppBar position="static">
          <Toolbar>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                onClick={moveToMain}
                aria-label="open drawer"
                sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
            >
              이슈 게시판
            </Typography>
            <InputLabel htmlFor="grouped-native-select">조건</InputLabel>
            <Select
                native
                defaultValue="1"
                id="grouped-native-select"
                label="category"
                name="category"
                onChange={handleChangeSearch}
                sx={{
                  bgcolor: 'white', // 배경색을 하얗게 설정
                  opacity: 0.7, // 불투명도 설정
                  color: 'black', // 텍스트 색상을 검정색으로 설정
                }}
            >
                <option value={1}>작성자</option>
                <option value={2}>제목</option>
                <option value={3}>내용</option>
            </Select>
            <Search>
              <SearchIconWrapper>
                <SearchIcon/>
              </SearchIconWrapper>
              <StyledInputBase
                  name="search"
                  onChange={handleChangeSearch}
                  onKeyDown={handleKeyPress}
                  placeholder="Search…"
                  inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
          </Toolbar>
        </AppBar>
        {children}
      </Box>
  );
}
