// User code here

// HINT: start here: http://swapi.co/api/films/


// Establish a function and set variables 
$(function() {
    var films = [],
        selectedFilm = [],
        starships = [],
        skippedCharacters = [],
        getShips,
        filmRequest,
        selectedFilmRequest,
        dropdownHTML = "",
        tableCharacter = "";

    //Hides a loading screen
    $('#load-screen').hide()

    //gets the list of films, sorts by release date, add them to drop down list for selection
    $.getJSON('http://swapi.co/api/films/', function(data){
      for (var i = 0; i < data.results.length; i++){
        films.push({releaseDate: data.results[i].release_date.slice(0,4),
                    title: data.results[i].title,
                    url: data.results[i].url})

        //sort films by releaseDate
        films.sort(function(a,b){
          return parseFloat(a.releaseDate) - parseFloat(b.releaseDate);
        })
      }

      //add films to html drop down list 
      $.each(films, function(i){
        var newDropdown = "<li id='movie-title'>"+ films[i].title + "</li>"
        dropdownHTML += newDropdown;
      })

      $(".dropdown-menu").html(dropdownHTML);
    })


    //When a film is clicked, retrieve characters in film and the starships for each character
    $('.dropdown-menu').on('click',"li",function(e) {

      //Reset film array and clear table
      selectedFilm = [];
      tableCharacter = "";
      $(".table-results").html(tableCharacter);

      //Retrieves information on chosen film
      for (var i = 0; i < films.length; i++){
        if(films[i].title === $(this).text()){
          filmRequest = $.getJSON(films[i].url.toString())
        }
      }

      // Hides the table while loading, and shows a gif
      $('table').hide()
      $('#load-screen').show()

      //When call is finished, loops through character urls, and retrieves information on them.
      //Adds their name and the url of their starships to the selectedFilm array
      filmRequest.done(function(filmData){
        console.log(filmData);
        for (var j = 0; j < filmData.characters.length; j++){
          selectedFilmRequest = $.getJSON(filmData.characters[j].toString(), function(characterData){
                selectedFilm.push({name: characterData.name, starships: characterData.starships})
          })
        }

        //When character information has been retrieved, it loops through selectedFilm array and the starship
        //array within the character object, retrieves the name of each starship and
        //pushes the name of the starships to their own array
        selectedFilmRequest.done(function(){
          selectedFilm.forEach(function(character){
            for(var k = 0; k < character.starships.length; k++){
               getShips = $.getJSON(character.starships[k], function(shipData){
                 starships.push({name: shipData.name, url: shipData.url})
               })
            }
          })

          //When the call is finished, the starship name is mapped to the correct character in the selectedFilm array 
          getShips.done(function(){

            //Loops through selectedFilm array and starships array and replaces starship url with
            //the correct starship name. Also, removes characters that the user chose to remove
            mapStarshipToSelectedFilm()

            //Hides loader and shows the table
            $('#load-screen').hide()
            $('table').show()

            //Renders the rows on the table
            renderTable()


          })

        })

      });

    })

    //When a row is clicked, the character name is added to a skipped
    //character array and the row is removed.
    $('tbody').on("click", 'td', function(e){
      skippedCharacters.push($(this).text())
      $(this).closest('tr').remove();
    })



    //functions:

    function mapStarshipToSelectedFilm() {

      selectedFilm.forEach(function(character){
        for (var l = 0; l < character.starships.length; l++){
          starships.forEach(function(ship){
            if(ship.url === character.starships[l]){
              character.starships[l] = " " + ship.name
            }
          })
        }
      })

      //Removes all the characters that the user chose to skip.
      skippedCharacters.forEach(function(index){
        for (var i = 0; i < selectedFilm.length; i++){
          if(index === selectedFilm[i].name){
            selectedFilm.splice(i, 1);
            i--
          }
        }
      })
    }



    function renderTable() {

      $.each(selectedFilm, function(index){
        tableCharacter += "<tr>"
        tableCharacter += "<td id='character-name'>"+ selectedFilm[index].name + "<a><span class='glyphicon glyphicon-remove'></span></a></td>";
        tableCharacter += "<td id='starships'>" + selectedFilm[index].starships + "<td>";
        tableCharacter += "</tr>"
      })

      return $("tbody").html(tableCharacter);
    }

  });




// HINT: start here: http://swapi.co/api/films/