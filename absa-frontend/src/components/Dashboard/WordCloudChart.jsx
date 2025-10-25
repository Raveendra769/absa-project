import React, { useEffect, useState } from "react";
import { WordCloud } from "@ant-design/plots";
import axios from "axios";


const WordCloudChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/dashboard/top-keywords")
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  const config = {
    data,
    wordField: "text",
    weightField: "value",
    colorField: "text",
    wordStyle: {
      rotation: 0,
    },
  };

  return (
    <div className="bg-white shadow p-4 rounded">
      <h2 className="text-xl font-semibold mb-4">Top Keywords</h2>
      <WordCloud {...config} />
    </div>
  );
};

export default WordCloudChart;
