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
  Icon,
} from '@chakra-ui/react';
import React from 'react';
import { CgProfile } from 'react-icons/cg';
import { FiLogOut } from 'react-icons/fi';
import { MdGroups, MdMusicNote, MdAdminPanelSettings, MdOutlineWork } from 'react-icons/md';
import { Link } from 'react-router-dom';

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
  const handleLogout = () => console.log('Logout');

  return optionsPerRole.map((currentOption, index) => {
    const option = currentOption[role];
    return (
      option && (
        <MenuOptionGroup key={index} title={group === 'management' ? 'Manage' : 'Account'}>
          {option[group].map((m, index) => (
            <MenuItem
              key={index}
              as={m.to && Link}
              to={m.to}
              icon={<Icon as={m.icon} w="20px" h="20px" marginTop="5px" />}
              onClick={!m.to && handleLogout}
              _hover={{
                bg: theme.colors.primaryBgHover.value,
              }}
              _active={{
                bg: theme.colors.primaryBgActive.value,
                color: theme.colors.accentSolidActive.value,
              }}
              _focus={{
                bg: theme.colors.primaryBgActive.value,
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
      to: '/profile',
      icon: CgProfile,
    },
    {
      text: 'Logout',
      icon: FiLogOut,
    },
  ],
  moderation: [
    {
      text: 'Users, artists and managers',
      to: '/m/entities',
      icon: MdGroups,
    },
    {
      text: 'Songs, albums and metadata',
      to: '/m/published-work',
      icon: MdMusicNote,
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
          to: '/m/published-work',
          icon: MdOutlineWork,
        },
      ],
    },
  },
  {
    ARTIST: {
      account: options.account,
      management: [{ text: 'Published work', to: '/m/published-work', icon: MdOutlineWork }],
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
          to: '/m/staff',
          icon: MdAdminPanelSettings,
        },
      ],
    },
  },
];
