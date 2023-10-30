import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";

function SearchForm() {
    return (
        <div className="flex w-full items-center ">
            <Input
                type="search"
                placeholder="Search"
                name="search"
                className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-none rounded-none rounded-l-md"
            />
            <Button type="submit" className="rounded-l-none">
                <Search />
            </Button>
        </div>
    );
}

export default SearchForm;
