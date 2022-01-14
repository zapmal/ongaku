import {
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItem,
  MenuDivider,
  Avatar,
  AvatarBadge,
  Badge,
} from '@chakra-ui/react';
import React from 'react';

import { theme } from '@/stitches.config.js';

export function ProfileIcon() {
  const user = { role: 'ADMIN' };

  return (
    <Menu isLazy>
      <MenuButton margin="10px">
        <Avatar src="/assets/images/static-admin-avatar.jpeg">
          <AvatarBadge
            as={Badge}
            bg={theme.colors.accentSolid.value}
            color="whiteAlpha.900"
            height="20px"
            borderColor="transparent"
            width="50px"
            fontSize={user.role === 'MANAGER' && 'xx-small'}
          >
            {user.role === 'MODERATOR' ? 'MOD' : user.role}
          </AvatarBadge>
        </Avatar>
      </MenuButton>
      <MenuList bg={theme.colors.primaryBase.value} marginTop="10px">
        {user.role !== 'USER' && (
          <>
            <MenuItems group="management" role={user.role} />
            <MenuDivider />
          </>
        )}

        <MenuItems group="account" role={user.role} />
      </MenuList>
    </Menu>
  );
}

function MenuItems({ group, role }) {
  return optionsPerRole.map((currentOption, index) => {
    const option = currentOption[role];
    return (
      option && (
        <MenuOptionGroup key={index} title={group === 'management' ? 'Manage' : 'Account'}>
          {option[group].map((m, index) => (
            <MenuItem
              key={index}
              _hover={{
                bg: theme.colors.primaryBgHover.value,
              }}
              _active={{
                bg: theme.colors.primaryBgHover.value,
                color: theme.colors.accentSolidActive.value,
              }}
              _focus={{
                bg: theme.colors.primaryBgHover.value,
                color: theme.colors.accentSolidActive.value,
              }}
            >
              {m.text}
            </MenuItem>
          ))}
        </MenuOptionGroup>
      )
    );
  });
}

const options = {
  account: [
    {
      text: 'View Profile',
      icon: '',
    },
    {
      text: 'Logout',
      icon: '',
    },
  ],
  moderation: [
    {
      text: 'Users, artists and managers',
      icon: '',
    },
    {
      text: 'Songs, albums and metadata',
      icon: '',
    },
  ],
};

const optionsPerRole = [
  {
    USER: { account: options.account },
  },
  {
    MANAGER: {
      account: options.account,
      management: [
        {
          text: "Artist's work",
          icon: '',
        },
      ],
    },
  },
  {
    ARTIST: {
      account: options.account,
      management: [{ text: 'Published work', icon: '' }],
    },
  },
  {
    MODERATOR: {
      account: options.account,
      management: options.moderation,
    },
  },
  {
    ADMIN: {
      account: options.account,
      management: [
        ...options.moderation,
        {
          text: 'Ongaku Staff',
          icon: '',
        },
      ],
    },
  },
];
