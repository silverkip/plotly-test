import './App.css';
import Plot from 'react-plotly.js';
import React, { useState, useRef } from "react"
import TweetCard from 'react-tweet-card';
import ListGroup from 'react-bootstrap/ListGroup';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import {fetchData, buildChart} from './FetchData';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import 'bootstrap/dist/css/bootstrap.min.css';

const PRIMARY_COLOR = "0060df";
const SECONDARY_COLOR = "8899a6";
const ACCENT_COLOR = "green";

// let chart = buildChart(data);

let RANGE_DICT = {
  "Polarity":[-1.1, 1.1],
  "Subjectivity": [-0.1, 1.1],
  "Followers":[0,0],
  "Retweets":[0,0],
  "Likes":[0,0],
  "Statuses":[0,0]
}

let data = require('./data/sample_record.json');
let chart = buildChart(data);

// let chart = [{
//   x: [],
//   y: [],
//   mode: 'markers',
//   type: 'scatter',
//   marker: {color: color, size:12,},
//   // selectedpoints: [1],
//   // selected: {
//   //   marker: {color:'red', size: 12, },
//   // },
//   hoverinfo: 'none',
// }];

// data.forEach(function(val) {
//   chart[0].x.push(val["Polarity"]);
//   chart[0].y.push(val["Subjectivity"]);
// });


function App() {
  const [currentData, setData] = useState(data);
  const [currentChart, setChart] = useState(chart);
  const [activeIndex, setActiveIndex] = useState(0);
  const [figure, setFigure] = useState();
  const [revision, setRevision] = useState(0);
  const [query, setQuery] = useState();
  const [xAxis, setXAxis] = useState("Polarity");
  const [yAxis, setYAxis] = useState("Subjectivity");
  const [rangeDict, setRange] = useState(RANGE_DICT);

  let testX = currentChart[0].x[activeIndex];
  let testY = currentChart[0].y[activeIndex];

  const [hoverX, setHoverX] = useState(testX);
  const [hoverY, setHoverY] = useState(testY);
  const ref = useRef();


  function handleMouseClick(e) {
    console.log(e);
  
    let ind = e.points[0].pointIndex;
    const element = document.getElementById(ind);
    // console.log(element);
    element.scrollIntoView({behavior: 'smooth'});
  
    console.log(ind);
    // console.log(data[ind]);
    console.log(currentChart[0].marker.color[ind]);

    updateChart(ind);
    // let temp = currentData[0].x
    // currentData[0].x = currentData[0].y
    // currentData[0].y = temp

    // currentData[0].marker.color[activeIndex] = 'grey';
    // currentData[0].marker.color[ind] = 'green';
    // console.log(currentData[0].marker.color)
    // setActiveIndex(ind);
    // setData(currentData);
    // setRevision(revision+1);
    // console.log(revision);

    // const allPoints = Array.from(document.querySelectorAll(".point"));
    // console.log(allPoints);
    // console.log(data[ind])
  }

  function updateMax(newData) {
    let statusmax = 0;
    let followersmax = 0;
    let likesmax = 0;
    let rtmax = 0;

    for (var i=0; i<newData.length; i++) {
      statusmax = newData[i]['Statuses'] > statusmax ? newData[i]['Statuses'] : statusmax;
      followersmax = newData[i]['Followers'] > followersmax ?  newData[i]['Followers'] : followersmax;
      likesmax = newData[i]['Likes'] > likesmax ?  newData[i]['Likes'] : likesmax;
      rtmax = newData[i]['Retweets'] > rtmax ?  newData[i]['Retweets'] : rtmax;
    };
    rangeDict['Followers'] = [0, followersmax];
    rangeDict['Statuses'] = [0, statusmax];
    rangeDict['Likes'] = [0, likesmax];
    rangeDict['Retweets'] = [0, rtmax];
    setRange(rangeDict);
  }

  function handleMouseOver(e) {
    let ind = e.points[0].pointIndex;
    setHoverX(currentChart[0].x[ind]);
    setHoverY(currentChart[0].y[ind]);
  }

  function listHover(e) {
    setHoverX(currentChart[0].x[e]);
    setHoverY(currentChart[0].y[e]);
  }

  function listClick(e) {
    // console.log(e);
    // console.log(ref.current);

    setActiveIndex(e);
    updateChart(e);
    // console.log(ind);
    // console.log(data[ind]);
    // console.log(currentData[0].marker.color[ind]);
    // currentData[0].marker.color[ind] = 'green';
    // setData(currentData);
    // const allPoints = Array.from(document.querySelectorAll(".point"));
    // console.log(allPoints);
  }

  function updateData(e) {
    console.log(e);
    let search_query = String(e);
    fetchData(search_query).then(function(data) {
      setData(data);
      setChart(buildChart(data));
      updateMax(data);
      setActiveIndex(0);
      setRevision(revision+1);
    });
    console.log(RANGE_DICT);
    console.log(currentData[0]);
  }

  function changeXAxis(x) {
    setXAxis(x);
    setChart(buildChart(currentData, xAxis, yAxis));
    console.log(xAxis);
    console.log(currentChart);
    console.log(currentData);
    setRevision(revision+1);
  }

  function changeYAxis(y) {
    setYAxis(y);
    setChart(buildChart(currentData, xAxis, yAxis));
    console.log(yAxis);
    console.log(currentChart);
    console.log(currentData);
    setRevision(revision+1);
  }

  function updateChart(ind) {
    currentChart[0].marker.color[activeIndex] = SECONDARY_COLOR;
    currentChart[0].marker.color[ind] = ACCENT_COLOR;
    // console.log(currentChart[0].marker.color)
    setActiveIndex(ind);
    setChart(currentChart);
    setRevision(revision+1);
    // console.log(revision);
  }

  return (
    <div className='container'>
      <div className='column-1'>
        <InputGroup className="mt-1 mb-0 search-bar">
          <Form.Control
            placeholder="Keyword"
            aria-label="Keyword"
            aria-describedby="basic-addon1"
            onChange={event => {
              setQuery(event.target.value);
            }} 
            value={query ? query : ""}
          />
          <Button variant="outline-secondary" id="button-addon1" onClick={() => updateData(query)}>
            Search
          </Button>
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroup.Text>X-Axis</InputGroup.Text>
          <Form.Select aria-label="Default select example"
            onChange={event => {
              changeXAxis(event.target.value);
            }}
          >
            <option value="Polarity" selected>Polarity</option>
            <option value="Followers">Followers</option>
            <option value="Retweets">Retweets</option>
            <option value="Likes">Likes</option>
            <option value="Statuses">Total Posts</option>
            <option value="Subjectivity">Subjectivity</option>
          </Form.Select>
          <InputGroup.Text>Y-Axis</InputGroup.Text>
          <Form.Select aria-label="Default select example"
            onChange={event => {
              console.log(event.target.value);
            }}
          >
            <option value="Subjectivity" selected>Subjectivity</option>
            <option value="Followers">Followers</option>
            <option value="Retweets">Retweets</option>
            <option value="Likes">Likes</option>
            <option value="Statuses">Total Posts</option>
            <option value="Polarity">Polarity</option>
          </Form.Select>
        </InputGroup>

        <Plot
          data = {currentChart}
          layout = {{
            width: 720,
            height: 720,
            dragmode : 'pan',
            hovermode: 'closest',
            xaxis: {
              title: xAxis,
              range: rangeDict[xAxis],
              autotick: false,
              showgrid: false,
            },
            yaxis: {
              title: yAxis,
              range: rangeDict[yAxis],
              autotick: false,
              zeroline: false,
              showgrid: false,
            },
            shapes: [
              {
                type: 'line',
                layer: 'below',
                x0: -100,
                y0: 0.5,  
                x1: 100,
                y1: 0.5,
                line: {
                  color: 'rgb(0, 0, 0)',
                  width: 1
                }
              },
              {
                type: 'circle',
                xref: 'x',
                yref: 'y',
                xsizemode: 'pixel',
                ysizemode: 'pixel',
                xanchor: hoverX,
                yanchor: hoverY,
                x0: -9,
                y0: -9,
                x1: 9,
                y1: 9,
                line: {
                  color: 'rgba(0, 0, 0, 0.7)',
                  width: 2.5,
                }
              },
            ],
            clickmode: 'event',
            uirevision: true,
            datarevision: {revision}
          }}
          config={{
            displayModeBar: false,
            scrollZoom: true,
            doubleClick: 'reset',
            responsive: true,
          }}
          onClick={handleMouseClick}
          onHover={handleMouseOver}
          // onUpdate={(figure) => setFigure(figure)}
        />
      </div>

      <div className='column-2 content'>
      {/* <p>{`${data[activeIndex].Tweet}`}</p> */}
        {
          <div>
            <TweetCard
              className='tweetviewer'
              theme='dim'
              emojis={false}
              engagement={{
                likes: currentData[activeIndex].Likes,
                retweets: currentData[activeIndex].Retweets,
              }}
              author={{
                name: currentData[activeIndex].DisplayName,
                username: currentData[activeIndex].User,
                // image: data[activeIndex].ProfileURL,
                isVerified: currentData[activeIndex]['User Info'].protected,
              }}
              tweet={currentData[activeIndex].Tweet}
              time={new Date(currentData[activeIndex]['Date Created'])}
              source={currentData[activeIndex]['User Info'].location}
              permalink={currentData[activeIndex].URL}
              fitInsideContainer
              showDetails={false}
              showEngagement={true}
            />
            <SimpleBar className='tweetlist' scrollableNodeProps={{ ref: ref }}>
              <ListGroup variant="flush">
                {currentData.map((post, key) => 
                  // <Post postData={post} key={post.id}/>
                  <ListGroup.Item action onClick={() => listClick(key)} onMouseOver={() => listHover(key)} key={key} id={key}>
                    <TweetCard
                      theme='light'
                      emojis={false}
                      engagement={{
                        likes: post.Likes,
                        retweets: post.Retweets,
                      }}
                      author={{
                        name: post.DisplayName,
                        username: post.User,
                        // image: post.ProfileURL,
                        isVerified: post['User Info'].verified,
                      }}
                      tweet={post.Tweet}
                      time={new Date(post['Date Created'])}
                      source={post['User Info'].location}
                      permalink={post.URL}
                      // fitInsideContainer
                      showDetails={false}
                      showEngagement={false}
                    />
                  </ListGroup.Item>
                )}

              </ListGroup>
            </SimpleBar>
          </div>
        }
      </div>
      
    </div> 
  );
}

export default App;
