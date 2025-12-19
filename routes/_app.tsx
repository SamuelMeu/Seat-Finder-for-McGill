import { PageProps } from "fresh";
import { define } from "../utils.ts";
import TopBar from "../components/TopBar.tsx";

export default define.page(function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Seat Finder for McGill</title>
      </head>
      <body class="bg-gray-100">
        <TopBar />
        <Component />
      </body>
    </html>
  );
});
