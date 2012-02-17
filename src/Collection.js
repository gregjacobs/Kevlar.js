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
	 * @param {Kevlar.Model/Kevlar.Model[]/Object/Object[]} model One or more models to add to the Collection. This may also
	 *   be one or more anonymous objects, which will be converted into models based on the {@link #modelClass} config.
	 */
	add : function( model ) {
		
	},
	
	
	/**
	 * Removes one or more models from the Collection.
	 * 
	 * @method remove
	 * @param {Kevlar.Model/Kevlar.Model[]} model One or more models to remove from the Collection.
	 */
	remove : function( model ) {
		
	},
	
	
	/**
	 * @method getAt
	 */
	getAt : function() {
		
	},
	
	
	/**
	 * @method getById
	 */
	getById : function() {
		
	},
	
	
	/**
	 * @method getByClientId
	 */
	getByClientId : function() {
		
	}

} );