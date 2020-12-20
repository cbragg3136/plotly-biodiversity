// function to initialize page
function init() {
    // select data for the dropdown
    var selDataset = d3.select("#selDataset");

    // use d3 to pull the json data file 
    d3.json("./samples.json").then((data) => {

        console.log(data) //test to see that data was properly fed

        // loop through data using forEach
        data.names.forEach((name) => {

            // append the new option
            selDataset.append("option").text(name).property("value", name);
        });
        // initialize with data from the initial index
        optionChanged(data.names[0]);
    });
}
// run init function
init();

//--------------------------------------------//
// function to append deographic metadata to table for selected subject id
function demographic(metadata) {
    var demoInfo = d3.select('#sample-metadata')

    // clear out existing data
    demoInfo.html("")

    // append metadata for the selected id to the table
    Object.entries(metadata).forEach(([key, value]) => {
        demoInfo.append('h6').text(`${key}: ${value}`)
    })
}

//--------------------------------------------//
// function to create the horizontal bar chart
function barplot(samples) {

    // Define variables to store top10_values, top10_OTU, and labels
    var top10_values = samples.sample_values.slice(0, 10);
    var top10_OTU = (samples.otu_ids.slice(0, 10));
    var top10_OTU = top10_OTU.map(otu_ids => "OTU " + otu_ids)
    var labels = samples.otu_labels.slice(0, 10);

    // Define the data for bar chart
    var trace1 = [{
        x: top10_values,
        y: top10_OTU,
        text: labels,
        marker: { color: '#065fc3' },
        type: "bar",
        orientation: "h",
    }];

    // Define the layout for bar chart
    var layout = {
        title: "Top 10 OTU",
        height: 500,
        width: 500,
        yaxis: {
            autorange: "reversed",
            tickmode: "linear",
        },
    };

    // Use Plotly to build a bar chart
    Plotly.newPlot("bar", trace1, layout);
};

//--------------------------------------------//
// function to create the bubble chart
function bubbleplot(samples) {

    var trace2 = [{
        x: samples.otu_ids,
        y: samples.sample_values,
        mode: "markers",
        marker: {
            size: samples.sample_values,
            color: samples.otu_ids
        },
        text: samples.otu_labels
    }];

    var layout = {
        height: 500,
        width: 1000
    };
    // Use Plotly to build a bubble chart
    Plotly.newPlot("bubble", trace2, layout);
};

// function to update the page with the selected subject
function optionChanged(sample) {

    // Pull metadata and sample & filter by dropdown selection
    d3.json("./samples.json").then((data) => {

        var metadata = data.metadata.filter(x => x.id.toString() === sample)[0];
        var samples = data.samples.filter(y => y.id.toString() === sample)[0];

        // call functions to build charts
        demographic(metadata);
        barplot(samples);
        bubbleplot(samples);
        gaugeplot(metadata)
        
    });
};

//--------------------------------------------//
// BONUS - function to create gauge chart
function gaugeplot() {

    // variables to pull the selected subject id and use the wash frequency value
    var selDataset = d3.select("#selDataset").node().value
    d3.json('./samples.json').then(data => {
        var Gauge = data.metadata.filter(x => x.id.toString() === selDataset)[0];
        var value = Gauge.wfreq
        console.log(value) // test that the wfreq is pulled correctly

        // define data for the gauge plot (wash frequency from 0-9)
        var trace3 = [
            {
                domain: { x: [0, 9], y: [0, 9] },
                value: value,
                title: 'Scrubs per Week',
                type: "indicator",
                mode: "gauge",
                gauge: { 
                    axis: {range: [null,9]},
                    steps: [
                        {range: [0,1], color: '#f0f5f2'},
                        {range: [1,2], color: '#e4f5eb'},
                        {range: [2,3], color: '#d9fae7'},
                        {range: [3,4], color: '#c6f7db'},
                        {range: [4,5], color: '#a4ebc2'},
                        {range: [5,6], color: '#7ac499'},
                        {range: [6,7], color: '#57b37e'},
                        {range: [7,8], color: '#44ad70'},
                        {range: [8,9], color: '#309c5d'},
                        ],
                    }   
            }] 
                
        var layout = {
            title: 'Belly Button Washing Frequency',
            width: 500,
            height: 500,
            margin: {
                t: 75,
                b: 75,
            },            
        };
        
        // use plotly to build the gauge chart
        Plotly.newPlot('gauge', trace3, layout)
})
}



