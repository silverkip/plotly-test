import axios from "axios";

const PRIMARY_COLOR = "0060df";



export async function fetchData(query) {

  // const getData = async () => {
  //   const response = await axios.post('http://localhost:5000/search', {
  //     'data': query
  //   });
  // };

  const response = await axios.post('http://localhost:5000/search', {
    'data': query
  });
  // console.log(response.data);
  return await JSON.parse(JSON.stringify(response.data));
}

export function buildChart(data, x = "Polarity", y = "Subjectivity") {
  let color = new Array(data.length).fill(PRIMARY_COLOR);

  let chart = [{
    x: [],
    y: [],
    mode: 'markers',
    type: 'scatter',
    marker: {color: color, size:12,},
    // selectedpoints: [1],
    // selected: {
    //   marker: {color:'red', size: 12, },
    // },
    hoverinfo: 'none',
  }];

  for (var i=0; i<data.length; i++) {
    chart[0].x.push(data[i][x]);
    chart[0].y.push(data[i][y]);
  }
    
  // data.forEach(function(val) {
  //   chart[0].x.push(val[x]);
  //   chart[0].y.push(val[y]);
  // });
  return chart;
}