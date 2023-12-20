import { InputHTMLAttributes } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type UserDataInputProps = {
  name: string;
  value: string;
};

function UserDataInput({ name, value }: UserDataInputProps) {
  return (
    <Card className="mx-3">
      <CardHeader className="px-4 py-2">
        <CardTitle className="text-base capitalize">{name}</CardTitle>
        <CardDescription>{value}</CardDescription>
      </CardHeader>
    </Card>
  );
}

export default UserDataInput;
