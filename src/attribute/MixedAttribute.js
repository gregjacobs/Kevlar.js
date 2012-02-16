/**
 * @class Kevlar.attribute.MixedAttribute
 * @extends Kevlar.attribute.Attribute
 * 
 * Attribute definition class for an Attribute that takes any data value.
 */
/*global Kevlar */
Kevlar.attribute.MixedAttribute = Kevlar.attribute.Attribute.extend( {
		
	
	
} );


// Register the Attribute type
Kevlar.attribute.Attribute.registerType( 'mixed', Kevlar.attribute.MixedAttribute );