QUnit.test("Test", function (assert) {
    done = assert.async();
    var $getTitles;
    $getTitles.trigger("click");
    assert.equal(title[0], 'A New Hope', 'first title')
    done();
});

Qunit.test('List Length', function(assert){
  done = assert.async();
  var titles = $('titles');
  assert.equal(titles, 7, "There are the right number of movies");
  done();
});

Qunit.test('Results passed', function (assert){
  done.assert.async();
  var titles = $('li.title').click(function(){
    var e = $(this).index();
  }
  var $listTitles;
  assert.equal(listTitles, e, "there are the correct number of results");
})
