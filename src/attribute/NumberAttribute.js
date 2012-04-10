/**
 * @abstract
 * @class Kevlar.attribute.IntegerAttribute
 * @extends Kevlar.attribute.Attribute
 * 
 * Abstract base class for an Attribute that takes a number data value.
 */
/*global Kevlar */
Kevlar.attribute.NumberAttribute = Kevlar.attribute.Attribute.extend( {
	
	abstractClass: true,
	
	
	/**
	 * @cfg {Boolean} useNull
	 * Used when parsing the provided value for the Attribute. If this config is true, and the value 
	 * cannot be "easily" parsed into an integer (i.e. if it's undefined, null, or empty string), `null` will be used 
	 * instead of converting to 0.
	 */
	useNull : false,
	
	
	/**
	 * @protected
	 * @property {RegExp} stripCharsRegex 
	 * 
	 * A regular expression for stripping non-numeric characters from a numeric value. Defaults to `/[\$,%]/g`.
	 * This should be overridden for localization. A way to do this globally is, for example:
	 * 
	 *     Kevlar.attribute.NumberAttribute.prototype.stripCharsRegex = /newRegexHere/g;
	 */
	stripCharsRegex : /[\$,%]/g
	
} );