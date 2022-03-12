import { SimpleGrid, Image, Box, Text, Divider, Heading } from '@chakra-ui/react';
import React from 'react';

import { SongInQueue } from '../components';

import { Highlight } from '@/components/Utils';
import { useQueueStore } from '@/stores/useQueueStore';
import { getImage } from '@/utils/getImage';

export function Queue() {
  const store = useQueueStore();

  return (
    <>
      <SimpleGrid columns={2} align="space-evenly" position="relative" margin="20px 50px">
        <Box width="550px">
          <Image
            src={getImage(
              'album',
              store.queue.isEmpty() ? null : store.queue.getHeadNode().getData().cover,
              'default/default_album.png'
            )}
            width="inherit"
            height="420px"
            borderRadius="5px"
            sx={{ position: 'fixed', top: '80px' }}
          />
        </Box>

        <Box>
          <Text color="whiteAlpha.700" marginBottom="10px">
            <Highlight>Cola</Highlight> · {store.queue.getSize()} canciones
          </Text>
          <Divider />

          {store.queue.isEmpty() ? (
            <Box paddingBottom="100%" textAlign="center">
              <Heading fontSize="lg" margin="10px">
                La cola está vacia
              </Heading>
            </Box>
          ) : (
            <div style={{ paddingBottom: '100%' }}>
              {store.queue.toArray().map((data, index) => {
                const author = data.artist.artisticName
                  ? data.artist.artisticName
                  : data.artist.band.name;

                return (
                  <div key={index}>
                    <SongInQueue
                      // id={data.id}
                      song={data}
                      name={data.name}
                      isExplicit={data.isExplicit}
                      isPlaying={data === store.currentlyPlaying}
                      authors={`${author}${
                        data.collaborators.filter((v) => v !== '').length !== 0
                          ? `,${data.collaborators.join(',')}`
                          : ''
                      }`}
                      itemNumber={index + 1}
                    />

                    {store.queue.getSize() !== index + 1 && <Divider />}
                  </div>
                );
              })}
            </div>
          )}
        </Box>
      </SimpleGrid>
    </>
  );
}
