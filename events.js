/*
 * Create tracker object for events
 * @class
 * @param {string} name of the tracker object
 */
var EventTracker = function(name) {
    this.name = name;
    this._events = {};
    this._notifications = {};
};


/*
 * Trigger callbacks for specified event
 * @param {string} name of event
 * @param {any} callback parameter
 */
EventTracker.prototype.triggerEvent = function(event, param) {
  function invokeEach(fn) { fn(param); }

  // iterate through existing event's callbacks
  if (this._events.hasOwnProperty(event)) {
    // invoke each one
    this._events[event].forEach(invokeEach);
  }

};

/*
 * Trigger event for all instances to be notified
 * @param {string} name of event
 * @param {any} callback parameter
 */
EventTracker.prototype.triggerNotifications = function(event, param) {
  function instanceResponse(instance) { instance.trigger(event, param); }

  // iterate through instances to be notified
  if (this._notifications.hasOwnProperty(event)) {
    // trigger the event for each instance
    this._notifications[event].forEach(instanceResponse);
  }
};


/*
 * Associate event with its associated callback event
 * @param {string} event name
 * @param {function} callback
 */
EventTracker.prototype.on = function(events, callback) {
  function register(event) { this.registerEvent(event, callback) };
  // parse events
  events = events.split(' ');
  // register multiple events
  events.forEach(register, this);
};

/*
 * Register each event per callback
 */
EventTracker.prototype.registerEvent = function(event, callback) {
  // initialize callback array if not present
  this._events[event] = this._events[event] ?
    this._events[event] : [];

  // push callback to stack
  this._events[event].push(callback);
}


/*
 * Associates an instance to notify re: a triggered event
 * @param {object} named instance
 * @param {string} named event
 */
EventTracker.prototype.notify = function(instance, event) {
  // initialize notifications array if not present
  this._notifications[event] = Array.isArray(this._notifications[event]) ?
    this._notifications[event] : [];

  // push instance to array for a specific event
  this._notifications[event].push(instance);
};


/*
 * Trigger an event for a particular event object instance
 * @param {string} named event
 * @param {any} callback data
 */
EventTracker.prototype.trigger = function(events, param) {
  function triggerEach(event) { this.triggerEach(event, param) };
  // parse events
  events = events.split(' ');
  // register multiple events
  events.forEach(triggerEach, this);
};

EventTracker.prototype.triggerEach = function(event, param) {
  this.triggerEvent(event, param);
  // also trigger events on objects to be notified
  this.triggerNotifications(event, param);
};