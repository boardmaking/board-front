import {Box, FormControl, InputLabel, MenuItem, Select} from '@mui/material';
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
                <MenuItem value="TRAVEL">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleOutlineIcon sx={{ fontSize: 16 }} />
                        <span>여행</span>
                    </Box>
                </MenuItem>
                <MenuItem value="FOOD">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <InfoOutlinedIcon sx={{ fontSize: 16 }} />
                        <span>맛집</span>
                    </Box>
                </MenuItem>
            </Select>
        </FormControl>
    );
};

export default ClassificationComponent;
