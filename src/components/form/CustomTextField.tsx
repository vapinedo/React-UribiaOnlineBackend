import { FC } from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { UseFormRegisterReturn } from "react-hook-form";

interface InputProps extends Omit<TextFieldProps, 'error'> {
    register?: UseFormRegisterReturn;
    error?: string;
}

const CustomTextField: FC<InputProps> = ({ error, register, ...rest }) => {
    return (
        <TextField
            {...rest}
            size="small"
            error={!!error}
            label={rest.label}
            sx={{ width: '100%' }}
            {...(register ? register : {})}
            helperText={error && <span className="text-danger">{error}</span>}
        />
    );
}

export default CustomTextField;