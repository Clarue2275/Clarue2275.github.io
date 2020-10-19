function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    
    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var desiredSampleNumber = samplesArray.filter(sampArr => sampArr.id ==sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = desiredSampleNumber[0];
    // wfreq
  

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var newotu_ids = result.otu_ids;
    var newotu_labels = result.otu_labels;
    var newsample_value = result.sample_values;
    console.log(newotu_ids);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = newotu_ids.slice(0, 10).reverse();
    yticks = yticks.sort((a, b) => a - b);

    // 8. Create the trace for the bar chart. 
    var barData = {
        x: newsample_value.slice(0, 10).reverse(),
        y: yticks,
      text: newotu_labels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h'
      
    };
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: 'Top 10 Bacteria Cultures Found ',
      barmode: 'stack'
     
     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [barData], barLayout);
    
    // Deliverable 2

    // 1. Create the trace for the bubble chart.
    var bubbleData = {
      x: newotu_ids.slice(0, 10).reverse(),
      y: newsample_value.slice(0,10).reverse(),
      text: newotu_labels,
      mode: 'markers',
      marker: {
        size: newsample_value.slice(0,10).reverse(),
        color: newotu_ids.slice(0,10).reverse(), 
      }
   
    };

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample'
      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", [bubbleData], bubbleLayout);

    // 4. Create the trace for the gauge chart

    var wfreq = data.metadata.map(c => c.wfreq)
    
    var gaugeData = 
    {
      type: "indicator",
      mode: "gauge+number",
      domain: {x:[0,1],y:[0,1]},
      value: parseFloat(wfreq),
      //title: { text: "Speed", font: { size: 24 } },
      //delta: { reference: 10, increasing: { color: "RebeccaPurple" } },
      gauge: {
        axis: { range: [null, 10], tickwidth: 1, tickcolor: "darkblue" },
        bar: { color: "darkblue" },
        bgcolor: "white",
        borderwidth: 1,
        bordercolor: "gray",
        steps: [
          { range: [0, 2], color: "lightcyan" },
          { range: [2, 4], color: "cyan" },
          { range: [4, 6], color: "lightsteelblue" },
          { range: [6, 8], color: "steelblue" },
          { range: [8, 10], color: "royalblue" },
        
        ],
        threshold: {
          line: { color: "red", width: 4 },
          thickness: 0.75,
          value: 490
        }
      }
    };

    
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      title: 'Belly Button Washing Frequency <br>Scrubs per Week',
      width: 500,
      height: 400, 
      margin: { t: 25, r: 25, l: 25, b: 25 }, 
      //paper_bgcolor: "lavender",
      font: { color: "darkblue", family: "Helvetica" }
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", [gaugeData], gaugeLayout);

    
  });
}
