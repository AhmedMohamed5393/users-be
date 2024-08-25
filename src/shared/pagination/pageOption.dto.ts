import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { OrderEnum } from '../enums/order.enum';

export class PageOptionsDto {
  @IsEnum(OrderEnum)
  @IsOptional()
  readonly order?: string = OrderEnum.ASC;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  readonly take?: number = 10;

  @IsOptional()
  readonly search?: string;
  
  @IsOptional()
  @IsDateString()
  readonly fromDate?: string;
  
  @IsOptional()
  @IsDateString()
  readonly toDate?: string;

  @IsOptional()
  readonly is_email_verified?: boolean;
  
  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
