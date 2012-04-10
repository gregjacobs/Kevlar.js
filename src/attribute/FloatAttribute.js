/**
 * @class Kevlar.attribute.FloatAttribute
 * @extends Kevlar.attribute.NumberAttribute
 * 
 * Attribute definition class for an Attribute that takes a float (i.e. decimal, or "real") number data value.
 */
/*global Kevlar */
Kevlar.attribute.FloatAttribute = Kevlar.attribute.NumberAttribute.extend( {
	
	/**
	 * Converts the provided data value into a float. If {@link #useNull} is true, undefined/null/empty string 
	 * values will return null, or else will otherwise be converted to 0. If the number is simply not parsable, will 
	 * return NaN.
	 * 
	 * @method beforeSet
	 * @param {Kevlar.Model} model The Model instance that is providing the value. This is normally not used,
	 *   but is provided in case any model processing is needed.
	 * @param {Mixed} newValue The new value provided to the {@link Kevlar.Model#set} method.
	 * @param {Mixed} oldValue The old (previous) value that the model held (if any).
	 * @return {Boolean} The converted value.
	 */
	beforeSet : function( model, newValue, oldValue ) {
		var defaultValue = ( this.useNull ) ? null : 0;
		return ( newValue !== undefined && newValue !== null && newValue !== '' ) ? parseFloat( String( newValue ).replace( this.stripCharsRegex, '' ), 10 ) : defaultValue;
	}
	
} );


// Register the Attribute type
Kevlar.attribute.Attribute.registerType( 'float', Kevlar.attribute.FloatAttribute );
Kevlar.attribute.Attribute.registerType( 'number', Kevlar.attribute.FloatAttribute );