/**
 * @class Kevlar.Model
 * @extends Kevlar.DataComponent
 * 
 * Generalized key/value data storage class, which has a number of data-related features, including the ability to persist its data to a backend server.
 * Basically, a Model represents some object of data that your application uses. For example, in an online store, one might define two Models: 
 * one for Users, and the other for Products. These would be `User` and `Product` models, respectively. Each of these Models would in turn,
 * have the {@link Kevlar.attribute.Attribute Attributes} (data values) that each Model is made up of. Ex: A User model may have: `userId`, `firstName`, and 
 * `lastName` Attributes.
 */
/*global window, Kevlar */
/*jslint forin:true */
Kevlar.Model = Kevlar.DataComponent.extend( {
	
	/**
	 * @cfg {Kevlar.persistence.Proxy} persistenceProxy
	 * The persistence proxy to use (if any) to persist the data to the server.
	 */
	persistenceProxy : null,
	
	/**
	 * @cfg {String[]/Object[]} attributes
	 * Array of {@link Kevlar.attribute.Attribute Attribute} declarations. These are objects with any number of properties, but they
	 * must have the property 'name'. See the configuration options of {@link Kevlar.attribute.Attribute} for more information. 
	 * 
	 * Anonymous config objects defined here will become instantiated {@link Kevlar.attribute.Attribute} objects. An item in the array may also simply 
	 * be a string, which will specify the name of the {@link Kevlar.attribute.Attribute Attribute}, with no other {@link Kevlar.attribute.Attribute Attribute} 
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
	 *         'id',    // name-only; no other configs for this attribute (not recommended! should declare the {@link Kevlar.attribute.Attribute#type type})
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
	
	/**
	 * @cfg {String[]/Object[]} addAttributes
	 * Alias of {@link #cfg-attributes}, which may make more sense to use in hierarchies of models that go past more than one level of nesting, 
	 * as it conveys the meaning that the attributes are being *added* to the attributes that are already defined in its superclass, not
	 * replacing them.
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
	 * its superclasses.
	 */
	
	/**
	 * @private
	 * @property {Object} data
	 * 
	 * A hash that holds the current data for the {@link Kevlar.attribute.Attribute Attributes}. The property names in this object match 
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
	 * A hash that serves two functions:
	 * 
	 * 1) Properties are set to it when an attribute is modified. The property name is the attribute {@link Kevlar.attribute.Attribute#name}. 
	 *    This allows it to be used to determine which attributes have been modified. 
	 * 2) The *original* (non-committed) data of the attribute (before it was {@link #set}) is stored as the value of the 
	 *    property. When rolling back changes (via {@link #method-rollback}), these values are copied back onto the {@link #data} object
	 *    to overwrite the data to be rolled back.
	 * 
	 * Went back and forth with naming this `originalData` and `modifiedData`, because it stores original data, but is used
	 * to determine which data is modified... 
	 */
	
	/**
	 * @private
	 * @property {Object} embeddedDataComponentChangeHandlers
	 * 
	 * A hashmap of {@link #change} handlers for any embedded DataComponents (which are defined by a {@link Kevlar.attribute.DataComponentAttribute} with
	 * {@link Kevlar.attribute.DataComponentAttribute#embedded} set to `true`).
	 * 
	 * This hashmap is keyed by the Attribute's name, and stores a Function reference as its value, which is the handler for a change
	 * event in the embedded DataComponent.
	 */
	
	/**
	 * @private
	 * @property {Object} embeddedCollectionAddRemoveReorderHandlers
	 * 
	 * A hashmap of {@link Kevlar.Collection#event-add}, {@link Kevlar.Collection#event-remove}, and {@link Kevlar.Collection#event-reorder} handlers for any
	 * embedded {@link Kevlar.Collection Collections}. An "embedded" Collection is defined by a {@link Kevlar.attribute.CollectionAttribute} with
	 * {@link Kevlar.attribute.CollectionAttribute#embedded} set to `true`.
	 * 
	 * This hashmap is keyed by the Attribute's name, and stores a Function reference as its value, which is the handler for the add/remove/reorder
	 * events in the embedded Collection.
	 */
	
	/**
	 * @private
	 * @property {Number} setCallCount
	 * 
	 * This variable supports the {@link #changeset} event, by keeping track of the number of calls to {@link #method-set}.
	 * When {@link #method-set} is called, this variable is incremented by 1. Just before {@link #method-set} returns, this variable is decremented
	 * by 1. If at the end of the {@link #method-set} method this variable reaches 0 again, the {@link #changeset} event is fired
	 * with all of the attribute changes since the first call to {@link #method-set}. This handles the recursive nature of the {@link #method-set} method,
	 * and the fact that {@link #method-set} may be called by Attribute {@link Kevlar.attribute.Attribute#cfg-set set} functions, and handlers of the
	 * {@link #change} event.
	 */
	setCallCount : 0,
	
	/**
	 * @private
	 * @property {Object} changeSetNewValues
	 * 
	 * A hashmap which holds the changes to attributes for the {@link #changeset} event to fire with. This hashmap collects the 
	 * changed values as calls to {@link #method-set} are made, and is used with the arguments that the {@link #changeset} event fires
	 * with (when it does fire, at the end of all of the calls to {@link #method-set}).
	 */
	
	/**
	 * @private
	 * @property {Object} changeSetOldValues
	 * 
	 * A hashmap which holds the changes to attributes for the {@link #changeset} event to fire with. This hashmap collects the 
	 * previous ("old") values as calls to {@link #method-set} are made, and is used with the arguments that the {@link #changeset} event fires
	 * with (when it does fire, at the end of all of the calls to {@link #method-set}).
	 */
	
	/**
	 * @private
	 * @property {String} id (readonly)
	 * The id for the Model. This property is set when the attribute specified by the {@link #idAttribute} config
	 * is {@link #set}. 
	 * 
	 * *** Note: This property is here solely to maintain compatibility with Backbone's Collection, and should
	 * not be accessed or used, as it will most likely be removed in the future.
	 */
	
	/**
	 * @protected
	 * @property {Boolean} destroyed
	 * 
	 * Flag that is set to true once the Model is successfully destroyed.
	 */
	destroyed : false,
	
	
	inheritedStatics : {
		/**
		 * A static property that is unique to each Kevlar.Model subclass, which uniquely identifies the subclass.
		 * This is used as part of the Model cache, where it is determined if a Model instance already exists
		 * if two models are of the same type (i.e. have the same __Kevlar_modelTypeId), and instance id.
		 * 
		 * @private
		 * @inheritable
		 * @static
		 * @property {Number} __Kevlar_modelTypeId
		 */
		
		
		// Subclass-specific setup
		/**
		 * @ignore 
		 */
		onClassExtended : function( newModelClass ) {
			// Assign a unique id to this class, which is used in hashmaps that hold the class
			newModelClass.__Kevlar_modelTypeId = Kevlar.newId();
			
			
			// Now handle initializing the Attributes, merging this subclass's attributes with the superclass's attributes
			var classPrototype = newModelClass.prototype,
			    superclassPrototype = newModelClass.superclass,
			    superclassAttributes = superclassPrototype.attributes || {},    // will be an object (hashmap) of attributeName -> Attribute instances
			    newAttributes = {}, 
			    attributeDefs = [],  // will be an array of Attribute configs (definitions) on the new subclass 
			    attributeObj,   // for holding each of the attributeDefs, one at a time
			    i, len;
			
			// Grab the 'attributes' or 'addAttributes' property from the new subclass's prototype. If neither of these are present,
			// will use the empty array instead.
			if( classPrototype.hasOwnProperty( 'attributes' ) ) {
				attributeDefs = classPrototype.attributes;
			} else if( classPrototype.hasOwnProperty( 'addAttributes' ) ) {
				attributeDefs = classPrototype.addAttributes;
			}
			
			// Instantiate each of the new subclass's Attributes, and then merge them with the superclass's attributes
			for( i = 0, len = attributeDefs.length; i < len; i++ ) {
				attributeObj = attributeDefs[ i ];
				
				// Normalize to a Kevlar.attribute.Attribute configuration object if it is a string
				if( typeof attributeObj === 'string' ) {
					attributeObj = { name: attributeObj };
				}
				
				// Create the actual Attribute instance
				var attribute = Kevlar.attribute.Attribute.create( attributeObj );
				newAttributes[ attribute.getName() ] = attribute;
			}
			
			newModelClass.prototype.attributes = Kevlar.apply( {}, newAttributes, superclassAttributes );  // newAttributes take precedence; superclassAttributes are used in the case that a newAttribute doesn't exist for a given attributeName
		},
		
		
		/**
		 * Retrieves the Attribute objects that are present for the Model, in an object (hashmap) where the keys
		 * are the Attribute names, and the values are the {@link Kevlar.attribute.Attribute} objects themselves.
		 * 
		 * @inheritable
		 * @static
		 * @method getAttributes
		 * @return {Object} An Object (hashmap) where the keys are the attribute {@link Kevlar.attribute.Attribute#name names},
		 *   and the values are the {@link Kevlar.attribute.Attribute Attribute} instances themselves.
		 */
		getAttributes : function() {
			// Note: `this` refers to the class (constructor function) that the static method was called on
			return this.prototype.attributes;
		}
		
	},
	
	
	
	/**
	 * Creates a new Model instance.
	 * 
	 * @constructor 
	 * @param {Object} [data] Any initial data for the {@link #cfg-attributes attributes}, specified in an object (hash map). See {@link #set}.
	 */
	constructor : function( data ) {
		var me = this;
		
		// Default the data to an empty object
		data = data || {};
		
		
		// --------------------------
		
		// Handle this new model being a duplicate of a model that already exists (with the same id)
				
		// If there already exists a model of the same type, with the same ID, update that instance,
		// and return that instance from the constructor. We don't create duplicate Model instances
		// with the same ID.
		me = Kevlar.ModelCache.get( me, data[ me.idAttribute ] );
		if( me !== this ) {
			me.set( data );   // set any provided initial data to the already-existing instance (as to combine them),
			return me;        // and then return the already-existing instance
		}
		
		
		// --------------------------
		
		
		// Call superclass constructor
		this._super( arguments );
		
		// If this class has a persistenceProxy definition that is an object literal, instantiate it *onto the prototype*
		// (so one Proxy instance can be shared for every model)
		if( me.persistenceProxy && typeof me.persistenceProxy === 'object' && !( me.persistenceProxy instanceof Kevlar.persistence.Proxy ) ) {
			me.constructor.prototype.persistenceProxy = Kevlar.persistence.Proxy.create( me.persistenceProxy );
		}
		
		
		me.addEvents(
			/**
			 * Fires when a {@link Kevlar.attribute.Attribute} in the Model has changed its value. This is a 
			 * convenience event to respond to just a single attribute's change. Ex: if you want to
			 * just respond to the `title` attribute's change, you could subscribe to `change:title`. Ex:
			 * 
			 *     model.addListener( 'change:title', function( model, newValue ) { ... } );
			 * 
			 * @event change:[attributeName]
			 * @param {Kevlar.Model} model This Model instance.
			 * @param {Mixed} newValue The new value, processed by the attribute's {@link Kevlar.attribute.Attribute#get get} function if one exists. 
			 * @param {Mixed} oldValue The old (previous) value, processed by the attribute's {@link Kevlar.attribute.Attribute#get get} function if one exists. 
			 */
			
			/**
			 * Fires when a {@link Kevlar.attribute.Attribute} in the Model has changed its value.
			 * 
			 * @event change
			 * @param {Kevlar.Model} model This Model instance.
			 * @param {String} attributeName The name of the attribute that was changed.
			 * @param {Mixed} newValue The new value, processed by the attribute's {@link Kevlar.attribute.Attribute#get get} function if one exists. 
			 * @param {Mixed} oldValue The old (previous) value, processed by the attribute's {@link Kevlar.attribute.Attribute#get get} function if one exists. 
			 */
			'change',
			
			/**
			 * Fires once at the end of one of more (i.e. a set) of Attribute changes to the model. Multiple changes may be made to the model in a "set" by
			 * providing the first argument to {@link #method-set} as an object, and/or may also result from having {@link Kevlar.attribute.Attribute#cfg-set Attribute set} 
			 * functions which modify other Attributes. Or, one final way that changes may be counted in a "set" is if handlers of the {@link #change} event end up
			 * setting Attributes on the Model as well.
			 * 
			 * @event changeset
			 * @param {Kevlar.Model} model This Model instance.
			 * @param {Object} newValues An object (hashmap) of the new values of the Attributes that changed. The object's keys (property names) are the
			 *   {@link Kevlar.attribute.Attribute#name Attribute names}, and the object's values are the new values for those Attributes.
			 * @param {Object} oldValues An object (hashmap) of the old values of the Attributes that changed. The object's keys (property names) are the
			 *   {@link Kevlar.attribute.Attribute#name Attribute names}, and the object's values are the old values that were held for those Attributes.
			 */
			'changeset',
			
			/**
			 * Fires when the data in the model is {@link #method-commit committed}. This happens if the
			 * {@link #method-commit commit} method is called, and after a successful {@link #save}.
			 * 
			 * @event commit
			 * @param {Kevlar.Model} model This Model instance.
			 */
			'commit',
			
			/**
			 * Fires when the data in the model is {@link #method-rollback rolled back}. This happens when the
			 * {@link #method-rollback rollback} method is called.
			 * 
			 * @event rollback
			 * @param {Kevlar.Model} model This Model instance.
			 */
			'rollback',
			
			/**
			 * Fires when the Model has been destroyed (via {@link #method-destroy}).
			 * 
			 * @event destroy
			 * @param {Kevlar.Model} model This Model instance.
			 */
			'destroy'
		);
		
		
		// Set the default values for attributes that don't have an initial value.
		var attributes = me.attributes,  // me.attributes is a hash of the Attribute objects, keyed by their name
		    attributeDefaultValue;
		for( var name in attributes ) {
			if( data[ name ] === undefined && ( attributeDefaultValue = attributes[ name ].getDefaultValue() ) !== undefined ) {
				data[ name ] = attributeDefaultValue;
			}
		}
		
		// Initialize the underlying data object, which stores all attribute values
		me.data = {};
		
		// Initialize the data hash for storing attribute names of modified data, and their original values (see property description)
		me.modifiedData = {};
		
		// Initialize the embeddedDataComponentChangeHandlers and embeddedCollectionAddRemoveReorderHandlers hashmaps
		me.embeddedDataComponentChangeHandlers = {};
		me.embeddedCollectionAddRemoveReorderHandlers = {};
		
		// Set the initial data / defaults, if we have any
		me.set( data );
		me.commit();  // and because we are initializing, the data is not dirty
		
		// Call hook method for subclasses
		me.initialize();
	},
	
	
	/**
	 * Hook method for subclasses to initialize themselves. This method should be overridden in subclasses to 
	 * provide any model-specific initialization.
	 * 
	 * Note that it is good practice to always call the superclass `initialize` method from within yours (even if
	 * your class simply extends Kevlar.Model, which has no `initialize` implementation itself). This is to future proof it
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
	 * Retrieves the Attribute objects that are present for the Model, in an object (hashmap) where the keys
	 * are the Attribute names, and the values are the {@link Kevlar.attribute.Attribute} objects themselves.
	 * 
	 * @method getAttributes
	 * @return {Object} An Object (hashmap) where the keys are the attribute {@link Kevlar.attribute.Attribute#name names},
	 *   and the values are the {@link Kevlar.attribute.Attribute Attribute} instances themselves.
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
			throw new Error( "Error: The `idAttribute` (currently set to an attribute named '" + this.idAttribute + "') was not found on the Model. Set the `idAttribute` config to the name of the id attribute in the Model. The model can't be saved or destroyed without it." );
		}
		return this.get( this.idAttribute );
	},
	
	
	/**
	 * Retrieves the "ID attribute" for the Model, if there is a valid id attribute. The Model has a valid ID attribute if there exists
	 * an attribute which is referenced by the {@link #idAttribute} config. Otherwise, returns null.
	 * 
	 * @method getIdAttribute
	 * @return {Kevlar.attribute.Attribute} The Attribute that represents the ID attribute, or null if there is no valid ID attribute.
	 */
	getIdAttribute : function() {
		return this.attributes[ this.idAttribute ] || null;
	},
	
	
	/**
	 * Retrieves the name of the "ID attribute" for the Model. This will be the attribute referenced by the {@link #idAttribute}
	 * config.
	 * 
	 * @method getIdAttributeName
	 * @return {String} The name of the "ID attribute".
	 */
	getIdAttributeName : function() {
		return this.idAttribute;
	},
	
	
	/**
	 * Determines if the Model has a valid {@link #idAttribute}. Will return true if there is an {@link #cfg-attributes attribute}
	 * that is referenced by the {@link #idAttribute}, or false otherwise.
	 * 
	 * @method hasIdAttribute
	 * @return {Boolean}
	 */
	hasIdAttribute : function() {
		return !!this.attributes[ this.idAttribute ];
	},

	
	// --------------------------------
	
	
	/**
	 * Sets the value for a {@link Kevlar.attribute.Attribute Attribute} given its `name`, and a `value`. For example, a call could be made as this:
	 * 
	 *     model.set( 'attribute1', 'value1' );
	 * 
	 * As an alternative form, multiple valuse can be set at once by passing an Object into the first argument of this method. Ex:
	 * 
	 *     model.set( { key1: 'value1', key2: 'value2' } );
	 * 
	 * Note that in this form, the method will ignore any property in the object (hash) that don't have associated Attributes.
	 * 
	 * When attributes are set, their {@link Kevlar.attribute.Attribute#cfg-set} method is run, if they have one defined.
	 * 
	 * @method set
	 * @param {String/Object} attributeName The attribute name for the Attribute to set, or an object (hash) of name/value pairs.
	 * @param {Mixed} [newValue] The value to set to the attribute. Required if the `attributeName` argument is a string (i.e. not a hash). 
	 */
	set : function( attributeName, newValue ) {
		// If coming into the set() method for the first time (non-recursively, not from an attribute setter, not from a 'change' handler, etc),
		// reset the hashmaps which will hold the newValues and oldValues that will be provided to the 'changeset' event.
		if( this.setCallCount === 0 ) {
			this.changeSetNewValues = {};
			this.changeSetOldValues = {};
		}
		
		// Increment the setCallCount, for use with the 'changeset' event. The 'changeset' event only fires when all calls to set() have exited.
		this.setCallCount++;
		
		var attributes = this.attributes,
		    changeSetNewValues = this.changeSetNewValues,
		    changeSetOldValues = this.changeSetOldValues;
		
		if( typeof attributeName === 'object' ) {
			// Hash provided
			var values = attributeName,  // for clarity
			    attrsWithSetters = [];
			
			for( var fldName in values ) {  // a new variable, 'fldName' instead of 'attributeName', so that JSLint stops whining about "Bad for in variable 'attributeName'" (for whatever reason it does that...)
				if( values.hasOwnProperty( fldName ) ) {
					// <debug>
					if( !attributes[ fldName ] ) {
						throw new Error( "Kevlar.Model.set(): An attribute with the attributeName '" + fldName + "' was not found." );
					}
					// </debug>
					if( attributes[ fldName ].hasUserDefinedSetter() ) {   // defer setting the values on attributes with user-defined setters until all attributes without user-defined setters have been set
						attrsWithSetters.push( fldName );
					} else {
						this.set( fldName, values[ fldName ] );
					}
				}
			}
			
			for( var i = 0, len = attrsWithSetters.length; i < len; i++ ) {
				fldName = attrsWithSetters[ i ];
				this.set( fldName, values[ fldName ] );
			}
			
		} else {
			// attributeName and newValue provided
			var attribute = attributes[ attributeName ];
			
			// <debug>
			if( !attribute ) {
				throw new Error( "Kevlar.Model.set(): An attribute with the attributeName '" + attributeName + "' was not found." );
			}
			// </debug>
			
			// Get the current (old) value of the attribute, and its current "getter" value (to provide to the 'change' event as the oldValue)
			var oldValue = this.data[ attributeName ],
			    oldGetterValue = this.get( attributeName );
						
			// Allow the Attribute to pre-process the newValue
			newValue = attribute.beforeSet( this, newValue, oldValue );
			
			// Now call the Attribute's set() method (or user-provided 'set' config function)
			newValue = attribute.doSet( this, newValue, oldValue );  // doSet() is a method which provides a level of indirection for calling the 'set' config function, or set() method
			
			// *** Temporary workaround to get the 'change' event to fire on an Attribute whose set() config function does not
			// return a new value to set to the underlying data. This will be resolved once dependencies are 
			// automatically resolved in the Attribute's get() function. 
			if( attribute.hasOwnProperty( 'set' ) && newValue === undefined ) {  // the attribute will only have a 'set' property of its own if the 'set' config was provided
				// This is to make the following block below think that there is already data in for the attribute, and
				// that it has the same value. If we don't have this, the change event will fire twice, the
				// the model will be set as 'dirty', and the old value will be put into the `modifiedData` hash.
				if( !( attributeName in this.data ) ) {
					this.data[ attributeName ] = undefined;
				}
				
				// Fire the events with the value of the Attribute after it has been processed by any Attribute-specific `get()` function.
				newValue = this.get( attributeName );
				
				// Store the 'change' in the 'changeset' hashmaps
				this.changeSetNewValues[ attributeName ] = newValue;
				if( !( attributeName in changeSetOldValues ) ) {  // only store the "old" value if we don't have an "old" value for the attribute already. This leaves us with the real "old" value when multiple sets occur for an attribute during the changeset.
					this.changeSetOldValues[ attributeName ] = oldGetterValue;
				}
				
				// Now manually fire the events
				this.fireEvent( 'change:' + attributeName, this, newValue, oldGetterValue );  // model, newValue, oldValue
				this.fireEvent( 'change', this, attributeName, newValue, oldGetterValue );    // model, attributeName, newValue, oldValue
			}
			
			// Allow the Attribute to post-process the newValue
			newValue = attribute.afterSet( this, newValue );
			
			// Only change if there is no current value for the attribute, or if newValue is different from the current
			if( !( attributeName in this.data ) || !attribute.valuesAreEqual( oldValue, newValue ) ) {   // let the Attribute itself determine if two values of its datatype are equal
				// Store the attribute's *current* value (not the newValue) into the "modifiedData" attributes hash.
				// This should only happen the first time the attribute is set, so that the attribute can be rolled back even if there are multiple
				// set() calls to change it.
				if( !( attributeName in this.modifiedData ) ) {
					this.modifiedData[ attributeName ] = oldValue;
				}
				this.data[ attributeName ] = newValue;
				this.dirty = true;
				
				
				// Now that we have set the new raw value to the internal `data` hash, we want to fire the events with the value
				// of the Attribute after it has been processed by any Attribute-specific `get()` function.
				newValue = this.get( attributeName );
				
				// If the attribute is the "idAttribute", set the `id` property on the model for compatibility with Backbone's Collection
				if( attributeName === this.idAttribute ) {
					this.id = newValue;

					// Re-submit to ModelCache, so new ID will be used.  This is particularly relevant on 'create', where the ID isn't known
					// at the time the model is instantiated.
					Kevlar.ModelCache.get( this, newValue );
				}
				
				// Store the 'change' values in the changeset hashmaps, for use when the 'changeset' event fires
				changeSetNewValues[ attributeName ] = newValue;
				if( !( attributeName in changeSetOldValues ) ) {  // Only store the "old" value if we don't have an "old" value for the attribute already. This leaves us with the real "old" value when multiple set()'s occur for an attribute during the changeset.
					changeSetOldValues[ attributeName ] = oldGetterValue;
				}
				
				// And finally, fire the 'change' events
				this.fireEvent( 'change:' + attributeName, this, newValue, oldGetterValue );  // model, newValue, oldValue
				this.fireEvent( 'change', this, attributeName, newValue, oldGetterValue );    // model, attributeName, newValue, oldValue
			}
		}
		
		// Handle firing the 'changeset' event, which fires once for all of the attribute changes to the Model (i.e. when all calls to set() have exited)
		this.setCallCount--;
		if( this.setCallCount === 0 ) {
			this.fireEvent( 'changeset', this, changeSetNewValues, changeSetOldValues );
		}
	},
	
	
	/**
	 * Retrieves the value for the attribute given by `attributeName`. If the {@link Kevlar.attribute.Attribute Attribute} has a
	 * {@link Kevlar.attribute.Attribute#get get} function defined, that function will be called, and its return value
	 * will be used as the return of this method.
	 * 
	 * @method get
	 * @param {String} attributeName The name of the Attribute whose value to retieve.
	 * @return {Mixed} The value of the attribute returned by the Attribute's {@link Kevlar.attribute.Attribute#get get} function (if
	 * one exists), or the underlying value of the attribute. Will return undefined if there is no {@link Kevlar.attribute.Attribute#get get}
	 * function, and the value has never been set.  
	 */
	get : function( attributeName ) {
		// <debug>
		if( !( attributeName in this.attributes ) ) {
			throw new Error( "Kevlar.Model::get() error: attribute '" + attributeName + "' was not found on the Model." );
		}
		// </debug>
		
		var value = this.data[ attributeName ],
		    attribute = this.attributes[ attributeName ];
		
		// If there is a `get` function on the Attribute, run it now to convert the value before it is returned.
		if( typeof attribute.get === 'function' ) {
			value = attribute.get.call( this, value );  // provided the underlying value
		}
		
		return value;
	},
	
	
	/**
	 * Retrieves the *raw* value for the attribute given by `attributeName`. If the {@link Kevlar.attribute.Attribute Attributes} has a
	 * {@link Kevlar.attribute.Attribute#raw raw} function defined, that function will be called, and its return value will be used
	 * by the return of this method. If not, the underlying data that is currently stored will be returned, bypassing any
	 * {@link Kevlar.attribute.Attribute#get get} function defined on the {@link Kevlar.attribute.Attribute Attribute}.
	 * 
	 * @method raw
	 * @param {String} attributeName The name of the Attribute whose raw value to retieve.
	 * @return {Mixed} The value of the attribute returned by the Attribute's {@link Kevlar.attribute.Attribute#raw raw} function (if
	 * one exists), or the underlying value of the attribute. Will return undefined if there is no {@link Kevlar.attribute.Attribute#raw raw}
	 * function, and the value has never been set.
	 */
	raw : function( attributeName ) {
		// <debug>
		if( !( attributeName in this.attributes ) ) {
			throw new Error( "Kevlar.Model::raw() error: attribute '" + attributeName + "' was not found on the Model." );
		}
		// </debug>
		
		var value = this.data[ attributeName ],
		    attribute = this.attributes[ attributeName ];
		    
		// If there is a `raw` function on the Attribute, run it now to convert the value before it is returned.
		if( typeof attribute.raw === 'function' ) {
			value = attribute.raw.call( this, value, this );  // provided the value, and the Model instance
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
		return this.attributes[ attributeName ].getDefaultValue();
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
	
	
	// Embedded Model / Collection related functionality
	
	/**
	 * Used internally by the framework, this method subscribes to the change event of the given child {@link Kevlar.Model}, in order to relay
	 * its events through this (i.e. its parent) model. This supports a form of "event bubbling" for {@link Kevlar.attribute.ModelAttribute#embedded embedded} 
	 * child models, and is called from {@link Kevlar.attribute.ModelAttribute ModelAttribute}. For non-embedded Models (i.e. simply "related" Models), this 
	 * method is not called.
	 * 
	 * @ignore
	 * @method subscribeEmbeddedModel
	 * @param {String} attributeName The name of the Attribute that is subscribing a Model.
	 * @param {Kevlar.Model} embeddedModel
	 */
	subscribeEmbeddedModel : function( attributeName, embeddedModel ) {
		var changeHandler = function( model, attrName, newValue, oldValue, childChangeData ) {  // note: 'childChangeData' arg is needed for the bubbling of deep model/collection events
			this.onEmbeddedDataComponentChange( attributeName, /* collection */ null, model, attrName, newValue, oldValue, childChangeData );
		};
		
		this.embeddedDataComponentChangeHandlers[ attributeName ] = changeHandler;
		embeddedModel.on( 'change', changeHandler, this );
	},	
	
	
	/**
	 * Used internally by the framework, this method subscribes to the change event of the given child {@link Kevlar.Container}, in order to relay
	 * its events through this (i.e. its parent) model. This supports a form of "event bubbling" for {@link Kevlar.attribute.CollectionAttribute#embedded embedded} 
	 * child collections, and is called from {@link Kevlar.attribute.CollectionAttribute CollectionAttribute}. For non-embedded Collections (i.e. simply "related" 
	 * Collections), this method is not called.
	 * 
	 * @ignore
	 * @method subscribeEmbeddedCollection
	 * @param {String} attributeName The name of the Attribute that is subscribing a Collection.
	 * @param {Kevlar.Collection} embeddedCollection
	 */
	subscribeEmbeddedCollection : function( attributeName, embeddedCollection ) {
		var changeHandler = function( collection, model, attrName, newValue, oldValue, childChangeData ) {  // note: 'childChangeData' arg is needed for the bubbling of deep model/collection events
			this.onEmbeddedDataComponentChange( attributeName, collection, model, attrName, newValue, oldValue, childChangeData );
		};
		this.embeddedDataComponentChangeHandlers[ attributeName ] = changeHandler;
		embeddedCollection.on( 'change', changeHandler, this );
		
		
		var addRemoveReorderHandler = function( collection ) {
			this.onEmbeddedCollectionAddRemoveReorder( attributeName, collection );
		};
		this.embeddedCollectionAddRemoveReorderHandlers[ attributeName ] = addRemoveReorderHandler;
		embeddedCollection.on( {
			'addset'    : addRemoveReorderHandler,
			'removeset' : addRemoveReorderHandler,
			'reorder'   : addRemoveReorderHandler,
			scope : this
		} );
	},
	
	
	
	/**
	 * Used internally by the framework, this method unsubscribes the change event from the given child {@link Kevlar.Model}/{@link Kevlar.Container}. 
	 * Used in conjunction with {@link #subscribeEmbeddedDataComponent}, when a child model/collection is un-set from its parent model (i.e. this model).
	 * 
	 * @ignore
	 * @method unsubscribeEmbeddedModel
	 * @param {String} attributeName The name of the Attribute that is unsubscribing a Model/Collection.
	 * @param {Kevlar.Model} embeddedModel
	 */
	unsubscribeEmbeddedModel : function( attributeName, embeddedModel ) {
		this.unsubscribeEmbeddedDataComponent( attributeName, embeddedModel );
	},
	
	
	/**
	 * Used internally by the framework, this method unsubscribes the change event from the given child {@link Kevlar.Model}/{@link Kevlar.Container}. 
	 * Used in conjunction with {@link #subscribeEmbeddedCollection}, when a child model/collection is un-set from its parent model (i.e. this model).
	 * 
	 * @ignore
	 * @method unsubscribeEmbeddedCollection
	 * @param {String} attributeName The name of the Attribute that is unsubscribing a Model/Collection.
	 * @param {Kevlar.Model} embeddedModel
	 */
	unsubscribeEmbeddedCollection : function( attributeName, embeddedCollection ) {
		this.unsubscribeEmbeddedDataComponent( attributeName, embeddedCollection );
		
		var addRemoveReorderHandler = this.embeddedCollectionAddRemoveReorderHandlers[ attributeName ];
		embeddedCollection.un( {
			'addset'    : addRemoveReorderHandler,
			'removeset' : addRemoveReorderHandler,
			'reorder'   : addRemoveReorderHandler,
			scope : this
		} );
	},
	
	
	/**
	 * Used internally by the framework, this method unsubscribes the change event from the given child {@link Kevlar.Model}/{@link Kevlar.Container}. 
	 * Used in conjunction with {@link #subscribeEmbeddedModel}/{@link #subscribeEmbeddedCollection}, when a child model/collection is un-set from 
	 * its parent model (i.e. this model).
	 * 
	 * @ignore
	 * @method unsubscribeEmbeddedDataComponent
	 * @param {String} attributeName The name of the Attribute that is unsubscribing a Model/Collection.
	 * @param {Kevlar.DataComponent} dataComponent
	 */
	unsubscribeEmbeddedDataComponent : function( attributeName, dataComponent ) {
		var changeHandler = this.embeddedDataComponentChangeHandlers[ attributeName ];
		dataComponent.un( 'change', changeHandler, this );
	},
	
	
	
	
	/**
	 * Handler for a change in an embedded model/collection. Relays the embedded model's/collection's {@link #change} events through this model.
	 * 
	 * @private
	 * @method onEmbeddedDataComponentChange
	 * @param {String} attributeName The attribute name in *this* model that stores the embedded model.
	 * @param {Kevlar.Collection} childCollection The embedded child collection, if there is one at this level in the bubbling hierarchy.
	 *   Should be set to null otherwise.
	 * @param {Kevlar.Model} childModel The embedded child model.
	 * @param {String} childModelAttr The attribute name of the changed attribute in the embedded model. When fired "up the chain"
	 *   from deeply nested models, this will accumulate into a dot-delimited path to the child model. Ex: "parent.intermediate.child".
	 * @param {Mixed} newValue
	 * @param {Mixed} oldValue
	 * 
	 * @param {Object} [childChangeData] An object which holds information from the 'change' event of child DataComponents. This is a "private"
	 *   argument, and is only used for the event bubbling feature.
	 * @param {String} [childChangeData.pathToChangedAttr] A string path to the changed attribute. This is a "private" argument, which is only used for
	 *   the event bubbling feature. Defaults to the value of `childModelAttr`.
	 * @param {Mixed} [childChangeData.origNewValue=newValue] The newValue from the original event in the deepest DataComponent.
	 * @param {Mixed} [childChangeData.origOldValue=oldValue] The oldValue from the original event in the deepest DataComponent.
	 * @param {Kevlar.Model[]} [childChangeData.embeddedDataComponents] An array of the nested models/collections that have fired a 'change' event below 
	 *   this Model's event. This is a "private" argument, which is only used for this feature.
	 */
	onEmbeddedDataComponentChange : function( attributeName, childCollection, childModel, childModelAttr, newValue, oldValue, childChangeData ) {
		// Create the childChangeData object for the change event of the first (deepest) DataComponent
		if( !childChangeData ) {
			childChangeData = {
				// Default the pathToChangedAttr to the childModelAttr, so it starts out with the attribute that is changed from the deepest child
				pathToChangedAttr : childModelAttr,
				
				// Default the original newValue/oldValue to the newValue/oldValue provided to this handler. These will be the the newValue/oldValue from the
				// deepest child, and then passed up.
				origNewValue : newValue,
				origOldValue : oldValue,
				
				// Default the embeddedDataComponents to the child DataComponent
				embeddedDataComponents : [ childModel ]
			};
		}
		
		if( childCollection ) {
			childChangeData.embeddedDataComponents.unshift( childCollection );
		}
		childChangeData.embeddedDataComponents.unshift( this );  // prepend this model/collection to the list
		childChangeData.pathToChangedAttr = attributeName + '.' + childChangeData.pathToChangedAttr;  // prepend the attribute from this DataComponent
		
		var pathToChangedAttr = childChangeData.pathToChangedAttr,
		    embeddedDataComponents = childChangeData.embeddedDataComponents,
		    origNewValue = childChangeData.origNewValue,
		    origOldValue = childChangeData.origOldValue,
		    pathsToChangedAttr = pathToChangedAttr.split( '.' );   // array of the parts of the full dot-delimited path
		
		
		// First, an event with the full path, and one for the generalized attribute change event. Example:
		//   - change:parent.intermediate.child.attr  model = child                 newValue = [the new value]  oldValue = [the old value]
		//   - change:parent.intermediate.child.*     model = child  attr = "attr"  newValue = [the new value]  oldValue = [the old value]
		var changedDataComponent = embeddedDataComponents[ embeddedDataComponents.length - 1 ],
		    pathToChangedDataComponent = pathsToChangedAttr.slice( 0, pathsToChangedAttr.length - 1 ).join( '.' ),   // if the path to the attr is 'child.attr', this will be 'child'
		    changedAttrName = pathsToChangedAttr[ pathsToChangedAttr.length - 1 ],
		    parentDataComponent = embeddedDataComponents[ embeddedDataComponents.length - 2 ];
		
		if( parentDataComponent instanceof Kevlar.Collection ) {
			this.fireEvent( 'change:' + pathToChangedAttr, parentDataComponent, changedDataComponent, origNewValue, origOldValue );
			this.fireEvent( 'change:' + pathToChangedDataComponent + '.*', parentDataComponent, changedDataComponent, changedAttrName, origNewValue, origOldValue );
		} else {
			this.fireEvent( 'change:' + pathToChangedAttr, changedDataComponent, origNewValue, origOldValue );
			this.fireEvent( 'change:' + pathToChangedDataComponent + '.*', changedDataComponent, changedAttrName, origNewValue, origOldValue );
		}
		
		
		// Next, fire an event for each of the "paths" leading up to the changed attribute, but not including the attribute itself (we fired an event for that just above).
		// This loop will fire them backwards, from longest path, to shortest.
		// Example of events while looping, if the full path to the changed attr is 'parent.intermediate.child.attr':
		//   - change:parent.intermediate.child       model = intermediate                             newValue = childModel         oldValue = childModel
		//   - change:parent.intermediate.*           model = intermediate      attr = "child"         newValue = childModel         oldValue = childModel
		//   - change:parent.intermediate             model = parent                                   newValue = intermediateModel  oldValue = intermediateModel
		//   - change:parent.*                        model = parent            attr = "intermediate"  newValue = intermediateModel  oldValue = intermediateModel
		//   - change:parent                          model = [parent's parent]                        newValue = parentModel        oldValue = parentModel 
		// Note: The 'model' arg that the event is fired with is always the one that relates to the path
		for( var i = pathsToChangedAttr.length - 2; i >= 0; i-- ) {
			var currentPath = pathsToChangedAttr.slice( 0, i + 1 ).join( '.' ),
			    currentPathParent = pathsToChangedAttr.slice( 0, i ).join( '.' ),
			    changedAttr = pathsToChangedAttr[ i ],
			    dataComponentForPathParent = embeddedDataComponents[ i ],
			    dataComponentForPath = embeddedDataComponents[ i + 1 ];
			
			
			// Now if the event should relate to a Collection, we must fire it like a Collection fires its event.
			if( dataComponentForPathParent instanceof Kevlar.Collection ) {
				this.fireEvent( 'change:' + currentPath, dataComponentForPathParent, dataComponentForPath, dataComponentForPath );
				if( currentPathParent !== '' ) {
					this.fireEvent( 'change:' + currentPathParent + '.*', dataComponentForPathParent, changedAttr, dataComponentForPath, dataComponentForPath );
				}
				
			} else {
				this.fireEvent( 'change:' + currentPath, dataComponentForPathParent, dataComponentForPath, dataComponentForPath );
				if( currentPathParent !== '' ) {
					this.fireEvent( 'change:' + currentPathParent + '.*', dataComponentForPathParent, changedAttr, dataComponentForPath, dataComponentForPath );
				}
			}
		}
		
		// Now fire the general 'change' event from this model
		if( childCollection ) {
			this.fireEvent( 'change', this, attributeName, childCollection, childCollection, childChangeData );   // this model, attributeName, newValue, oldValue, the string path to the changed attribute, the original newValue from the deepest child, the original oldValue from the deepest child, the nested models/collections so far for this event from the deepest child
			
		} else {
			this.fireEvent( 'change', this, attributeName, childModel, childModel, childChangeData );   // this model, attributeName, newValue, oldValue, the string path to the changed attribute, the original newValue from the deepest child, the original oldValue from the deepest child, the nested models/collections so far for this event from the deepest child
		}
	},
	
	
	/**
	 * Method that responds to an embedded {@link Kevlar.Collection Collection}, and fires a change event in this model
	 * when a Collection is {@link Kevlar.Collection#event-add added to}, {@link Kevlar.Collection#event-remove removed from},
	 * of {@link Kevlar.Collection#event-reorder reordered}.
	 * 
	 * @private
	 * @method onEmbeddedCollectionAddRemoveReorder
	 * @param {String} attributeName The name of the attribute where the embedded Collection exists.
	 * @param {Kevlar.Collection} collection The collection that fired the {@link Kevlar.Collection#event-add}, 
	 *   {@link Kevlar.Collection#event-remove}, or {@link Kevlar.Collection#event-reorder} event. 
	 */
	onEmbeddedCollectionAddRemoveReorder : function( attributeName, collection ) {
		this.fireEvent( 'change:' + attributeName, this, collection, collection );
		this.fireEvent( 'change', this, attributeName, collection, collection );
	},
	
	
	
	// --------------------------------
	
	
	/**
	 * Determines if the Model is a new model, and has not yet been persisted to the server.
	 * It is a new Model if it lacks an id.
	 * 
	 * @method isNew
	 * @return {Boolean} True if the model is new, false otherwise.
	 */
	isNew : function() {
		if( !this.hasIdAttribute() ) {
			return true;
		} else {
			var id = this.getId();
			return ( typeof id === 'undefined' || id === null );
		}
	},
	
	
	/**
	 * Determines if this Model itself (excluding child Models and {@link Kevlar.Collection Collections}) currently has un-committed (i.e. changed) data.
	 * Prefer to use {@link #isModified} instead.
	 * 
	 * @method isDirty
	 * @return {Boolean}
	 */
	isDirty : function() {
		return this.dirty;
	},
	
	
	/**
	 * Determines if any attribute(s) in the model are modified, or if a given attribute has been modified, since the last 
	 * {@link #method-commit} or {@link #method-rollback}.
	 * 
	 * @override
	 * @method isModified
	 * @param {String} [attributeName] Provide this argument to test if a particular attribute has been modified. If this is not 
	 *   provided, the model itself will be checked to see if there are any modified attributes. 
	 * 
	 * @param {Object} [options] An object (hash) of options to change the behavior of this method. This may be provided as the first argument to the
	 *   method if no `attributeName` is to be provided. Options may include:
	 * @param {Boolean} [options.persistedOnly=false] True to have the method only return true if a {@link Kevlar.attribute.Attribute#persist persisted} 
	 *   attribute is modified. 
	 * 
	 * @return {Boolean} True if the attribute has been modified, false otherwise.
	 */
	isModified : function( attributeName, options ) {
		if( typeof attributeName === 'object' ) {  // 'options' provided as first argument, fix the parameter variables
			options = attributeName;
			attributeName = undefined;
		}
		
		options = options || {};
		
		var attributes = this.attributes,
		    data = this.data,
		    modifiedData = this.modifiedData;
		
		if( !attributeName ) {
			// First, check if there are any modifications to primitives (i.e. non-nested Models/Collections).
			// If the 'persistedOnly' option is true, we only consider attributes that are persisted.
			for( var attr in modifiedData ) {
				if( modifiedData.hasOwnProperty( attr ) && ( !options.persistedOnly || ( options.persistedOnly && attributes[ attr ].isPersisted() ) ) ) {
					return true;  // there is any property in the modifiedData hashmap, return true (unless 'persistedOnly' option is set, in which case we only consider persisted attributes)
				}
			}
			
			// No local modifications to primitives, check all embedded collections/models to see if they have changes
			var embeddedDataComponentAttrs = this.getEmbeddedDataComponentAttributes(),
			    dataComponent;
			
			for( var i = 0, len = embeddedDataComponentAttrs.length; i < len; i++ ) {
				var attrName = embeddedDataComponentAttrs[ i ].getName();
				
				if( ( dataComponent = data[ attrName ] ) && dataComponent.isModified( options ) ) {
					return true;
				}
			}
			return false;
			
		} else {
			// Handle an attributeName being provided to this method
			var attribute = attributes[ attributeName ];
			
			if( attribute instanceof Kevlar.attribute.DataComponentAttribute && attribute.isEmbedded() && data[ attributeName ].isModified( options ) ) {   // DataComponent (Model or Collection) attribute is modified
				return true;
			} else if( modifiedData.hasOwnProperty( attributeName ) && ( !options.persistedOnly || ( options.persistedOnly && attributes[ attributeName ].isPersisted() ) ) ) {  // primitive (non Model or Collection) attribute is modified
				return true;
			}
			
			return false;
		}
	},
	
	
	/**
	 * Retrieves the values for all of the attributes in the Model. The Model attributes are retrieved via the {@link #get} method,
	 * to pre-process the data before it is returned in the final hash, unless the `raw` option is set to true,
	 * in which case the Model attributes are retrieved via {@link #raw}. 
	 * 
	 * @override
	 * @method getData
	 * 
	 * @param {Object} [options] An object (hash) of options to change the behavior of this method. This object is sent to
	 *   the {@link Kevlar.data.NativeObjectConverter#convert NativeObjectConverter's convert method}, and accepts all of the options
	 *   that the {@link Kevlar.data.NativeObjectConverter#convert} method does. See that method for details.
	 * @return {Object} A hash of the data, where the property names are the keys, and the values are the {@link Kevlar.attribute.Attribute Attribute} values.
	 */
	getData : function( options ) {
		return Kevlar.data.NativeObjectConverter.convert( this, options );
	},
	
	
	/**
	 * Retrieves the values for all of the {@link Kevlar.attribute.Attribute attributes} in the Model whose values have been changed since
	 * the last {@link #method-commit} or {@link #method-rollback}. 
	 * 
	 * The Model attributes are retrieved via the {@link #get} method, to pre-process the data before it is returned in the final hash, 
	 * unless the `raw` option is set to true, in which case the Model attributes are retrieved via {@link #raw}.
	 * 
	 * @method getChanges
	 * 
	 * @param {Object} [options] An object (hash) of options to change the behavior of this method. This object is sent to
	 *   the {@link Kevlar.data.NativeObjectConverter#convert NativeObjectConverter's convert method}, and accepts all of the options
	 *   that the {@link Kevlar.data.NativeObjectConverter#convert} method does. See that method for details. Options specific to this method include:
	 * @param {Boolean} [options.persistedOnly=false] True to have the method only return only changed attributes that are 
	 *   {@link Kevlar.attribute.Attribute#persist persisted}. In the case of nested models, a nested model will only be returned in the resulting
	 *   hashmap if one if its {@link Kevlar.attribute.Attribute#persist persisted} attributes are modified. 
	 * 
	 * @return {Object} A hash of the attributes that have been changed since the last {@link #method-commit} or {@link #method-rollback}.
	 *   The hash's property names are the attribute names, and the hash's values are the new values.
	 */
	getChanges : function( options ) {
		options = options || {};
		
		// Provide specific attribute names to the NativeObjectConverter's convert() method, which are only the
		// names for attributes which hold native JS objects that have changed (not embedded models/arrays)
		options.attributeNames = Kevlar.util.Object.keysToArray( this.modifiedData );
		
		// Add any modified embedded model/collection to the options.attributeNames array
		var embeddedDataComponentAttrs = this.getEmbeddedDataComponentAttributes(),
		    data = this.data,
		    dataComponent;
	
		for( var i = 0, len = embeddedDataComponentAttrs.length; i < len; i++ ) {
			var attrName = embeddedDataComponentAttrs[ i ].getName();
			
			if( ( dataComponent = data[ attrName ] ) && dataComponent.isModified( options ) ) {
				options.attributeNames.push( attrName );
			}
		}
		
		return Kevlar.data.NativeObjectConverter.convert( this, options );
	},
	
	
	/**
	 * Commits dirty attributes' data. Data can no longer be reverted after a commit has been performed. Note: When developing with a {@link #persistenceProxy},
	 * this method should normally not need to be called explicitly, as it will be called upon the successful persistence of the Model's data
	 * to the server.
	 * 
	 * @override
	 * @method commit
	 */
	commit : function() {
		this.modifiedData = {};  // reset the modifiedData hash. There is no modified data.
		this.dirty = false;
		
		// Go through all embedded models/collections, and "commit" those as well
		var embeddedDataComponentAttrs = this.getEmbeddedDataComponentAttributes(),
		    data = this.data,
		    dataComponent;
		
		for( var i = 0, len = embeddedDataComponentAttrs.length; i < len; i++ ) {
			var attrName = embeddedDataComponentAttrs[ i ].getName();
			
			if( ( dataComponent = data[ attrName ] ) ) {
				dataComponent.commit();
			}
		}
		
		this.fireEvent( 'commit', this );
	},
	
	
	/**
	 * Rolls back the Model attributes that have been changed since the last commit or rollback.
	 * 
	 * @override
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
		
		this.fireEvent( 'rollback', this );
	},
	
	
	// --------------------------------
	
	
	/**
	 * Creates a clone of the Model, by copying its instance data. Note that the cloned model will *not* have a value
	 * for its {@link #idAttribute} (as it is a new model, and multiple models of the same type cannot exist with
	 * the same id). You may optionally provide a new id for the clone with the `id` parameter. 
	 * 
	 * Note: This is a very early, alpha version of the method, where the final version will most likely
	 * account for embedded models, while copying embedded models and other such nested data. Will also handle 
	 * circular dependencies. I don't recommend using it just yet.
	 * 
	 * @method clone
	 * @param {Mixed} [id] A new id for the Model. Defaults to undefined.
	 * @return {Kevlar.Model} The new Model instance, which is a clone of the Model this method was called on.
	 */
	clone : function( id ) {
		var data = Kevlar.util.Object.clone( this.getData() );
		
		// Remove the id, so that it becomes a new model. If this is kept here, a reference to this exact
		// model will be returned instead of a new one, as the framework does not allow duplicate models with
		// the same id. Otherwise, if a new id is passed, it will be set to the new model.
		if( typeof id === 'undefined' ) {
			delete data[ this.idAttribute ];
		} else {
			data[ this.idAttribute ] = id;
		}
		
		return new this.constructor( data );
	},
	
	
	// --------------------------------
	
	
	/**
	 * Gets the {@link #persistenceProxy} that is currently configured for this Model. Note that
	 * the same persistenceProxy instance is shared between all instances of the model.
	 * 
	 * @method getPersistenceProxy
	 * @return {Kevlar.persistence.Proxy} The persistenceProxy, or null if there is no persistenceProxy currently set.
	 */
	getPersistenceProxy : function() {
		return this.persistenceProxy;
	},
	
	
	/**
	 * Reloads the Model data from the server (discarding any changed data), using the configured {@link #persistenceProxy}.
	 * 
	 * @method reload
	 * @param {Object} [options] An object which may contain the following properties:
	 * @param {Boolean} [options.async=true] True to make the request asynchronous, false to make it synchronous.
	 * @param {Function} [options.success] Function to call if the save is successful.
	 * @param {Function} [options.failure] Function to call if the save fails.
	 * @param {Function} [options.complete] Function to call when the operation is complete, regardless of a success or fail state.
	 * @param {Object} [options.scope=window] The object to call the `success`, `failure`, and `complete` callbacks in.
	 */
	reload : function( options ) {
		options = options || {};
		
		// No persistenceProxy, cannot load. Throw an error
		if( !this.persistenceProxy ) {
			throw new Error( "Kevlar.Model::reload() error: Cannot load. No persistenceProxy." );
		}
		
		var proxyOptions = {
			async    : ( typeof options.async === 'undefined' ) ? true : options.async,   // defaults to true
			success  : options.success  || Kevlar.emptyFn,
			failure  : options.failure  || Kevlar.emptyFn,
			complete : options.complete || Kevlar.emptyFn,
			scope    : options.scope    || window
		};
		
		// Make a request to update the data on the server
		this.persistenceProxy.read( this, proxyOptions );
	},
	
	
	/**
	 * Persists the Model data to the backend, using the configured {@link #persistenceProxy}. If the request to persist the Model's data is successful,
	 * the Model's data will be {@link #method-commit committed} upon completion.
	 * 
	 * @method save
	 * @param {Object} [options] An object which may contain the following properties:
	 * @param {Boolean} [options.async=true] True to make the request asynchronous, false to make it synchronous.
	 * 
	 * @param {Function} [options.success] Function to call if the save is successful.
	 * @param {Kevlar.Model} options.success.model This Model instance.
	 * @param {Object} options.success.data The data returned from the server, or if there was none, the data of the Model.
	 * 
	 * @param {Function} [options.error] Function to call if the save fails.
	 * @param {Kevlar.Model} options.error.model This Model instance.
	 * 
	 * @param {Function} [options.complete] Function to call when the operation is complete, regardless of success or failure.
	 * @param {Kevlar.Model} options.complete.model This Model instance.
	 * 
	 * @param {Object} [options.scope=window] The object to call the `success`, `error`, and `complete` callbacks in. This may also
	 *   be provided as `context` if you prefer.
	 */
	save : function( options ) {
		options = options || {};
		var scope = options.scope || options.context || window;
		
		// No persistenceProxy, cannot save. Throw an error
		if( !this.persistenceProxy ) {
			throw new Error( "Kevlar.Model::save() error: Cannot save. No persistenceProxy." );
		}
		
		// No id attribute, throw an error
		if( !this.hasIdAttribute ) {
			throw new Error( "Kevlar.Model::save() error: Cannot save. Model does not have an idAttribute that relates to a valid attribute." );
		}
		
		
		// Store a "snapshot" of the data that is being persisted. This is used to compare against the Model's current data at the time of when the persistence operation 
		// completes. Anything that does not match this persisted snapshot data must have been updated while the persistence operation was in progress, and the Model must 
		// be marked as dirty for those attributes after its commit() runs. This is a bit roundabout that a commit() operation runs when the persistence operation is complete
		// and then data is manually modified, but this is also the correct time to run the commit() operation, as we still want to see the changes if the request fails. 
		// So, if a persistence request fails, we should have all of the data still marked as dirty, both the data that was to be persisted, and any new data that was set 
		// while the persistence operation was being attempted.
		var persistedData = Kevlar.util.Object.clone( this.getData() );
		
		var successCallback = function( data ) {
			data = data || this.getData();

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
			
			
			if( options.success ) {
				options.success.call( scope, this, data );
			}
		};
		
		var errorCallback = function() {
			if( options.error ) {
				options.error.call( scope, this );
			}
		};
		
		var completeCallback = function() {
			if( options.complete ) {
				options.complete.call( scope, this );
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
		this.persistenceProxy[ this.isNew() ? 'create' : 'update' ]( this, proxyOptions );
	},
	
	
	/**
	 * Destroys the Model on the backend, using the configured {@link #persistenceProxy}.
	 * 
	 * @method destroy
	 * @param {Object} [options] An object which may contain the following properties:
	 * @param {Boolean} [options.async=true] True to make the request asynchronous, false to make it synchronous.
	 * 
	 * @param {Function} [options.success] Function to call if the destroy (deletion) is successful.
	 * @param {Kevlar.Model} options.success.model This Model instance.
	 * @param {Object} options.success.data The data returned from the server, or if there was none, the data of the Model.
	 * 
	 * @param {Function} [options.error] Function to call if the destroy (deletion) fails.
	 * @param {Kevlar.Model} options.error.model This Model instance.
	 * 
	 * @param {Function} [options.complete] Function to call when the operation is complete, regardless of success or failure.
	 * @param {Kevlar.Model} options.complete.model This Model instance.
	 * 
	 * @param {Object} [options.scope=window] The object to call the `success`, `error`, and `complete` callbacks in. This may also
	 *   be provided as `context` if you prefer.
	 */
	destroy : function( options ) {
		options = options || {};
		var scope = options.scope || options.context || window;
		
		var successCallback = function() {
			this.destroyed = true;
			this.fireEvent( 'destroy', this );
			
			if( options.success ) {
				options.success.call( scope, this );
			}
		};
		var errorCallback = function() {
			if( options.error ) {
				options.error.call( scope, this );
			}
		};
		var completeCallback = function() {
			if( options.complete ) {
				options.complete.call( scope, this );
			}
		};
		
		if( this.isNew() ) {
			// If it is a new model, there is nothing on the server to destroy. Simply fire the event and call the callback
			successCallback.call( this );
			completeCallback.call( this );
			
		} else {
			// No persistenceProxy, cannot destroy. Throw an error
			// <debug>
			if( !this.persistenceProxy ) {
				throw new Error( "Kevlar.Model::destroy() error: Cannot destroy model on server. No persistenceProxy." );
			}
			// </debug>
			
			var proxyOptions = {
				async    : ( typeof options.async === 'undefined' ) ? true : options.async,   // defaults to true
				success  : successCallback,
				error    : errorCallback,
				complete : completeCallback,
				scope    : this
			};
			
			// Make a request to destroy the data on the server
			this.persistenceProxy.destroy( this, proxyOptions );
		}
	},
	
	
	// --------------------------
	
	// Private utility methods
	
	/**
	 * Retrieves an array of the attributes that are {@link Kevlar.attribute.DataComponentAttribute DataComponentAttributes} which
	 * are also {@link Kevlar.attribute.DataComponentAttribute#embedded}. This is a convenience method that supports the methods which
	 * use the embedded DataComponentAttributes. 
	 * 
	 * @private
	 * @method getEmbeddedDataComponentAttributes
	 * @return {Kevlar.attribute.DataComponentAttribute[]}
	 */
	getEmbeddedDataComponentAttributes : function() {
		var attributes = this.attributes,
		    attribute,
		    DataComponentAttribute = Kevlar.attribute.DataComponentAttribute,
		    dataComponentAttributes = [];
		
		for( var attrName in attributes ) {
			if( attributes.hasOwnProperty( attrName ) && ( attribute = attributes[ attrName ] ) instanceof DataComponentAttribute && attribute.isEmbedded() ) {
				dataComponentAttributes.push( attribute );
			}
		}
		
		return dataComponentAttributes;
	}
	
} );


/**
 * Alias of {@link #reload}. See {@link #reload} for description and arguments.
 * 
 * @method fetch
 */
Kevlar.Model.prototype.fetch = Kevlar.Model.prototype.reload;

/**
 * Backward compatibility alias of {@link #reload}. See {@link #reload} for description and arguments.
 * 
 * @method load
 */
Kevlar.Model.prototype.load = Kevlar.Model.prototype.reload;


/**
 * Alias of {@link #getData}, which is currently just for compatibility with 
 * Backbone's Collection. Do not use. Use {@link #getData} instead.
 * 
 * @method toJSON
 */
Kevlar.Model.prototype.toJSON = Kevlar.Model.prototype.getData;


/**
 * For compatibility with Backbone's Collection, when it is called from Collection's `_onModelEvent()`
 * method. `_onModelEvent()` asks for the previous `id` of the Model when the id attribute changes,
 * such as when a Model is created on the server. This method simply returns undefined for this purpose,
 * but if more compatibility is needed, it could return the original data for a given attribute (which is
 * a little different than Backbone's notion of "previous" data, which is the previous data from before any
 * current 'change' event).
 * 
 * @method previous
 * @param {String} attributeName
 */
Kevlar.Model.prototype.previous = function( attributeName ) {
	return undefined;
};
