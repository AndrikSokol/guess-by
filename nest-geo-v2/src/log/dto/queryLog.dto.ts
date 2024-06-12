import { ApiProperty } from '@nestjs/swagger';

export class QueryLogDto {
  @ApiProperty({ example: 'SQL' })
  context: string;
}
