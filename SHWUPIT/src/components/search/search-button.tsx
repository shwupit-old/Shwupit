import { Button } from "@/components/ui/button";
import { SearchIcon } from "@/components/icons/search-icon";


export default function SearchButton({
  className = 'flex',
}: {
  className?: string;
}) {

  return (
    <Button
      variant="icon"
      aria-label="Search"
      className={className}

    >
      <SearchIcon className="h-5 w-5" />
    </Button>
  );
}
