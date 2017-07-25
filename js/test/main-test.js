QUnit.test("Test", function (assert) {
    done = assert.async();
    var $getTitles = $('.title');
    $getTitles.trigger("click");
    assert.equal($getTitles[0], 'A New Hope', 'first title')
    done();
});

Qunit.test("Length", function (assert) {
  done = assert.async();
  var $titles = $('.title');
  assert.equal($titles, 7, "There are the right number of movies");
  done();
});

Qunit.test("Results passed", function (assert){
  done = assert.async();
  var titles = $('.titles');
  $titles.trigger("click").index();
  var e = $(this).index();
  assert.equal(titles, e, "these have the same index");

  var $listTitles;
  assert.equal(listTitles, e, "there are the correct number of results");
  done();
});
