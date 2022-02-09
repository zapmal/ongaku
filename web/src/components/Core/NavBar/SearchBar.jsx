import { Box, Flex, Input, IconButton, Tooltip, Icon, Text, Divider } from '@chakra-ui/react';
import React, { useState } from 'react';
import { FiTrash } from 'react-icons/fi';
import { MdArrowBack, MdHistory } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { Link } from '@/components/Elements';
import { TRANSPARENT_ICON_PROPS } from '@/features/app';
import { useHistory } from '@/hooks/useHistory';
import { theme } from '@/stitches.config.js';

export function SearchBar({ setClickedSearch }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [searchHistory, setSearchHistory, cleanHistory] = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${query}`);
    setSearchHistory(query);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex
        backgroundColor={theme.colors.primaryBg.value}
        border={`.5px solid ${theme.colors.primaryLine.value}`}
        width="500px"
        height="50px"
      >
        <IconButton
          icon={<Icon as={MdArrowBack} w="20px" h="20px" marginTop="5px" />}
          onClick={() => setClickedSearch(false)}
          {...TRANSPARENT_ICON_PROPS}
        />
        <Input
          type="text"
          name="query"
          css={{ width: '90%', padding: '10px' }}
          placeholder="El Minero"
          variant="unstyled"
          onChange={(e) => setQuery(e.target.value)}
        />
        <Tooltip label="Clear history">
          <IconButton
            onClick={cleanHistory}
            icon={<Icon as={FiTrash} />}
            marginTop="3px"
            {...TRANSPARENT_ICON_PROPS}
          />
        </Tooltip>
      </Flex>
      {searchHistory.length != 0 && (
        <Box
          marginTop="5px"
          maxHeight="225px"
          width="500px"
          position="absolute"
          backgroundColor={theme.colors.primaryBg.value}
          border={`.5px solid ${theme.colors.primaryLine.value}`}
        >
          {searchHistory.map((current, index) => (
            <React.Fragment key={index}>
              <Flex align="center" margin="10px">
                <Icon marginRight="10px" as={MdHistory} w="20px" h="20px" color="whiteAlpha.600" />
                <Text
                  color="whiteAlpha.600"
                  as={Link}
                  to={`/search?query=${current}`}
                  underline={false}
                >
                  {current}
                </Text>
              </Flex>
              <Divider />
            </React.Fragment>
          ))}
        </Box>
      )}
    </form>
  );
}
