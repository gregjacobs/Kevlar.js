/**
 * @private
 * @class Kevlar.ModelCache
 * @singleton
 * 
 * Singleton class which caches models by their type (subclass type), and id. This is used
 * to retrieve models, and not duplicate them when instantiating the same model type with the
 * same instance id. 
 * 
 * This is a class used internally by Kevlar, and should not be used directly.
 */
/*global Kevlar */
Kevlar.ModelCache = {
	
	/**
	 * The hashmap of model references stored in the cache. This hashmap is a two-level hashmap, first keyed by the
	 * {@link Kevlar.Model Model's} assigned `__Kevlar_modelTypeId`, and then its instance id.
	 * 
	 * @private
	 * @property {Object} models
	 */
	models : {},
	
	
	/**
	 * Returns a Model that is in the cache with the same model type (model subclass) and instance id, if one exists
	 * that matches the type of the provided `model`, and the provided instance `id`. If a Model does not already exist, 
	 * the provided `model` is simply returned.
	 * 
	 * @method get
	 * @param {Kevlar.Model} model
	 * @param {String} [id]
	 * @return {Kevlar.Model}
	 */
	get : function( model, id ) {
		var modelClass = model.constructor,
		    modelTypeId = modelClass.__Kevlar_modelTypeId,  // the current modelTypeId, defined when the Model is extended
		    cachedModel;
		
		// If there is not a cache for this modelTypeId, create one now
		if( !this.models[ modelTypeId ] ) {
			this.models[ modelTypeId ] = {};
		}
		
		// If the model has an id provided with it, pull the cached model with that id (if it exists), or otherwise cache it
		if( typeof id !== 'undefined' ) {
			cachedModel = this.models[ modelTypeId ][ id ];
			if( !cachedModel ) {
				this.models[ modelTypeId ][ id ] = model;
			}
		}
		
		return cachedModel || model;
	}

};