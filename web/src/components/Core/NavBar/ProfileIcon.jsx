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
import { MdGroups, MdMusicNote, MdOutlineWork } from 'react-icons/md';
import { Link } from 'react-router-dom';

import { MENU_ITEM_PROPS } from '@/features/app';
import { theme } from '@/stitches.config.js';
import { useAuthStore } from '@/stores/useAuthStore';
import { getImage } from '@/utils/getImage';

export function ProfileIcon() {
  const entity = useAuthStore((s) => s.entity);

  return (
    <Menu isLazy>
      <MenuButton margin="10px" _hover={{ opacity: '.8' }}>
        <Avatar
          src={getImage(
            entity.role.toLowerCase(),
            null,
            entity.role === 'USER' ? 'default/default_avatar.svg' : 'default/default_avatar.png'
          )}
        >
          <AvatarBadge
            as={Badge}
            bg={theme.colors.accentSolid.value}
            color="whiteAlpha.900"
            height="20px"
            borderColor="transparent"
            width="50px"
            fontSize={entity.role === 'MANAGER' && 'xx-small'}
          >
            {entity.role === 'MODERATOR' ? 'MOD' : entity.role}
          </AvatarBadge>
        </Avatar>
      </MenuButton>
      <MenuList bg={theme.colors.primaryBase.value} marginTop="10px">
        {entity.role !== 'USER' && (
          <>
            <MenuItems group="management" entity={entity} />
            <MenuDivider />
          </>
        )}

        <MenuItems group="account" entity={entity} />
      </MenuList>
    </Menu>
  );
}

function MenuItems({ group, entity }) {
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    logout();
    window.location.assign('/');
  };

  return optionsPerRole.map((currentOption, index) => {
    const option = currentOption[entity.role];
    return (
      option && (
        <MenuOptionGroup key={index} title={group === 'management' ? 'Administrar' : 'Cuenta'}>
          {option[group].map((m, index) => (
            <MenuItem
              key={index}
              as={m.to && Link}
              to={
                m.text === 'Ver Perfil' && entity.role === 'USER'
                  ? `${m.to}user/${entity.username}`
                  : m.text === 'Ver Perfil' && entity.role === 'ARTIST'
                  ? `${m.to}artist/${entity.artisticName}`
                  : m.to
              }
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
      text: 'Ver Perfil',
      to: '/',
      icon: CgProfile,
    },
    {
      text: 'Cerrar Sesión',
      icon: FiLogOut,
    },
  ],
  moderation: [
    {
      text: 'Entidades',
      to: '/administration/entities',
      icon: MdGroups,
    },
    {
      text: 'Trabajo publicado',
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
          text: 'Trabajo del Artista',
          to: '/administration/published-work',
          icon: MdOutlineWork,
        },
      ],
    },
  },
  {
    ARTIST: {
      account: options.account,
      management: [
        { text: 'Trabajos Publicados', to: '/administration/published-work', icon: MdOutlineWork },
      ],
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
      management: [...options.moderation],
    },
  },
];
