/**
 * @abstract
 * @class Kevlar.attribute.IntegerAttribute
 * @extends Kevlar.attribute.PrimitiveAttribute
 * 
 * Abstract base class for an Attribute that takes a number data value.
 */
/*global Kevlar */
Kevlar.attribute.NumberAttribute = Kevlar.attribute.PrimitiveAttribute.extend( {
	
	abstractClass: true,
	
	/**
	 * @cfg {Mixed/Function} defaultValue
	 * @inheritdoc
	 * 
	 * The NumberAttribute defaults to 0, unless the {@link #useNull} config is 
	 * set to `true`, in which case it defaults to `null` (to denote the Attribute being "unset").
	 */
	defaultValue: function( attribute ) {
		return attribute.useNull ? null : 0;
	},
	
	
	/**
	 * @cfg {Boolean} useNull
	 * True to allow `null` to be set to the Attribute (which is usually used to denote that the 
	 * Attribute is "unset", and it shouldn't take an actual default value).
	 * 
	 * This is also used when parsing the provided value for the Attribute. If this config is true, and the value 
	 * cannot be "easily" parsed into an integer (i.e. if it's undefined, null, or empty string), `null` will be used 
	 * instead of converting to 0.
	 */
	
	
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