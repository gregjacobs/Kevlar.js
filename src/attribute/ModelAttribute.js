/**
 * @class Kevlar.attribute.ModelAttribute
 * @extends Kevlar.attribute.DataContainerAttribute
 * 
 * Attribute definition class for an Attribute that allows for a nested {@link Kevlar.Model} value.
 * 
 * This class enforces that the Attribute hold a {@link Kevlar.Model Model} value, or null. However, it will
 * automatically convert an anonymous data object into the appropriate {@link Kevlar.Model Model} subclass, using
 * the Model provided to the {@link #modelClass} config. 
 * 
 * Otherwise, you must either provide a {@link Kevlar.Model} subclass as the value, or use a custom {@link #set} 
 * function to convert any anonymous object to a Model in the appropriate way. 
 */
/*global window, Kevlar */
Kevlar.attribute.ModelAttribute = Kevlar.attribute.DataContainerAttribute.extend( {
		
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
		this._super( arguments );
		
		// Check if the user provided a modelClass, but the value is undefined. This means that they specified
		// a class that either doesn't exist, or doesn't exist yet, and we should give them a warning.
		if( 'modelClass' in this && this.modelClass === undefined ) {
			throw new Error( "The 'modelClass' config provided to an Attribute with the name '" + this.getName() + "' either doesn't exist, or doesn't " +
			                 "exist just yet. Consider using the String or Function form of the modelClass config for late binding, if needed" );
		}
	},
	
	
	/**
	 * Overridden method used to determine if two models are equal.
	 * @inheritdoc
	 * 
	 * @override
	 * @method valuesAreEqual
	 * @param {Mixed} oldValue
	 * @param {Mixed} newValue
	 * @return {Boolean} True if the values are equal, and the Model should *not* consider the new value as a 
	 *   change of the old value, or false if the values are different, and the new value should be taken as a change.
	 */
	valuesAreEqual : function( oldValue, newValue ) {
		// We can't instantiate two different Models with the same id that have different references, so if the references are the same, they are equal
		return oldValue === newValue;
	},
	
	
	/**
	 * Overridden `beforeSet` method used to convert any anonymous objects into the specified {@link #modelClass}. The anonymous object
	 * will be provided to the {@link #modelClass modelClass's} constructor.
	 * 
	 * @override
	 * @method beforeSet
	 * @inheritdoc
	 */
	beforeSet : function( model, oldValue, newValue ) {
		// First, if the oldValue was a Model, and this attribute is an "embedded" model, we need to unsubscribe it from its parent model
		if( this.embedded && oldValue instanceof Kevlar.Model ) {
			model.unsubscribeEmbeddedDataContainer( this.getName(), oldValue );
		}
		
		// Now, normalize the newValue to an object, or null
		newValue = this._super( arguments );
		
		if( newValue !== null ) {
			var modelClass = this.modelClass;
			
			// Normalize the modelClass
			if( typeof modelClass === 'string' ) {
				modelClass = this.resolveGlobalPath( modelClass );  // changes the string "a.b.c" into the value at `a.b.c`
				
				if( !modelClass ) {
					throw new Error( "The string value 'modelClass' config did not resolve to a Model class for attribute '" + this.getName() + "'" );
				}
			} else if( typeof modelClass === 'function' && modelClass.constructor === Function ) {  // it's an anonymous function, run it, so it returns the Model reference we need
				this.modelClass = modelClass = modelClass();
				if( !modelClass ) {
					throw new Error( "The function value 'modelClass' config did not resolve to a Model class for attribute '" + this.getName() + "'" );
				}
			}
			
			if( newValue && typeof modelClass === 'function' && !( newValue instanceof modelClass ) ) {
				newValue = new modelClass( newValue );
			}
		}
		
		return newValue;
	},
	
	
	/**
	 * Overridden `afterSet` method used to subscribe to change events on a set child {@link Kevlar.Model Model}, if {@link #embedded} is true.
	 * 
	 * @override
	 * @method afterSet
	 * @inheritdoc
	 */
	afterSet : function( model, value ) {
		// Enforce that the value is either null, or a Kevlar.Model
		if( value !== null && !( value instanceof Kevlar.Model ) ) {
			throw new Error( "A value set to the attribute '" + this.getName() + "' was not a Kevlar.Model subclass" );
		}
		
		if( this.embedded && value instanceof Kevlar.Model ) {
			model.subscribeEmbeddedDataContainer( this.getName(), value );
		}
		
		return value;
	}
	
} );


// Register the Attribute type
Kevlar.attribute.Attribute.registerType( 'model', Kevlar.attribute.ModelAttribute );