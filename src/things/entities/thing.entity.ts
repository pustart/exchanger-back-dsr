import { Thing } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class ThingEntity implements Thing {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  photo: string;

  @ApiProperty()
  authorId: string;

  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  exchangeCategoryId: string;
}
