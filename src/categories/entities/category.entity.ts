import { ApiProperty } from "@nestjs/swagger";

export class CategoryEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}
