import { Icon } from "@iconify/react";
import { useLogsStore } from "../../stores/useLogsStore";
import useDebounce from "../../hooks/useDebounce";
import { useEffect, useState } from "react";

export default function LogSearch() {
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const { setSearchQuery, searchQuery } = useLogsStore();

  useDebounce(localSearchQuery, { callback: setSearchQuery });
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  return (
    <div className="w-full relative">
      <Icon
        icon={"material-symbols:search"}
        className="text-2xl text-secondary absolute left-4 top-1/2 -translate-y-1/2"
      />
      <input
        type="text"
        className="border-border border bg-white w-full font-light text-xs pl-12 py-2.5 pr-3 rounded-md ring-1 ring-transparent hover:ring-black focus:ring-black outline-none transition duration-100 "
        placeholder="Search Here..."
        onChange={(e) => setLocalSearchQuery(e.target.value)}
        value={localSearchQuery}
      />
    </div>
  );
}
