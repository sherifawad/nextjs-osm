import { LocateFixed, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type SearchFormProps = {
    getLocationHandler?: () => void;
    showLocationButton?: boolean;
};

function SearchForm({
    getLocationHandler = () => {},
    showLocationButton = false,
}: SearchFormProps) {
    return (
        <div className="flex w-full items-center ">
            <Input
                type="search"
                placeholder="Search"
                name="search"
                className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-none rounded-none rounded-l-md"
            />
            {showLocationButton && (
                <Button
                    type="button"
                    variant={"secondary"}
                    size={"default"}
                    className="bg-background  hover:bg-background rounded-none"
                    onClick={getLocationHandler}
                >
                    <LocateFixed className="h-6 w-6 rotate-0 scale-100 transition-all hover:-rotate-90 " />
                </Button>
            )}
            <Button type="submit" className="rounded-l-none">
                <Search />
            </Button>
        </div>
    );
}

export default SearchForm;
