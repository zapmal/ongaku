import { Controller,  Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller()
export class SearchController {
  constructor(private readonly search: SearchService) {}

  @Get('search')
  async findByQuery(@Query() { query }) {
    return await this.search.findByQuery(query);
  }
}
