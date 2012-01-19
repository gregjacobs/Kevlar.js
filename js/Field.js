/**
 * @class Kevlar.Field
 * @extends Object
 * 
 * Field definition object for a {@link Kevlar.Model Model}. The Field itself does not store data, but instead simply
 * defines the behaviors of a {@link Kevlar.Model Model's} fields. A {@link Kevlar.Model Model} is made up of Fields. 
 * 
 * Note: You will most likely not instantiate Field objects directly. This is used by {@link Kevlar.Model} with its
 * {@link Kevlar.Model#addFields addFields} config. Anonymous config objects provided to {@link Kevlar.Model#addFields addFields}
 * will be passed to the Field constructor.
 * 
 * @constructor
 * @param {Object/String} config An object (hashmap) of the Field object's configuration options, which is its definition. 
 *   Can also be its Field {@link #name} provided directly as a string.
 */
/*global Kevlar */
Kevlar.Field = Kevlar.extend( Object, {
	
	/**
	 * @cfg {String} name (required)
	 * The name for the field, which is used by the owner Model to reference it.
	 */
	name : "",
	
	/**
	 * @cfg {Function} type
	 * Specifies the type of the Field, in which a conversion of the raw data will be performed. 
	 * Currently, this config accepts a constructor function for the type. If a {@link Kevlar.Model}
	 * subclass is provided, any raw data object will be fed to the constructor function.
	 * 
	 * In the future, this may be implemented for other custom types.
	 */
	
	/**
	 * @cfg {Mixed/Function} defaultValue
	 * The default value for the Field, if it has no value of its own. This can also be specified as the config 'default', 
	 * but must be wrapped in quotes as `default` is a reserved word in JavaScript.
	 *
	 * If the defaultValue is a function, the function will be executed, and its return value used as the defaultValue.
	 */
	
	/**
	 * @cfg {Function} set
	 * A function that can be used to convert the value provided to the field, to a new value which will be stored
	 * on the {@link Kevlar.Model Model}. This function is passed two arguments:
	 * 
	 * @cfg {Mixed} set.value The provided data value to the field. If the field has no initial data value, its {@link #defaultValue}
	 *   will be provided to this argument upon instantiation of the {@link Kevlar.Model Model}.
	 * @cfg {Kevlar.Model} set.model The Model instance that this Field belongs to.
	 * 
	 * The function should then do any processing that is necessary, and return the value that the Field should hold. For example,
	 * this `set` function will convert a string value to a {@link Date} object. Otherwise, it will return the value unchanged:
	 *     
	 *     set : function( value, model ) {
	 *         if( typeof value === 'string' ) {
	 *             value = new Date( value );
	 *         }
	 *         return value;
	 *     }
	 * 
	 * The {@link Kevlar.Model Model} instance is passed to this function as well, in case other Fields need to be queried, or need
	 * to be {@link Kevlar.Model#set set} by the `set` function. However, in the case of querying other Fields for their value, be 
	 * careful in that they may not be set to the expected value when the `set` function executes. For creating computed Fields that 
	 * rely on other Fields' values, use a {@link #get} function instead.
	 * 
	 * Notes:
	 * 
	 * - Both a `set` and a {@link #get} function can be used in conjunction.
	 * - The `set` function is called upon instantiation of the {@link Kevlar.Model Model}, if the Model is passed an initial value
	 *   for the Field, or if the Field has a {@link #defaultValue}.
	 */
	
	/**
	 * @cfg {Function} get
	 * A function that can be used to change the value that is returned when the Model's {@link Kevlar.Model#get get} method is called
	 * on the Field. This is useful to create "computed" fields, which may be created based on other Fields' values.  The function is 
	 * passed two arguments, and should return the computed value:
	 * 
	 * @cfg {Mixed} get.value The value that the Field currently has stored in the {@link Kevlar.Model Model}.
	 * @cfg {Kevlar.Model} get.model The Model instance that this Field belongs to.
	 * 
	 * For example, if we had a {@link Kevlar.Model Model} with `firstName` and `lastName` Fields, and we wanted to create a `fullName` 
	 * Field, this could be done as such:
	 * 
	 *     {
	 *         name : 'fullName',
	 *         get : function( value, model ) {  // in this example, the Field has no value of its own, so we ignore the first arg
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
	 * @cfg {Object} scope
	 * The scope to call the {@link #set}, {@link #get}, and {@link #raw} functions in. Defaults to the {@link Kevlar.Model Model}
	 * instance. 
	 */
	
	/**
	 * @cfg {Boolean} persist
	 * True if the field should be persisted by its {@link Kevlar.Model Model} using the Model's {@link Kevlar.Model#proxy proxy}.
	 * Set to false to prevent the field from being persisted.
	 */
	persist : true,
	
	
	constructor : function( config ) {
		// If the argument wasn't an object, it must be its field name
		if( typeof config !== 'object' ) {
			config = { name: config };
		}
		
		// Copy members of the field definition (config) provided onto this object
		Kevlar.apply( this, config );
		
		
		// Each Field must have a name.
		var name = this.name;
		if( name === undefined || name === null || name === "" ) {
			throw new Error( "no 'name' property provided to Kevlar.Field constructor" );
			
		} else if( typeof this.name === 'number' ) {  // convert to a string if it is a number
			this.name = name.toString();
		}
		
		
		// Handle defaultValue
		if( this[ 'default' ] ) {  // accept the key as simply 'default'
			this.defaultValue = this[ 'default' ];
		}
		if( typeof this.defaultValue === "function" ) {
			this.defaultValue = this.defaultValue();
		}
		
		// If defaultValue is an object, recurse through it and execute any functions, using their return values as the defaults
		if( typeof this.defaultValue === 'object' ) {
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
			})( this.defaultValue );
		}
		
	},
	
	
	/**
	 * Retrieves the name for the Field.
	 * 
	 * @method getName()
	 */
	getName : function() {
		return this.name;
	},
	
	
	/**
	 * Determines if the Field should be persisted.
	 * 
	 * @method isPersisted
	 * @return {Boolean}
	 */
	isPersisted : function() {
		return this.persist;
	}
	
} );
