import { CheckCircle2Icon, Circle, Eye, EyeOff, Trash, Trash2 } from "lucide-react";

export const VERIFIED = [
	{
		value: true,
		label: "Verified",
		icon: CheckCircle2Icon,
	},
	{
		value: false,
		label: "Un-Verified",
		icon: Circle,
	},
];
export const DELETED = [
	{
		value: true,
		label: "Deleted",
		icon: Trash2,
	},
	{
		value: false,
		label: "Exist",
		icon: Trash,
	},
];
export const HIDDEN = [
	{
		value: true,
		label: "Hidden",
		icon: EyeOff,
	},
	{
		value: false,
		label: "Visible",
		icon: Eye,
	},
];
