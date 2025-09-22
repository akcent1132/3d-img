import "./App.css";

import Card3D from "./Card3D";
import React from "react";

function App() {
  return (
    <div className="app__container">
      <Card3D
        imageSrc="https://www.osh.by/wp-content/uploads/2023/12/1041436899_0_206_2905_1840_1920x0_80_0_0_c7022893b761781d76fe592010d14bd2.jpg"
        className="app__card"
      />
    </div>
  );
}

export default App;
