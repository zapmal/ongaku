import React from 'react';
import { Controller } from 'react-hook-form';
import Select from 'react-select';

import { theme } from '@/stitches.config.js';

const styles = {
  menu: (provided) => ({
    ...provided,
    backgroundColor: theme.colors.primaryBg.value,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: theme.colors.primaryBg.value,
    color: state.isSelected ? theme.colors.accentSolid.value : 'white',
    '&:hover': {
      backgroundColor: theme.colors.primaryBgSubtle.value,
    },
  }),
  control: (provided, state) => ({
    ...provided,
    backgroundColor: theme.colors.primaryBase.value,
    boxShadow: 0,
    borderColor: state.isFocused ? theme.colors.accentSolid.value : 'white',
    '&:hover': {
      borderColor: state.isFocused ? theme.colors.accentSolid.value : 'white',
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: theme.colors.accentSolid.value,
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: theme.colors.accentBg.value,
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: theme.colors.accentTextContrast.value,
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    '&:hover': {
      backgroundColor: theme.colors.accentBgHover.value,
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    textAlign: 'left',
  }),
};

const errorStyles = {
  ...styles,
  control: (provided, state) => ({
    ...provided,
    backgroundColor: theme.colors.primaryBase.value,
    boxShadow: 0,
    borderColor: theme.colors.dangerSolid.value,
    '&:hover': {
      borderColor: state.isFocused
        ? theme.colors.accentSolid.value
        : theme.colors.dangerSolid.value,
    },
  }),
};

export function CustomSelect({
  control,
  options,
  name,
  error,
  onChangeCallback,
  placeholder,
  defaultValue = undefined,
  isMulti = false,
}) {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field }) => (
        <Select
          value={[...options].filter((option) => {
            if (field.value) {
              return field.value.includes(option.value);
            }
          })}
          onChange={(value) => field.onChange(onChangeCallback(value))}
          options={options}
          isMulti={isMulti}
          styles={error ? errorStyles : styles}
          placeholder={placeholder}
        />
      )}
    />
  );
}
