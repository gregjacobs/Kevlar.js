/**
 * @class Kevlar.attribute.MixedAttribute
 * @extends Kevlar.attribute.Attribute
 * 
 * Attribute definition class for an Attribute that takes any data value.
 */
/*global Kevlar */
Kevlar.attribute.MixedAttribute = Kevlar.attribute.Attribute.extend( {
		
	// No specific implementation at this time. All handled by the base class Attribute.
	
} );


// Register the Attribute type
Kevlar.attribute.Attribute.registerType( 'mixed', Kevlar.attribute.MixedAttribute );