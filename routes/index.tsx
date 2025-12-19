import { useSignal } from "@preact/signals";
import SearchBar from "../islands/SearchBar.tsx";
import { define } from "../utils.ts";

export default define.page(function Home() {
  const count = useSignal(3);

  return (
    <div class="p-4 h-screen w-screen flex flex-col overflow-auto">
      <SearchBar/>
    </div>
  );
});
