/* eslint-disable no-unused-vars */
import {
  Box,
  Image,
  Heading,
  Flex,
  Spacer,
  Text,
  IconButton,
  Icon,
  Tooltip,
  Badge,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { IoMdCheckmark } from 'react-icons/io';
import { MdAdd } from 'react-icons/md';
import { useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';

import { followArtist } from '../../api/artist';
import { FADE_OUT_ANIMATION } from '../../constants';
import { useHover } from '../../hooks/useHover';

import { Link as CustomLink } from '@/components/Elements';
import { theme } from '@/stitches.config.js';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { getLink } from '@/utils/getLink';

const sizes = {
  sm: {
    top: '80px',
    boxHeight: '250px',
    width: '200px',
    height: '200px',
    borderRadius: '10px',
  },
  lg: {
    top: '100px',
    margin: '10px',
    width: '250px',
    height: '250px',
    borderRadius: '50%',
  },
};

export function ArtistCard({
  avatar,
  name,
  amountOfFollowers,
  isHighlighted,
  artistId,
  isFollowed = false,
  size = 'lg',
  badge = true,
}) {
  const entity = useAuthStore((s) => s.entity);

  const [isHovered, mouseEventsHandlers] = useHover();
  const [followed, setFollowed] = useState(isFollowed);
  const [_, artistLink] = getLink(name, name);

  return (
    <Box
      margin={sizes[size].margin}
      height={sizes[size].boxHeight}
      marginRight="15px"
      textAlign="center"
      position="relative"
    >
      <Image
        src={avatar}
        width={sizes[size].width}
        height={sizes[size].height}
        borderRadius={sizes[size].borderRadius}
        opacity={isHovered && size !== 'lg' && 0.6}
        transition="opacity 300ms ease-in-out"
        objectFit="cover"
        {...mouseEventsHandlers}
      />
      {isHovered && size !== 'lg' && (
        <Box animation={FADE_OUT_ANIMATION}>
          {hoverButtons.map((button, index) => {
            if (button.text === 'Seguir' && entity.role === 'ARTIST') {
              return null;
            }

            return (
              <HoverButton
                key={index}
                button={button}
                to={artistLink}
                mouseEventsHandlers={mouseEventsHandlers}
                size={size}
                isFollowed={followed}
                artistId={artistId}
                entityId={entity.id}
              />
            );
          })}
        </Box>
      )}
      {size === 'lg' ? (
        <>
          <Heading
            color={isHighlighted && theme.colors.accentText.value}
            as={CustomLink}
            to={`/artist/${artistLink}`}
            underline={false}
            fontSize="3xl"
          >
            {name}
          </Heading>
          <Text color="whiteAlpha.800">{amountOfFollowers} seguidores</Text>
        </>
      ) : (
        <>
          <Flex align="center">
            <Text fontWeight="bold">{name}</Text>
            <Spacer />
            {badge && (
              <Badge bg={theme.colors.accentSolid.value} color="whiteAlpha.900" height="100%">
                ARTISTA
              </Badge>
            )}
          </Flex>
          <Text color="whiteAlpha.700" fontSize="sm" textAlign="left">
            {amountOfFollowers === 1 ? '1 seguidor' : `${amountOfFollowers} seguidores`}
          </Text>
        </>
      )}
    </Box>
  );
}

const hoverButtons = [
  {
    icon: MdAdd,
    altIcon: IoMdCheckmark,
    text: 'Seguir',
    altText: 'Dejar de seguir',
    position: {
      right: '40px',
    },
  },
  {
    icon: HiOutlineExternalLink,
    text: 'Ir a Página',
    position: {
      left: '40px',
    },
  },
];

function HoverButton({ button, size, to, isFollowed, artistId, entityId, mouseEventsHandlers }) {
  const goToPageProps = to && button.text.includes('Página') && { as: Link, to: `/artist/${to}` };
  const icon = button.altIcon && isFollowed ? button.altIcon : button.icon;
  const text = button.altText && isFollowed ? button.altText : button.text;

  const addNotification = useNotificationStore((s) => s.addNotification);

  const queryClient = useQueryClient();
  const mutation = useMutation(followArtist, {
    onSuccess: () => queryClient.invalidateQueries('library-artists'),
  });

  const handleOnClick = async () => {
    try {
      if (entityId === artistId) {
        addNotification({
          title: 'Error',
          status: 'error',
          message: 'No te puedes seguir a ti mismo',
        });
      } else {
        await mutation.mutateAsync({ artistId });
      }
    } catch (error) {
      console.log('Error al cambiar el seguimiento del artista', error);
    }
  };

  return (
    <Tooltip label={text}>
      <IconButton
        position="absolute"
        top={sizes[size].top}
        onClick={button.altIcon === IoMdCheckmark ? handleOnClick : () => {}}
        {...goToPageProps}
        {...button.position}
        variant={button.variant}
        width="50px"
        height="50px"
        icon={<Icon as={icon} w="35px" h="35px" />}
        backgroundColor="transparent"
        _hover={{
          color: 'whiteAlpha.800',
        }}
        _active={{
          color: theme.colors.accentSolidActive.value,
        }}
        {...mouseEventsHandlers}
      />
    </Tooltip>
  );
}
