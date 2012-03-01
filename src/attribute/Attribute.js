/**
 * @abstract
 * @class Kevlar.attribute.Attribute
 * @extends Object
 * 
 * Base attribute definition class for {@link Kevlar.Model Models}. The Attribute itself does not store data, but instead simply
 * defines the behaviors of a {@link Kevlar.Model Model's} attributes. A {@link Kevlar.Model Model} is made up of Attributes. 
 * 
 * Note: You will most likely not instantiate Attribute objects directly. This is used by {@link Kevlar.Model} with its
 * {@link Kevlar.Model#attributes attributes} prototype config. Anonymous config objects provided to {@link Kevlar.Model#attributes attributes}
 * will be passed to the Attribute constructor.
 */
/*global Kevlar */
Kevlar.attribute.Attribute = Kevlar.extend( Object, {
	
	/**
	 * @cfg {String} name (required)
	 * The name for the attribute, which is used by the owner Model to reference it.
	 */
	name : "",
	
	/**
	 * @cfg {Function} type
	 * Specifies the type of the Attribute, in which a conversion of the raw data will be performed.
	 * This accepts the following general types, but custom types may be added using the {@link Kevlar.attribute.Attribute#registerType} method.
	 * 
	 * - {@link Kevlar.attribute.MixedAttribute mixed}: Performs no conversions, and no special processing of given values. This is the default Attribute type (not recommended).
	 * - {@link Kevlar.attribute.StringAttribute string}
	 * - {@link Kevlar.attribute.IntegerAttribute int} / {@link Kevlar.attribute.IntegerAttribute integer}
	 * - {@link Kevlar.attribute.FloatAttribute float} (really a "double")
	 * - {@link Kevlar.attribute.BooleanAttribute boolean} / {@link Kevlar.attribute.BooleanAttribute bool}
	 * - {@link Kevlar.attribute.DateAttribute date}
	 * - {@link Kevlar.attribute.ModelAttribute model}
	 */
	
	/**
	 * @cfg {Mixed/Function} defaultValue
	 * The default value for the Attribute, if it has no value of its own. This can also be specified as the config 'default', 
	 * but must be wrapped in quotes (as `default` is a reserved word in JavaScript).
	 *
	 * If the defaultValue is a function, the function will be executed each time a Model is created, and its return value used as 
	 * the defaultValue. This is useful, for example, to assign a new unique number to an attribute of a model. Ex:
	 * 
	 *     MyModel = Kevlar.Model.extend( {
	 *         attributes : [
	 *             { name: 'uniqueId', defaultValue: function() { return Kevlar.newId(); } }
	 *         ]
	 *     } );
	 * 
	 * If an Object is provided as the defaultValue, its properties will be recursed and searched for functions. The functions will
	 * be executed to provide default values for nested properties of the object in the same way that providing a Function for this config
	 * will do.
	 */
	
	/**
	 * @cfg {Function} set
	 * A function that can be used to convert the value provided to the attribute, to a new value which will be stored
	 * on the {@link Kevlar.Model Model}. This function is passed the following arguments:
	 * 
	 * @cfg {Mixed} set.value The provided data value to the attribute. If the attribute has no initial data value, its {@link #defaultValue}
	 *   will be provided to this argument upon instantiation of the {@link Kevlar.Model Model}.
	 * @cfg {Kevlar.Model} set.model The Model instance that this Attribute belongs to.
	 * 
	 * The function should then do any processing that is necessary, and return the value that the Attribute should hold. For example,
	 * this `set` function will convert a string value to a 
	 * <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date" target="_blank">Date</a>
	 * object. Otherwise, it will return the value unchanged:
	 *     
	 *     set : function( value, model ) {
	 *         if( typeof value === 'string' ) {
	 *             value = new Date( value );
	 *         }
	 *         return value;
	 *     }
	 * 
	 * The {@link Kevlar.Model Model} instance is passed to this function as well, in case other Attributes need to be queried, or need
	 * to be {@link Kevlar.Model#set set} by the `set` function. However, in the case of querying other Attributes for their value, be 
	 * careful in that they may not be set to the expected value when the `set` function executes. For creating computed Attributes that 
	 * rely on other Attributes' values, use a {@link #get} function instead.
	 * 
	 * Notes:
	 * 
	 * - Both a `set` and a {@link #get} function can be used in conjunction.
	 * - The `set` function is called upon instantiation of the {@link Kevlar.Model Model}, if the Model is passed an initial value
	 *   for the Attribute, or if the Attribute has a {@link #defaultValue}.
	 */
	
	/**
	 * @cfg {Function} get
	 * A function that can be used to change the value that is returned when the Model's {@link Kevlar.Model#get get} method is called
	 * on the Attribute. This is useful to create "computed" attributes, which may be created based on other Attributes' values.  The function is 
	 * passed two arguments, and should return the computed value.
	 * 
	 * @cfg {Mixed} get.value The value that the Attribute currently has stored in the {@link Kevlar.Model Model}.
	 * @cfg {Kevlar.Model} get.model The Model instance that this Attribute belongs to.
	 * 
	 * For example, if we had a {@link Kevlar.Model Model} with `firstName` and `lastName` Attributes, and we wanted to create a `fullName` 
	 * Attribute, this could be done as such:
	 * 
	 *     {
	 *         name : 'fullName',
	 *         get : function( value, model ) {  // in this example, the Attribute has no value of its own, so we ignore the first arg
	 *             return model.get( 'firstName' ) + " " + model.get( 'lastName' );
	 *         }
	 *     }
	 * 
	 * Note: if the intention is to convert a provided value which needs to be stored on the {@link Kevlar.Model Model} in a different way,
	 * use a {@link #set} function instead. 
	 * 
	 * However, also note that both a {@link #set} and a `get` function can be used in conjunction.
	 */
	
	/**
	 * @cfg {Function} raw
	 * A function that can be used to convert an Attribute's value to a raw representation, usually for persisting data on a server.
	 * This function is automatically called (if it exists) when a persistence {@link Kevlar.persistence.Proxy proxy} is collecting
	 * the data to send to the server. The function is passed two arguments, and should return the raw value.
	 * 
	 * @cfg {Mixed} raw.value The underlying value that the Attribute currently has stored in the {@link Kevlar.Model Model}.
	 * @cfg {Kevlar.Model} raw.model The Model instance that this Attribute belongs to.
	 * 
	 * For example, a Date object is normally converted to JSON with both its date and time components in a serialized string (such
	 * as "2012-01-26T01:20:54.619Z"). To instead persist the Date in m/d/yyyy format, one could create an Attribute such as this:
	 * 
	 *     {
	 *         name : 'eventDate',
	 *         set : function( value, model ) { return new Date( value ); },  // so the value is stored as a Date object when used client-side
	 *         raw : function( value, model ) {
	 *             return (value.getMonth()+1) + '/' + value.getDate() + '/' + value.getFullYear();  // m/d/yyyy format 
	 *         }
	 *     }
	 * 
	 * The value that this function returns is the value that is used when the Model's {@link Kevlar.Model#raw raw} method is called
	 * on the Attribute.
	 */
	
	/**
	 * @cfg {Object} scope
	 * The scope to call the {@link #set}, {@link #get}, and {@link #raw} functions in. Defaults to the {@link Kevlar.Model Model}
	 * instance. 
	 */
	
	/**
	 * @cfg {Boolean} persist
	 * True if the attribute should be persisted by its {@link Kevlar.Model Model} using the Model's {@link Kevlar.Model#persistenceProxy persistenceProxy}.
	 * Set to false to prevent the attribute from being persisted.
	 */
	persist : true,
	
	
	
	
	statics : {
		/**
		 * An object (hashmap) which stores the registered Attribute types. It maps type names to Attribute subclasses.
		 * 
		 * @private
		 * @static
		 * @property {Object} attributeTypes
		 */
		attributeTypes : {},
		
		
		/**
		 * Static method to instantiate the appropriate Attribute subclass based on a configuration object, based on its `type` property.
		 * 
		 * @static
		 * @method create
		 * @param {Object} config The configuration object for the Attribute. Config objects should have the property `type`, 
		 *   which determines which type of Attribute will be instantiated. If the object does not have a `type` property, it will default 
		 *   to `mixed`, which accepts any data type, but does not provide any type checking / data consistency. Note that already-instantiated 
		 *   Attributes will simply be returned unchanged. 
		 * @return {Kevlar.attribute.Attribute} The instantiated Attribute.
		 */
		create : function( config ) {
			var type = config.type ? config.type.toLowerCase() : undefined;
		
			if( config instanceof Kevlar.attribute.Attribute ) {
				// Already an Attribute instance, return it
				return config;
				
			} else if( this.hasType( type || "mixed" ) ) {
				return new this.attributeTypes[ type || "mixed" ]( config );
				
			} else {
				// No registered type with the given config's `type`, throw an error
				throw new Error( "Kevlar.attribute.Attribute: Unknown Attribute type: '" + type + "'" );
			}
		},
		
		
		/**
		 * Static method used to register implementation Attribute subclass types. When creating an Attribute subclass, it 
		 * should be registered with the Attribute superclass (this class), so that it can be instantiated by a string `type` 
		 * name in an anonymous configuration object. Note that type names are case-insensitive.
		 * 
		 * This method will throw an error if a type name is already registered, to assist in making sure that we don't get
		 * unexpected behavior from a type name being overwritten.
		 * 
		 * @static
		 * @method registerType
		 * @param {String} typeName The type name of the registered class. Note that this is case-insensitive.
		 * @param {Function} jsClass The Attribute subclass (constructor function) to register.
		 */
		registerType : function( type, jsClass ) {
			type = type.toLowerCase();
			
			if( !this.attributeTypes[ type ] ) { 
				this.attributeTypes[ type ] = jsClass;
			} else {
				throw new Error( "Error: Attribute type '" + type + "' already exists" );
			}
		},
		
		
		/**
		 * Retrieves the Component class (constructor function) that has been registered by the supplied `type` name. 
		 * 
		 * @method getType
		 * @param {String} type The type name of the registered class.
		 * @return {Function} The class (constructor function) that has been registered under the given type name.
		 */
		getType : function( type ) {
			return this.attributeTypes[ type.toLowerCase() ];
		},
		
		
		/**
		 * Determines if there is a registered Attribute type with the given `typeName`.
		 * 
		 * @method hasType
		 * @param {String} typeName
		 * @return {Boolean}
		 */
		hasType : function( typeName ) {
			if( !typeName ) {  // any falsy type value given, return false
				return false;
			} else {
				return !!this.attributeTypes[ typeName.toLowerCase() ];
			}
		}
	},
	
	
	// End Statics
	
	// -------------------------------
	
	
	
	/**
	 * Creates a new Attribute instance. Note: You will normally not be using this constructor function, as this class
	 * is only used internally by {@link Kevlar.Model}.
	 * 
	 * @constructor 
	 * @param {Object/String} config An object (hashmap) of the Attribute object's configuration options, which is its definition. 
	 *   Can also be its Attribute {@link #name} provided directly as a string.
	 */
	constructor : function( config ) {
		// If the argument wasn't an object, it must be its attribute name
		if( typeof config !== 'object' ) {
			config = { name: config };
		}
		
		// Copy members of the attribute definition (config) provided onto this object
		Kevlar.apply( this, config );
		
		
		// Each Attribute must have a name.
		var name = this.name;
		if( name === undefined || name === null || name === "" ) {
			throw new Error( "no 'name' property provided to Kevlar.attribute.Attribute constructor" );
			
		} else if( typeof this.name === 'number' ) {  // convert to a string if it is a number
			this.name = name.toString();
		}
		
		
		// Normalize defaultValue
		if( this[ 'default' ] ) {  // accept the key as simply 'default'
			this.defaultValue = this[ 'default' ];
		}
	},
	
	
	/**
	 * Retrieves the name for the Attribute.
	 * 
	 * @method getName
	 * @return {String}
	 */
	getName : function() {
		return this.name;
	},
	
	
	/**
	 * Retrieves the default value for the Attribute. 
	 * 
	 * @method getDefaultValue
	 * @return {Mixed}
	 */
	getDefaultValue : function() {
		var defaultValue = this.defaultValue;
		
		if( typeof defaultValue === "function" ) {
			defaultValue = defaultValue();
		}
		
		// If defaultValue is an object, recurse through it and execute any functions, using their return values as the defaults
		if( typeof defaultValue === 'object' ) {
			defaultValue = Kevlar.util.Object.clone( defaultValue );  // clone it, to not edit the original object structure
			(function recurse( obj ) {
				for( var prop in obj ) {
					if( obj.hasOwnProperty( prop ) ) {
						if( typeof obj[ prop ] === 'function' ) {
							obj[ prop ] = obj[ prop ]();
						} else if( typeof obj[ prop ] === 'object' ) {
							recurse( obj[ prop ] );
						}
					}
				}
			})( defaultValue );
		}
		
		return defaultValue;
	},
	
	
	
	/**
	 * Determines if the Attribute should be persisted.
	 * 
	 * @method isPersisted
	 * @return {Boolean}
	 */
	isPersisted : function() {
		return this.persist;
	},
	
	
	// ---------------------------
	
	
	/**
	 * Allows the Attribute to determine if two values of its data type are equal, and the model
	 * should consider itself as "changed". This method is passed the "old" value and the "new" value
	 * when a value is {@link Kevlar.Model#set set} to the Model, and if this method returns `false`, the
	 * new value is taken as a "change".
	 * 
	 * This may be overridden by subclasses to provide custom comparisons, but the default implementation is
	 * to directly compare primitives, and deep compare arrays and objects.
	 * 
	 * @method valuesAreEqual
	 * @param {Mixed} oldValue
	 * @param {Mixed} newValue
	 * @return {Boolean} True if the values are equal, and the Model should *not* consider the new value as a 
	 *   change of the old value, or false if the values are different, and the new value should be taken as a change.
	 */
	valuesAreEqual : function( oldValue, newValue ) {
		return Kevlar.util.Object.isEqual( oldValue, newValue );
	},
	
	
	// ---------------------------
	
	
	/**
	 * Method that allows pre-processing for the value that is to be set to a {@link Kevlar.Model}.
	 * After this method has processed the value, it is provided to the {@link #set} function (if
	 * one exists), and then finally, the return value from the {@link #set} function will be provided
	 * to {@link #afterSet}, and then set as the data on the {@link Kevlar.Model Model}.
	 * 
	 * Note that the default implementation simply returns the raw value unchanged, but this may be overridden
	 * in subclasses to provide a conversion.
	 * 
	 * @method beforeSet
	 * @param {Kevlar.Model} model The Model instance that is providing the value. This is normally not used,
	 *   but is provided in case any model processing is needed.
	 * @param {Mixed} oldValue The old (previous) value that the model held.
	 * @param {Mixed} newValue The value provided to the {@link Kevlar.Model#set} method.
	 * @return {Mixed} The converted value.
	 */
	beforeSet : function( model, oldValue, newValue ) {
		return newValue;
	},
	
	
	/**
	 * Method that allows post-processing for the value that is to be set to a {@link Kevlar.Model}.
	 * This method is executed after the {@link #beforeSet} method, and the {@link #set} function (if one is provided), and is given 
	 * the value that the {@link #set} function returns. If no {@link #set} function exists, this will simply be executed 
	 * immediately after {@link #beforeSet}, after which the return from this method will be set as the data on the {@link Kevlar.Model Model}.
	 * 
	 * Note that the default implementation simply returns the value unchanged, but this may be overridden
	 * in subclasses to provide a conversion.
	 * 
	 * @method beforeSet
	 * @param {Kevlar.Model} model The Model instance that is providing the value. This is normally not used,
	 *   but is provided in case any model processing is needed.
	 * @param {Mixed} value The value provided to the {@link Kevlar.Model#set} method, after it has been processed by the
	 *   {@link #beforeSet} method, and any provided {@link #set} function.
	 * @return {Mixed} The converted value.
	 */
	afterSet : function( model, value ) {
		return value;
	}
	
} );
