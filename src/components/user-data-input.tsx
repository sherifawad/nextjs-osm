import { InputHTMLAttributes } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

type UserDataInputProps = InputHTMLAttributes<HTMLInputElement> & {
	name: string;
};

function UserDataInput({ name, value, ...props }: UserDataInputProps) {
	return (
		<div className="grid gap-1 shadow-sm rounded-md border border-input bg-background px-3  py-2 text-sm ring-offset-background  placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
			<Label htmlFor={name} className=" text-foreground/50 capitalize">
				{name}
			</Label>
			<Input
				id={name}
				defaultValue={value}
				{...props}
				className="border-none  outline-none  focus-visible:ring-0 font-medium capitalize p-0 h-auto"
			/>
		</div>
	);
}

export default UserDataInput;
