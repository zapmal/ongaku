/* eslint-disable react/no-children-prop */
import {
  FormControl,
  Text,
  Tooltip,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import React, { useRef } from 'react';
import { MdFileUpload } from 'react-icons/md';

import { Button } from '@/components/Elements';
import { theme } from '@/stitches.config.js';

export function Field(props) {
  const label = (
    <FormLabel
      color={theme.colors.primaryTextContrast.value}
      htmlFor={props.name}
      padding="5px"
      fontWeight="bold"
      _hover={{
        cursor: 'help',
      }}
    >
      {props.label}
    </FormLabel>
  );
  return (
    <FormControl>
      {props.label &&
        (props.helperText ? (
          <Tooltip
            label={props.helperText}
            bg={theme.colors.primaryBgHover.value}
            textAlign="center"
            borderRadius="5px"
            placement="top"
          >
            {label}
          </Tooltip>
        ) : (
          label
        ))}
      {props.type === 'file' ? (
        <FileInput
          id={props.name}
          accept={'image/**'}
          register={props.register(props.name, { validate: validateFileInput })}
        >
          <Button leftIcon={<MdFileUpload />}>Upload</Button>
        </FileInput>
      ) : (
        <InputGroup>
          <Input
            type={props.type}
            id={props.name}
            placeholder={props.placeholder}
            isInvalid={!!props.error}
            isDisabled={!!props.isDisabled}
            css={props.css}
            focusBorderColor={'#E93D82'}
            {...props.register(props.name, {
              disabled: props.isDisabled,
            })}
            onChange={props.onChange}
          />
          {props.rightIcon && <InputRightElement children={props.rightIcon} pointerEvents="none" />}
        </InputGroup>
      )}
      {props.error && (
        <Text color={theme.colors.dangerSolid.value} paddingTop="5px" textAlign="left">
          {props.error.message}
        </Text>
      )}
    </FormControl>
  );
}

const validateFileInput = (value) => {
  if (value.length < 1) {
    return 'Files is required';
  }
  for (const file of Array.from(value)) {
    const fileSizeInMegabytes = file.size / (1024 * 1024);
    const MAX_FILE_SIZE = 10;
    if (fileSizeInMegabytes > MAX_FILE_SIZE) {
      return 'Max file size 10mb';
    }
  }
  return true;
};

function FileInput(props) {
  const inputRef = useRef(null);
  const { ref, ...field } = props.register;

  const handleClick = () => inputRef.current.click();

  return (
    <InputGroup onClick={handleClick}>
      <input
        id={props.id}
        type={'file'}
        multiple={props.multiple || false}
        hidden
        accept={props.accept}
        {...field}
        ref={(e) => {
          ref(e);
          inputRef.current = e;
        }}
      />
      <>{props.children}</>
    </InputGroup>
  );
}
