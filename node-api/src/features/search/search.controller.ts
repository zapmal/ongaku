import { Role } from '@/internal/constants';
import { RoleGuard } from '@/internal/guards';
import { RequestWithEntity } from '@/internal/interfaces';
import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller()
@UseGuards(RoleGuard([Role.USER, Role.ADMIN, Role.ARTIST]))
export class SearchController {
  constructor(private readonly search: SearchService) {}

  @Get('search')
  async findByQuery(@Query() { query }, @Req() request: RequestWithEntity) {
    return await this.search.findByQuery(query, Number(request.entity.id));
  }
}
