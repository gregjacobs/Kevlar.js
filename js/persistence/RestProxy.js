/**
 * @class Kevlar.persistence.RestProxy
 * @extends Kevlar.persistence.Proxy
 * 
 * RestProxy is responsible for performing CRUD operations in a RESTful manner for a given Model on the server.
 * 
 * @constructor
 * @param {Object} config The configuration options for this class, specified in an object (hash).
 */
/*global window, jQuery, Kevlar */
Kevlar.persistence.RestProxy = Kevlar.extend( Kevlar.persistence.Proxy, {
	
	/**
	 * @cfg {String} urlRoot
	 * The url to use in a RESTful manner to perform CRUD operations. Ex: `/tasks`.
	 * 
	 * The {@link Kevlar.Model#idField id} of the {@link Kevlar.Model} being read/updated/deleted
	 * will automatically be appended to this url. Ex: `/tasks/12`
	 */
	urlRoot : "",
	
    /**
     * @cfg {Boolean} appendId
     * True to automatically append the ID of the Model to the {@link #url} when
     * performing requests. 
     */
    appendId: true,
    
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
	 * Creates a Model on the server.
	 * 
	 * @method create
	 * @param {Kevlar.Model} The Model instance to create on the server.
	 */
	create : function() {
		throw new Error( "create() not yet implemented" );
	},
	
	
	/**
	 * Reads a Model from the server.
	 * 
	 * @method read
	 * @param {Kevlar.Model} The Model instance to read from the server.
	 * @param {Object} [options] An object which may contain the following properties:
	 * @param {Boolean} [options.async=true] True to make the request asynchronous, false to make it synchronous.
	 * @param {Function} [options.success] Function to call if the delete is successful.
	 * @param {Function} [options.error] Function to call if the delete fails.
	 * @param {Function} [options.complete] Function to call regardless of if the delete is successful or fails.
	 * @param {Object} [options.scope=window] The object to call the `success`, `error`, and `complete` callbacks in.
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
		
		this.ajax( {
			async    : ( typeof options.async === 'undefined' ) ? true : options.async,  // async defaults to true.
			
			url      : this.buildUrl( model.getId() ),
			type     : 'GET',
			dataType : 'json',
			
			success  : successCallback,
			error    : options.error    || Kevlar.emptyFn,
			complete : options.complete || Kevlar.emptyFn,
			context  : options.scope    || window
		} );
	},
	
	
	/**
	 * Updates the given Model on the server.  This method uses "incremental" updates, in which only the changed fields of the `model`
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
	 */
	update : function( model, options ) {
		options = options || {};
		
		var changedData = model.getPersistedChanges();
		
		// Short Circuit: If there is no changed data in any of the fields that are to be persisted, there is no need to make a 
		// request. Run the success callback and return out.
		if( Kevlar.util.Object.isEmpty( changedData ) ) {
			if( typeof options.success === 'function' ) {
				options.success.call( options.scope || window );
			}
			if( typeof options.complete === 'function' ) {
				options.complete.call( options.scope || window );
			}
			return;
		}
		
		
		// Set the data to persist, based on if the proxy is set to do incremental updates or not
		var dataToPersist;
		if( this.incremental ) {
			dataToPersist = changedData;               // uses incremental updates, we can just send it the changes
		} else {
			dataToPersist = model.getPersistedData();  // non-incremental updates, provide all persisted data
		}
		
		
		// Handle needing a different "root" wrapper object for the data
		if( this.rootProperty ) {
			var dataWrap = {};
			dataWrap[ this.rootProperty ] = dataToPersist;
			dataToPersist = dataWrap;
		}
		
		
		// Finally, persist to the server
		this.ajax( {
			async    : ( typeof options.async === 'undefined' ) ? true : options.async,  // async defaults to true.
			
			url      : this.buildUrl( model.getId() ),
			type     : 'PUT',
			data     : JSON.stringify( dataToPersist ),
			contentType : 'application/json',
			
			success  : options.success  || Kevlar.emptyFn,
			error    : options.error    || Kevlar.emptyFn,
			complete : options.complete || Kevlar.emptyFn,
			context  : options.scope    || window
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
	 */
	destroy : function( model, options ) {
		options = options || {};
		
		this.ajax( {
			async    : ( typeof options.async === 'undefined' ) ? true : options.async,  // async defaults to true.
			
			url      : this.buildUrl( model.getId() ),
			type     : 'DELETE',
			
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
	 * @private
	 * @method buildUrl
	 * @param {String} [id] The ID of the Model.
	 * @return {String} The url to use.
	 */
	buildUrl : function( id ) {
		var url = this.urlRoot;
		
		// And now, use the model's ID to set the url.
		if( this.appendId && id ) {
			if( !url.match( /\/$/ ) ) {
				url += '/';
			}
			
			url += id;
		}
		
		return url;
	}
	
} );

// Register the proxy so that it can be created by an object literal with a `type` property
Kevlar.persistence.Proxy.register( 'rest', Kevlar.persistence.RestProxy );