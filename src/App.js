import React, { useState } from "react";
import TreeChart from "./TreeChart"
import "./App.css";

const initialData = {
  name: "😐",
  children: [
    {
      name: "🙂",
      children: [
        {
          name: "😀"
        },
        {
          name: "😁"
        },
        {
          name: "🤣"
        }
      ]
    },
    {
      name: "😔"
    }
  ]
}

function App() {
  const [data, setData] = useState(initialData)

  return <React.Fragment>
    <TreeChart data={data}/>
    <br/>
    <button onClick={() => setData(initialData.children[0])}>Update Data</button>
    </React.Fragment>;
}

export default App;
