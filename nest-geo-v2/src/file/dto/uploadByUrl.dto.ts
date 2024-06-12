import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UploadByUrlDto {
  @ApiProperty({
    example:
      'https://images.radiox.co.uk/images/46391?crop=16_9&width=660&relax=1&format=webp&signature=qSH69AcydTnP-7x2bUa7fgD5edU=',
  })
  @IsNotEmpty()
  url: string;
}
