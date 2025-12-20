import { useSignal } from "@preact/signals";
import SearchBar from "../islands/SearchBar.tsx";
import TermSelector from "../islands/TermSelector.tsx";
import CourseModal from "../islands/CourseModal.tsx";
import Box from "../components/Box.tsx"
import { define } from "../utils.ts";
import { getTerms } from "../services/db.ts";

export default define.page(async function Home() {
  // Fetch terms from DB
  const terms = await getTerms()

  return (
    <div>
        <CourseModal/>
        <div class="px-4 py-6 w-2xl max-w-full flex flex-col mx-auto gap-2">
        <Box title="Select Your Term">
          <TermSelector terms={terms}/>
        </Box>
        <Box title="Find Courses">
          <SearchBar/>
        </Box>
      </div>
    </div>
  );
});