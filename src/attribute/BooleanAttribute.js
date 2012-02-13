/**
 * @class Kevlar.attribute.BooleanAttribute
 * @extends Kevlar.attribute.Attribute
 * 
 * Attribute definition class for an Attribute that takes a boolean (i.e. true/false) data value.
 */
/*global Kevlar */
Kevlar.attribute.BooleanAttribute = Kevlar.attribute.Attribute.extend( {
		
	
	
} );


// Register the Attribute type
Kevlar.attribute.Attribute.registerType( 'boolean', Kevlar.attribute.BooleanAttribute );
Kevlar.attribute.Attribute.registerType( 'bool', Kevlar.attribute.BooleanAttribute );