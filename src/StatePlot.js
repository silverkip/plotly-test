import React from 'react';
import Plot from 'react-plotly.js';

const data = require('./data/sample_recordxy.json');
let color = new Array(data.length).fill('red');

export default class StatePlot extends React.Component {
  state = {
    data: {
      x: [],
      y: [],
      mode: 'markers',
      type: 'scatter',
      marker: {color: color},
      selected: {
        marker: {color:'blue', size: 14}
      },
      hoverinfo: 'none'
    },
  }
  
  data.forEach(function(val) {
    chart.x.push(val["x"]);
    chart.y.push(val["y"]);
  });
  increaseGraphic = () => { 
    const { line1, line2, layout } = this.state;
    line1.x.push(this.rand());
    line1.y.push(this.rand());
    line2.x.push(this.rand());
    line2.y.push(this.rand());
    this.setState({ revision: this.state.revision + 1 });
    layout.datarevision = this.state.revision + 1;
  }
  render() {
     return (
       <div>
         <Plot
           data={[
             this.state.line1,
             this.state.line2,
           ]}
           layout={this.state.layout}
           revision={this.state.revision}
           graphDiv="graph"
         />
       </div>
     );
  }
}