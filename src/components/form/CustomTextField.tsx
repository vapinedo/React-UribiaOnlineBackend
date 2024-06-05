import { FC } from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { UseFormRegisterReturn } from "react-hook-form";

interface InputProps extends Omit<TextFieldProps, 'error' | 'name'> {
    name: string;
    register?: UseFormRegisterReturn;
    error?: string;
}

const CustomTextField: FC<InputProps> = ({ name, error, register, ...rest }) => {
    return (
        <TextField
            {...rest}
            name={name}
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