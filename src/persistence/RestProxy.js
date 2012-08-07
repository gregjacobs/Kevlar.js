/**
 * @class Kevlar.persistence.RestProxy
 * @extends Kevlar.persistence.Proxy
 * 
 * RestProxy is responsible for performing CRUD operations in a RESTful manner for a given Model on the server.
 * 
 * @constructor Creates a new RestProxy instance.
 * @param {Object} config The configuration options for this class, specified in an object (hash).
 */
/*global window, jQuery, Kevlar */
Kevlar.persistence.RestProxy = Kevlar.extend( Kevlar.persistence.Proxy, {
	
	/**
	 * @cfg {String} urlRoot
	 * The url to use in a RESTful manner to perform CRUD operations. Ex: `/tasks`.
	 * 
	 * The {@link Kevlar.Model#idAttribute id} of the {@link Kevlar.Model} being read/updated/deleted
	 * will automatically be appended to this url. Ex: `/tasks/12`
	 */
	urlRoot : "",
	
	/**
	 * @cfg {Boolean} incremental
	 * True to have the RestProxy only provide data that has changed to the server when
	 * updating a model. By using this, it isn't exactly following REST per se, but can
	 * optimize requests by only providing a subset of the full model data. Only enable
	 * this if your server supports this.
	*/
	incremental : false,
	
	/**
	 * @cfg {String} rootProperty
	 * If the server requires the data to be wrapped in a property of its own, use this config
	 * to specify it. For example, if PUT'ing a Task's data needs to look like this, use this config:
	 * 
	 *     {
	 *         "task" : {
	 *             "text" : "Do Something",
	 *             "isDone" : false
	 *         }
	 *     }
	 * 
	 * This config should be set to "task" in this case.
	 */
	rootProperty : "",
	
	/**
	 * @cfg {Object} actionMethods
	 * A mapping of the HTTP method to use for each action. This may be overridden for custom
	 * server implementations.
	 */
	actionMethods : {
		create  : 'POST',
		read    : 'GET',
		update  : 'PUT',
		destroy : 'DELETE'
	},
	
	/**
	 * @private
	 * @property {Function} ajax
	 * A reference to the AJAX function to use for persistence. This is normally left as jQuery.ajax,
	 * but is changed for the unit tests.
	 */
	ajax : jQuery.ajax,
	
	
	
	/**
	 * Accessor to set the {@link #rootProperty} after instantiation.
	 * 
	 * @method setRootProperty
	 * @param {String} rootProperty The new {@link #rootProperty} value. This can be set to an empty string 
	 *   to remove the {@link #rootProperty}.
	 */
	setRootProperty : function( rootProperty ) {
		this.rootProperty = rootProperty;
	},
	
	
	/**
	 * Creates the Model on the server. Any response data that is provided from the request is
	 * then {@link Kevlar.Model#set} to the Model.
	 * 
	 * @method create
	 * @param {Kevlar.Model} The Model instance to create on the server.
	 * @param {Object} [options] An object which may contain the following properties:
	 * @param {Boolean} [options.async=true] True to make the request asynchronous, false to make it synchronous.
	 * @param {Function} [options.success] Function to call if the delete is successful.
	 * @param {Function} [options.error] Function to call if the delete fails.
	 * @param {Function} [options.complete] Function to call regardless of if the delete is successful or fails.
	 * @param {Object} [options.scope=window] The object to call the `success`, `error`, and `complete` callbacks in.
	 * @return {jqXHR} The jQuery XMLHttpRequest superset object for the request.
	 */
	create : function( model, options ) {
		options = options || {};
		
		// Set the data to persist
		var dataToPersist = model.getData( { persistedOnly: true, raw: true } );
		
		// Handle needing a different "root" wrapper object for the data
		if( this.rootProperty ) {
			var dataWrap = {};
			dataWrap[ this.rootProperty ] = dataToPersist;
			dataToPersist = dataWrap;
		}
		
		
		var successCallback = function( data ) {
			if( data ) {
				model.set( data );
				model.commit();
			}
			
			if( typeof options.success === 'function' ) {
				options.success.call( options.scope || window );
			}
		};
		
		return this.ajax( {
			async    : ( typeof options.async === 'undefined' ) ? true : options.async,  // async defaults to true.
			
			url      : this.buildUrl( model, 'create' ),
			type     : this.getMethod( 'create' ),
			dataType : 'json',
			data     : JSON.stringify( dataToPersist ),
			contentType : 'application/json',
			
			success  : successCallback,  // note: currently called in the scope of options.scope
			error    : options.error    || Kevlar.emptyFn,
			complete : options.complete || Kevlar.emptyFn,
			context  : options.scope    || window
		} );
	},
	
	
	/**
	 * Reads the Model from the server.
	 * 
	 * @method read
	 * @param {Kevlar.Model} The Model instance to read from the server.
	 * @param {Object} [options] An object which may contain the following properties:
	 * @param {Boolean} [options.async=true] True to make the request asynchronous, false to make it synchronous.
	 * @param {Function} [options.success] Function to call if the delete is successful.
	 * @param {Function} [options.error] Function to call if the delete fails.
	 * @param {Function} [options.complete] Function to call regardless of if the delete is successful or fails.
	 * @param {Object} [options.scope=window] The object to call the `success`, `error`, and `complete` callbacks in.
	 * @return {jqXHR} The jQuery XMLHttpRequest superset object for the request.
	 */
	read : function( model, options ) {
		options = options || {};
		
		var successCallback = function( data ) {
			model.set( data );
			model.commit();
			
			if( typeof options.success === 'function' ) {
				options.success.call( options.scope || window );
			}
		};
		
		return this.ajax( {
			async    : ( typeof options.async === 'undefined' ) ? true : options.async,  // async defaults to true.
			
			url      : this.buildUrl( model, 'read' ),
			type     : this.getMethod( 'read' ),
			dataType : 'json',
			
			success  : successCallback,
			error    : options.error    || Kevlar.emptyFn,
			complete : options.complete || Kevlar.emptyFn,
			context  : options.scope    || window
		} );
	},
	
	
	/**
	 * Updates the given Model on the server.  This method uses "incremental" updates, in which only the changed attributes of the `model`
	 * are persisted.
	 * 
	 * @method update
	 * @param {Kevlar.Model} model The model to persist to the server. 
	 * @param {Object} [options] An object which may contain the following properties:
	 * @param {Boolean} [options.async=true] True to make the request asynchronous, false to make it synchronous.
	 * @param {Function} [options.success] Function to call if the update is successful.
	 * @param {Function} [options.error] Function to call if the update fails.
	 * @param {Function} [options.complete] Function to call regardless of if the update is successful or fails.
	 * @param {Object} [options.scope=window] The object to call the `success`, `error`, and `complete` callbacks in. 
	 *   This may also be provided as `context` if you prefer.
	 * @return {jqXHR} The jQuery XMLHttpRequest superset object for the request, *or `null` if no request is made
	 *   because the model contained no changes*.
	 */
	update : function( model, options ) {
		options = options || {};
		var scope = options.scope || options.context || window;
		
		var changedData = model.getChanges( { persistedOnly: true, raw: true } );
		
		// Short Circuit: If there is no changed data in any of the attributes that are to be persisted, there is no need to make a 
		// request. Run the success callback and return out.
		if( Kevlar.util.Object.isEmpty( changedData ) ) {
			if( typeof options.success === 'function' ) {
				options.success.call( scope );
			}
			if( typeof options.complete === 'function' ) {
				options.complete.call( scope );
			}
			return null;
		}
		
		
		// Set the data to persist, based on if the persistence proxy is set to do incremental updates or not
		var dataToPersist;
		if( this.incremental ) {
			dataToPersist = changedData;   // uses incremental updates, we can just send it the changes
		} else {
			dataToPersist = model.getData( { persistedOnly: true, raw: true } );  // non-incremental updates, provide all persisted data
		}
		
		
		// Handle needing a different "root" wrapper object for the data
		if( this.rootProperty ) {
			var dataWrap = {};
			dataWrap[ this.rootProperty ] = dataToPersist;
			dataToPersist = dataWrap;
		}
		
		
		// Finally, persist to the server
		return this.ajax( {
			async    : ( typeof options.async === 'undefined' ) ? true : options.async,  // async defaults to true.
			
			url      : this.buildUrl( model, 'update' ),
			type     : this.getMethod( 'update' ),
			dataType : 'json',
			data     : JSON.stringify( dataToPersist ),
			contentType : 'application/json',
			
			success  : options.success  || Kevlar.emptyFn,
			error    : options.error    || Kevlar.emptyFn,
			complete : options.complete || Kevlar.emptyFn,
			context  : scope
		} );
	},
	
	
	/**
	 * Destroys (deletes) the Model on the server.
	 * 
	 * Note that this method is not named "delete" as "delete" is a JavaScript reserved word.
	 * 
	 * @method destroy
	 * @param {Kevlar.Model} The Model instance to delete on the server.
	 * @param {Object} [options] An object which may contain the following properties:
	 * @param {Boolean} [options.async=true] True to make the request asynchronous, false to make it synchronous.
	 * @param {Function} [options.success] Function to call if the delete is successful.
	 * @param {Function} [options.error] Function to call if the delete fails.
	 * @param {Function} [options.complete] Function to call regardless of if the delete is successful or fails.
	 * @param {Object} [options.scope=window] The object to call the `success`, `error`, and `complete` callbacks in.
	 * @return {jqXHR} The jQuery XMLHttpRequest superset object for the request.
	 */
	destroy : function( model, options ) {
		options = options || {};
	
		return this.ajax( {
			async    : ( typeof options.async === 'undefined' ) ? true : options.async,  // async defaults to true.
			
			url      : this.buildUrl( model, 'destroy' ),
			type     : this.getMethod( 'destroy' ),
			dataType : 'text', // in case the server returns nothing. Otherwise, jQuery might make a guess as to the wrong data type (such as JSON), and try to parse it, causing the `error` callback to be executed instead of `success`
			
			success  : options.success  || Kevlar.emptyFn,
			error    : options.error    || Kevlar.emptyFn,
			complete : options.complete || Kevlar.emptyFn,
			context  : options.scope    || window
		} );
	},
	
	
	// -------------------
	
	
	/**
	 * Builds the URL to use to do CRUD operations.
	 * 
	 * @protected
	 * @method buildUrl
	 * @param {Kevlar.Model} model The model that a url is being built for.
	 * @param {String} [action] The action being taken. This will be one of: 'create', 'read', 'update', or 'destroy'.
	 * @return {String} The url to use.
	 */
	buildUrl : function( model, action ) {
		var url = this.urlRoot;
		
		// Use the model's ID to set the url if we're not creating
		if( action !== 'create' ) {
			if( !url.match( /\/$/ ) ) {
				url += '/';  // append trailing slash if it's not there
			}
			
			url += encodeURIComponent( model.getId() );
		}
		
		return url;
	},
	
	
	/**
	 * Retrieves the HTTP method that should be used for a given action. This is, by default, done via 
	 * a lookup to the {@link #actionMethods} config object.
	 * 
	 * @protected
	 * @method getMethod
	 * @param {String} action The action that is being taken. Should be 'create', 'read', 'update', or 'destroy'.
	 * @return {String} The HTTP method that should be used.
	 */
	getMethod : function( action ) {
		return this.actionMethods[ action ];
	}
	
} );

// Register the persistence proxy so that it can be created by an object literal with a `type` property
Kevlar.persistence.Proxy.register( 'rest', Kevlar.persistence.RestProxy );