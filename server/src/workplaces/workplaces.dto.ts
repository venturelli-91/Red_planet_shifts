import { IsString, IsNotEmpty } from "class-validator";

export class CreateWorkplaceDto {
	@IsString() @IsNotEmpty() name: string;
	@IsString() @IsNotEmpty() address: string;
}
