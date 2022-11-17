import './App.css';
import Plot from 'react-plotly.js';
import React, { useState, useRef } from "react"
import TweetCard from 'react-tweet-card';
import ListGroup from 'react-bootstrap/ListGroup';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

// const data = [
//   { name:'This is Headline A', polarity: 0.8, subjectivity: 0.9, z: 400 },
//   { name:'This is Headline B', polarity: 0.7, subjectivity: 0.4, z: 400 },
//   { name:'This is Headline C', polarity: 0.4, subjectivity: 0.2, z: 400 },
//   { name:'This is Headline D', polarity: 0.1, subjectivity: 0.7, z: 400 },
// ];

const data = require('./data/sample_record.json');
// const PRIMARY_COLOR = "";
// const SECONDARY_COLOR = "8899a6";
// const ACCENT_COLOR = "2AA3EF";

let color = new Array(data.length).fill('2AA3EF');
let xAxis = "Polarity"
let yAxis = "Subjectivity"

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
data.forEach(function(val) {
  chart[0].x.push(val["Polarity"]);
  chart[0].y.push(val["Subjectivity"]);
});


function App() {
  const [currentData, setData] = useState(chart)
  const [activeIndex, setActiveIndex] = useState(0);
  const [figure, setFigure] = useState();
  const [revision, setRevision] = useState(0);

  let testX = currentData[0].x[activeIndex];
  let testY = currentData[0].y[activeIndex];

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
    console.log(data[ind]);
    console.log(currentData[0].marker.color[ind]);

    updateData(ind);
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

  function handleMouseOver(e) {
    let ind = e.points[0].pointIndex;
    setHoverX(currentData[0].x[ind]);
    setHoverY(currentData[0].y[ind]);
  }

  function listHover(e) {
    setHoverX(currentData[0].x[e]);
    setHoverY(currentData[0].y[e]);
  }

  function listClick(e) {
    console.log(e);
    console.log(ref.current);

    setActiveIndex(e);
    updateData(e);
    // console.log(ind);
    // console.log(data[ind]);
    // console.log(currentData[0].marker.color[ind]);
    // currentData[0].marker.color[ind] = 'green';
    // setData(currentData);
    // const allPoints = Array.from(document.querySelectorAll(".point"));
    // console.log(allPoints);
  }

  function updateData(ind) {
    currentData[0].marker.color[activeIndex] = 'grey';
    currentData[0].marker.color[ind] = 'green';
    console.log(currentData[0].marker.color)
    setActiveIndex(ind);
    setData(currentData);
    setRevision(revision+1);
    console.log(revision);
  }

  return (
    <div className='container'>
      <div className='column-1 plot'>
        <Plot
          data = {currentData}
          layout = {{
            width: 720,
            height: 720,
            dragmode : 'pan',
            hovermode: 'closest',
            xaxis: {
              title: xAxis,
              range: [-1.1, 1.1], 
              fixedrange: false,
              autotick: false,
            },
            yaxis: {
              title: yAxis,
              range: [-0.1, 1.1], 
              fixedrange:false,
              tick0: 0.5,
              autotick: false,
              zeroline: false,
            },
            shapes: [
              {
                type: 'line',
                layer: 'below',
                x0: -2,
                y0: 0.5,  
                x1: 2,
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
                x0: -8,
                y0: -8,
                x1: 8,
                y1: 8,
                line: {
                  color: 'rgba(0, 0, 0, 0.5)',
                  width: 2,
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
                likes: data[activeIndex].Likes,
                retweets: data[activeIndex].Retweets,
              }}
              author={{
                name: data[activeIndex].DisplayName,
                username: data[activeIndex].User,
                // image: data[activeIndex].ProfileURL,
                isVerified: data[activeIndex]['User Info'].protected,
              }}
              tweet={data[activeIndex].Tweet}
              time={new Date(data[activeIndex]['Date Created'])}
              source={data[activeIndex]['User Info'].location}
              permalink={data[activeIndex].URL}
              fitInsideContainer
              showDetails={false}
              showEngagement={true}
            />
            <SimpleBar className='tweetlist' scrollableNodeProps={{ ref: ref }}>
              <ListGroup variant="flush">
                {data.map((post, key) => 
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
                        image: post.ProfileURL,
                        isVerified: post['User Info'].protected,
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
