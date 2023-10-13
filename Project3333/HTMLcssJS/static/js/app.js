//This file contains the code to create the plots for the Belly Button Biodiversity Dashboard.    

// Define the URL for the JSON data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Use D3 to read the JSON data and create the dropdown menu
d3.json(url).then(({names})=>{  
    names.forEach(name => {
        d3.select('select').append('option').text(name);
    });

    // Call the optionChanged function with the first sample
    optionChanged(names[0]); 
});

// Create a function to update the plots when a new sample is selected
const optionChanged = data=>{

    // Read the JSON data for samples and metadata  
    d3.json(url).then(({samples, metadata})=>{
        // Find the sample and metadata for the selected sample 
        const sample = samples.find(({id})=>id===data);
        const meta = metadata.find(({id})=>id===+data);
        const {otu_ids, sample_values, otu_labels} = sample;
        const {wfreq} = meta;

        // Clear the previous metadata
        d3.select('#sample-metadata').html('');

        // Show each key-value pair from the metadata    
        Object.entries(meta).forEach(([key, value])=>{
            d3.select('#sample-metadata').append('p').text(`${key}: ${value}`);
        });

        // Create the horizontal bar chart data and layout
        const barData = [{
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map(id=>`OTU ${id}`).reverse(),
            text: otu_labels.slice(0,10).reverse(),
            type: 'bar',
            orientation: 'h',
            marker: {
                color: 'green'
            }
        }];
        const barLayout = {
            title: 'Top 10 OTUs',

        };

        // Create the bar chart
        Plotly.newPlot('bar', barData, barLayout);

        // Create the bubble chart data and layout
        const bubbleData = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids
            }
        }];

        const bubbleLayout = {
            xaxis: {title: 'OTU ID'}
        };

        // Create the bubble chart
        Plotly.newPlot('bubble', bubbleData, bubbleLayout);

        // Create the gauge chart data and layout
        const gaugeData = [{
            domain: {x: [0,1], y: [0,1]},
            value: wfreq,
            title: {text: 'Belly Button Washing Frequency<br>Scrubs per Week'},
            type: 'indicator',
            mode: 'gauge+number',
            gauge: {
                axis: {range: [0,9]},
                bar: {color: 'blue'},
        
                // Use purple gradient
                steps: [
                        { range: [0, 1], color: 'rgb(240, 230, 240)' },  
                        { range: [1, 2], color: 'rgb(220, 190, 220)' },  
                        { range: [2, 3], color: 'rgb(200, 160, 200)' },  
                        { range: [3, 4], color: 'rgb(180, 130, 180)' },  
                        { range: [4, 5], color: 'rgb(160, 100, 160)' },  
                        { range: [5, 6], color: 'rgb(140, 70, 140)' },   
                        { range: [6, 7], color: 'rgb(120, 40, 120)' },   
                        { range: [7, 8], color: 'rgb(100, 10, 100)' },    
                        { range: [8, 9], color: 'rgb(80, 0, 80)' }    
                      ]
                      
            
            }
        }];

            const gaugeLayout = {
                width: 600,
                height: 500,
                margin: {t: 0, b: 0}
            };

            // Create the gauge chart
            Plotly.newPlot('gauge', gaugeData, gaugeLayout);
        });
    }
