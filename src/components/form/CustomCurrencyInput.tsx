import React from 'react';
import { Controller, Control } from 'react-hook-form';
import MaskedInput from 'react-text-mask';
import { TextField, TextFieldProps } from '@mui/material';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

interface CustomCurrencyInputProps extends Omit<TextFieldProps, 'name' | 'onChange' | 'value'> {
  name: string;
  control: Control<any>;
  label: string;
  helperText?: string;
}

const currencyMask = createNumberMask({
  prefix: '',
  suffix: '',
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: '.',
  allowDecimal: true,
  decimalSymbol: ',',
  decimalLimit: 2,
  integerLimit: null,
  allowNegative: false,
  allowLeadingZeroes: false,
});

const CustomCurrencyInput: React.FC<CustomCurrencyInputProps> = ({ name, control, label, helperText, ...rest }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <MaskedInput
          {...field}
          mask={currencyMask}
          render={(ref, props) => (
            <TextField
              fullWidth
              {...props}
              inputRef={ref}
              label={label}
              error={!!helperText}
              helperText={helperText}
              {...rest}
            />
          )}
        />
      )}
    />
  );
};

export default CustomCurrencyInput;
