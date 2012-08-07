/**
 * @class Kevlar.Collection
 * @extends Kevlar.DataComponent
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
 * 
 * 
 * ### Model Events
 * 
 * Collections automatically relay all of their {@link Kevlar.Model Models'} events as if the Collection
 * fired it. The collection instance provides itself in the handler though. For example, Models' 
 * {@link Kevlar.Model#event-change change} events:
 *     
 *     var Model = Kevlar.Model.extend( {
 *         attributes: [ 'name' ]
 *     } );
 *     var Collection = Kevlar.Collection.extend( {
 *         model : Model
 *     } );
 * 
 *     var model1 = new Model( { name: "Greg" } ),
 *         model2 = new Model( { name: "Josh" } );
 *     var collection = new Collection( [ model1, model2 ] );
 *     collection.on( 'change', function( collection, model, attributeName, newValue, oldValue ) {
 *         console.log( "A model changed its '" + attributeName + "' attribute from '" + oldValue + "' to '" + newValue + "'" );
 *     } );
 * 
 *     model1.set( 'name', "Gregory" );
 *       // "A model changed its 'name' attribute from 'Greg' to 'Gregory'"
 */
/*global window, jQuery, Kevlar */
Kevlar.Collection = Kevlar.DataComponent.extend( {
	
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
	 * @protected
	 * @property {Kevlar.Model[]} removedModels
	 * 
	 * An array that holds Models removed from the Collection, which haven't yet been {@link #sync synchronized} to the server yet (by 
	 * {@link Kevlar.Model#destroy destroying} them).
	 */
	
	/**
	 * @private
	 * @property {Boolean} modified
	 * 
	 * Flag that is set to true whenever there is an addition, insertion, or removal of a model in the Collection.
	 */
	modified : false,
	
	
	
	/**
	 * Creates a new Collection instance.
	 * 
	 * @constructor
	 * @param {Object/Object[]/Kevlar.Model[]} config This can either be a configuration object (in which the options listed
	 *   under "configuration options" can be provided), or an initial set of Models to provide to the Collection. If providing
	 *   an initial set of models, they must be wrapped in an array. Note that an initial set of models can be provided when using
	 *   a configuration object with the {@link #cfg-models} config.
	 */
	constructor : function( config ) {
		this._super( arguments );
		
		this.addEvents(
			/**
			 * Fires when one or more models have been added to the Collection. This event is fired once for each
			 * model that is added. To respond to a set of model adds all at once, use the {@link #event-addset} 
			 * event instead. 
			 * 
			 * @event add
			 * @param {Kevlar.Collection} collection This Collection instance.
			 * @param {Kevlar.Model} model The model instance that was added. 
			 */
			'add',
			
			/**
			 * Responds to a set of model additions by firing after one or more models have been added to the Collection. 
			 * This event fires with an array of the added model(s), so that the additions may be processed all at 
			 * once. To respond to each addition individually, use the {@link #event-add} event instead. 
			 * 
			 * @event addset
			 * @param {Kevlar.Collection} collection This Collection instance.
			 * @param {Kevlar.Model[]} models The array of model instances that were added. This will be an
			 *   array of the added models, even in the case that a single model is added.
			 */
			'addset',
			
			/**
			 * Fires when a model is reordered within the Collection. A reorder can be performed
			 * by calling the {@link #insert} method with a given index of where to re-insert one or
			 * more models. If the model did not yet exist in the Collection, it will *not* fire a 
			 * reorder event, but will be provided with an {@link #event-add add} event instead. 
			 * 
			 * This event is fired once for each model that is reordered.
			 * 
			 * @event reorder
			 * @param {Kevlar.Collection} collection This Collection instance.
			 * @param {Kevlar.Model} model The model that was reordered.
			 * @param {Number} newIndex The new index for the model.
			 * @param {Number} oldIndex The old index for the model.
			 */
			'reorder',
			
			/**
			 * Fires when one or more models have been removed from the Collection. This event is fired once for each
			 * model that is removed. To respond to a set of model removals all at once, use the {@link #event-removeset} 
			 * event instead.
			 * 
			 * @event remove
			 * @param {Kevlar.Collection} collection This Collection instance.
			 * @param {Kevlar.Model} model The model instances that was removed.
			 * @param {Number} index The index that the model was removed from.
			 */
			'remove',
			
			/**
			 * Responds to a set of model removals by firing after one or more models have been removed from the Collection. 
			 * This event fires with an array of the removed model(s), so that the removals may be processed all at once. 
			 * To respond to each removal individually, use the {@link #event-remove} event instead.
			 * 
			 * @event removeset
			 * @param {Kevlar.Collection} collection This Collection instance.
			 * @param {Kevlar.Model[]} models The array of model instances that were removed. This will be an
			 *   array of the removed models, even in the case that a single model is removed.
			 */
			'removeset'
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
		// for when it is passed into Array.prototype.sort()
		if( typeof this.sortBy === 'function' ) {
			this.sortBy = Kevlar.bind( this.sortBy, this );
		}
		
		
		this.models = [];
		this.modelsByClientId = {};
		this.modelsById = {};
		this.removedModels = [];
		
		
		if( initialModels ) {
			this.add( initialModels );
			this.modified = false;  // initial models should not make the collection "modified". Note: NOT calling commit() here, because we may not want to commit changed model data. Need to figure that out.
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
		this.insert( models );
	},
	
	
	/**
	 * Inserts (or moves) one or more models into the Collection, at the specified `index`.
	 * Fires the {@link #event-add add} event for models that are newly inserted into the Collection,
	 * and the {@link #event-reorder} event for models that are simply moved within the Collection.
	 * 
	 * @method insert
	 * @param {Kevlar.Model/Kevlar.Model[]} models The model(s) to insert.
	 * @param {Number} index The index to insert the models at.
	 */
	insert : function( models, index ) {
		var indexSpecified = ( typeof index !== 'undefined' ),
		    i, len, model, modelId,
		    addedModels = [];
		
		// First, normalize the `index` if it is out of the bounds of the models array
		if( typeof index !== 'number' ) {
			index = this.models.length;  // append by default
		} else if( index < 0 ) {
			index = 0;
		} else if( index > this.models.length ) {
			index = this.models.length;
		}
		
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
			if( !( model instanceof Kevlar.Model ) ) {
				model = this.createModel( model );
			}
						
			// Only add if the model does not already exist in the collection
			if( !this.has( model ) ) {
				this.modified = true;  // model is being added, then the Collection has been modified
				
				addedModels.push( model );
				this.modelsByClientId[ model.getClientId() ] = model;
				
				// Insert the model into the models array at the correct position
				this.models.splice( index, 0, model );  // 0 elements to remove
				index++;  // increment the index for the next model to insert / reorder
				
				if( model.hasIdAttribute() ) {  // make sure the model actually has a valid idAttribute first, before trying to call getId()
					modelId = model.getId();
					if( modelId !== undefined && modelId !== null ) {
						this.modelsById[ modelId ] = model;
					}
					
					// Respond to any changes on the idAttribute
					model.on( 'change:' + model.getIdAttribute().getName(), this.onModelIdChange, this );
				}
				
				// Subscribe to the special 'all' event on the model, so that the Collection can relay all of the model's events
				model.on( 'all', this.onModelEvent, this );
				
				this.fireEvent( 'add', this, model );
				
			} else {
				// Handle a reorder, but only actually move the model if a new index was specified.
				// In the case that add() is called, no index will be specified, and we don't want to
				// "re-add" models
				if( indexSpecified ) {
					this.modified = true;  // model is being reordered, then the Collection has been modified
					
					var oldIndex = this.indexOf( model );
					
					// Move the model to the new index
					this.models.splice( oldIndex, 1 );
					this.models.splice( index, 0, model );
					
					this.fireEvent( 'reorder', this, model, index, oldIndex );
					index++; // increment the index for the next model to insert / reorder
				}
			}
		}
		
		// If there is a 'sortBy' config, use that now
		if( this.sortBy ) {
			this.models.sort( this.sortBy );  // note: the sortBy function has already been bound to the correct scope
		}
		
		// Fire the 'add' event for models that were actually inserted into the Collection (meaning that they didn't already
		// exist in the collection). Don't fire the event though if none were actually inserted (there could have been models
		// that were simply reordered).
		if( addedModels.length > 0 ) {
			this.fireEvent( 'addset', this, addedModels );
		}
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
		    i, len, model, modelIndex;
		
		// Normalize the argument to an array
		if( !Kevlar.isArray( models ) ) {
			models = [ models ];
		}
		
		for( i = 0, len = models.length; i < len; i++ ) {
			model = models[ i ];
			modelIndex = this.indexOf( model );
			
			// Don't bother doing anything to remove the model if we know it doesn't exist in the Collection
			if( modelIndex > -1 ) {
				this.modified = true;  // model is being removed, then the Collection has been modified
				
				delete this.modelsByClientId[ model.getClientId() ];
				
				if( model.hasIdAttribute() ) {   // make sure the model actually has a valid idAttribute first, before trying to call getId()
					delete this.modelsById[ model.getId() ];
					
					// Remove the listener for changes on the idAttribute
					model.un( 'change:' + model.getIdAttribute().getName(), this.onModelIdChange, this );
				}
				
				// Unsubscribe the special 'all' event listener from the model
				model.un( 'all', this.onModelEvent, this );
				
				// Remove the model from the models array
				collectionModels.splice( modelIndex, 1 );
				this.fireEvent( 'remove', this, model, modelIndex );
				
				removedModels.push( model );
				this.removedModels.push( model );  // Add reference to the model just removed, for when synchronizing the collection (using sync()). This is an array of all non-destroyed models that have been removed from the Collection, and is reset when those models are destroyed.
			}
		}
		
		if( removedModels.length > 0 ) {
			this.fireEvent( 'removeset', this, removedModels );
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
	 * Note that {@link #onModelEvent} is still called even when this method executes.
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
	
	
	/**
	 * Handles an event fired by a Model in the Collection by relaying it from the Collection
	 * (as if the Collection had fired it).
	 * 
	 * @protected
	 * @method onModelEvent
	 * @param {String} eventName
	 * @param {Mixed...} args The original arguments passed to the event.
	 */
	onModelEvent : function( eventName ) {
		// If the model was destroyed, we need to remove it from the collection
		if( eventName === 'destroy' ) {
			var model = arguments[ 1 ];  // arguments[ 1 ] is the model for the 'destroy' event
			this.remove( model );   // if the model is destroyed on its own, remove it from the collection. If it has been destroyed from the collection's sync() method, then this will just have no effect.
			
			// If the model was destroyed manually on its own, remove the model from the removedModels array, so we don't try to destroy it (again)
			// when sync() is executed.
			var removedModels = this.removedModels;
			for( var i = 0, len = removedModels.length; i < len; i++ ) {
				if( removedModels[ i ] === model ) {
					removedModels.splice( i, 1 );
					break;
				}
			}
		}
		
		// Relay the event from the collection, passing the collection itself, and the original arguments
		this.fireEvent.apply( this, [ eventName, this ].concat( Array.prototype.slice.call( arguments, 1 ) ) );
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
	 * Retrieves the Array representation of the Collection, where all models are converted into native JavaScript Objects.  The attribute values
	 * for each of the models are retrieved via the {@link Kevlar.Model#get} method, to pre-process the data before they are returned in the final 
	 * array of objects, unless the `raw` option is set to true, in which case the Model attributes are retrieved via {@link Kevlar.Model#raw}. 
	 * 
	 * @override
	 * @method getData
	 * @param {Object} [options] An object (hash) of options to change the behavior of this method. This object is sent to
	 *   the {@link Kevlar.data.NativeObjectConverter#convert NativeObjectConverter's convert method}, and accepts all of the options
	 *   that the {@link Kevlar.data.NativeObjectConverter#convert} method does. See that method for details.
	 * @return {Object} A hash of the data, where the property names are the keys, and the values are the {@link Kevlar.attribute.Attribute Attribute} values.
	 */
	getData : function( options ) {
		return Kevlar.data.NativeObjectConverter.convert( this, options );
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
	
	
	/**
	 * Commits any changes in the Collection, so that it is no longer considered "modified".
	 * 
	 * @override
	 * @method commit
	 */
	commit : function() {
		this.modified = false;  // reset flag
		
		// TODO: Determine if child models should also be committed. Possibly a flag argument for this?
		// But for now, maintain consistency with isModified()
		var models = this.models;
		for( var i = 0, len = models.length; i < len; i++ ) {
			models[ i ].commit();
		}
	},
	
	
	
	/**
	 * Rolls any changes to the Collection back to its state when it was last {@link #commit committed}
	 * or rolled back.
	 * 
	 * @override
	 * @method rollback 
	 */
	rollback : function() {
		this.modified = false;  // reset flag
		
		// TODO: Implement rolling back the collection's state to the array of models that it had before any
		// changes were made
		
		
		// TODO: Determine if child models should also be rolled back. Possibly a flag argument for this?
		// But for now, maintain consistency with isModified()
		var models = this.models;
		for( var i = 0, len = models.length; i < len; i++ ) {
			models[ i ].rollback();
		}
	},
	
	
	/**
	 * Determines if the Collection has been added to, removed from, reordered, or 
	 * has any {@link Kevlar.Model models} which are modified.
	 * 
	 * @method isModified
	 * 
	 * @param {Object} [options] An object (hash) of options to change the behavior of this method. This may be provided as the first argument to the
	 *   method if no `attributeName` is to be provided. Options may include:
	 * @param {Boolean} [options.persistedOnly=false] True to have the method only return true only if a Model exists within it that has a 
	 *   {@link Kevlar.attribute.Attribute#persist persisted} attribute which is modified. However, if the Collection itself has been modified
	 *   (by adding/reordering/removing a Model), this method will still return true.
	 * 
	 * @return {Boolean} True if the Collection has any modified models, false otherwise.
	 */
	isModified : function( options ) {
		options = options || {};
		
		// First, if the collection itself has been added to / removed from / reordered, then it is modified
		if( this.modified ) {
			return true;
			
		} else {
			var models = this.models,
			    i, len;
			
			for( i = 0, len = models.length; i < len; i++ ) {
				if( models[ i ].isModified( options ) ) {
					return true;
				}
			}
			return false;
		}
	},
	
	
	// ----------------------------
	
	// Searching methods
	
	/**
	 * Finds the first {@link Kevlar.Model Model} in the Collection by {@link Kevlar.attribute.Attribute Attribute} name, and a given value.
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
	},
	
	
	// ----------------------------
	
	// Persistence methods
	
	
	/**
	 * Synchronizes the Collection by persisting each of the {@link Kevlar.Model Models} that have changes. New Models are created,
	 * existing Models are modified, and removed Models are deleted.
	 * 
	 * @method sync
	 * @param {Object} [options] An object which may contain the following properties:
	 * @param {Boolean} [options.async=true] True to make the request asynchronous, false to make it synchronous.
	 * @param {Function} [options.success] Function to call if the synchronization is successful.
	 * @param {Function} [options.error] Function to call if the synchronization fails. The sychronization will be considered
	 *   failed if one or more Models does not persist successfully.
	 * @param {Function} [options.complete] Function to call when the operation is complete, regardless of success or failure.
	 * @param {Object} [options.scope=window] The object to call the `success`, `error`, and `complete` callbacks in. This may also
	 *   be provided as `context` if you prefer.
	 * @return {jQuery.Promise} A Promise object which may have handlers attached. 
	 */
	sync : function( options ) {
		options = options || {};
		var scope = options.scope || options.context || window;
		
				
		var models = this.getModels(),
		    newModels = [],
		    modifiedModels = [],
		    removedModels = this.removedModels,
		    i, len;
		
		// Put together an array of all of the new models, and the modified models
		for( i = 0, len = models.length; i < len; i++ ) {
			var model = models[ i ];
			
			if( model.isNew() ) {
				newModels.push( model );
			} else if( model.isModified( { persistedOnly: true } ) ) {  // only check "persisted" attributes
				modifiedModels.push( model );
			}
		}
		
		
		// Callbacks for the options to this function
		var successCallback = function() {
			if( options.success ) { options.success.call( scope ); }
		};
		var errorCallback = function() {
			if( options.error ) { options.error.call( scope ); }
		};
		var completeCallback = function() {
			if( options.complete ) { options.complete.call( scope ); }
		};
		
		// A callback where upon successful destruction of a model, remove the model from the removedModels array, so that we don't try to destroy it again from another call to sync()
		var destroySuccess = function( model ) {
			for( var i = 0, len = removedModels.length; i < len; i++ ) {
				if( removedModels[ i ] === model ) {
					removedModels.splice( i, 1 );
					break;
				}
			}
		};
		
		
		// Now synchronize the models
		var promises = [],
		    modelsToSave = newModels.concat( modifiedModels );
		
		for( i = 0, len = modelsToSave.length; i < len; i++ ) {
			var savePromise = modelsToSave[ i ].save( {
				async   : options.async
			} );
			promises.push( savePromise );
		}
		for( i = removedModels.length - 1; i >= 0; i-- ) {  // Loop this one backwards, as destroyed models will be removed from the array as they go if they happen synchronously
			var destroyPromise = removedModels[ i ].destroy( {
				async   : options.async
			} );
			destroyPromise.done( destroySuccess );  // Upon successful destruction, we want to remove the model from the removedModels array, so that we don't try to destroy it again
			promises.push( destroyPromise );
		}
		
		// The "overall" promise that will either succeed if all persistence requests are made successfully, or fail if just one does not.
		var overallPromise = jQuery.when.apply( null, promises );  // apply all of the promises as arguments
		overallPromise.done( successCallback, completeCallback );
		overallPromise.fail( errorCallback, completeCallback );
		
		return overallPromise;  // Return a jQuery.Promise object for all the promises
	}

} );