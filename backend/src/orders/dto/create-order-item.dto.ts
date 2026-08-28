import { IsInt, IsPositive } from 'class-validator';

export class CreateOrderItemDto {
  @IsInt()
  @IsPositive()
  menuItemId: number;

  @IsInt()
  @IsPositive()
  quantity: number;
}
