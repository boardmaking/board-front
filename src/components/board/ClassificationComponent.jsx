import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import BugReportIcon from '@mui/icons-material/BugReport';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const ClassificationComponent = ({ value, onChange }) => {
    return (
        <FormControl fullWidth style={{ marginTop: 10 }}>
            <InputLabel id="classification-select-label">카테고리</InputLabel>
            <Select
                labelId="classification-select-label"
                id="classification-select"
                value={value}
                label="카테고리"
                onChange={onChange}
                required
            >
                <MenuItem value="NEW">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <NewReleasesIcon sx={{ fontSize: 16 }} />
                        <span>새소식</span>
                    </Box>
                </MenuItem>
                <MenuItem value="BUG">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BugReportIcon sx={{ fontSize: 16 }} />
                        <span>버그</span>
                    </Box>
                </MenuItem>
                <MenuItem value="QUESTION">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <HelpOutlineIcon sx={{ fontSize: 16 }} />
                        <span>질문</span>
                    </Box>
                </MenuItem>
                <MenuItem value="SOLVED">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleOutlineIcon sx={{ fontSize: 16 }} />
                        <span>해결됨</span>
                    </Box>
                </MenuItem>
                <MenuItem value="INFO">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <InfoOutlinedIcon sx={{ fontSize: 16 }} />
                        <span>정보</span>
                    </Box>
                </MenuItem>
            </Select>
        </FormControl>
    );
};

export default ClassificationComponent;
