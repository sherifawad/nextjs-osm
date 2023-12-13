import { z } from "zod";

export const GetAccountBlockStatusSchema = z.object({
	provider: z.string().min(1),
	providerAccountId: z.string().min(1),
});

export type GetAccountBlockStatus = z.infer<typeof GetAccountBlockStatusSchema>;

/////////////////////////////////////////
//FETCH ACCOUNT BLOCKED SCHEMA VALIDATION OUTPUT
/////////////////////////////////////////

const AccountBlockStatusErrorsSchema = GetAccountBlockStatusSchema.merge(
	z.object({
		serverError: z.string(),
	})
);

type AccountBlockStatusDataErrors = {
	[key in keyof z.infer<typeof AccountBlockStatusErrorsSchema>]: string;
};

type AccountBlockStatusSuccessResponse = { status: "success"; data: boolean };
type AccountBlockStatusErrorResponse = { status: "error"; errors: Partial<AccountBlockStatusDataErrors> };

export type AccountBlockStatusResponse = AccountBlockStatusErrorResponse | AccountBlockStatusSuccessResponse;
