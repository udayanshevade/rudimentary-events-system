QUnit.test('Processing an event invokes the action', function (assert) {
  var dispatch = new EventTracker('dispatcher');

  dispatch.on('event1', function () {
    assert.ok(true, 'Received event');
  });

  assert.expect(1);
  dispatch.trigger('event1');
});

QUnit.test('Processing an event passes the parameter', function (assert) {

  var dispatch = new EventTracker('dispatcher');
  dispatch.on('event1', function (param) {
    assert.equal(param, 'test value', 'parameter received');
  });

  assert.expect(1);
  dispatch.trigger('event1', 'test value');
});

QUnit.test('Processing a notification dispatches to the listening handler', function (assert) {
  var parent = new EventTracker('dispatcher');
  var child = new EventTracker('receiver');

  parent.on('event2', function (param) {
    assert.equal(param, 'test value', 'parameter received');
    assert.ok('event received at parent');
  });

  assert.expect(2);
  child.notify(parent, 'event2');
  child.trigger('event2', 'test value');
});

QUnit.test('Can register multiple events on a tracker', function (assert) {
  var dispatch = new EventTracker('dispatcher');

  dispatch.on('event1', function (param) {
    assert.ok(param, 'Received event 1');
  });

  dispatch.on('event2', function (param) {
    assert.ok(param, 'Received event 2');
  });

  assert.expect(2);
  dispatch.trigger('event1', '1');
  dispatch.trigger('event2', '2');
});

QUnit.test('Can register multiple listeners for an event', function (assert) {
  var parent1 = new EventTracker('parent 1');
  var parent2 = new EventTracker('parent 2');
  var child = new EventTracker('dispatcher');

  parent1.on('christmas_morning', function (param) {
    assert.ok(true, 'Parent 1 received event');
  });

  parent2.on('christmas_morning', function (param) {
    assert.ok(true, 'Parent 2 received event');
  });

  assert.expect(2);
  child.notify(parent1, 'christmas_morning');
  child.notify(parent2, 'christmas_morning');
  child.trigger('christmas_morning', 'presents!');
});

QUnit.test('Can register multiple events at once', function (assert) {
  var parent1 = new EventTracker('parent 1');
  var parent2 = new EventTracker('parent 2');
  var parent3 = new EventTracker('parent 3');
  parent1.on('christmas kwanzaa', function(param) {
    assert.ok(true, 'Parent 1 celebrates ' + param);
  });
  parent2.on('kwanzaa diwali', function(param) {
    assert.ok(true, 'Parent 2 celebrates ' + param);
  });
  parent3.on('christmas laba', function(param) {
    assert.ok(true, 'Parent 3 celebrates ' + param);
  });

  assert.expect(4);
  parent2.notify(parent1, 'kwanzaa');
  parent1.notify(parent3, 'christmas');
  parent2.trigger('kwanzaa', 'kwanzaa');
  parent1.trigger('christmas', 'christmas');
});

QUnit.test('Can trigger multiple events at once', function (assert) {
  var people = new EventTracker('people');
  people.on('kwanzaa diwali easter eid_al-fitr', function(param) {
    assert.ok(true, 'People everywhere celebrate ' + param);
  });

  assert.expect(4);
  people.trigger('kwanzaa diwali easter eid_al-fitr', 'life');
});

QUnit.test('Can notify multiple instances at once', function (assert) {
  var a = new EventTracker('a');
  var b = new EventTracker('b');
  var c = new EventTracker('c');
  a.on('marco', function(param) {
    assert.ok(true, param);
  });
  b.on('marco', function(param) {
    assert.ok(true, param);
  });
  c.on('marco', function(param) {
    assert.ok(true, param);
  });

  assert.expect(3);
  a.notify([b, c], 'marco');
  a.trigger('marco', 'polo');
});