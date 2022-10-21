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
let color = new Array(data.length).fill('red');

let chart = [{
  x: [],
  y: [],
  mode: 'markers',
  type: 'scatter',
  marker: {color: color, size:12},
  selected: {
    marker: {color:'blue', size: 12, line: {width: 2, color:'grey'}}
  },
  hoverinfo: 'none'
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
  const ref = useRef();

  function handleMouseClick(e) {
    console.log(e);
    
    // console.log(ind);
    // console.log(data[ind]);
    // console.log(currentData[0].marker.color[ind]);
    // currentData[0].marker.color[ind] = 'green';
    // setData(currentData);
    // const allPoints = Array.from(document.querySelectorAll(".point"));
    // console.log(allPoints);

    let ind = e.points[0].pointIndex;
    const element = document.getElementById(ind);
    // console.log(element);
    element.scrollIntoView({behavior: 'smooth'});
    setActiveIndex(ind);
    // console.log(data[ind])
  }

  function listClick(e) {
    // console.log('poggers');
    console.log(e);
    setActiveIndex(e);
    console.log(ref.current);
    // console.log(ind);
    // console.log(data[ind]);
    // console.log(currentData[0].marker.color[ind]);
    // currentData[0].marker.color[ind] = 'green';
    // setData(currentData);
    // const allPoints = Array.from(document.querySelectorAll(".point"));
    // console.log(allPoints);
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
            xaxis: {range: [-1.1, 1.1], fixedrange: false},
            yaxis: {range: [-0.1, 1.1], fixedrange:false},
            clickmode: 'select+event',
          }}
          config={{
            displayModeBar: false,
            scrollZoom: true,
            doubleClick: 'reset',
            responsive: true,
          }}
          onClick={handleMouseClick}
          revision={revision}
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
                image: data[activeIndex].ProfileURL,
                isVerified: data[activeIndex]['User Info'].protected, // try replacing this with "isProtected"
              }}
              tweet={data[activeIndex].Tweet}
              time={new Date(data[activeIndex]['Date Created'])}
              source={data[activeIndex]['User Info'].location}
              permalink={data[activeIndex].URL}
              fitInsideContainer
              showDetails={true}
              showEngagement={true}
            />
            <SimpleBar className='tweetlist' scrollableNodeProps={{ ref: ref }}>
              <ListGroup variant="flush">
                {data.map((post, key) => 
                  // <Post postData={post} key={post.id}/>
                  <ListGroup.Item action onClick={() => listClick(key)} key={key} id={key}>
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
                        isVerified: post['User Info'].protected, // try replacing this with "isProtected"
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
