/**
 * @class Kevlar.Model
 * @extends Kevlar.util.Observable
 * 
 * Data storage and persistence facility for Quark data. 
 * 
 * @constructor
 * @param {Object} data Any initial data for the attributes, specified in an object (hash map).
 */
/*global window, Kevlar */
Kevlar.Model = Kevlar.extend( Kevlar.util.Observable, {
	
	/**
	 * @cfg {Kevlar.persistence.Proxy} proxy
	 * The proxy to use (if any) to persist the data to the server.
	 */
	
	/**
	 * @cfg {String[]/Object[]} addFields
	 * Array of {@link Kevlar.Field Field} declarations. These are objects with any number of properties, but they
	 * must have the property 'name'. See {@link Kevlar.Field} for more information. They will become instantiated
	 * {@link Kevlar.Field} objects upon instantiation.<br><br>
	 * 
	 * Fields defined on the prototype of a Model (like below), and its subclasses, are concatenated together come
	 * instantiation time. This means that the Kevlar.Model base class can define the 'id' field, and then subclasses
	 * can define their own fields to append to it.  So if a subclass defined the fields `[ 'name', 'phone' ]`, then the
	 * final concatenated array of fields for the subclass would be `[ 'id', 'name', 'phone' ]`. This works for however many
	 * levels of subclasses there are.<br><br>
	 * 
	 * This array will become an object (hash) come instantiation time, with the keys as the field names, and the values as
	 * the instantiated {@link Kevlar.Field} objects that represent them.
	 */
	addFields : [],
	
	/**
	 * @cfg {String} idField
	 * The field that should be used as the ID for the Model. 
	 */
	idField : "id",
	
	
	/**
	 * @private
	 * @property {Object} data
	 * A hash that holds the current data for the {@link Kevlar.Field Fields}. The property names in this object match 
	 * the field names.  This hash holds the current data as it is modified by {@link #set}.
	 */
	
	/**
	 * @private
	 * @property {Boolean} dirty
	 * Flag for quick-testing if the Model currently has un-committed data.
	 */
	dirty : false,
	
	/**
	 * @private 
	 * @property {Object} modifiedData
	 * A hash that serves two functions:<br> 
	 * 1) Properties are set to it when a field is modified. The property name is the field {@link Kevlar.Field#name}. 
	 * This allows it to be used to determine which fields have been modified. 
	 * 2) The <b>original</b> (non-committed) data of the field (before it was {@link #set}) is stored as the value of the 
	 * property. When rolling back changes (via {@link #rollback}), these values are copied back onto the {@link #data} object
	 * to overwrite the data to be rolled back.
	 * 
	 * Went back and forth with naming this `originalData` and `modifiedData`, because it stores original data, but is used
	 * to determine which data is modified... 
	 */
	
	/**
	 * @hide
	 * @property {String} id (readonly)
	 * The id for the Model. This property is set when the field specified by the {@link #idField} config
	 * is {@link #set}. 
	 * 
	 * *** Note: This property is here solely to maintain compatibility with Backbone's Collection, and should
	 * not be accessed or used, as it will most likely be removed in the future.
	 */
	
	/**
	 * @hide
	 * @property {String} cid (readonly)
	 * A "client id" for the Model. This is a uniquely generated identifier assigned to the Model.
	 * 
	 * *** Note: This property is here solely to maintain compatibility with Backbone's Collection, and should
	 * not be accessed or used, as it will most likely be removed in the future.
	 */
	
	
	constructor : function( data ) {		
		// Call superclass constructor
		Kevlar.Model.superclass.constructor.call( this );
		
		// If this class has a proxy definition that is an object literal, instantiate it *onto the prototype*
		// (so one Proxy instance can be shared for every model)
		if( typeof this.proxy === 'object' && !( this.proxy instanceof Kevlar.persistence.Proxy ) ) {
			this.constructor.prototype.proxy = Kevlar.persistence.Proxy.create( this.proxy );
		}
		
		
		this.addEvents(
			/**
			 * Fires when a {@link Kevlar.Field} in the Model has changed its value. This is a 
			 * convenience event to respond to just a single field's change. Ex: if you want to
			 * just respond to the `title` field's change, you could subscribe to `change:title`. 
			 * 
			 * @event change:[fieldName]
			 * @param {Kevlar.Model} model This Model instance.
			 * @param {Mixed} value The new value. 
			 */
			
			/**
			 * Fires when a {@link Kevlar.Field} in the Model has changed its value.
			 * 
			 * @event change
			 * @param {Kevlar.Model} model This Model instance.
			 * @param {String} fieldName The field name for the Field that was changed.
			 * @param {Mixed} value The new value.
			 */
			'change'
		);
		
		// Initialize the 'fields' array, which gets turned into an object (hash)
		this.initFields();
		
		
		// Create a "client id" to maintain compatibility with Backbone's Collection
		this.cid = 'c' + (++Kevlar.Model.currentCid);
		
		// Default the data to an empty object
		data = data || {};
		
		// Set the default values for fields that don't have a value.
		// Note: This has the side effect of putting the 'undefined' value into the 'data' hash for field data that wasn't
		// provided, and doesn't have a default. This allows 'convert' fields that weren't specified with a value to get their
		// initial value when the call to this.set() is made later in this method.
		var fields = this.fields;  // this.fields is now a hash of the Field objects, keyed by their name
		for( var name in fields ) {
			if( data[ name ] === undefined ) {
				data[ name ] = fields[ name ].defaultValue;
			}
		}
		
		// Initialize the data 
		this.data = {};  // re-initialize the instance property (formerly a config) to an empty hash. This will be populated by the call to set()
		this.modifiedData = {};
		
		this.set( data );
		this.commit();  // because we are initializing, the data is not dirty
		
		// Call hook method for subclasses
		this.initialize( data );
	},
	
	
	/**
	 * Hook methods for subclasses to initialize themselves. This method should be overridden in subclasses to 
	 * provide any model-specific initialization.
	 * 
	 * Note that it is good practice to always call the superclass `initialize` method from within yours (even if
	 * your class simply extends Kevlar.Model, which has no `initialize` implementation). This is to future proof it
	 * from being moved under another superclass, or if there is ever an implementation made in this class.
	 * 
	 * Ex:
	 *     MyModel = Kevlar.Model.extend( {
	 *         initialize : function() {
	 *             MyModel.superclass.initialize.apply( this, arguments );   // or could be MyModel.__super__.initialize.apply( this, arguments );
	 *             
	 *             // my initialization logic goes here
	 *         }
	 *     }
	 * 
	 * @protected
	 * @method initialize
	 * @param {Object} data The initial data provided to the Kevlar.Model constructor.
	 */
	initialize : Kevlar.emptyFn,
	
	
	
	/**
	 * Initializes the Model's {@link #fields} by walking up the prototype change from the current Model subclass
	 * up to this (the base) class, collecting their `addFields` arrays, and combining them into one single fields hash. 
	 * See {@link fields} for more information.
	 * 
	 * @private
	 * @method initFields
	 */
	initFields : function() {
		this.fields = {};
		
		// Define concatenated fields array from all subclasses
		var fieldsObjects = [],
		    currentConstructor = this.constructor,
		    currentProto = currentConstructor.prototype;
		
		// Walk up the prototype chain from the current object, collecting 'addFields' objects as we go along
		do {
			if( currentProto.hasOwnProperty( 'addFields' ) && Kevlar.isArray( currentProto.addFields ) ) {    // skip over any prototype that doesn't define 'addFields' itself
				fieldsObjects = fieldsObjects.concat( currentProto.addFields );
			}
		} while( ( currentConstructor = ( currentProto = currentConstructor.superclass ) && currentProto.constructor ) );
		
		// After we have the array of fields, go backwards through them, which allows fields from subclasses to override those in superclasses
		for( var i = fieldsObjects.length; i--; ) {
			var fieldObj = fieldsObjects[ i ];
			
			// Normalize to a Kevlar.Field configuration object if it is a string
			if( typeof fieldObj === 'string' ) {
				fieldObj = { name: fieldObj };
			}
			
			var field = this.createField( fieldObj );
			this.fields[ field.getName() ] = field;
		}
	},
	
	
	/**
	 * Factory method which by default creates a {@link Kevlar.Field}, but may be overridden by subclasses
	 * to create different {@link Kevlar.Field} subclasses. 
	 * 
	 * @protected
	 * @method createField
	 * @param {Object} fieldObj The field object provided on the prototype. If it was a string, it will have been
	 *   normalized to the object `{ name: fieldName }`.
	 * @return {Kevlar.Field}
	 */
	createField : function( fieldObj ) {
		return new Kevlar.Field( fieldObj );
	},
	
	
	/**
	 * Retrieves the Field objects that are present for the Model, in an object (hashmap) where the keys
	 * are the Field names, and the values are the {@link Kevlar.Field} objects themselves.
	 * 
	 * @method getFields
	 * @return {Object} 
	 */
	getFields : function() {
		return this.fields;
	},
	
	
	// --------------------------------
	
	
	/**
	 * Retrieves the ID for the Model. This uses the configured {@link #idField} to retrieve
	 * the correct ID field for the Model.
	 * 
	 * @method getId
	 * @return {Mixed} The ID for the Model.
	 */
	getId : function() {
		return this.get( this.idField );
	},

	
	// --------------------------------
	
	
	/**
	 * Retrieves the value for the field given by `key`.
	 * 
	 * @method get
	 * @param {String} fieldName The name of the Field whose value to retieve.
	 * @return {Mixed} The value of the field given by `key`, or undefined if the key was not found. 
	 */
	get : function( key ) {
		if( !( key in this.data ) ) {
			throw new Error( "Kevlar.Model::get() error: provided key '" + key + "' was not found in the Model." );
		}
		return this.data[ key ];
	},
	
	
	/**
	 * Sets the value for a {@link Kevlar.Field Field} given its `name`, and a `value`. For example, a call could be made as this:
	 * <pre><code>model.set( 'field1', 'value1' );</code></pre>
	 * 
	 * As an alternative form, multiple valuse can be set at once by passing an Object into the first argument of this method. Ex:
	 * <pre><code>model.set( { key1: 'value1', key2: 'value2' } );</code></pre>
	 * Note that in this form, the method will ignore any property in the object (hash) that don't have associated Fields.<br><br>
	 * 
	 * When fields are set, their {@link Kevlar.Field#convert} method is run, if they have one defined.
	 * 
	 * @method set
	 * @param {String/Object} fieldName The field name for the Field to set, or an object (hash) of name/value pairs.
	 * @param {Mixed} [value] The value to set to the field. Required if the `fieldName` argument is a string (i.e. not a hash). 
	 */
	set : function( fieldName, value ) {
		var fields = this.fields,
		    fieldsWithConverts = [];
		
		if( typeof fieldName === 'object' ) {
			// Hash provided 
			var values = fieldName;  // for clarity, and so we can reuse the fieldName variable
			
			for( fieldName in values ) {
				// filter out prototype properties of the provided object (hash), and make sure there is an associated field for the property
				// (i.e. ignore any properties that don't have an associated Field).
				if( values.hasOwnProperty( fieldName ) && ( fieldName in fields ) ) {
					
					// Fields with converts have to be deferred for their set() call until all fields without converts
					// have been processed, to guarantee that they have access to all non-converted data first.
					if( typeof fields[ fieldName ].convert === 'function' ) {
						fieldsWithConverts.push( fieldName );  // push it onto the array, to be handled later
					} else {
						this.set( fieldName, values[ fieldName ] );
					}
					
				}
			}
			
			// After all fields without a 'convert' function have been set, we can now set the ones with a 'convert' function.
			// This is done so that fields with a convert function have access to the data for fields without a 'convert' function
			// before their 'convert' function is run.
			for( var i = 0, len = fieldsWithConverts.length; i < len; i++ ) {
				fieldName = fieldsWithConverts[ i ];
				this.set( fieldName, values[ fieldName ] );
			}
			
		} else {
			// fieldName and value provided
			var field = fields[ fieldName ];
			if( !field ) {
				throw new Error( "Kevlar.Model.set(): A field with the fieldName '" + fieldName + "' was not found." );
			}
			
			// Get the current value of the field
			var currentValue = this.data[ fieldName ];
			
			// If the field has a 'convert' function defined, call it to convert the data
			if( typeof field.convert === 'function' ) {
				value = field.convert.call( field.scope || window, value, this );  // provided the value, and the Model instance
			}
			
			// Store the field's *current* value (not the new value) into the "modifiedData" fields hash.
			// This should only happen the first time the field is set, so that the field can be rolled back even if there are multiple
			// set() calls to change it.
			if( !( fieldName in this.modifiedData ) ) {
				this.modifiedData[ fieldName ] = currentValue;
			}
			this.data[ fieldName ] = value;
			this.dirty = true;
			
			// If the field is the "idField", set the `id` property on the model for compatibility with Backbone's Collection
			if( fieldName === this.idField ) {
				this.id = value;
			}
			
			this.fireEvent( 'change:' + fieldName, this, value );
			this.fireEvent( 'change', this, fieldName, value );
		}
	},
	
	
	/**
	 * Returns the default value specified for a Field.
	 * 
	 * @method getDefault
	 * @param {String} fieldName The field name to retrieve the default value for.
	 * @return {Mixed} The default value for the field.
	 */
	getDefault : function( fieldName ) {
		return this.fields[ fieldName ].defaultValue;
	},
	
	
	/**
	 * Determines if the Model has a given field (attribute).
	 * 
	 * @method has
	 * @param {String} fieldName The name of the field (attribute) name to test for.
	 * @return {Boolean} True if the Model has the given field name.
	 */
	has : function( fieldName ) {
		return !!this.fields[ fieldName ];
	},
	
	
	// --------------------------------
	
	
	/**
	 * Determines if the Model currently has un-committed (i.e. changed) data.
	 * 
	 * @method isDirty
	 * @return {Boolean}
	 */
	isDirty : function() {
		return this.dirty;
	},
	
	
	/**
	 * Determines if a given field has been modified since the last {@link #commit} or {@link #rollback}.
	 * 
	 * @method isModified
	 * @param {String} fieldName
	 * @return {Boolean} True if the field has been modified, false otherwise.
	 */
	isModified : function( fieldName ) {
		return this.modifiedData.hasOwnProperty( fieldName );
	},
	
	
	/**
	 * Retrieves all {@link Kevlar.Field Field} values held by the Model whose values have been changed since the last
	 * {@link #commit} or {@link #rollback}.
	 * 
	 * @method getChanges
	 * @return {Object} A hash of the fields that have been changed since the last {@link #commit} or {@link #rollback}.
	 *   The hash's property names are the field names, and the hash's values are the new values.
	 */
	getChanges : function() {
		var modifiedData = this.modifiedData,
		    changes = {};
			
		for( var fieldName in modifiedData ) {
			if( modifiedData.hasOwnProperty( fieldName ) ) {
				changes[ fieldName ] = this.get( fieldName );
			}
		}		
		return changes;
	},
	
	
	/**
	 * Retrieves the values for all of the fields in the Model. Note: returns a copy of the data so that the object
	 * retrieved from this method may be modified.
	 * 
	 * @methods getData
	 * @return {Object} A hash of the data, where the property names are the keys, and the values are the {@link Kevlar.Field Field} values.
	 */
	getData : function() {
		return Kevlar.util.Object.clone( this.data );
	},
	
	
	/**
	 * Commits dirty fields' data. Data can no longer be reverted after a commit has been performed. Note: When developing with a {@link #proxy},
	 * this method should normally not need to be called explicitly, as it will be called upon the successful persistence of the Model's data
	 * to the server.
	 * 
	 * @method commit
	 */
	commit : function() {
		this.modifiedData = {};  // reset the modifiedData hash. There is no modified data.
		this.dirty = false;
	},
	
	
	/**
	 * Rolls back the Model fields that have been changed since the last commit or rollback.
	 * 
	 * @method rollback
	 */
	rollback : function() {
		// Loop through the modifiedData hash, which holds the *original* values, and set them back to the data hash.
		var modifiedData = this.modifiedData;
		for( var fieldName in modifiedData ) {
			if( modifiedData.hasOwnProperty( fieldName ) ) {
				this.data[ fieldName ] = modifiedData[ fieldName ];
			}
		}
		
		this.modifiedData = {};
		this.dirty = false;
	},
	
	
	// --------------------------------
	
	
	/**
	 * Sets the {@link #proxy} to use to persist the Model's data.
	 * 
	 * @method setProxy
	 * @param {Kevlar.persistence.Proxy} proxy
	 */
	setProxy : function( proxy ) {
		// Proxy's get placed on the prototype, so they are shared between instances
		this.constructor.prototype.proxy = proxy;
	},
	
	
	/**
	 * Loads the Model data from the server, using the configured {@link #proxy}.
	 * 
	 * @method load
	 * @param {Object} [options] An object which may contain the following properties:
	 * @param {Boolean} [options.async=true] True to make the request asynchronous, false to make it synchronous.
	 * @param {Function} [options.success] Function to call if the save is successful.
	 * @param {Function} [options.failure] Function to call if the save fails.
	 * @param {Function} [options.complete] Function to call when the operation is complete, regardless of a success or fail state.
	 * @param {Object} [options.scope=window] The object to call the `success`, `failure`, and `complete` callbacks in.
	 */
	load : function( options ) {
		options = options || {};
		
		// No proxy, cannot load. Throw an error
		if( !this.proxy ) {
			throw new Error( "Kevlar.Model::load() error: Cannot load. No proxy." );
		}
		
		var proxyOptions = {
			async    : ( typeof options.async === 'undefined' ) ? true : options.async,   // defaults to true
			success  : options.success  || Kevlar.emptyFn,
			failure  : options.failure  || Kevlar.emptyFn,
			complete : options.complete || Kevlar.emptyFn,
			scope    : options.scope    || window
		};
		
		// Make a request to update the data on the server
		this.proxy.read( this, proxyOptions );
	},
	
	
	/**
	 * Persists the Model data to the backend, using the configured {@link #proxy}. If the request to persist the Model's data is successful,
	 * the Model's data will be {@link #commit committed}.
	 * 
	 * @method save
	 * @param {Object} [options] An object which may contain the following properties:
	 * @param {Boolean} [options.async=true] True to make the request asynchronous, false to make it synchronous.
	 * @param {Function} [options.success] Function to call if the save is successful.
	 * @param {Function} [options.failure] Function to call if the save fails.
	 * @param {Function} [options.complete] Function to call when the operation is complete, regardless of a success or fail state.
	 * @param {Object} [options.scope=window] The object to call the `success`, `failure`, and `complete` callbacks in.
	 */
	save : function( options ) {
		options = options || {};
		
		// No proxy, cannot save. Throw an error
		if( !this.proxy ) {
			throw new Error( "Kevlar.Model::save() error: Cannot save. No proxy." );
		}
		
		// Store a "snapshot" of the data that is being persisted. This is used to compare against the Model's current data at the time of when the persistence operation 
		// completes. Anything that does not match this persisted snapshot data must have been updated while the persistence operation was in progress, and the Model must 
		// be marked as dirty for those fields after its commit() runs. This is a bit roundabout that a commit() operation runs when the persistence operation is complete
		// and then data is manually modified, but this is also the correct time to run the commit() operation, as we still want to see the changes if the request fails. 
		// So, if a persistence request fails, we should have all of the data still marked as dirty, both the data that was to be persisted, and any new data that was set 
		// while the persistence operation was being attempted.
		var persistedData = Kevlar.util.Object.clone( this.data );
		
		var successCallback = function() {
			// The request to persist the data was successful, commit the Model
			this.commit();
			
			// Loop over the persisted snapshot data, and see if any Model attributes were updated while the persistence request was taking place.
			// If so, those fields should be marked as modified, with the snapshot data used as the "originals". See the note above where persistedData was set. 
			var currentData = this.getData();
			for( var fieldName in persistedData ) {
				if( persistedData.hasOwnProperty( fieldName ) && !Kevlar.util.Object.isEqual( persistedData[ fieldName ], currentData[ fieldName ] ) ) {
					this.modifiedData[ fieldName ] = persistedData[ fieldName ];   // set the last persisted value on to the "modifiedData" object. Note: "modifiedData" holds *original* values, so that the "data" object can hold the latest values. It is how we know a field is modified as well.
					this.dirty = true;
				}
			}
			
			
			if( typeof options.success === 'function' ) {
				options.success.call( options.scope || window );
			}
		};
		
		var failureCallback = function() {
			if( typeof options.failure === 'function' ) {
				options.failure.call( options.scope || window );
			}
		};
		
		var completeCallback = function() {
			if( typeof options.complete === 'function' ) {
				options.complete.call( options.scope || window );
			}
		};
		
		var proxyOptions = {
			async    : ( typeof options.async === 'undefined' ) ? true : options.async,   // defaults to true
			success  : successCallback,
			failure  : failureCallback,
			complete : completeCallback,
			scope    : this
		};
		
		// Make a request to update the data on the server
		this.proxy.update( this, proxyOptions );
	}
	
} );


/**
 * Alias of {@link #load}. See {@link #load} for description and arguments.
 * 
 * @method fetch
 */
Kevlar.Model.prototype.fetch = Kevlar.Model.prototype.load;


/**
 * Alias of {@link #getData}, which is currently just for compatibility with 
 * Backbone's Collection. Do not use. Use {@link #getData} instead.
 * 
 * @method toJSON
 */
Kevlar.Model.prototype.toJSON = Kevlar.Model.prototype.getData;


/**
 * Static property used to provide a "client id" to models. See {@link #cid}.
 * 
 * @static 
 * @private
 * @property currentCid
 */
Kevlar.Model.currentCid = 0;