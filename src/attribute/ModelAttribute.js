/**
 * @class Kevlar.attribute.ModelAttribute
 * @extends Kevlar.attribute.Attribute
 * 
 * Attribute definition class for an Attribute that allows for a nested {@link Kevlar.Model} value.
 */
/*global Kevlar */
Kevlar.attribute.ModelAttribute = Kevlar.attribute.Attribute.extend( {
	
	/**
	 * @cfg {Kevlar.Model} defaultValue
	 * @inheritdoc
	 */
	defaultValue : null,
	
	
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
	persistIdOnly : false
	
} );


// Register the Attribute type
Kevlar.attribute.Attribute.registerType( 'model', Kevlar.attribute.ModelAttribute );