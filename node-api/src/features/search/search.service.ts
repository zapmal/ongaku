import { PrismaService } from '@/internal/services';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async findByQuery(query: string, entityId: number) {
    const SEARCH_LIMIT = 5;

    const artists = await this.prisma.artist.findMany({
      where: {
        OR: [
          {
            artisticName: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            band: {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
        ],
      },
      select: {
        id: true,
        artisticName: true,
        avatar: true,
        artistMetrics: {
          select: {
            followers: true,
          },
        },
        band: {
          select: {
            id: true,
            name: true,
          },
        },
        interaction: {
          where: {
            albumId: undefined,
            songId: undefined,
            userPlaylistId: undefined,
            userId: entityId,
          },
          select: {
            id: true,
            value: true,
          },
        },
      },
      take: SEARCH_LIMIT,
    });

    const playlists = await this.prisma.userPlaylist.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      include: {
        interaction: {
          where: {
            albumId: undefined,
            songId: undefined,
            artistId: undefined,
            userId: entityId,
          },
          select: {
            id: true,
            value: true,
          },
        },
        user: {
          select: {
            username: true,
          },
        },
        songsInPlaylist: {
          include: {
            song: {
              include: {
                interaction: {
                  where: {
                    albumId: undefined,
                    userPlaylistId: undefined,
                    artistId: undefined,
                    userId: entityId,
                  },
                  select: {
                    id: true,
                    value: true,
                  },
                },
                artist: {
                  select: {
                    id: true,
                    artisticName: true,
                    band: { select: { id: true, name: true } },
                  },
                },
                album: true,
              },
            },
          },
        },
      },
      take: SEARCH_LIMIT,
    });

    const albums = await this.prisma.album.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      include: {
        song: {
          include: {
            album: true,
            interaction: {
              where: { userId: entityId, value: true },
              select: {
                id: true,
                value: true,
              },
            },
            artist: {
              select: {
                id: true,
                artisticName: true,
                band: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        artist: {
          select: {
            id: true,
            artisticName: true,
            band: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      take: SEARCH_LIMIT,
    });

    const songs = await this.prisma.song.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      include: {
        interaction: {
          where: { userId: entityId, value: true },
          select: {
            id: true,
            value: true,
          },
        },
        artist: {
          select: {
            id: true,
            artisticName: true,
            band: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        album: true,
      },
      take: SEARCH_LIMIT,
    });

    return {
      artists,
      playlists,
      albums,
      songs,
    };
  }
}
