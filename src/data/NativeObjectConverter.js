/**
 * @private
 * @class Kevlar.data.NativeObjectConverter
 * @singleton
 * 
 * NativeObjectConverter allows for the conversion of {@link Kevlar.Collection Collection} / {@link Kevlar.Model Models}
 * to their native Array / Object representations, while dealing with circular dependencies.
 */
/*global Kevlar */
Kevlar.data.NativeObjectConverter = {
	
	/**
	 * Converts a {@link Kevlar.Collection Collection} or {@link Kevlar.Model} to its native Array/Object representation,
	 * while dealing with circular dependencies.
	 * 
	 * @method convert
	 * 
	 * @param {Kevlar.Collection/Kevlar.Model} A Collection or Model to convert to its native Array/Object representation.
	 * @param {Object} [options] An object (hashmap) of options to change the behavior of this method. This may include:
	 * @param {String[]} [options.attributeNames] In the case that a {@link Kevlar.Model Model} is provided to this method, this
	 *   may be an array of the attribute names that should be returned in the output object.  Other attributes will not be processed.
	 *   (Note: only affects the Model passed to this method, and not nested models.)
	 * @param {Boolean} [options.persistedOnly] True to have the method only return data for the persisted attributes on
	 *   Models (i.e. attributes with the {@link Kevlar.attribute.Attribute#persist persist} config set to true, which is the default).
	 * @param {Boolean} [options.raw] True to have the method only return the raw data for the attributes, by way of the {@link Kevlar.Model#raw} method. 
	 *   This is used for persistence, where the raw data values go to the server rather than higher-level objects, or where some kind of serialization
	 *   to a string must take place before persistence (such as for Date objects). 
	 * 
	 * @return {Object[]/Object} An array of objects (for the case of a Collection}, or an Object (for the case of a Model)
	 *   with the internal attributes converted to their native equivalent.
	 */
	convert : function( obj, options ) {
		options = options || {};
		var cache = {},  // keyed by models' clientId, and used for handling circular dependencies
		    persistedOnly = !!options.persistedOnly,
		    raw = !!options.raw,
		    data = {};
		
		// Prime the cache with the Model provided to this method, so that if a circular reference points back to this
		// model, the data object is not duplicated as an internal object (i.e. it should refer right back to the converted Model's 
		// data object)
		cache[ obj.getClientId() ] = data;
		
		// Recursively goes through the data structure, and convert models to objects
		Kevlar.apply( data, (function convert( obj ) {
			var attributes = obj.getAttributes(),
			    attributeNames = options.attributeNames || Kevlar.util.Object.keysToArray( attributes ),
			    data = {},
			    i, len, attributeName, currentValue,
			    modelClientId, cachedModel;
			    
			// Slight hack, but delete options.attributeNames now, so that it is not used again for inner Models (should only affect the first 
			// Model that gets converted, i.e. the Model provided to this method)
			delete options.attributeNames;
			
			for( i = 0, len = attributeNames.length; i < len; i++ ) {
				attributeName = attributeNames[ i ];
				if( !persistedOnly || attributes[ attributeName ].isPersisted() === true ) {
					currentValue = data[ attributeName ] = ( raw ) ? obj.raw( attributeName ) : obj.get( attributeName );
					
					// Process nested models
					if( currentValue instanceof Kevlar.Model ) {
						modelClientId = currentValue.getClientId();
						
						if( ( cachedModel = cache[ modelClientId ] ) ) {
							data[ attributeName ] = cachedModel;
						} else {
							// first, set up an object for the cache (so it exists when checking for it in the next call to convert()), 
							// and set that object to the return data as well
							data[ attributeName ] = cache[ modelClientId ] = {};
							
							// now, populate that object with the properties of the inner object
							Kevlar.apply( cache[ modelClientId ], convert( currentValue ) );  
						}
					}
				}
			}
			return data;
		})( obj ) );
		
		return data;
	}
	
};