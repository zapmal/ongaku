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

import { MENU_ITEM_PROPS } from '@/features/app';
import { theme } from '@/stitches.config.js';
import { useAuthStore } from '@/stores/useAuthStore';

export function ProfileIcon() {
  const { role = {} } = useAuthStore((s) => s.entity);

  return (
    <Menu isLazy>
      <MenuButton margin="10px" _hover={{ opacity: '.8' }}>
        <Avatar src="/assets/images/static-admin-avatar.jpeg">
          <AvatarBadge
            as={Badge}
            bg={theme.colors.accentSolid.value}
            color="whiteAlpha.900"
            height="20px"
            borderColor="transparent"
            width="50px"
            fontSize={role === 'MANAGER' && 'xx-small'}
          >
            {role === 'MODERATOR' ? 'MOD' : role}
          </AvatarBadge>
        </Avatar>
      </MenuButton>
      <MenuList bg={theme.colors.primaryBase.value} marginTop="10px">
        {role !== 'USER' && (
          <>
            <MenuItems group="management" role={role} />
            <MenuDivider />
          </>
        )}

        <MenuItems group="account" role={role} />
      </MenuList>
    </Menu>
  );
}

function MenuItems({ group, role }) {
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    logout();
    window.location.assign('/');
  };

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
              {...MENU_ITEM_PROPS}
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
      to: '/user/zapmal',
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
      to: '/administration/entities',
      icon: MdGroups,
    },
    {
      text: 'Songs, albums and metadata',
      to: '/administration/published-work',
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
        // {
        //   text: 'Ongaku Staff',
        //   to: '/administration/staff',
        //   icon: MdAdminPanelSettings,
        // },
      ],
    },
  },
];
