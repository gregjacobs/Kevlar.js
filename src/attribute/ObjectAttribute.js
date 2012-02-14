/**
 * @class Kevlar.attribute.ObjectAttribute
 * @extends Kevlar.attribute.Attribute
 * 
 * Attribute definition class for an Attribute that takes an object value.
 */
/*global Kevlar */
Kevlar.attribute.ObjectAttribute = Kevlar.attribute.Attribute.extend( {
	
	/**
	 * @cfg {Kevlar.Model} defaultValue
	 * @inheritdoc
	 */
	defaultValue : null,
	
	
	/**
	 * Overridden `preSet` method used to normalize the value provided. All non-object values are converted to null,
	 * while object values are returned unchanged.
	 * 
	 * @override
	 * @method preSet
	 * @inheritdoc
	 */
	preSet : function( model, value ) {
		if( typeof value !== 'object' ) {
			value = null;  // convert all non-object values to null
		}
		
		return value;
	}
	
} );


// Register the Attribute type
Kevlar.attribute.Attribute.registerType( 'object', Kevlar.attribute.ObjectAttribute );