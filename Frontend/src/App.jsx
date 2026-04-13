import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import "./index.css"; // Asegurate de tener Tailwind importado acá o en index.css
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster position="top-right" reverseOrder={false} />
        <AppRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;
