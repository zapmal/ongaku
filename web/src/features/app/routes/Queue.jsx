import { SimpleGrid, Image, Box, Text, Divider, Heading } from '@chakra-ui/react';
import React, { useState } from 'react';

import { SongInQueue } from '../components';

import { Highlight } from '@/components/Utils';
import { useQueueStore } from '@/stores/useQueueStore';

export function Queue() {
  const queue = useQueueStore((s) => s.queue);

  return (
    <>
      <SimpleGrid columns={2} align="space-evenly" position="relative" margin="20px 50px">
        <Box width="550px">
          <Image
            src="/assets/images/static-arknights-race.jpeg"
            width="inherit"
            height="420px"
            borderRadius="5px"
            sx={{ position: 'fixed', top: '80px' }}
          />
        </Box>

        <Box>
          <Text color="whiteAlpha.700" marginBottom="10px">
            <Highlight>Cola</Highlight> · {queue.getSize()} canciones
          </Text>
          <Divider />

          {queue.isEmpty() ? (
            <Box paddingBottom="100%" textAlign="center">
              <Heading fontSize="lg" margin="10px">
                La cola está vacia
              </Heading>
            </Box>
          ) : (
            <div style={{ paddingBottom: '100%' }}>
              {queue.toArray().map((data, index) => {
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
                      isPlaying={index === 0}
                      authors={`${author}${
                        data.collaborators.filter((v) => v !== '').length !== 0
                          ? `,${data.collaborators.join(',')}`
                          : ''
                      }`}
                      itemNumber={index + 1}
                    />

                    {queue.getSize() !== index + 1 && <Divider />}
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
