let map;

// Function to populate the dropdown with data from the CSV file
function populateDropdown(csvData) {

    // Select the dropdown element3
    var dropdown = d3.select("#dropdown");
    let us_dropdown_option = d3.select('#dropdown').append('option').text('US');

    // Add options to the dropdown based on the CSV data
    dropdown.selectAll("option")
        .data(csvData)
        .enter().append("option")
        .text(function(d) { return d; })
        .attr("value", function(d) { return d; });
}

// // Add a tile layer to the map (you can use a different tile layer if needed)
function buildleafletmap(dropdownName){

    // Load the CSV file and populate the dropdown
  d3.json('http://localhost:8003/updated-sale-price-data').then(function(data) {

      // Extract a single column from the CSV data (change "ColumnName" to the desired column)
      var csvColumn = data.map(function(d) {
          return d.StateName;
      });

      // Call the function to populate the dropdown
      populateDropdown(csvColumn);
  });
    // // Initialize the map
    
  var map = L.map('map').setView([0, 0], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // // Load CSV data and add markers to the map
  d3.json('http://localhost:8003/updated-sale-price-data').then(function(data) {

  //     // Loop through the CSV data and add markers to the map
      data.reverse().forEach(function(d) {
          var StateName = d.State;
          if (dropdownName == d.StateName || dropdownName == 'US') {
            var lat = (parseFloat(d.Latitude));
            var lon = parseFloat(d.Longitude);

    //     //     // Check if latitude and longitude are valid numbers
            if (!isNaN(lat) && !isNaN(lon)) {
              L.marker([lat, lon]).addTo(map)
                    .bindPopup('State: ' + d.StateName  +'<br>City:' + d.RegionName + '<br> City average 2008-2023:' + d.Average );
                    
            }
          }
      });
  });

  return map;
}


// Initialize bar chart
function buildbarchartcity(){
  d3.json('http://localhost:8003/updated-sale-price-data').then(function(data) {

  var svgBarChart = d3.select("#bar-chart").append("svg");
  let name = 'US CITIES'

  let title = `${name}'s HOME PRICE CHART`
  var plotAvg = data.map(function(d) {
    return d.Average;
  });
    
  var plotRegion = data.map(function(d) {
    return d.RegionName;
  });
  let trace1 = {
  x: plotRegion, 
  y: plotAvg, 
  type: 'bar'
  };

  let plotTrace = [trace1];

  let layout = {
  title: title
  }
  Plotly.newPlot("plot", plotTrace, layout);
  });

}

// Initialize bar chart#2
function buildbarchartstate(){
  d3.json('http://localhost:8003/group-data').then(function(data) {

  let name = 'US STATE'
  let title = `${name}'s HOME PRICE CHART`

  var plotState = data.map(function(d) {
          return d.StateName;
      });
      
  var plotPrice = data.map(function(d) {
          return d.Price;
      });
  let trace1 = {
    x: plotState, 
    y: plotPrice, 
    type: 'bar'
  };

  let plotTrace = [trace1];

  let layout = {
    title: title
  }
  Plotly.newPlot("new", plotTrace, layout);
});
}

function init(){
  map = buildleafletmap('US');
  buildbarchartcity();
  buildbarchartstate();
}

init();

var dropdown = d3.select("#dropdown");

// dropdown.on('change',console.log('something'))
// d3.select(“#selData”).on(“change”, console.log(event.target);
function handleClick(event) {

  map = map.remove();

  let dropdownMenu = d3.select(this);

  let dataset = dropdownMenu.property("value");

  map = buildleafletmap(dataset)
}

dropdown.on("change", handleClick);