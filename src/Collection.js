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
 *         
 *         modelClass: myApp.Todo
 *         
 *     } );
 * 
 * 
 * Note: Configuration options should be placed on the prototype of a Collection subclass.
 */
/*global Kevlar */
Kevlar.Collection = Kevlar.util.Observable.extend( {
	
	/**
	 * @cfg {Function} modelClass
	 * 
	 * A Kevlar.Model subclass which will be used to convert any anonymous data objects into
	 * its appropriate Model instance for the Collection. 
	 * 
	 * Note that if a factory method is required for the creation of models, where custom processing may be needed,
	 * override the {@link #createModel} method in a subclass.
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
	 * @param {Object[]/Kevlar.Model[]} models An initial set of Models to provide to the Collection.
	 */
	constructor : function( models ) {
		Kevlar.Collection.superclass.constructor.call( this );
		
		
		this.addEvents(
			/**
			 * Fires when one or more models has been added to the Collection.
			 * 
			 * @event add
			 * @param {Kevlar.Collection} collection This Collection instance.
			 * @param {Kevlar.Model[]} The model instances that were added.
			 * @param {Number} index The index at which the models were inserted. 
			 */
			'add',
			
			/**
			 * Fires when one or more models have been removed from the Collection.
			 * 
			 * @event remove
			 * @param {Kevlar.Collection} collection This Collection instance.
			 * @param {Kevlar.Model[]} The model instances that were removed.
			 */
			'remove'
		);
		
		
		this.models = [];
		this.modelsByClientId = {};
		this.modelsById = {};
		
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
	 * the appropriate {@link Kevlar.Model model} class, using the {@link #modelClass} config.
	 * 
	 * This may be overridden in subclasses to allow for custom processing, or to create a factory method for Model creation.
	 * 
	 * @protected
	 * @method createModel
	 * @param {Object} modelData
	 * @return {Kevlar.Model} The instantiated model.
	 */
	createModel : function( modelData ) {
		if( !this.modelClass ) {
			throw new Error( "Cannot instantiate model from anonymous data, 'modelClass' config not provided to Collection." );
		}
		
		return new this.modelClass( modelData );
	},
	
	
	
	/**
	 * Adds one or more models to the Collection.
	 * 
	 * @method add
	 * @param {Kevlar.Model/Kevlar.Model[]/Object/Object[]} models One or more models to add to the Collection. This may also
	 *   be one or more anonymous objects, which will be converted into models based on the {@link #modelClass} config.
	 */
	add : function( models ) {
		var insertPos = this.models.length,
		    i, len, model, modelId;
		
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
			
			this.models.push( model );
			this.modelsByClientId[ model.getClientId() ] = model;
			
			modelId = model.getId();
			if( modelId !== undefined && modelId !== null ) {
				this.modelsById[ modelId ] = model;
			}
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
		    i, len, j, model, modelClientId;
		
		// Normalize the argument to an array
		if( !Kevlar.isArray( models ) ) {
			models = [ models ];
		}
		
		for( i = 0, len = models.length; i < len; i++ ) {
			model = models[ i ];
			modelClientId = model.getClientId();
			
			// Don't bother searching to remove the model if we know it doesn't exist in the Collection
			if( this.modelsByClientId[ modelClientId ] ) {
				delete this.modelsByClientId[ modelClientId ];
				delete this.modelsById[ model.getId() ];
								
				for( j = collectionModels.length - 1; j >= 0; j-- ) {
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
	}

} );