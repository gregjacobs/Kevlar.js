/**
 * @abstract
 * @class Kevlar.attribute.DataContainerAttribute
 * @extends Kevlar.attribute.ObjectAttribute
 * 
 * Attribute definition class for an Attribute that allows for a nested {@link Kevlar.Model} value.
 * 
 * This class enforces that the Attribute hold a {@link Kevlar.Model Model} value, or null. However, it will
 * automatically convert an anonymous data object into the appropriate {@link Kevlar.Model Model} subclass, using
 * the Model provided to the {@link #modelClass} config. 
 * 
 * Otherwise, you must either provide a {@link Kevlar.Model} subclass as the value, or use a custom {@link #set} 
 * function to convert any anonymous object to a Model in the appropriate way. 
 */
/*global window, Kevlar */
Kevlar.attribute.DataContainerAttribute = Kevlar.attribute.ObjectAttribute.extend( {
	
	/**
	 * @cfg {Boolean} embedded
	 * Setting this config to true has the parent {@link Kevlar.Model Model} treat the child {@link Kevlar.DataContainer DataContainer} as if it is a part of itself. 
	 * Normally, a child DataContainer that is not embedded is treated as a "relation", where it is considered as independent from the parent Model.
	 * 
	 * What this means is that, when true:
	 * 
	 * - The parent Model is considered as "changed" when there is a change in the child DataContainer is changed. This Attribute 
	 *   (the attribute that holds the child DataContainer) is the "change".
	 * - The parent Model's {@link Kevlar.Model#change change} event is fired when an attribute on the child DataContainer (Model or Collection) has changed.
	 * - The child DataContainer's data is persisted with the parent Model's data, unless the {@link #persistIdOnly} config is set to true,
	 *   in which case just the child DataContainer's {@link Kevlar.Model#idAttribute id} is persisted with the parent Model. In the case of a {@link Kevlar.Collection},
	 *   the ID's of the models are only persisted if {@link #persistIdOnly} is true.
	 */
	embedded : false,
	
	/**
	 * @cfg {Boolean} persistIdOnly
	 * In the case that the {@link #embedded} config is true, set this to true to only have the {@link Kevlar.Model#idProperty id} of the embedded 
	 * model(s) be persisted, rather than all of the Model/Collection data. Normally, when {@link #embedded} is false (the default), the child 
	 * {@link Kevlar.DataContainer DataContainer} is treated as a relation, and only its {@link Kevlar.Model#idAttribute ids} is/are persisted.
	 */
	persistIdOnly : false,
	
	
	// -------------------------------
	
	
	/**
	 * Utility method to resolve a string path to an object from the global scope to the
	 * actual object.
	 * 
	 * @protected
	 * @method resolveGlobalPath
	 * @param {String} path A string in the form "a.b.c" which will be resolved to the actual `a.b.c` object
	 *   from the global scope (`window`).
	 * @return {Mixed} The value at the given path under the global scope. Returns undefined if the value at the
	 *   path was not found (or this method errors if an intermediate path is not found).
	 */
	resolveGlobalPath : function( path ) {
		var paths = path.split( '.' );
		
		// Loop through the namespaces down to the end of the path, and return the value.
		var value;
		for( var i = 0, len = paths.length; i < len; i++ ) {
			value = ( value || window )[ paths[ i ] ];
		}
		return value;
	}
	
} );
