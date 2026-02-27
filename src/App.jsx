import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cvselector from "./components/Cvselector.jsx";
import WorkCvForm from "./components/WorkCv.jsx";
import ScholarshipCvForm from "./components/ScholarshipCv.jsx";
function App() {
  return (
      <Routes>
        <Route path="/" element={<Cvselector />} />
        <Route path="/scholarship" element={<ScholarshipCvForm />} />
        <Route path="/work" element={<WorkCvForm />} />
      </Routes>
  );
}
export default App;