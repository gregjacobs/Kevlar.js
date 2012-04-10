/**
 * @class Kevlar.attribute.DateAttribute
 * @extends Kevlar.attribute.ObjectAttribute
 * 
 * Attribute definition class for an Attribute that takes a JavaScript Date object.
 */
/*global Kevlar */
Kevlar.attribute.DateAttribute = Kevlar.attribute.ObjectAttribute.extend( {
		
	/**
	 * Converts the provided data value into a Date object. If the value provided is not a Date, or cannot be parsed
	 * into a Date, will return null.
	 * 
	 * @method beforeSet
	 * @param {Kevlar.Model} model The Model instance that is providing the value. This is normally not used,
	 *   but is provided in case any model processing is needed.
	 * @param {Mixed} newValue The new value provided to the {@link Kevlar.Model#set} method.
	 * @param {Mixed} oldValue The old (previous) value that the model held (if any).
	 * @return {Boolean} The converted value.
	 */
	beforeSet : function( model, newValue, oldValue ) {
		if( !newValue ) {
			return null;
		}
		if( Kevlar.isDate( newValue ) ) {
			return newValue;
		}
		
		var parsed = Date.parse( newValue );
		return ( parsed ) ? new Date( parsed ) : null;
	}
} );


// Register the Attribute type
Kevlar.attribute.Attribute.registerType( 'date', Kevlar.attribute.DateAttribute );