import {
  Box,
  Image,
  Heading,
  Text,
  Button,
  Flex,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useState } from 'react';

import { Option, EditEntity, EditEntityMetadata } from '../components';
import { TABLE_PROPS, TABLE_ROW_PROPS, SUB_HEADER_MARGIN } from '../constants';

import { Footer } from '@/components/Core';
import { ENTITIES, ENTITIES_METADATA } from '@/features/app';
import { theme } from '@/stitches.config.js';

export function Entities() {
  const [selectedRole, setRole] = useState('USER');
  // king of verbosity
  const {
    isOpen: isEntityEditOpen,
    onClose: onEntityEditClose,
    onOpen: onEntityEditOpen,
  } = useDisclosure();
  const {
    isOpen: isEntityMetadataEditOpen,
    onClose: onEntityMetadataEditClose,
    onOpen: onEntityMetadataEditOpen,
  } = useDisclosure();

  return (
    <>
      <Box paddingTop="10px">
        <Box margin="0px 20px" textAlign="center">
          <Heading>Administración de Entidades</Heading>
          <Text color="whiteAlpha.800" marginTop="10px">
            Las acciones realizadas en esta página son irreversibles, tomelo en cuenta al hacer
            alguna.
          </Text>

          <Flex justify="center" gap="10px" marginTop="20px">
            <Text fontSize="lg" marginRight="10px" color="whiteAlpha.800">
              Filtra por rol:
            </Text>
            {buttons.map(({ role }, index) => (
              <Button
                key={index}
                variant="outline"
                borderColor={selectedRole === role && 'transparent'}
                size="sm"
                backgroundColor={selectedRole === role && theme.colors.accentSolid.value}
                onClick={() => setRole(role)}
                _hover={{
                  backgroundColor: theme.colors.accentSolid.value,
                }}
                _active={{
                  backgroundColor: theme.colors.accentSolidActive.value,
                }}
              >
                {role}
              </Button>
            ))}
          </Flex>
        </Box>

        <Table {...TABLE_PROPS}>
          <Thead color={theme.colors.accentText.value}>
            <Tr>
              <Th color="inherit">id</Th>
              <Th color="inherit">Avatar</Th>
              <Th color="inherit">Email</Th>
              <Th color="inherit">Nombre de Usuario</Th>
              <Th color="inherit">Nombre</Th>
              <Th color="inherit">Fecha de Nacimiento</Th>
              <Th color="inherit">Opciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {ENTITIES.map((entity, index) => (
              <Tr key={index} {...TABLE_ROW_PROPS}>
                <Td>{entity.id}</Td>
                <Td>
                  <Image src={entity.avatar} w="50px" h="50px" borderRadius="5px" />
                </Td>
                <Td>{entity.email}</Td>
                <Td>{entity.username}</Td>
                <Td>{entity.fullName}</Td>
                <Td>{entity.birthdate}</Td>
                <Td>
                  <Option type="edit" onClick={onEntityEditOpen} />
                  <Option type="delete" />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {selectedRole === 'USER' && (
          <>
            <Heading margin={SUB_HEADER_MARGIN} textAlign="center">
              Administración de metadatos
            </Heading>
            <Table {...TABLE_PROPS}>
              <Thead color={theme.colors.accentText.value}>
                <Tr>
                  <Th color="inherit">Fecha de creación</Th>
                  <Th color="inherit">Fecha de actualziación</Th>
                  <Th color="inherit">Activo</Th>
                  <Th color="inherit">Dirección IP</Th>
                  <Th color="inherit">Correo Verificado</Th>
                  <Th color="inherit">ID del Usuario</Th>
                  <Th color="inherit">Opciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {ENTITIES_METADATA.map((metadata, index) => (
                  <Tr key={index} {...TABLE_ROW_PROPS}>
                    <Td>{metadata.createdAt}</Td>
                    <Td>{metadata.updatedAt}</Td>
                    <Td>{metadata.active ? 'Sí' : 'No'}</Td>
                    <Td>{metadata.ipAddress}</Td>
                    <Td>{metadata.verifiedEmail ? 'Sí' : 'No'}</Td>
                    <Td>{metadata.userId}</Td>
                    <Td>
                      <Option type="edit" onClick={onEntityMetadataEditOpen} />
                      <Option type="delete" />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </>
        )}

        <Footer topMargin="30px" />
      </Box>
      {isEntityEditOpen && <EditEntity isOpen={isEntityEditOpen} onClose={onEntityEditClose} />}
      {isEntityMetadataEditOpen && (
        <EditEntityMetadata isOpen={isEntityMetadataEditOpen} onClose={onEntityMetadataEditClose} />
      )}
    </>
  );
}

const buttons = [
  {
    role: 'USER',
  },
  {
    role: 'ADMIN',
  },
  {
    role: 'ARTIST',
  },
];
