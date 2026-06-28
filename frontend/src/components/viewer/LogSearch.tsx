import { Icon } from "@iconify/react";
import useDebounce from "../../hooks/useDebounce";
import { useEffect, useState } from "react";
import { useLogsFilterStore } from "@/stores/useLogsFilterStore";

export default function LogSearch() {
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const { setSearchQuery, searchQuery } = useLogsFilterStore();

  useDebounce(localSearchQuery, { callback: setSearchQuery });
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  return (
    <div className="w-full relative">
      <Icon
        icon={"material-symbols:search"}
        className="text-xl text-secondary absolute left-4 top-1/2 -translate-y-1/2"
      />
      <input
        type="text"
        className="border-border border bg-background w-full font-light text-xs pl-11 py-2.5 pr-3 rounded-md ring-1 ring-transparent hover:ring-primary focus:ring-primary outline-none transition duration-100 text-secondary"
        placeholder="Search Here..."
        onChange={(e) => setLocalSearchQuery(e.target.value)}
        value={localSearchQuery}
      />
    </div>
  );
}
