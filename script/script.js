var margin = {t:50,r:125,b:50,l:125};
var width = document.getElementById('plot').clientWidth - margin.r - margin.l,
    height = document.getElementById('plot').clientHeight - margin.t - margin.b;

var canvas = d3.select('.plot')
    .append('svg')
    .attr('width',width+margin.r+margin.l)
    .attr('height',height + margin.t + margin.b)
    .append('g')
    .attr('class','canvas')
    .attr('transform','translate('+margin.l+','+margin.t+')');

//Scale for the size of the circles
var scaleX = d3.scale.log().domain([1,5]).range([0,width]),
    scaleR = d3.scale.sqrt().domain([5,100]).range([25,100]);



d3.csv('data/olympic_medal_count.csv', parse, dataLoaded);

function dataLoaded(err,rows){

    var year = 1900;
    rows.sort(function(a,b){
        //Note: this is called a "comparator" function
        //which makes sure that the array is sorted from highest to lowest
        return b[year] - a[year];
    });

    //Note: this returns "top5" as a subset of the larger array "rows", containing positions 0,1,2,3,4
    var top5 = rows.slice(0,5);

    //Call the draw function
    draw(top5, year);

    //TODO: fill out this function
    d3.selectAll('.btn-group .year').on('click',function(){

        var year = d3.select(this).attr("id")

        //if statements to reorder array w/ button-clicks
        if (year == 'year-1900'){
            var year = 1900;

            rows.sort(function(a,b) {
                return b[year] - a[year];
            });

                var top5 = rows.slice(0,5);
                draw(top5, year);

        }else if(year == 'year-1960'){
            var year = 1960;

            rows.sort(function(a,b) {
                return b[year] - a[year];
            });

                var top5 = rows.slice(0,5);
                draw(top5, year);

        }else{

            var year = 2012;

            rows.sort(function(a,b) {
                return b[year] - a[year];
            });


        var top5 = rows.slice(0,5);
        draw(top5, year);
        }


        console.log("Show top 5 medal count for: " + year);
    });
}

function draw(rows, year){
    //TODO: Complete drawing function, accounting for enter, exit, update
    //Note that this function requires two parameters
    //The second parameter, "year", determines which one of the three years (1900,1960,2012) to draw the medal counts based on

    var row = canvas.selectAll('.country')
        .data(rows, function (d) {

            return d.country

        })

    //Enter Set

    var rowEnter = row.enter().append('g')
        .attr('class', 'country')
        .attr('transform', function(d,i){

            return 'translate(' + i*(width/4) + ',' + (0-height) + ')';

        })
        

    rowEnter.append('circle')
        .attr('r', function (d) {

            return scaleR(d[year]);

        })
        .style("fill", 'rgba(0,0,250,.75)')
        .style('stroke', 'rgb(30,3,250)')
        .style('stroke-width', '5px')


    rowEnter
        .append('text')
        .text(function(d){ 

            return d.country; 

        })
        .style('font-size','12px')
        .style('fill','rgb(240,240,240)')
        .attr('class','label')
        .attr('text-anchor','middle');


    rowEnter
        .append('text')
        .text(function(d){

            return d[year];

        })
        .style('font-size','10px')
        .style('fill','rgb(200,200,200)')
        .attr('class','label')
        .attr('text-anchor','bottom')
        .attr('y',15)
        .attr('class','counter');

    //Exit Set

    var rowExit = row.exit()
        .transition()
        .duration(750)
        .attr('transform',function(d,i){

            return 'translate(' + i*(width/4) + ',' + (height*1.1) + ')';

        })
        .style('opacity',0)
        .remove();

    //////// --- Reference code from class --- ////////
        /*
        var teamsExit = topTeams.exit()
        .transition()
        .duration(200)
        .attr('transform',function(d,i){
            return 'translate(' + i*(width/4) + ',' + height + ')';
        })
        .style('opacity',0)
        .remove();
        */


    //Update Set
    row

        .transition()
        .duration(1500)
        .attr('transform', function(d,i){

            return 'translate(' + i*(width/4) + ',' + (height/2)+ ')';

        })
        .select('circle')
        .attr('r', function (d) {

            return scaleR(d[year]);

        })

    d3.selectAll('.counter')
        .text(function(d){

            return d[year];

        })
}

function parse(row){
    //@param row is each unparsed row from the dataset
    return {
        country: row['Country'],
        1900: +row['1900'],
        1960: +row['1960'],
        2012: +row['2012']
    };
}