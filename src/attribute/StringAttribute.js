/**
 * @class Kevlar.attribute.StringAttribute
 * @extends Kevlar.attribute.Attribute
 * 
 * Attribute definition class for an Attribute that takes a string data value.
 */
/*global Kevlar */
Kevlar.attribute.StringAttribute = Kevlar.attribute.Attribute.extend( {
	
	/**
	 * @cfg {Boolean} useNull
	 * Used when parsing the provided value for the Attribute. If this config is true, and the value 
	 * cannot be "easily" parsed into a String (i.e. if it's undefined, or null), `null` will be used 
	 * instead of converting to an empty string.
	 */
	useNull : false,
	
	
	/**
	 * Converts the provided data value into a Boolean. If {@link #useNull} is true, "unparsable" values
	 * will return null. 
	 * 
	 * @method beforeSet
	 * @param {Kevlar.Model} model The Model instance that is providing the value. This is normally not used,
	 *   but is provided in case any model processing is needed.
	 * @param {Mixed} newValue The new value provided to the {@link Kevlar.Model#set} method.
	 * @param {Mixed} oldValue The old (previous) value that the model held (if any).
	 * @return {Boolean} The converted value.
	 */
	beforeSet : function( model, newValue, oldValue ) {
		var defaultValue = ( this.useNull ) ? null : "";
		return ( newValue === undefined || newValue === null ) ? defaultValue : String( newValue );
	}
	
} );


// Register the Attribute type
Kevlar.attribute.Attribute.registerType( 'string', Kevlar.attribute.StringAttribute );