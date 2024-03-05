//const url
const url="https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//fetch data in samples.json using d3
d3.json(url).then(function(data) {
    console.log(data);
});

//create function to make dropdown and graphs 
//Initialize dashboard

function init() {
    let dropdownMenu=d3.select("#selDataset");
//use d3 to select dropdown menu
    d3.json(url).then((data) => {
        //set a variable for sample name
        let s_ids=data.names;
        console.log(s_ids);
            for (id of s_ids){
                dropdownMenu.append('option').attr("value", id).text(id);
            };
        //set first sample from list and print value of first entry    
        let first_entry=s_ids[0];
        console.log(first_entry);
        //build initial plots
        makeBar(first_entry);
        makeBubble(first_entry);
        makeDemographic(first_entry);

    });
    
};
//create demographic graph and use d3 to select sample data
function makeDemographic(sample){
    //populate metadata info
    d3.json(url).then((data)=> {
        let demo_info=data.metadata;
        let results=demo_info.filter(id => id.id==sample);
        let first_r = results[0];
        console.log(first_r);
        d3.select('#sample-metadata').text('');

        //use Object.entries to add each key/value pair to panel
        Object.entries(first_r).forEach(([key,value]) => {
            console.log(key,value);
            d3.select('#sample-metadata').append('h5').text(`${key}, ${value}`);

        });
    });
};
//create function to populate bar graph
function makeBar(sample){
    //d3 to retrieve data
    d3.json(url).then((data) => {
        //gather all sample data
        let sd=data.samples;
        //filter value of the sample
        let results=sd.filter(id => id.id ==sample);
        //get first index of array
        let first_r= results[0];
        console.log(first_r);
        //get the otu ids, labels, and sample values and set top ten items
        let sample_values =first_r.sample_values.slice(0,10);
        let otu_ids = first_r.otu_ids.slice(0,10);
        let otu_labels = first_r.otu_labels.slice(0,10);
        console.log(sample_values);
        console.log(otu_ids);
        console.log(otu_labels);

        //create trace for bar chart

        let bar_trace = {
            x: sample_values.reverse(),
            y: otu_ids.map(item =>`OTU ${item}`).reverse(),
            text: otu_labels.reverse(),
            type: 'bar',
            orientation: 'h',
        };
        //setup the layout and call plotly to plot bar chart
        let layout = {title: "The Top Ten OTUs"};
        Plotly.newPlot("bar", [bar_trace], layout);

    });
};
//create function to populate the bubble chart
function makeBubble(sample){
    //call up d3 to retrieve data
    d3.json(url).then((data) => {
        let sd = data.samples;
        //filter value of the sample and get first index from array
        let results = sd.filter(id => id.id ==sample);
        let first_r=results[0];
        console.log(first_r);
        //get sample values, otu ids, and lables
        let sample_values =first_r.sample_values;
        let otu_ids = first_r.otu_ids;
        let otu_labels = first_r.otu_labels;
        //log data to the console
        console.log(sample_values);
        console.log(otu_ids);
        console.log(otu_labels);

        //create trace for bubble chart
        let bubble_trace = {
            x: otu_ids.reverse(),
            y: sample_values.reverse(),
            text: otu_labels.reverse(),
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: 'Picnic',
            }
        };

        //designate layout and call plotly to plot bubble chart
        let layout = {
            title: "The Bacteria Count for each Sample ID",
            xaxis: {title: "OTU ID"},
            yaxis: {title: "Bacteria Amount"}
        };
        Plotly.newPlot("bubble", [bubble_trace], layout);
    });
};

//designate function for dropdown menu changes
function optionChanged(value){
    console.log(value);
    makeBar(value);
    makeDemographic(value);
    makeBubble(value);
};
init();