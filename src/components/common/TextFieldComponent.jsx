import { TextField } from "@mui/material";

function TextFieldComponent({auto=true, id, name, type, label, value, disabled=false, handleChange, onBlur, error = false, helperText = ""}) {
    return (
        <TextField
            required
            margin="dense"
            id={id}
            name={name}
            type={type}
            disabled={disabled}
            label={label}
            value={value}
            onChange={handleChange}
            onBlur={onBlur}
            error={error}
            helperText={helperText}
            variant="outlined"
            size="medium"
            fullWidth
        />
    );
}

export default TextFieldComponent;