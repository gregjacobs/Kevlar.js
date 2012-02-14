/**
 * @class Kevlar.attribute.ModelAttribute
 * @extends Kevlar.attribute.Attribute
 * 
 * Attribute definition class for an Attribute that allows for a nested {@link Kevlar.Model} value.
 */
/*global window, Kevlar */
Kevlar.attribute.ModelAttribute = Kevlar.attribute.Attribute.extend( {
	
	/**
	 * @cfg {Kevlar.Model} defaultValue
	 * @inheritdoc
	 */
	defaultValue : null,
	
	
	/**
	 * @cfg {Kevlar.Model/String/Function} modelClass
	 * The specific {@link Kevlar.Model} subclass that will be used in the ModelAttribute. This config can be provided
	 * to perform automatic conversion of anonymous data objects into the approperiate Model subclass.
	 * 
	 * This config may be provided as a reference to a Model, a String which specifies the object path to the Model (which
	 * must be able to be referenced from the global scope, ex: 'myApp.MyModel'), or a function, which will return a reference
	 * to the Model that should be used. The reason that this config may be specified as a String or a Function is to allow
	 * for late binding to the Model class that is used, where the Model class that is to be used does not have to exist in the
	 * source code until a value is actually set to the Attribute. This allows for the handling of circular dependencies as well.
	 */
	
	/**
	 * @cfg {Boolean} embedded
	 * Setting this config to true has the parent {@link Kevlar.Model Model} treat the child {@link Kevlar.Model Model} as if it is a part of itself. 
	 * Normally, a child Model that is not embedded is treated as a "relation", where it is considered as independent from the parent Model.
	 * 
	 * What this means is that, when true:
	 * 
	 * - The parent Model is considered as "changed" when an attribute in the child Model is changed. This Attribute (the attribute that holds the child
	 *   model) is the "change".
	 * - The parent Model's {@link Kevlar.Model#change change} event is fired when an attribute on the child Model has changed.
	 * - The child Model's data is persisted with the parent Model's data, unless the {@link #persistIdOnly} config is set to true,
	 *   in which case just the child Model's {@link Kevlar.Model#idAttribute id} is persisted with the parent Model.
	 */
	embedded : false,
	
	/**
	 * @cfg {Boolean} persistIdOnly
	 * In the case that the {@link #embedded} config is true, set this to true to only have the {@link Kevlar.Model#idProperty id} of the embedded 
	 * model be persisted, rather than all of the Model data. Normally, when {@link #embedded} is false (the default), the child {@link Kevlar.Model Model}
	 * is treated as a relation, and only its {@link Kevlar.Model#idAttribute id} is persisted.
	 */
	persistIdOnly : false,
	
	
	// -------------------------------
	
	
	constructor : function() {
		Kevlar.attribute.ModelAttribute.superclass.constructor.apply( this, arguments );
		
		// Check if the user provided a modelClass, but the value is undefined. This means that they specified
		// a class that either doesn't exist, or doesn't exist yet, and we should give them a warning.
		if( 'modelClass' in this && this.modelClass === undefined ) {
			throw new Error( "The 'modelClass' config provided to an Attribute with the name '" + this.name + "' either doesn't exist, or doesn't " +
			                 "exist just yet. Consider using the String or Function form of the modelClass config for very late binding, if needed" );
		}
	},
	
	
	/**
	 * Overridden `preSet` method used to convert any anonymous objects into the specified {@link #modelClass}. The anonymous object
	 * will be provided to the {@link #modelClass modelClass's} constructor.
	 * 
	 * @override
	 * @method preSet
	 * @inheritdoc
	 */
	preSet : function( model, value ) {
		var modelClass = this.modelClass;
		
		// Normalize the modelClass
		if( typeof modelClass === 'string' ) {
			this.modelClass = modelClass = window[ modelClass ];
		} else if( typeof modelClass === 'function' && modelClass.constructor === Function ) {  // it's an anonymous function, run it, so it returns the Model reference we need
			this.modelClass = modelClass = modelClass();
		}
		
		if( !value || typeof value !== 'object' ) {
			value = null;  // convert all falsy values to null, and all other non-object data types
		} else if( value && typeof value === 'object' && typeof modelClass === 'function' && !( value instanceof modelClass ) ) {
			value = new modelClass( value );
		}
		
		return value;
	}
	
} );


// Register the Attribute type
Kevlar.attribute.Attribute.registerType( 'model', Kevlar.attribute.ModelAttribute );