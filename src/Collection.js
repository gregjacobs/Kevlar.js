/**
 * @class Kevlar.Collection
 * @extends Kevlar.util.Observable
 * 
 * Manages an ordered set of {@link Kevlar.Model Models}. This class itself is not meant to be used directly, 
 * but rather extended and configured for the different collections in your application.
 * 
 * Ex:
 *     
 *     myApp.Todos = Kevlar.Collection.extend( {
 *         model: myApp.Todo
 *     } );
 * 
 * 
 * Note: Configuration options should be placed on the prototype of a Collection subclass.
 */
/*global window, Kevlar */
Kevlar.Collection = Kevlar.util.Observable.extend( {
	
	/**
	 * @cfg {Function} model
	 * 
	 * The Kevlar.Model (sub)class which will be used to convert any anonymous data objects into
	 * its appropriate Model instance for the Collection. 
	 * 
	 * Note that if a factory method is required for the creation of models, where custom processing may be needed,
	 * override the {@link #createModel} method in a subclass.
	 * 
	 * It is recommended that you subclass Kevlar.Collection, and add this configuration as part of the definition of the 
	 * subclass. Ex:
	 * 
	 *     myApp.MyCollection = Kevlar.Collection.extend( {
	 *         model : myApp.MyModel
	 *     } );
	 */
	
	/**
	 * @cfg {Function} sortBy
	 * A function that is used to keep the Collection in a sorted ordering. Without one, the Collection will
	 * simply keep models in insertion order.
	 * 
	 * This function takes two arguments: each a {@link Kevlar.Model Model}, and should return `-1` if the 
	 * first model should be placed before the second, `0` if the models are equal, and `1` if the 
	 * first model should come after the second.
	 * 
	 * Ex:
	 *     
	 *     sortBy : function( model1, model2 ) { 
	 *         var name1 = model1.get( 'name' ),
	 *             name2 = model2.get( 'name' );
	 *         
	 *         return ( name1 < name2 ) ? -1 : ( name1 > name2 ) ? 1 : 0;
	 *     }
	 * 
	 * It is recommended that you subclass Kevlar.Collection, and add the sortBy function in the definition of the subclass. Ex:
	 * 
	 *     myApp.MyCollection = Kevlar.Collection.extend( {
	 *         sortBy : function( model1, model2 ) {
	 *             // ...
	 *         }
	 *     } );
	 *     
	 *     
	 *     // And instantiating:
	 *     var myCollection = new myApp.MyCollection();
	 */
	
	/**
	 * @cfg {Object/Kevlar.Model/Object[]/Kevlar.Model[]} models
	 * If providing a configuration object to the Kevlar.Collection constructor instead of an array of initial models, the initial 
	 * model(s) may be specified using this configuration option. Can be a single model or an array of models (or object / array of
	 * objects that will be converted to models).
	 * 
	 * Ex:
	 * 
	 *     // Assuming you have created a myApp.MyModel subclass of {@link Kevlar.Model},
	 *     // and a myApp.MyCollection subclass of Kevlar.Collection
	 *     var model1 = new myApp.MyModel(),
	 *         model2 = new myApp.MyModel();
	 *     
	 *     var collection = new myApp.MyCollection( {
	 *         models: [ model1, model2 ]
	 *     } );
	 */
	
	
	
	/**
	 * @protected
	 * @property {Kevlar.Model[]} models
	 * 
	 * The array that holds the Models, in order.
	 */
	
	/**
	 * @protected
	 * @property {Object} modelsByClientId
	 * 
	 * An object (hashmap) of the models that the Collection is currently holding, keyed by the models' {@link Kevlar.Model#clientId clientId}.
	 */
	
	/**
	 * @protected
	 * @property {Object} modelsById
	 * 
	 * An object (hashmap) of the models that the Collection is currently holding, keyed by the models' {@link Kevlar.Model#id id}, if the model has one.
	 */
	
	
	
	/**
	 * Creates a new Collection instance.
	 * 
	 * @constructor
	 * @param {Object/Object[]/Kevlar.Model[]} config This can either be a configuration object (in which the options listed
	 *   under "configuration options" can be provided), or an initial set of Models to provide to the Collection. If providing
	 *   an initial set of models, they must be wrapped in an array.
	 */
	constructor : function( config ) {
		Kevlar.Collection.superclass.constructor.call( this );
		
		this.addEvents(
			/**
			 * Fires when one or more models has been added to the Collection.
			 * 
			 * @event add
			 * @param {Kevlar.Collection} collection This Collection instance.
			 * @param {Kevlar.Model[]} The array of model instances that were added. This will be an
			 *   array even in the case that a single model is added, so that handlers can consistently
			 *   handle both cases of single/multiple model addition.
			 * @param {Number} index The index at which the models were inserted. 
			 */
			'add',
			
			/**
			 * Fires when one or more models have been removed from the Collection.
			 * 
			 * @event remove
			 * @param {Kevlar.Collection} collection This Collection instance.
			 * @param {Kevlar.Model[]} The array of model instances that were removed. This will be an
			 *   array even in the case that a single model is removed, so that handlers can consistently
			 *   handle both cases of single/multiple model removal.
			 */
			'remove'
		);
		
		
		var initialModels;
		
		// If the "config" is an array, it must be an array of initial models
		if( Kevlar.isArray( config ) ) {
			initialModels = config;
			
		} else if( typeof config === 'object' ) {
			Kevlar.apply( this, config );
			
			initialModels = this.models;  // grab any initial models in the config
		}
		
		
		// If a 'sortBy' exists, and it is a function, create a bound function to bind it to this Collection instance
		//  for when it is passed into Array.prototype.sort()
		if( typeof this.sortBy === 'function' ) {
			this.sortBy = Kevlar.bind( this.sortBy, this );
		} 
		
		
		this.models = [];
		this.modelsByClientId = {};
		this.modelsById = {};
		
		
		if( initialModels ) {
			this.add( initialModels );
		}
		
		// Call hook method for subclasses
		this.initialize();
	},
	
	
	/**
	 * Hook method for subclasses to initialize themselves. This method should be overridden in subclasses to 
	 * provide any model-specific initialization.
	 * 
	 * Note that it is good practice to always call the superclass `initialize` method from within yours (even if
	 * your class simply extends Kevlar.Collection, which has no `initialize` implementation itself). This is to future proof it
	 * from being moved under another superclass, or if there is ever an implementation made in this class.
	 * 
	 * Ex:
	 * 
	 *     MyCollection = Kevlar.Collection.extend( {
	 *         initialize : function() {
	 *             MyCollection.superclass.initialize.apply( this, arguments );   // or could be MyCollection.__super__.initialize.apply( this, arguments );
	 *             
	 *             // my initialization logic goes here
	 *         }
	 *     }
	 * 
	 * @protected
	 * @method initialize
	 */
	initialize : Kevlar.emptyFn,
	
	
	
	// -----------------------------
	
	
	/**
	 * If a model is provided as an anonymous data object, this method will be called to transform the data into 
	 * the appropriate {@link Kevlar.Model model} class, using the {@link #model} config.
	 * 
	 * This may be overridden in subclasses to allow for custom processing, or to create a factory method for Model creation.
	 * 
	 * @protected
	 * @method createModel
	 * @param {Object} modelData
	 * @return {Kevlar.Model} The instantiated model.
	 */
	createModel : function( modelData ) {
		if( !this.model ) {
			throw new Error( "Cannot instantiate model from anonymous data, 'model' config not provided to Collection." );
		}
		
		return new this.model( modelData );
	},
	
	
	
	/**
	 * Adds one or more models to the Collection.
	 * 
	 * @method add
	 * @param {Kevlar.Model/Kevlar.Model[]/Object/Object[]} models One or more models to add to the Collection. This may also
	 *   be one or more anonymous objects, which will be converted into models based on the {@link #model} config.
	 */
	add : function( models ) {
		var insertPos = this.models.length,
		    i, len, model, modelClientId, modelId;
		
		// Normalize the argument to an array
		if( !Kevlar.isArray( models ) ) {
			models = [ models ];
		}
		
		// No models to insert, return
		if( models.length === 0 ) {
			return;
		}
		
		for( i = 0, len = models.length; i < len; i++ ) {
			model = models[ i ];
			if( !( models[ i ] instanceof Kevlar.Model ) ) {
				model = models[ i ] = this.createModel( models[ i ] );
			}
			
			modelClientId = model.getClientId();
			
			// Only add if the model does not already exist in the collection
			if( !this.modelsByClientId[ modelClientId ] ) {
				this.models.push( model );
				this.modelsByClientId[ modelClientId ] = model;
				
				if( model.hasIdAttribute() ) {  // make sure the model actually has a valid idAttribute first, before trying to call getId()
					modelId = model.getId();
					if( modelId !== undefined && modelId !== null ) {
						this.modelsById[ modelId ] = model;
					}
					
					// Respond to any changes on the idAttribute
					model.on( 'change:' + model.getIdAttribute().getName(), this.onModelIdChange, this );
				}
			}
		}
		
		// If there is a 'sortBy' config, use that now
		if( this.sortBy ) {
			this.models.sort( this.sortBy );  // note: the sortBy function has already been bound to the correct scope
		}
		
		this.fireEvent( 'add', this, models, insertPos );
	},
	
	
	/**
	 * Removes one or more models from the Collection. Fires the {@link #event-remove} event with the
	 * models that were actually removed.
	 * 
	 * @method remove
	 * @param {Kevlar.Model/Kevlar.Model[]} models One or more models to remove from the Collection.
	 */
	remove : function( models ) {
		var collectionModels = this.models,
		    removedModels = [],
		    i, ilen, j, jlen, model, modelClientId;
		
		// Normalize the argument to an array
		if( !Kevlar.isArray( models ) ) {
			models = [ models ];
		}
		
		for( i = 0, ilen = models.length; i < ilen; i++ ) {
			model = models[ i ];
			modelClientId = model.getClientId();
			
			// Don't bother searching to remove the model if we know it doesn't exist in the Collection
			if( this.modelsByClientId[ modelClientId ] ) {
				delete this.modelsByClientId[ modelClientId ];
				if( model.hasIdAttribute() ) {   // make sure the model actually has a valid idAttribute first, before trying to call getId()
					delete this.modelsById[ model.getId() ];
					
					// Remove the listener for changes on the idAttribute
					model.un( 'change:' + model.getIdAttribute().getName(), this.onModelIdChange, this );
				}
								
				for( j = 0, jlen = collectionModels.length; j < jlen; j++ ) {
					if( collectionModels[ j ] === model ) {
						collectionModels.splice( j, 1 );
						removedModels.push( model );
						
						break;
					}
				}
			}
		}
		
		if( removedModels.length > 0 ) {
			this.fireEvent( 'remove', this, removedModels );
		}
	},
	
	
	/**
	 * Removes all models from the Collection. Fires the {@link #event-remove} event with the models
	 * that were removed.
	 * 
	 * @method removeAll
	 */
	removeAll : function() {
		this.remove( Kevlar.util.Object.clone( this.models, /* deep = */ false ) );  // make a shallow copy of the array to send to this.remove()
	},
	
	
	/**
	 * Handles a change to a model's {@link Kevlar.Model#idAttribute}, so that the Collection's 
	 * {@link #modelsById} hashmap can be updated.
	 * 
	 * @protected
	 * @method onModelIdChange
	 * @param {Kevlar.Model} model The model that fired the change event.
	 * @param {Mixed} newValue The new value.
	 * @param {Mixed} oldValue The old value. 
	 */
	onModelIdChange : function( model, newValue, oldValue ) {
		delete this.modelsById[ oldValue ];
		
		if( newValue !== undefined && newValue !== null ) {
			this.modelsById[ newValue ] = model;
		}
	},
	
	
	// ----------------------------
	
	
	/**
	 * Retrieves the Model at a given index.
	 * 
	 * @method getAt
	 * @param {Number} index The index to to retrieve the model at.
	 * @return {Kevlar.Model} The Model at the given index, or null if the index was out of range.
	 */
	getAt : function( index ) {
		return this.models[ index ] || null;
	},
	
	
	/**
	 * Convenience method for retrieving the first {@link Kevlar.Model model} in the Collection.
	 * If the Collection does not have any models, returns null.
	 * 
	 * @method getFirst
	 * @return {Kevlar.Model} The first model in the Collection, or null if the Collection does not have
	 *   any models.
	 */
	getFirst : function() {
		return this.models[ 0 ] || null;
	},
	
	
	/**
	 * Convenience method for retrieving the last {@link Kevlar.Model model} in the Collection.
	 * If the Collection does not have any models, returns null.
	 * 
	 * @method getLast
	 * @return {Kevlar.Model} The last model in the Collection, or null if the Collection does not have
	 *   any models.
	 */
	getLast : function() {
		return this.models[ this.models.length - 1 ] || null;
	},
	
	
	/**
	 * Retrieves a range of {@link Kevlar.Model Models}, specified by the `startIndex` and `endIndex`. These values are inclusive.
	 * For example, if the Collection has 4 Models, and `getRange( 1, 3 )` is called, the 2nd, 3rd, and 4th models will be returned.
	 * 
	 * @method getRange
	 * @param {Number} [startIndex=0] The starting index.
	 * @param {Number} [endIndex] The ending index. Defaults to the last Model in the Collection.
	 * @return {Kevlar.Model[]} The array of models from the `startIndex` to the `endIndex`, inclusively.
	 */
	getRange : function( startIndex, endIndex ) {
		var models = this.models,
		    numModels = models.length,
		    range = [],
		    i;
		
		if( numModels === 0 ) {
			return range;
		}
		
		startIndex = Math.max( startIndex || 0, 0 ); // don't allow negative indexes
		endIndex = Math.min( typeof endIndex === 'undefined' ? numModels - 1 : endIndex, numModels - 1 );
		
		for( i = startIndex; i <= endIndex; i++ ) {
			range.push( models[ i ] );
		}
		return range; 
	},
	
	
	/**
	 * Retrieves all of the models that the Collection has, in order.
	 * 
	 * @method getModels
	 * @return {Kevlar.Model[]} An array of the models that this Collection holds.
	 */
	getModels : function() {
		return this.getRange();  // gets all models
	},
	
	
	/**
	 * Retrieves the number of models that the Collection currently holds.
	 * 
	 * @method getCount
	 * @return {Number} The number of models that the Collection currently holds.
	 */
	getCount : function() {
		return this.models.length;
	},
	
	
	/**
	 * Retrieves a Model by its {@link Kevlar.Model#clientId clientId}.
	 * 
	 * @method getByClientId
	 * @param {Number} clientId
	 * @return {Kevlar.Model} The Model with the given {@link Kevlar.Model#clientId clientId}, or null if there is 
	 *   no Model in the Collection with that {@link Kevlar.Model#clientId clientId}.
	 */
	getByClientId : function( clientId ) {
		return this.modelsByClientId[ clientId ] || null;
	},
	
	
	/**
	 * Retrieves a Model by its {@link Kevlar.Model#id id}. Note: if the Model does not yet have an id, it will not
	 * be able to be retrieved by this method.
	 * 
	 * @method getById
	 * @param {Mixed} id The id value for the {@link Kevlar.Model Model}.
	 * @return {Kevlar.Model} The Model with the given {@link Kevlar.Model#id id}, or `null` if no Model was found 
	 *   with that {@link Kevlar.Model#id id}.
	 */
	getById : function( id ) {
		return this.modelsById[ id ] || null;
	},
	
	
	/**
	 * Determines if the Collection has a given {@link Kevlar.Model model}.
	 * 
	 * @method has
	 * @param {Kevlar.Model} model
	 * @return {Boolean} True if the Collection has the given `model`, false otherwise.
	 */
	has : function( model ) {
		return !!this.getByClientId( model.getClientId() );
	},
	
	
	/**
	 * Retrieves the index of the given {@link Kevlar.Model model} within the Collection. 
	 * Returns -1 if the `model` is not found.
	 * 
	 * @method indexOf
	 * @param {Kevlar.Model} model
	 * @return {Number} The index of the provided `model`, or of -1 if the `model` was not found.
	 */
	indexOf : function( model ) {
		var models = this.models,
		    i, len;
		
		if( !this.has( model ) ) {
			// If the model isn't in the Collection, return -1 immediately
			return -1;
			
		} else {
			for( i = 0, len = models.length; i < len; i++ ) {
				if( models[ i ] === model ) {
					return i;
				}
			}
		}
	},
	
	
	/**
	 * Retrieves the index of a given {@link Kevlar.Model model} within the Collection by its
	 * {@link Kevlar.Model#idAttribute id}. Returns -1 if the `model` is not found.
	 * 
	 * @method indexOfId
	 * @param {Mixed} id The id value for the model.
	 * @return {Number} The index of the model with the provided `id`, or of -1 if the model was not found.
	 */
	indexOfId : function( id ) {
		var model = this.getById( id );
		if( model ) {
			return this.indexOf( model );
		}
		return -1;
	},
	
	
	
	// ----------------------------
	
	// Searching methods
	
	/**
	 * Finds the first {@link Kevlar.Model Model} in the Collection by {@link Kevlar.Attribute Attribute} name, and a given value.
	 * Uses `===` to compare the value. If a more custom find is required, use {@link #findBy} instead.
	 * 
	 * Note that this method is more efficient than using {@link #findBy}, so if it can be used, it should.
	 * 
	 * @method find
	 * @param {String} attributeName The name of the attribute to test the value against.
	 * @param {Mixed} value The value to look for.
	 * @param {Object} [options] Optional arguments for this method, provided in an object (hashmap). Accepts the following:
	 * @param {Number} [options.startIndex] The index in the Collection to start searching from.
	 * @return {Kevlar.Model} The model where the attribute name === the value, or `null` if no matching model was not found.
	 */
	find : function( attributeName, value, options ) {
		options = options || {};
		
		var models = this.models,
		    startIndex = options.startIndex || 0;
		for( var i = startIndex, len = models.length; i < len; i++ ) {
			if( models[ i ].get( attributeName ) === value ) {
				return models[ i ];
			}
		}
		return null;
	},
	
	
	/**
	 * Finds the first {@link Kevlar.Model Model} in the Collection, using a custom function. When the function returns true,
	 * the model is returned. If the function does not return true for any models, `null` is returned.
	 * 
	 * @method findBy
	 * 
	 * @param {Function} fn The function used to find the Model. Should return an explicit boolean `true` when there is a match. 
	 *   This function is passed the following arguments:
	 * @param {Kevlar.Model} fn.model The current Model that is being processed in the Collection.
	 * @param {Number} fn.index The index of the Model in the Collection.
	 * 
	 * @param {Object} [options]
	 * @param {Object} [options.scope] The scope to run the function in.
	 * @param {Number} [options.startIndex] The index in the Collection to start searching from.
	 * 
	 * @return {Kevlar.Model} The model that the function returned `true` for, or `null` if no match was found.
	 */
	findBy : function( fn, options ) {
		options = options || {};
		
		var models = this.models,
		    scope = options.scope || window,
		    startIndex = options.startIndex || 0;
		    
		for( var i = startIndex, len = models.length; i < len; i++ ) {
			if( fn.call( scope, models[ i ], i ) === true ) {
				return models[ i ];
			}
		}
		return null;
	}

} );