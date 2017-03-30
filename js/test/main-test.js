
QUnit.test('selectedFilm array', function(assert){

  var selectedFilm = [{name: 'Luke Skywalker', starships: 'X-Wing, Something'}, {name: 'R2-D2', starships:'X-Wing'}],
      skippedCharacters = ['Luke Skywalker'],
      map = mapStarshipToSelectedFilm(selectedFilm, skippedCharacters),
      films = [{title: 'A New Hope', releaseDate: '1977', url: 'http://swapi.co/api/films/1/'}],
      characters = getCharacters(films),
      done = assert.async()

  assert.equal(map.length, 1, 'Correctly removes matched character')

  setTimeout(function(){
    characters.forEach(function(character){
      if(character.name === 'Luke Skywalker'){
        assert.equal(character.name, 'Luke Skywalker', 'Correct character in array')
        assert.ok(typeof character.starships === 'object', 'selectedFilm.starships is correct type')
        assert.equal(character.starships[0], ' X-wing', 'Correct first starship in array')
        assert.equal(character.starships[1], ' Imperial shuttle', 'Correct second starship in array')
      }
    })
    done()
  }, 8000)
})

QUnit.test('retrieve films array', function(assert){

  var filmTitles = retrieveFilmTitles(),
      done = assert.async();

  setTimeout(function(){
    assert.expect(5)
    assert.equal(filmTitles.length, 7, 'Correct film length')
    assert.equal(filmTitles[0].title, 'A New Hope', 'Correct First Title')
    assert.equal(filmTitles[0].releaseDate, '1977', 'Correct Release Year')
    assert.equal(filmTitles[0].url, 'http://swapi.co/api/films/1/', 'Correct Film URL')
    assert.equal(filmTitles[6].title, 'The Force Awakens', 'Correct Last Title')
    done()
  }, 4000)

})



var films = [],
    selectedFilm = [],
    starships = [],
    skippedCharacters = [],
    getShips,
    filmRequest,
    selectedFilmRequest,
    dropdownHTML = "",
    tableCharacter = "";

function retrieveFilmTitles() {
  $(function(){
    $.getJSON('http://swapi.co/api/films/', function(data){
      for (var i = 0; i < data.results.length; i++){
        films.push({releaseDate: data.results[i].release_date.slice(0,4),
                    title: data.results[i].title,
                    url: data.results[i].url})


        films.sort(function(a,b){
          return parseFloat(a.releaseDate) - parseFloat(b.releaseDate);
        })
      }


      $.each(films, function(i){
        var newDropdown = "<li id='movie-title'>"+ films[i].title + "</li>"
        dropdownHTML += newDropdown;
      })


    })
  })
  return films
}


function getCharacters(films){
  $(function(){
    var filmRequest,
        skippedCharacters = [];

    for (var i = 0; i < films.length; i++){
      filmRequest = $.getJSON(films[i].url.toString())

    }

    filmRequest.done(function(filmData){
      for (var j = 0; j < filmData.characters.length; j++){
        selectedFilmRequest = $.getJSON(filmData.characters[j].toString(), function(characterData){
          selectedFilm.push({name: characterData.name, starships: characterData.starships})
        })
      }

      selectedFilmRequest.done(function(){
        selectedFilm.forEach(function(character){
          for(var k = 0; k < character.starships.length; k++){
            getShips = $.getJSON(character.starships[k], function(shipData){
              starships.push({name: shipData.name, url: shipData.url})
            })
          }
        })

        getShips.done(function(){

          mapStarshipToSelectedFilm(selectedFilm, skippedCharacters)

          //renderTable()

        })

      })

    });
  })
  return selectedFilm
}


function mapStarshipToSelectedFilm(selectedFilm, skippedCharacters) {

  selectedFilm.forEach(function(character){
    for (var l = 0; l < character.starships.length; l++){
      starships.forEach(function(ship){
        if(ship.url === character.starships[l]){
          character.starships[l] = " " + ship.name
        }
      })
    }
  })


  skippedCharacters.forEach(function(index){
    for (var i = 0; i < selectedFilm.length; i++){
      if(index === selectedFilm[i].name){
        selectedFilm.splice(i, 1);
        i--
      }
    }
  })
  return selectedFilm
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




// HINT: start here: http://swapi.co/api/films/
