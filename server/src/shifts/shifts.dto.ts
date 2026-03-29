import { IsString, IsNotEmpty, IsDateString, IsUUID } from "class-validator";

export class CreateShiftDto {
	@IsDateString() @IsNotEmpty() start: string;
	@IsDateString() @IsNotEmpty() end: string;
	@IsString() @IsNotEmpty() trade: string;
	@IsUUID() @IsNotEmpty() workplaceId: string;
}

export class ClaimShiftDto {
	@IsUUID() @IsNotEmpty() workerId: string;
}
