import AppRoutes from "./routes/AppRoutes";
import "./index.css"; // Asegurate de tener Tailwind importado acá o en index.css
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <AppRoutes />
    </>
  );
}

export default App;
