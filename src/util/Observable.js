/*global window, Kevlar */
/*jslint forin: true */
(function(){

var KevlarUTIL = Kevlar.util,
	TOARRAY = Kevlar.toArray,
	ISOBJECT = Kevlar.isObject,
	TRUE = true,
	FALSE = false;
	
/**
 * @class Kevlar.util.Observable
 * 
 * Base class that provides a common interface for publishing events. Subclasses are expected to
 * to have a property "events" with all the events defined, and, optionally, a property "listeners"
 * with configured listeners defined.
 * 
 * For example:
 * 
 *     Employee = Kevlar.extend(Kevlar.util.Observable, {
 *         constructor: function( config ) {
 *             this.name = config.name;
 *             this.addEvents( {
 *                 "fired" : true,
 *                 "quit" : true
 *             } );
 *     
 *             // Copy configured listeners into *this* object so that the base class&#39;s
 *             // constructor will add them.
 *             this.listeners = config.listeners;
 *     
 *             // Call our superclass constructor to complete construction process.
 *             Employee.superclass.constructor.call( config )
 *         }
 *     });
 * 
 * 
 * This could then be used like this:
 * 
 *     var newEmployee = new Employee({
 *         name: employeeName,
 *         listeners: {
 *             'quit': function() {
 *                 // By default, "this" will be the object that fired the event.
 *                 alert( this.name + " has quit!" );
 *             }
 *         }
 *     });
 * 
 * 
 * Note that it is possible to subscribe to *all* events from a given Observable, by subscribing to the
 * special {@link #event-all all} event.
 */
/*global Class, Kevlar */
KevlarUTIL.Observable = Class.extend( Object, {
	
	/**
	 * @cfg {Object} listeners (optional) 
	 * A config object containing one or more event handlers to be added to this object during initialization.  
	 * This should be a valid listeners config object as specified in the {@link #addListener} example for attaching 
	 * multiple handlers at once.
	 */
		
	
	
	/**
	 * @constructor
	 */
	constructor : function() {
		var me = this, e = me.events;
		me.events = e || {};
		if( me.listeners ) {
			me.on( me.listeners );
			delete me.listeners;
		}
		
		this.addEvents(
			/**
			 * Special event which can be used to subscribe to *all* events from the Observable. When a given event
			 * is fired, this event is fired immediately after it, with the name of the original event as the first
			 * argument, and all other original arguments provided immediately after.
			 * 
			 * Ex:
			 * 
			 *     var myObservable = new Kevlar.util.Observable();
			 *     myObservable.on( 'all', function( eventName ) {
			 *         console.log( "Event '" + eventName + "' was fired with args: ", Array.prototype.slice.call( arguments, 1 ) );
			 *     } );
			 *     
			 *     myObservable.fireEvent( 'change', 'a', 'b', 'c' );
			 *     // console: Event 'change' was fired with args: [ "a", "b", "c" ]
			 *     
			 * 
			 * @event all
			 * @param {String} eventName The name of the original event that was fired.
			 * @param {Mixed...} args The original arguments that were provided with the original event.  
			 */
			'all'
		);
	},



	// private
	filterOptRe : /^(?:scope|delay|buffer|single)$/,

	/**
	 * Fires the specified event with the passed parameters (minus the event name).
	 * 
	 * An event may be set to bubble up an Observable parent hierarchy (See {@link ui.Component#getBubbleTarget})
	 * by calling {@link #enableBubble}.
	 * 
	 * @method fireEvent
	 * @param {String} eventName The name of the event to fire.
	 * @param {Object...} args Variable number of parameters are passed to handlers.
	 * @return {Boolean} returns false if any of the handlers return false otherwise it returns true.
	 */
	fireEvent : function() {
		var args = TOARRAY(arguments),
		    eventName = args[0].toLowerCase(),
		    me = this,
		    ret = TRUE,
		    ce = me.events[eventName],
		    q,
		    parentComponent;
			
		if (me.eventsSuspended === TRUE) {
			q = me.eventQueue;
			if (q) {
				q.push(args);
			}
			
		} else if( ISOBJECT(ce) && ce.bubble ) {
			if( ce.fire.apply( ce, args.slice( 1 ) ) === false ) {
				return FALSE;
			}
			
			// Firing of the event on this Observable didn't return false, check the bubbleFn for permission (if the event has one).
			// If the bubbleFn returns false, we return here and don't bubble
			var bubbleFn = ce.bubbleFn,
				bubbleFnScope = ce.bubbleFnScope;
				
			if( bubbleFn && bubbleFn.call( bubbleFnScope, this ) === false ) {
				return false;
			}
			
			
			// fire the event on the "parent" Observable (i.e. the "bubble target" observable)
			parentComponent = me.getBubbleTarget && me.getBubbleTarget();
			if( parentComponent && parentComponent.enableBubble ) {  // test for if parentComponent is an Observable?
				// If the parentComponent doesn't have the bubbled event, 
				// or the bubbled event on the parentComponent is not yet an Event object, 
				// or the bubbled event on the parentComponent doesn't have the bubble flag set to true,
				// or the bubbled event on the parentComponent doesn't have a bubbleFn, but this one does
				// then run enableBubble for the event on the parentComponent
				if( !parentComponent.events[ eventName ] || !Kevlar.isObject( parentComponent.events[ eventName ] ) || !parentComponent.events[ eventName ].bubble || ( !parentComponent.events[ eventName ].bubbleFn && bubbleFn ) ) {
					parentComponent.enableBubble( {
						eventName: eventName,
						bubbleFn: bubbleFn,
						scope: bubbleFnScope
					} );
				}
				return parentComponent.fireEvent.apply( parentComponent, args );
			}
			
		} else {
			if( ISOBJECT( ce ) ) {
				args.shift();
				ret = ce.fire.apply( ce, args );
			}
		}
		
		// Fire an "all" event, which is a special event that can be used to capture all events on an Observable. The first
		// argument passed to handlers will be the event name, and all arguments that were passed from the original event will follow.
		if( eventName !== 'all' ) {
			this.fireEvent.apply( this, [ 'all' ].concat( Array.prototype.slice.call( arguments, 0 ) ) );
		}
		
		return ret;
	},
	
	

	/**
	 * Appends an event handler to this object.
	 * 
	 * @method addListener
	 * @param {String} eventName The name of the event to listen for.
	 * @param {Function} handler The method the event invokes.
	 * @param {Object} [scope] The scope (`this` reference) in which the handler function is executed. **If omitted, defaults to the object which fired the event.**
	 * 
	 * Alternatively, a single options object may be provided:
	 * @param {Object} [options] An object containing handler configuration properties. This may contain any of the following properties:
	 * @param {Object} [options.scope] The scope (`this` reference) in which the handler function is executed. **If omitted, defaults to the object which fired the event.**
	 * @param {Number} [options.delay] The number of milliseconds to delay the invocation of the handler after the event fires.
	 * @param {Boolean} [options.single] True to add a handler to handle just the next firing of the event, and then remove itself.
	 * @param {Number} [options.buffer] Causes the handler to be scheduled to run in an {@link Kevlar.util.DelayedTask} delayed by the specified number of milliseconds. 
	 *   If the event fires again within that time, the original handler is *not* invoked, but the new handler is scheduled in its place.
	 * @param {Kevlar.util.Observable} [options.target] Only call the handler if the event was fired on the target Observable, *not* if the event was bubbled up from a child 
	 *   Observable.
	 * 
	 * 
	 * **Combining Options**
	 * Using the options argument, it is possible to combine different types of listeners:
	 * 
	 * A delayed, one-time listener.
	 *     myDataView.on('click', this.onClick, this, {
	 *         single: true,
	 *         delay: 100
	 *     });
	 * 
	 * **Attaching multiple handlers in 1 call**
	 * The method also allows for a single argument to be passed which is a config object containing properties
	 * which specify multiple handlers.
	 * 
	 *     myGridPanel.on({
	 *         'click' : {
	 *             fn: this.onClick,
	 *             scope: this,
	 *             delay: 100
	 *         },
	 *         'mouseover' : {
	 *             fn: this.onMouseOver,
	 *             scope: this
	 *         },
	 *         'mouseout' : {
	 *             fn: this.onMouseOut,
	 *             scope: this
	 *         }
	 *     });
	 * 
	 * Or a shorthand syntax:
	 *     myGridPanel.on( {
	 *         'click' : this.onClick,
	 *         'mouseover' : this.onMouseOver,
	 *         'mouseout' : this.onMouseOut,
	 *         scope: this
	 *     } );
	 */
	addListener : function( eventName, fn, scope, o ) {
		var me = this,
		    e,
		    oe,
		    isF,
		    ce;
			
		if (ISOBJECT(eventName)) {
			o = eventName;
			for (e in o){
				oe = o[e];
				if (!me.filterOptRe.test(e)) {
					me.addListener(e, oe.fn || oe, oe.scope || o.scope, oe.fn ? oe : o);
				}
			}
		} else {
			eventName = eventName.toLowerCase();
			ce = me.events[eventName] || TRUE;
			if (Kevlar.isBoolean(ce)) {
				me.events[eventName] = ce = new KevlarUTIL.Event(me, eventName);
			}
			ce.addListener(fn, scope, ISOBJECT(o) ? o : {});
		}
		
		return this;
	},

	/**
	 * Removes an event handler.
	 * @param {String}   eventName The type of event the handler was associated with.
	 * @param {Function} handler   The handler to remove. <b>This must be a reference to the function passed into the {@link #addListener} call.</b>
	 * @param {Object}   scope	 (optional) The scope originally specified for the handler.
	 */
	removeListener : function( eventName, fn, scope ) {
		if( typeof eventName === 'object' ) {
			var events = eventName; // for clarity
			for( var event in events ) {
				this.removeListener( event, events[ event ], events.scope );
			}
		} else {
			var ce = this.events[ eventName.toLowerCase() ];
			if ( ISOBJECT( ce ) ) {
				ce.removeListener( fn, scope );
			}
		}
		
		return this;
	},
	

	/**
	 * Removes all listeners for this object
	 */
	purgeListeners : function() {
		var events = this.events,
			evt,
			key;
		
		for( key in events ) {
			evt = events[ key ];
			if( ISOBJECT( evt ) ) {
				evt.clearListeners();
			}
		}
	},
	

	/**
	 * Adds the specified events to the list of events which this Observable may fire.
	 * Usage:
	 * 
	 *     this.addEvents( 'storeloaded', 'storecleared' );
	 * 
	 * 
	 * @method addEvents
	 * @param {Object/String} o Either an object with event names as properties with a value of <code>true</code>
	 * or the first event name string if multiple event names are being passed as separate parameters.
	 * @param {String} Optional. Event name if multiple event names are being passed as separate parameters.
	 */
	addEvents : function( o ) {
		var me = this;
		me.events = me.events || {};
		if (Kevlar.isString(o)) {
			var a = arguments,
			    i = a.length;
			while(i--) {
				me.events[a[i]] = me.events[a[i]] || TRUE;
			}
		} else {
			Kevlar.applyIf(me.events, o);
		}
	},


	/**
	 * Checks to see if this object has any listeners for a specified event
	 * 
	 * @method hasListener
	 * @param {String} eventName The name of the event to check for
	 * @return {Boolean} True if the event is being listened for, else false
	 */
	hasListener : function( eventName ){
		var e = this.events[eventName];
		return ISOBJECT(e) && e.listeners.length > 0;
	},


	/**
	 * Suspend the firing of all events. (see {@link #resumeEvents})
	 * 
	 * @method suspendEvents
	 * @param {Boolean} queueSuspended Pass as true to queue up suspended events to be fired
	 *   after the {@link #resumeEvents} call instead of discarding all suspended events;
	 */
	suspendEvents : function(queueSuspended){
		this.eventsSuspended = TRUE;
		if(queueSuspended && !this.eventQueue){
			this.eventQueue = [];
		}
	},


	/**
	 * Resume firing events. (see {@link #suspendEvents})
	 * If events were suspended using the `<b>queueSuspended</b>` parameter, then all
	 * events fired during event suspension will be sent to any listeners now.
	 * 
	 * @method resumeEvents
	 */
	resumeEvents : function() {
		var me = this,
		    queued = me.eventQueue || [];
		me.eventsSuspended = FALSE;
		delete me.eventQueue;
		
		for( var i = 0, len = queued.length; i < len; i++ ) {
			var result = me.fireEvent.apply( me, queued[ i ] );
			if( result === false ) {  // handler returned false, stop firing other events. Not sure why we'd need this, but this was the original behavior with the .each() method
				return;
			}
		}
	},
	
	
	/**
	 * Relays selected events from the specified Observable as if the events were fired by `this`.
	 * 
	 * @method relayEvents
	 * @param {Object} o The Observable whose events this object is to relay.
	 * @param {Array} events Array of event names to relay.
	 */
	relayEvents : function(o, events){
		var me = this;
		function createHandler(eventName){
			return function(){
				return me.fireEvent.apply(me, [eventName].concat(Array.prototype.slice.call(arguments, 0)));
			};
		}
		for(var i = 0, len = events.length; i < len; i++){
			var eventName = events[i];
			me.events[eventName] = me.events[eventName] || true;
			o.on(eventName, createHandler(eventName), me);
		}
	},
	
	
	
	/**
	 * Enables events fired by this Observable to bubble up an owner hierarchy by calling {@link #getBubbleTarget} to determine
	 * the object's owner. The default implementation of {@link #getBubbleTarget} in this class is just to return null, which specifies no owner.
	 * This method should be overridden by subclasses to provide this if applicable.
	 * 
	 * This is commonly used by {@link ui.Component ui.Components} to bubble events to owner {@link ui.Container iu.Containers}. 
	 * See {@link ui.Component#getBubbleTarget}. The default implementation in {@link ui.Component} returns the Component's immediate owner, 
	 * but if a known target is required, this can be overridden to access that target more quickly.
	 * 
	 * <p>Example:</p><pre><code>
MyClass = Kevlar.extend( Kevlar.util.Observable, {

	constructor : function() {
		...
		
		this.addEvents( 'myBubbledEvent' );
		this.enableBubble( 'myBubbledEvent' );  // enable the bubble
	},


	getBubbleTarget : function() {
		// return a reference to some component that is the target for bubbling. this component may be listened to directly for the 'myBubbledEvent' event
	}

} );
</code></pre>
	 * @param {Array/String.../Object...} events The event name to bubble, Array of event names, or one argument per event name. This may also
	 *   be an array of objects, where the objects have the following properties:<div class="mdetail-params"><ul>
	 *    <li><b>eventName</b> : String<div class="sub-desc">The name of the event to enable bubbling for.</div></li>
	 *   <li>
	 *	 <b>bubbleFn</b> : Function
	 *	 <div class="sub-desc">
	 *    A function that determines, at every level in the hierarchy, if bubbling should continue. If this function returns false
	 *    at any point, the bubbling of the event is stopped. The function is given one argument: the Observable that the event
	 *    has just been fired for.  This function can be used to test for some condition, and then stop bubbling based on that condition.
	 *    </div>
	 *    </li>
	 *    <li>
	 *    <b>scope</b> : Object
	 *    <div class="sub-desc">The scope to run the bubbleFn in. Defaults to the Observable that the event bubbling was enabled on.</div>
	 *    </li>
	 * </ul></div>
	 */
	enableBubble: function( events ) {
		var me = this,
		    eventArg,
		    eventName, bubbleFn, scope;
		    
		if( !Kevlar.isEmpty( events ) ) {
			events = Kevlar.isArray( events ) ? events : Kevlar.toArray( arguments );
			
			for( var i = 0, len = events.length; i < len; i++ ) {
				eventArg = events[ i ];
				eventName = bubbleFn = scope = undefined;  // the last 2 vars are for if an argument was specified as an object, and these were included
				
				// an object with the key 'eventName' is accepted for the enableBubble method
				if( typeof eventArg === 'object' ) {
					eventName = eventArg.eventName;
					bubbleFn = eventArg.bubbleFn;
					scope = eventArg.scope;
				} else {
					eventName = eventArg;  // string event argument
				}
				
				eventName = eventName.toLowerCase();
				var ce = me.events[ eventName ] || true;
				if( Kevlar.isBoolean( ce ) ) {
					ce = new KevlarUTIL.Event( me, eventName );
					me.events[ eventName ] = ce;
				}
				ce.bubble = true;
				
				// Add the bubbleFn, if provided by an object argument to enableBubble
				if( typeof bubbleFn === 'function' ) {
					ce.bubbleFn = bubbleFn;
					ce.bubbleFnScope = scope || me;  // default to the Observable's scope
				}
			}
		}
	},
	
	
	/**
	 * Specifies the Observable that is the target of the event's bubbling, if bubbling is enabled for
	 * events by the {@link #enableBubble} method. This default implementation returns null, and should
	 * be overridden by subclasses to specify their bubbling target.
	 * 
	 * @protected
	 * @method getBubbleTarget
	 * @return {Kevlar.util.Observable} The Observable that is the target for event bubbling, or null if none.
	 */
	getBubbleTarget : function() {
		return null;
	}
	
} );



var OBSERVABLE = KevlarUTIL.Observable.prototype;

/**
 * Appends an event handler to this object (shorthand for {@link #addListener}.)
 * 
 * @method on
 * @param {String} eventName The type of event to listen for
 * @param {Function} handler The method the event invokes
 * @param {Object} scope (optional) The scope (`this` reference) in which the handler function is executed.
 *   **If omitted, defaults to the object which fired the event.**
 * @param {Object} options (optional) An object containing handler configuration.
 */
OBSERVABLE.on = OBSERVABLE.addListener;

/**
 * Removes an event handler (shorthand for {@link #removeListener}.)
 * 
 * @method un
 * @param {String} eventName The type of event the handler was associated with.
 * @param {Function} handler The handler to remove. **This must be a reference to the function passed into the {@link #addListener} call.**
 * @param {Object} scope (optional) The scope originally specified for the handler.
 */
OBSERVABLE.un = OBSERVABLE.removeListener;


/**
 * Appends an event handler to this object (shorthand for {@link #addListener}.)
 * 
 * @method bind
 * @param {String} eventName The type of event to listen for
 * @param {Function} handler The method the event invokes
 * @param {Object} scope (optional) The scope (`this` reference) in which the handler function is executed.
 *   **If omitted, defaults to the object which fired the event.**
 * @param {Object} options (optional) An object containing handler configuration.
 */
OBSERVABLE.bind = OBSERVABLE.addListener;

/**
 * Removes an event handler (shorthand for {@link #removeListener}.)
 * 
 * @method unbind
 * @param {String} eventName The type of event the handler was associated with.
 * @param {Function} handler The handler to remove. **This must be a reference to the function passed into the {@link #addListener} call.**
 * @param {Object} scope (optional) The scope originally specified for the handler.
 */
OBSERVABLE.unbind = OBSERVABLE.removeListener;


/**
 * Alias of {@link #fireEvent}
 * 
 * @method trigger
 */
OBSERVABLE.trigger = OBSERVABLE.fireEvent;


function createTargeted(h, o, scope){
	return function(){
		if(o.target == arguments[0]){
			h.apply(scope, TOARRAY(arguments));
		}
	};
}

function createBuffered(h, o, l, scope){
	l.task = new KevlarUTIL.DelayedTask();
	return function(){
		l.task.delay(o.buffer, h, scope, TOARRAY(arguments));
	};
}

function createSingle(h, e, fn, scope){
	return function(){
		e.removeListener(fn, scope);
		return h.apply(scope, arguments);
	};
}

function createDelayed(h, o, l, scope){
	return function(){
		var task = new KevlarUTIL.DelayedTask();
		if(!l.tasks) {
			l.tasks = [];
		}
		l.tasks.push(task);
		task.delay(o.delay || 10, h, scope, TOARRAY(arguments));
	};
}



KevlarUTIL.Event = function(obj, name){
	this.name = name;
	this.obj = obj;
	this.listeners = [];
	
	// this object may also get the properties 'bubble', 'bubbleFn', and 'bubbleFnScope' if Observable's enableBubble() method is run for it
};

KevlarUTIL.Event.prototype = {
	addListener : function(fn, scope, options){
		var me = this,
		    l;
		scope = scope || me.obj;
		if(!me.isListening(fn, scope)){
			l = me.createListener(fn, scope, options);
			if(me.firing){ // if we are currently firing this event, don't disturb the listener loop
				me.listeners = me.listeners.slice(0);
			}
			me.listeners.push(l);
		}
	},

	createListener: function(fn, scope, o){
		o = o || {};
		scope = scope || this.obj;
		
		var l = {
			fn: fn,
			scope: scope,
			options: o
		}, h = fn;
		if(o.target){
			h = createTargeted(h, o, scope);
		}
		if(o.delay){
			h = createDelayed(h, o, l, scope);
		}
		if(o.single){
			h = createSingle(h, this, fn, scope);
		}
		if(o.buffer){
			h = createBuffered(h, o, l, scope);
		}
		l.fireFn = h;
		return l;
	},

	findListener : function(fn, scope){
		var list = this.listeners,
		    i = list.length,
		    l,
		    s;
		while(i--) {
			l = list[i];
			if(l) {
				s = l.scope;
				if(l.fn == fn && (s == scope || s == this.obj)){
					return i;
				}
			}
		}
		return -1;
	},

	isListening : function(fn, scope){
		return this.findListener(fn, scope) != -1;
	},

	removeListener : function(fn, scope){
		var index,
		    l,
		    k,
		    me = this,
		    ret = FALSE;
		if((index = me.findListener(fn, scope)) != -1){
			if (me.firing) {
				me.listeners = me.listeners.slice(0);
			}
			l = me.listeners[index];
			if(l.task) {
				l.task.cancel();
				delete l.task;
			}
			k = l.tasks && l.tasks.length;
			if(k) {
				while(k--) {
					l.tasks[k].cancel();
				}
				delete l.tasks;
			}
			me.listeners.splice(index, 1);
			ret = TRUE;
		}
		return ret;
	},

	// Iterate to stop any buffered/delayed events
	clearListeners : function(){
		var me = this,
		    l = me.listeners,
		    i = l.length;
		while(i--) {
			me.removeListener(l[i].fn, l[i].scope);
		}
	},

	fire : function() {
		var me = this,
		    args = TOARRAY(arguments),
		    listeners = me.listeners,
		    len = listeners.length,
		    i = 0,
		    l,
		    handlerReturnedFalse = false;  // added code

		if(len > 0){
			me.firing = TRUE;
			for (; i < len; i++) {
				l = listeners[i];
				if(l && l.fireFn.apply(l.scope || me.obj || window, args) === FALSE) {
					handlerReturnedFalse = true;
					//return (me.firing = FALSE);  -- old code, prevented other handlers from running if one returned false
				}
			}
		}
		me.firing = FALSE;
		//return TRUE;  -- old code
		return ( handlerReturnedFalse ) ? false : true;  // if any of the event handlers returned false, return false from this method. otherwise, return true
	}
};
})();