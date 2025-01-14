import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ViewTree from "./pages/ViewTree";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/show-tree" element={<ViewTree />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
