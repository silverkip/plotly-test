import axios from "axios";

const PRIMARY_COLOR = "0060df";



export async function fetchData(query) {

  // const getData = async () => {
  //   const response = await axios.post('http://localhost:5000/search', {
  //     'data': query
  //   });
  // };

  // Production

  // const response = await axios.post('/search', {
  //   'data': query
  // }, {headers: {
  //   "Content-Type": "application/json"}
  // });

  // Test

  const response = await axios.post('http://localhost:5000/search', {
    'data': query
  }, {headers: {
    "Content-Type": "application/json"}
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
    customdata: [],
    // selectedpoints: [1],
    // selected: {
    //   marker: {color:'red', size: 12, },
    // },

    hoverinfo: 'none',

    // hovertemplate: '%{customdata}',
    // hoverinfo: 'text',
  }];

  for (var i=0; i<data.length; i++) {
    chart[0].x.push(data[i][x]);
    chart[0].y.push(data[i][y]);
    // let subj = "";
    // let sent = "";
    // if(data[i].Polarity === 0) {
    //   sent = "Neutral";
    // } else if(data[i].Polarity > 0) {
    //   sent = "Positive";
    // } else if(data[i].Polarity < 0) {
    //   sent = "Negative";
    // };
    // if(data[i].Subjectivity > 0.5) {
    //   subj = "Subjective";
    // } else if(data[i].Subjectivity < 0.5) {
    //   subj = "Objective";
    // };
    // let customTemplate = 
    //   "This tweet is " + sent + " and " + subj +
    //   "<extra></extra>";
    // chart[0].customdata.push(customTemplate);
  }
    
  // data.forEach(function(val) {
  //   chart[0].x.push(val[x]);
  //   chart[0].y.push(val[y]);
  // });
  return chart;
}

export function buildBarChart(data, x = "Polarity", y = "Subjectivity") {
  let color = new Array(data.length).fill(PRIMARY_COLOR);

  let chart = [{
    x: [],
    y: [],
    customdata: [],
    mode: 'markers',
    type: 'bar',
    marker: {color: color, size:12,},
    transforms: [{
      type: 'sort',
      target: 'y',
      order: 'descending',
    }],
    // selectedpoints: [1],
    // selected: {
    //   marker: {color:'red', size: 12, },
    // },
    // hoverinfo: 'none',
    hovertemplate: '%{customdata}',
    hoverinfo: 'text',
  }];

  for (var i=0; i<data.length; i++) {
    chart[0].x.push(data[i][x]);
    chart[0].y.push(data[i][y]);
    let customTemplate = 
      "<b>Tweet By: "+ data[i].DisplayName + "</b><br>" +
      "Likes: " + data[i].Likes + "<br><br>" +
      "Polarity: " + data[i].Polarity + "<br>" +
      "Subjectivity: " + data[i].Subjectivity + "<br>" +
      "<extra></extra>";
    chart[0].customdata.push(customTemplate);
  }
    
  // data.forEach(function(val) {
  //   chart[0].x.push(val[x]);
  //   chart[0].y.push(val[y]);
  // });
  return chart;
}

export function buildBarChart2(data, x = "Polarity", y = "Subjectivity") {
  let color = new Array(data.length).fill(PRIMARY_COLOR);

  let chart = [{
    x: [],
    y: [],
    customdata: [],
    mode: 'markers',
    type: 'bar',
    marker: {color: color, size:12,},
    transforms: [{
      type: 'sort',
      target: 'y',
      order: 'descending',
    }],
    // selectedpoints: [1],
    // selected: {
    //   marker: {color:'red', size: 12, },
    // },
    // hoverinfo: 'none',
    hovertemplate: '%{customdata}',
    hoverinfo: 'text',
  }];

  for (var i=0; i<data.length; i++) {
    chart[0].x.push(data[i][x]);
    chart[0].y.push(data[i][y]);
    let customTemplate = 
      "<b>Tweet By: "+ data[i].DisplayName + "</b><br>" +
      "Followers: " + data[i].Followers + "<br><br>" +
      "Polarity: " + data[i].Polarity + "<br>" +
      "Subjectivity: " + data[i].Subjectivity + "<br>" +
      "<extra></extra>";
    chart[0].customdata.push(customTemplate);
  }
    
  // data.forEach(function(val) {
  //   chart[0].x.push(val[x]);
  //   chart[0].y.push(val[y]);
  // });
  return chart;
}

// const resultsByObjectId = sortByProperty(results, 'attributes.OBJECTID');
// const resultsByObjectIdDescending = sortByProperty(results, 'attributes.OBJECTID', -1);