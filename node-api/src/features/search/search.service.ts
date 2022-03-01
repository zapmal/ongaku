import { PrismaService } from '@/internal/services';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async findByQuery(query: string) {
    const SEARCH_LIMIT = 5;

    const artists = await this.prisma.artist.findMany({
      where: {
        OR: [
          {
            artisticName: {
              contains: query,
            },
          },
          {
            band: {
              name: {
                contains: query,
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
            name: true,
          },
        },
      },
      take: SEARCH_LIMIT,
    });

    const playlists = await this.prisma.userPlaylist.findMany({
      where: {
        name: {
          contains: query,
        },
      },
      take: SEARCH_LIMIT,
    });

    return {
      artists,
      playlists,
    };
  }
}
