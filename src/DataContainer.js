/**
 * @private
 * @abstract
 * @class Kevlar.DataContainer
 * 
 * Base class for data-holding classes ({@link Kevlar.Model} and {@link Kevlar.Collection}), that abstracts out some
 * of the commonalities between them.
 * 
 * This class is used internally by the framework, and shouldn't be used directly.
 */
/*global Kevlar */
Kevlar.DataContainer = Kevlar.util.Observable.extend( {
	
	/**
	 * @protected
	 * @property {String} clientId (readonly)
	 * 
	 * A unique ID for the Model on the client side. This is used to uniquely identify each Model instance.
	 * Retrieve with {@link #getClientId}.
	 */
	
	
	/**
	 * @constructor
	 */
	constructor : function() {
		var me = this;
		
		// Call the superclass's constructor (Observable)
		this._super( arguments );
		
		// Create a client ID for the DataContainer
		me.clientId = 'c' + Kevlar.newId();
	},
	
	
	/**
	 * Retrieves the DataContainer's unique {@link #clientId}.
	 * 
	 * @method getClientId
	 * @return {String} The DataContainer's unique {@link #clientId}. 
	 */
	getClientId : function() {
		return this.clientId;
	},
	
	
	/**
	 * Retrieves the native JavaScript value for the DataContainer.
	 * 
	 * @abstract
	 * @method getData
	 * @param {Object} [options] An object (hash) of options to change the behavior of this method. This object is sent to
	 *   the {@link Kevlar.data.NativeObjectConverter#convert NativeObjectConverter's convert method}, and accepts all of the options
	 *   that the {@link Kevlar.data.NativeObjectConverter#convert} method does. See that method for details.
	 * @return {Object} A hash of the data, where the property names are the keys, and the values are the {@link Kevlar.attribute.Attribute Attribute} values.
	 */
	getData : Kevlar.abstractFn,
	
	
	/**
	 * Determines if the DataContainer has any modifications.
	 * 
	 * @abstract
	 * @method isModified
	 * @return {Boolean}
	 */
	isModified : Kevlar.abstractFn
	
} );