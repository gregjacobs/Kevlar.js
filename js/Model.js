/**
 * @class Kevlar.Model
 * @extends Kevlar.util.Observable
 * 
 * Generalized data storage class, which has a number of data-related features, including the ability to persist the data to a backend server.
 * Basically, a Model represents some object of data that your application uses. For example, in an online store, one might define two Models: 
 * one for Users, and the other for Products. These would be `User` and `Product` models, respectively. Each of these Models would in turn,
 * have the {@link Kevlar.Attribute Attributes} (data values) that each Model is made up of. Ex: A User model may have: `userId`, `firstName`, and 
 * `lastName` Attributes.
 */
/*global window, Kevlar */
/*jslint forin:true */
Kevlar.Model = Kevlar.extend( Kevlar.util.Observable, {
	
	/**
	 * @cfg {Kevlar.persistence.Proxy} proxy
	 * The proxy to use (if any) to persist the data to the server.
	 */
	proxy : null,
	
	/**
	 * @cfg {String[]/Object[]} attributes
	 * Array of {@link Kevlar.Attribute Attribute} declarations. These are objects with any number of properties, but they
	 * must have the property 'name'. See the configuration options of {@link Kevlar.Attribute} for more information. 
	 * 
	 * Anonymous config objects defined here will become instantiated {@link Kevlar.Attribute} objects. An item in the array may also simply 
	 * be a string, which will specify the name of the {@link Kevlar.Attribute Attribute}, with no other {@link Kevlar.Attribute Attribute} 
	 * configuration options.
	 * 
	 * Attributes defined on the prototype of a Model, and its superclasses, are concatenated together come
	 * instantiation time. This means that the Kevlar.Model base class can define the 'id' attribute, and then subclasses
	 * can define their own attributes to append to it. So if a subclass defined the attributes `[ 'name', 'phone' ]`, then the
	 * final concatenated array of attributes for the subclass would be `[ 'id', 'name', 'phone' ]`. This works for however many
	 * levels of subclasses there are.
	 * 
	 * Example:
	 * 
	 *     attributes : [
	 *         'id',    // name-only; no other configs for this attribute (not recommended! should declare the {@link Kevlar.Attribute#type type})
	 *         { name: 'firstName', type: 'string' },
	 *         { name: 'lastName', type: 'string' },
	 *         {
	 *             name : 'fullName',
	 *             get  : function( value, model ) {
	 *                 return model.get( 'firstName' ) + ' ' + model.get( 'lastName' );
	 *             }
	 *         }
	 *     ]
	 * 
	 * Note: If using hierarchies of more than one Model subclass deep, consider using the {@link #addAttributes} alias instead of this
	 * config, which does the same thing (defines attributes), but better conveys that attributes in subclasses are being *added* to the
	 * attributes of the superclass, rather than *overriding* attributes of the superclass.
	 */
	attributes : [],
	
	/**
	 * @cfg {String[]/Object[]} addAttributes
	 * Alias of {@link #attributes}, which may make more sense to use in hierarchies of models that go past more than one level of nesting, 
	 * as it conveys the meaning that the attributes are being *added* to the attributes that are already defined in its superclass, not
	 * replacing them.
	 * 
	 * This config is recommended over {@link #attributes} for any hierarchy of models that goes past one level of nesting, or even those that 
	 * don't but may do so in the future.
	 */
	
	/**
	 * @cfg {String} idAttribute
	 * The attribute that should be used as the ID for the Model. 
	 */
	idAttribute : 'id',
	
	
	/**
	 * @private
	 * @property {Object} attributes
	 * 
	 * A hash of the combined Attributes, which have been put together from the current Model subclass, and all of
	 * its superclasses. This is created by the {@link #initAttributes} method upon instantiation.
	 */
	
	/**
	 * @private
	 * @property {Object} data
	 * 
	 * A hash that holds the current data for the {@link Kevlar.Attribute Attributes}. The property names in this object match 
	 * the attribute names.  This hash holds the current data as it is modified by {@link #set}.
	 */
	
	/**
	 * @private
	 * @property {Boolean} dirty
	 * 
	 * Flag for quick-testing if the Model currently has un-committed data.
	 */
	dirty : false,
	
	/**
	 * @private 
	 * @property {Object} modifiedData
	 * A hash that serves two functions:<br> 
	 * 1) Properties are set to it when an attribute is modified. The property name is the attribute {@link Kevlar.Attribute#name}. 
	 * This allows it to be used to determine which attributes have been modified. 
	 * 2) The <b>original</b> (non-committed) data of the attribute (before it was {@link #set}) is stored as the value of the 
	 * property. When rolling back changes (via {@link #rollback}), these values are copied back onto the {@link #data} object
	 * to overwrite the data to be rolled back.
	 * 
	 * Went back and forth with naming this `originalData` and `modifiedData`, because it stores original data, but is used
	 * to determine which data is modified... 
	 */
	
	/**
	 * @hide
	 * @property {String} id (readonly)
	 * The id for the Model. This property is set when the attribute specified by the {@link #idAttribute} config
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
	
	
	/**
	 * Creates a new Model instance.
	 * 
	 * @constructor 
	 * @param {Object} [data] Any initial data for the {@link #attributes attributes}, specified in an object (hash map). See {@link #set}.
	 */
	constructor : function( data ) {		
		// Call superclass constructor
		Kevlar.Model.superclass.constructor.call( this );
		
		// If this class has a proxy definition that is an object literal, instantiate it *onto the prototype*
		// (so one Proxy instance can be shared for every model)
		if( this.proxy && typeof this.proxy === 'object' && !( this.proxy instanceof Kevlar.persistence.Proxy ) ) {
			this.constructor.prototype.proxy = Kevlar.persistence.Proxy.create( this.proxy );
		}
		
		
		this.addEvents(
			/**
			 * Fires when a {@link Kevlar.Attribute} in the Model has changed its value. This is a 
			 * convenience event to respond to just a single attribute's change. Ex: if you want to
			 * just respond to the `title` attribute's change, you could subscribe to `change:title`. Ex:
			 * 
			 *     model.addListener( 'change:myAttribute', function( model, newValue ) { ... } );
			 * 
			 * @event change:[attributeName]
			 * @param {Kevlar.Model} model This Model instance.
			 * @param {Mixed} value The new value. 
			 */
			
			/**
			 * Fires when a {@link Kevlar.Attribute} in the Model has changed its value.
			 * 
			 * @event change
			 * @param {Kevlar.Model} model This Model instance.
			 * @param {String} attributeName The attribute name for the Attribute that was changed.
			 * @param {Mixed} value The new value.
			 */
			'change',
			
			/**
			 * Fires when the data in the model is {@link #method-commit committed}. This happens if the
			 * {@link #method-commit commit} method is called, and after a successful {@link #save}.
			 * 
			 * @event commit
			 * @param {Kevlar.Model} model This Model instance.
			 */
			'commit',
			
			/**
			 * Fires when the Model has been destroyed (via {@link #method-destroy}).
			 * 
			 * @event destroy
			 * @param {Kevlar.Model} model This Model instance.
			 */
			'destroy'
		);
		
		// Initialize the 'attributes' array, which gets turned into an object (hash)
		this.initAttributes();
		
		
		// Create a "client id" to maintain compatibility with Backbone's Collection
		this.cid = 'c' + (++Kevlar.Model.currentCid);
		
		// Default the data to an empty object
		data = data || {};
		
		// Set the default values for attributes that don't have an initial value.
		var attributes = this.attributes,  // this.attributes is a hash of the Attribute objects, keyed by their name
		    attributeDefaultValue;
		for( var name in attributes ) {
			if( data[ name ] === undefined && ( attributeDefaultValue = attributes[ name ].defaultValue ) !== undefined ) {
				data[ name ] = attributeDefaultValue;
			}
		}
		
		// Initialize the underlying data object, which stores all attribute values
		this.data = {};
		
		// Initialize the data hash for storing attribute names of modified data, and their original values (see property description)
		this.modifiedData = {};
		
		// Set the initial data / defaults, if we have any
		this.set( data );
		this.commit();  // and because we are initializing, the data is not dirty
		
		// Call hook method for subclasses
		this.initialize();
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
	 * 
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
	 */
	initialize : Kevlar.emptyFn,
	
	
	
	/**
	 * Initializes the Model's {@link #attributes} by walking up the prototype change from the current Model subclass
	 * up to this (the base) class, collecting their `attributes` arrays, and combining them into one single attributes hash. 
	 * See {@link attributes} for more information.
	 * 
	 * @private
	 * @method initAttributes
	 */
	initAttributes : function() {
		this.attributes = {};
		
		// Define concatenated attributes array from all subclasses
		var attributesObjects = [],
		    currentConstructor = this.constructor,
		    currentProto = currentConstructor.prototype;
		
		// Walk up the prototype chain from the current object, collecting 'attributes' and 'addAttributes' objects as we go along
		do {
			// skip over any prototype that doesn't define `attributes` or `addAttributes` itself
			if( currentProto.hasOwnProperty( 'attributes' ) && Kevlar.isArray( currentProto.attributes ) ) {    
				attributesObjects = attributesObjects.concat( currentProto.attributes );
			} else if( currentProto.hasOwnProperty( 'addAttributes' ) && Kevlar.isArray( currentProto.addAttributes ) ) {
				attributesObjects = attributesObjects.concat( currentProto.addAttributes );
			}
		} while( ( currentConstructor = ( currentProto = currentConstructor.superclass ) && currentProto.constructor ) );
		
		// After we have the array of attributes, go backwards through them, which allows attributes from subclasses to override those in superclasses
		for( var i = attributesObjects.length; i--; ) {
			var attributeObj = attributesObjects[ i ];
			
			// Normalize to a Kevlar.Attribute configuration object if it is a string
			if( typeof attributeObj === 'string' ) {
				attributeObj = { name: attributeObj };
			}
			
			var attribute = this.createAttribute( attributeObj );
			this.attributes[ attribute.getName() ] = attribute;
		}
	},
	
	
	/**
	 * Factory method which by default creates a {@link Kevlar.Attribute}, but may be overridden by subclasses
	 * to create different {@link Kevlar.Attribute} subclasses. 
	 * 
	 * @protected
	 * @method createAttribute
	 * @param {Object} attributeObj The attribute object provided on the prototype. If it was a string, it will have been
	 *   normalized to the object `{ name: attributeName }`.
	 * @return {Kevlar.Attribute}
	 */
	createAttribute : function( attributeObj ) {
		return new Kevlar.Attribute( attributeObj );
	},
	
	
	/**
	 * Retrieves the Attribute objects that are present for the Model, in an object (hashmap) where the keys
	 * are the Attribute names, and the values are the {@link Kevlar.Attribute} objects themselves.
	 * 
	 * @method getAttributes
	 * @return {Object} 
	 */
	getAttributes : function() {
		return this.attributes;
	},
	
	
	// --------------------------------
	
	
	/**
	 * Retrieves the ID for the Model. This uses the configured {@link #idAttribute} to retrieve
	 * the correct ID attribute for the Model.
	 * 
	 * @method getId
	 * @return {Mixed} The ID for the Model.
	 */
	getId : function() {
		// Provide a friendlier error message than what get() provides if the idAttribute is not an Attribute of the Model
		if( !( this.idAttribute in this.attributes ) ) {
			throw new Error( "Error: The `idAttribute` (currently set to an attribute named '" + this.idAttribute + "') was not found on the Model. Please set the `idAttribute` config to the name of the id attribute in the Model. The model can't be saved or destroyed without it." );
		}
		return this.get( this.idAttribute );
	},

	
	// --------------------------------
	
	
	/**
	 * Sets the value for a {@link Kevlar.Attribute Attribute} given its `name`, and a `value`. For example, a call could be made as this:
	 * 
	 *     model.set( 'attribute1', 'value1' );
	 * 
	 * As an alternative form, multiple valuse can be set at once by passing an Object into the first argument of this method. Ex:
	 * 
	 *     model.set( { key1: 'value1', key2: 'value2' } );
	 * 
	 * Note that in this form, the method will ignore any property in the object (hash) that don't have associated Attributes.<br><br>
	 * 
	 * When attributes are set, their {@link Kevlar.Attribute#set} method is run, if they have one defined.
	 * 
	 * @method set
	 * @param {String/Object} attributeName The attribute name for the Attribute to set, or an object (hash) of name/value pairs.
	 * @param {Mixed} [value] The value to set to the attribute. Required if the `attributeName` argument is a string (i.e. not a hash). 
	 */
	set : function( attributeName, value ) {
		if( typeof attributeName === 'object' ) {
			// Hash provided 
			var values = attributeName;  // for clarity
			for( var fldName in values ) {  // a new variable, 'fldName' instead of 'attributeName', so that JSLint stops whining about "Bad for in variable 'attributeName'" (for whatever reason it does that...)
				if( values.hasOwnProperty( fldName ) ) {
					this.set( fldName, values[ fldName ] );
				}
			}
			
		} else {
			// attributeName and value provided
			var attribute = this.attributes[ attributeName ];
			if( !attribute ) {
				throw new Error( "Kevlar.Model.set(): A attribute with the attributeName '" + attributeName + "' was not found." );
			}
			
			// Get the current value of the attribute
			var currentValue = this.data[ attributeName ];
			
			// If the attribute has a 'set' function defined, call it to convert the data
			if( typeof attribute.set === 'function' ) {
				value = attribute.set.call( attribute.scope || this, value, this );  // provided the value, and the Model instance
				
				// *** Temporary workaround to get the 'change' event to fire on an Attribute whose set() function does not
				// return a new value to set to the underlying data. This will be resolved once dependencies are 
				// automatically resolved in the Attribute's get() function
				if( value === undefined ) {
					// This is to make the following block below think that there is already data in for the attribute, and
					// that it has the same value. If we don't have this, the change event will fire twice, the
					// the model will be set as 'dirty', and the old value will be put into the `modifiedData` hash.
					if( !( attributeName in this.data ) ) {
						this.data[ attributeName ] = undefined;
					}
					
					// Fire the events with the value of the Attribute after it has been processed by any Attribute-specific `get()` function.
					value = this.get( attributeName );
					
					// Now manually fire the events
					this.fireEvent( 'change:' + attributeName, this, value );
					this.fireEvent( 'change', this, attributeName, value );
				}
			}
			
			// Only change if there is no current value for the attribute, or if new value is different from the current
			if( !( attributeName in this.data ) || !Kevlar.util.Object.isEqual( currentValue, value ) ) {
				// Store the attribute's *current* value (not the new value) into the "modifiedData" attributes hash.
				// This should only happen the first time the attribute is set, so that the attribute can be rolled back even if there are multiple
				// set() calls to change it.
				if( !( attributeName in this.modifiedData ) ) {
					this.modifiedData[ attributeName ] = currentValue;
				}
				this.data[ attributeName ] = value;
				this.dirty = true;
				
				
				// Now that we have set the new raw value to the internal `data` hash, we want to fire the events with the value
				// of the Attribute after it has been processed by any Attribute-specific `get()` function.
				value = this.get( attributeName );
				
				// If the attribute is the "idAttribute", set the `id` property on the model for compatibility with Backbone's Collection
				if( attributeName === this.idAttribute ) {
					this.id = value;
				}
				
				this.fireEvent( 'change:' + attributeName, this, value );
				this.fireEvent( 'change', this, attributeName, value );
			}
		}
	},
	
	
	/**
	 * Retrieves the value for the attribute given by `attributeName`. If the {@link Kevlar.Attribute Attribute} has a
	 * {@link Kevlar.Attribute#get get} function defined, that function will be called, and its return value
	 * will be used as the return of this method.
	 * 
	 * @method get
	 * @param {String} attributeName The name of the Attribute whose value to retieve.
	 * @return {Mixed} The value of the attribute returned by the Attribute's {@link Kevlar.Attribute#get get} function (if
	 * one exists), or the underlying value of the attribute. Will return undefined if there is no {@link Kevlar.Attribute#get get}
	 * function, and the value has never been set.  
	 */
	get : function( attributeName ) {
		if( !( attributeName in this.attributes ) ) {
			throw new Error( "Kevlar.Model::get() error: attribute '" + attributeName + "' was not found on the Model." );
		}
		
		var value = this.data[ attributeName ],
		    attribute = this.attributes[ attributeName ];
		    
		// If there is a `get` function on the Attribute, run it now to convert the value before it is returned.
		if( typeof attribute.get === 'function' ) {
			value = attribute.get.call( attribute.scope || this, value, this );  // provided the value, and the Model instance
		}
		
		return value;
	},
	
	
	/**
	 * Retrieves the *raw* value for the attribute given by `attributeName`. If the {@link Kevlar.Attribute Attributes} has a
	 * {@link Kevlar.Attribute#raw raw} function defined, that function will be called, and its return value will be used
	 * by the return of this method. If not, the underlying data that is currently stored will be returned, bypassing any
	 * {@link Kevlar.Attribute#get get} function defined on the {@link Kevlar.Attribute Attribute}.
	 * 
	 * @method raw
	 * @param {String} attributeName The name of the Attribute whose raw value to retieve.
	 * @return {Mixed} The value of the attribute returned by the Attribute's {@link Kevlar.Attribute#raw raw} function (if
	 * one exists), or the underlying value of the attribute. Will return undefined if there is no {@link Kevlar.Attribute#raw raw}
	 * function, and the value has never been set.
	 */
	raw : function( attributeName ) {
		if( !( attributeName in this.attributes ) ) {
			throw new Error( "Kevlar.Model::raw() error: attribute '" + attributeName + "' was not found on the Model." );
		}
		
		var value = this.data[ attributeName ],
		    attribute = this.attributes[ attributeName ];
		    
		// If there is a `raw` function on the Attribute, run it now to convert the value before it is returned.
		if( typeof attribute.raw === 'function' ) {
			value = attribute.raw.call( attribute.scope || this, value, this );  // provided the value, and the Model instance
		}
		
		return value;
	},
	
	
	/**
	 * Returns the default value specified for an Attribute.
	 * 
	 * @method getDefault
	 * @param {String} attributeName The attribute name to retrieve the default value for.
	 * @return {Mixed} The default value for the attribute.
	 */
	getDefault : function( attributeName ) {
		return this.attributes[ attributeName ].defaultValue;
	},
	
	
	/**
	 * Determines if the Model has a given attribute (attribute).
	 * 
	 * @method has
	 * @param {String} attributeName The name of the attribute (attribute) name to test for.
	 * @return {Boolean} True if the Model has the given attribute name.
	 */
	has : function( attributeName ) {
		return !!this.attributes[ attributeName ];
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
	 * Determines if a given attribute has been modified since the last {@link #method-commit} or {@link #method-rollback}.
	 * 
	 * @method isModified
	 * @param {String} attributeName
	 * @return {Boolean} True if the attribute has been modified, false otherwise.
	 */
	isModified : function( attributeName ) {
		return this.modifiedData.hasOwnProperty( attributeName );
	},
	
	
	/**
	 * Retrieves the values for all of the attributes in the Model. The Model attributes are retrieved via the {@link #get} method,
	 * to pre-process the data before it is returned in the final hash, unless the `raw` option is set to true,
	 * in which case the Model attributes are retrieved via {@link #raw}. 
	 * 
	 * Note: returns a copy of the data so that the object retrieved from this method may be modified.
	 * 
	 * @methods getData
	 * @param {Object} [options] An object (hash) of options to change the behavior of this method. This may include:
	 * @param {Boolean} [options.persistedOnly] True to have the method only return data for the persisted attributes (i.e.,
	 *   attributes with the {@link Kevlar.Attribute#persist persist} config set to true, which is the default).
	 * @param {Boolean} [options.raw] True to have the method only return the raw data for the attributes, by way of the {@link #raw} method. 
	 *   This is used for persistence, where the raw data values go to the server rather than higher-level objects, or where some kind of serialization
	 *   to a string must take place before persistence (such as for Date objects). 
	 * @return {Object} A hash of the data, where the property names are the keys, and the values are the {@link Kevlar.Attribute Attribute} values.
	 */
	getData : function( options ) {
		options = options || {};
		
		var attributes = this.attributes,
		    persistedOnly = !!options.persistedOnly,
		    raw = !!options.raw,
		    data = {};
		    
		for( var attributeName in this.attributes ) {
			if( !persistedOnly || attributes[ attributeName ].isPersisted() === true ) {
				data[ attributeName ] = ( raw ) ? this.raw( attributeName ) : this.get( attributeName );
			}
		}
		return Kevlar.util.Object.clone( data );
	},
	
	
	/**
	 * Retrieves the values for all of the {@link Kevlar.Attribute attributes} in the Model whose values have been changed since
	 * the last {@link #method-commit} or {@link #method-rollback}. 
	 * 
	 * The Model attributes are retrieved via the {@link #get} method, to pre-process the data before it is returned in the final hash, 
	 * unless the `raw` option is set to true, in which case the Model attributes are retrieved via {@link #raw}. 
	 * 
	 * Note: returns a copy of the data so that the object retrieved from this method may be modified.
	 * 
	 * @method getChanges
	 * @param {Object} [options] An object (hash) of options to change the behavior of this method. This may include:
	 * @param {Boolean} [options.persistedOnly] True to have the method only return data for the persisted Attributes (i.e.,
	 *   Attributes with the {@link Kevlar.Attribute#persist persist} config set to true, which is the default).
	 * @param {Boolean} [options.raw] True to have the method only return the raw data for the attributes, by way of the {@link #raw} method. 
	 *   This is used for persistence, where the raw data values go to the server rather than higher-level objects, or where some kind of serialization
	 *   to a string must take place before persistence (such as for Date objects). 
	 * @return {Object} A hash of the attributes that have been changed since the last {@link #commit} or {@link #rollback}.
	 *   The hash's property names are the attribute names, and the hash's values are the new values.
	 */
	getChanges : function( options ) {
		options = options || {};
		
		var modifiedData = Kevlar.util.Object.clone( this.modifiedData ),
		    attributes = this.attributes,
		    persistedOnly = !!options.persistedOnly,
		    raw = !!options.raw,
		    changes = {};
		
		for( var attributeName in modifiedData ) {
			if( !persistedOnly || attributes[ attributeName ].isPersisted() === true ) {
				changes[ attributeName ] = ( raw ) ? this.raw( attributeName ) : this.get( attributeName );
			}
		}
		return changes;
	},
	
	
	/**
	 * Commits dirty attributes' data. Data can no longer be reverted after a commit has been performed. Note: When developing with a {@link #proxy},
	 * this method should normally not need to be called explicitly, as it will be called upon the successful persistence of the Model's data
	 * to the server.
	 * 
	 * @method commit
	 */
	commit : function() {
		this.modifiedData = {};  // reset the modifiedData hash. There is no modified data.
		this.dirty = false;
		
		this.fireEvent( 'commit', this );
	},
	
	
	/**
	 * Rolls back the Model attributes that have been changed since the last commit or rollback.
	 * 
	 * @method rollback
	 */
	rollback : function() {
		// Loop through the modifiedData hash, which holds the *original* values, and set them back to the data hash.
		var modifiedData = this.modifiedData;
		for( var attributeName in modifiedData ) {
			if( modifiedData.hasOwnProperty( attributeName ) ) {
				this.data[ attributeName ] = modifiedData[ attributeName ];
			}
		}
		
		this.modifiedData = {};
		this.dirty = false;
	},
	
	
	// --------------------------------
	
	
	/**
	 * @hide
	 * Creates a clone of the Model, by copying its instance data.
	 * 
	 * Note: This is a simplistic early version of the method, where the final version will most likely
	 * account for shared nested models and other such nested data. Do not use just yet.
	 * 
	 * @method clone
	 * @return {Kevlar.Model} The new Model instance, which is a clone of the Model this method was called on.
	 */
	clone : function() {
		return new this.constructor( Kevlar.util.Object.clone( this.data ) );
	},
	
	
	// --------------------------------
	
	
	/**
	 * Sets the {@link #proxy} to use to persist the Model's data. Note that this is set
	 * to the *prototype* of the Model, for use with all instances of the Model. Because
	 * of this, it is usually best to define the {@link #proxy} on the prototype of a Model
	 * subclass.
	 * 
	 * @method setProxy
	 * @param {Kevlar.persistence.Proxy} proxy
	 */
	setProxy : function( proxy ) {
		// Proxy's get placed on the prototype, so they are shared between instances
		this.constructor.prototype.proxy = proxy;
	},
	
	
	/**
	 * Gets the {@link #proxy} that is currently configured for this Model. Note that
	 * the same proxy instance is shared between all instances of the model.
	 * 
	 * @method getProxy
	 * @return {Kevlar.persistence.Proxy} The proxy, or null if there is no proxy currently set.
	 */
	getProxy : function() {
		return this.proxy;
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
	 * the Model's data will be {@link #method-commit committed} upon completion.
	 * 
	 * @method save
	 * @param {Object} [options] An object which may contain the following properties:
	 * @param {Boolean} [options.async=true] True to make the request asynchronous, false to make it synchronous.
	 * @param {Function} [options.success] Function to call if the save is successful.
	 * @param {Function} [options.error] Function to call if the save fails.
	 * @param {Function} [options.complete] Function to call when the operation is complete, regardless of a success or fail state.
	 * @param {Object} [options.scope=window] The object to call the `success`, `error`, and `complete` callbacks in. This may also
	 *   be provided as `context` if you prefer.
	 */
	save : function( options ) {
		options = options || {};
		var scope = options.scope || options.context || window;
		
		// No proxy, cannot save. Throw an error
		if( !this.proxy ) {
			throw new Error( "Kevlar.Model::save() error: Cannot save. No proxy." );
		}
		
		// Store a "snapshot" of the data that is being persisted. This is used to compare against the Model's current data at the time of when the persistence operation 
		// completes. Anything that does not match this persisted snapshot data must have been updated while the persistence operation was in progress, and the Model must 
		// be marked as dirty for those attributes after its commit() runs. This is a bit roundabout that a commit() operation runs when the persistence operation is complete
		// and then data is manually modified, but this is also the correct time to run the commit() operation, as we still want to see the changes if the request fails. 
		// So, if a persistence request fails, we should have all of the data still marked as dirty, both the data that was to be persisted, and any new data that was set 
		// while the persistence operation was being attempted.
		var persistedData = Kevlar.util.Object.clone( this.data );
		
		var successCallback = function() {
			// The request to persist the data was successful, commit the Model
			this.commit();
			
			// Loop over the persisted snapshot data, and see if any Model attributes were updated while the persistence request was taking place.
			// If so, those attributes should be marked as modified, with the snapshot data used as the "originals". See the note above where persistedData was set. 
			var currentData = this.getData();
			for( var attributeName in persistedData ) {
				if( persistedData.hasOwnProperty( attributeName ) && !Kevlar.util.Object.isEqual( persistedData[ attributeName ], currentData[ attributeName ] ) ) {
					this.modifiedData[ attributeName ] = persistedData[ attributeName ];   // set the last persisted value on to the "modifiedData" object. Note: "modifiedData" holds *original* values, so that the "data" object can hold the latest values. It is how we know an attribute is modified as well.
					this.dirty = true;
				}
			}
			
			
			if( typeof options.success === 'function' ) {
				options.success.call( scope );
			}
		};
		
		var errorCallback = function() {
			if( typeof options.error === 'function' ) {
				options.error.call( scope );
			}
		};
		
		var completeCallback = function() {
			if( typeof options.complete === 'function' ) {
				options.complete.call( scope );
			}
		};
		
		var proxyOptions = {
			async    : ( typeof options.async === 'undefined' ) ? true : options.async,   // defaults to true
			success  : successCallback,
			error    : errorCallback,
			complete : completeCallback,
			scope    : this
		};
		
		// Make a request to create or update the data on the server
		if( typeof this.getId() === 'undefined' ) {
			this.proxy.create( this, proxyOptions );
		} else {
			this.proxy.update( this, proxyOptions );
		}
	},
	
	
	/**
	 * Destroys the Model on the backend, using the configured {@link #proxy}.
	 * 
	 * @method destroy
	 * @param {Object} [options] An object which may contain the following properties:
	 * @param {Boolean} [options.async=true] True to make the request asynchronous, false to make it synchronous.
	 * @param {Function} [options.success] Function to call if the destroy is successful.
	 * @param {Function} [options.error] Function to call if the destroy fails.
	 * @param {Function} [options.complete] Function to call when the operation is complete, regardless of a success or fail state.
	 * @param {Object} [options.scope=window] The object to call the `success`, `error`, and `complete` callbacks in. This may also
	 *   be provided as `context` if you prefer.
	 */
	destroy : function( options ) {
		options = options || {};
		var scope = options.scope || options.context || window;
		
		// No proxy, cannot destroy. Throw an error
		if( !this.proxy ) {
			throw new Error( "Kevlar.Model::destroy() error: Cannot destroy. No proxy." );
		}
		
		var successCallback = function() {
			this.fireEvent( 'destroy', this );
			
			if( typeof options.success === 'function' ) {
				options.success.call( scope );
			}
		};
		var errorCallback = function() {
			if( typeof options.error === 'function' ) {
				options.error.call( scope );
			}
		};
		var completeCallback = function() {
			if( typeof options.complete === 'function' ) {
				options.complete.call( scope );
			}
		};
		
		var proxyOptions = {
			async    : ( typeof options.async === 'undefined' ) ? true : options.async,   // defaults to true
			success  : successCallback,
			error    : errorCallback,
			complete : completeCallback,
			scope    : this
		};
		
		// Make a request to destroy the data on the server
		this.proxy.destroy( this, proxyOptions );
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