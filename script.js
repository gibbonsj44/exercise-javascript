//first call, fetches movie titles and makes an unordered list
  $.getJSON('http://swapi.co/api/films/?format=json', function (data){
          var output = '<ul class = "titles">';
          for (var i = 0; i < data.results.length; i++){
              output += '<li class="title">';
              output += data.results[i].title;
              output += '</li>';
          }
              output += '</ul>'

            //waits until the titles call has finished, otherwise there are problems
            $(document).ajaxComplete(function(){
            //place the titles list into the DOM
            $('.dropdown-menu').html(output);
                //capture the index and text of a clicked list item
                 $('li.title').click(function(){
                   var e = $(this).index();
                   var g = $(this).text();
                  //clear previous table data
                       $('.table td').empty();
                      //second call, finds the character urls
                        titleValue = $.getJSON('http://swapi.co/api/films/?format=json', function (data){
                             var characterUrls;
                             var starshipUrls;
                             //character url loop call, fetches character name urls
                             for (var i=0; i < data.results.length; i++ ){
                                 characterUrls =  data.results[e].characters;
                               }
                            //starship loop call, fetches starship urls
                             for (var a = 0; a < data.results.length; a++ ){
                                 starshipUrls =  data.results[e].starships;
                               }
                            //collects all character info from the url index characterURL
                            //this gives access to character name data
                              names = [];
                               $.each(characterUrls, function( e, value ) {
                                 $.getJSON(characterUrls[e], function (data) {
                                   names.push(data.name);
                                 });
                               });
                               //collects all character info from the url index starships
                               //this gives access to ship name data
                               var ships = []
                               $.each(starshipUrls, function(e, value){
                                 $.getJSON(starshipUrls[e], function(data){
                                    ships.push(data.name);
                                 });
                               });
                                    //make sure the call is complete, or there are problems
                                      $(document).ajaxComplete(function listResults(){
                                      //create DOM element out of arrays
                                       var output2;
                                       names.forEach(function(){
                                         output2 = "<td id='character-name'>"+ names + "</a></td>";
                                         output2 += "<td id='starships'>" + ships + "<td>";
                                       })
                                       //insert new dom element
                                       $('#character').html(output2);
                                    })
                          })//second call grabbing the characters and starships
                        })//when a title is clicked get its value
                      })//makes sure first call is complete
                    })// first ajax call; gets titles
