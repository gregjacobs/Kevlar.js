Kevlar is an MVC framework that I am developing while working at Jux (<a href="http://jux.com" target="_blank">jux.com</a> - make an account (3 form fields) and play).

My main intention and goal for writing this project was to address limitations and, to be frank, mediocrity in some of the other data frameworks that are out there (\*\*cough cough BACKBONE cough\*\*).  Many are simplistic, don't support any schema ("whoops, I misspelled the attribute name and it failed silently!"), don't support any datatype checking, don't support any nesting of models, and just flat out aren't great for the long term maintenance and robustness that large applications require.

Will put some actual description on how to use up here sometime soon when it is in a more complete state :)

* <a href="http://gregjacobs.github.com/Kevlar.js/docs/" target="_blank">API Docs</a>
* <a href="http://gregjacobs.github.com/Kevlar.js/tests/" target="_blank">Tests</a>

This is currently a work in progress, and is alpha.

## Changelog:

### 0.9.2

* Made parent Models of all nested Models and Collections (not just 'embedded' Models and Collections) always fire 'change' events for the nested Model/Collection's changes.

### 0.9.1

* Implemented nested 'related' (as opposed to 'embedded') Collections of a Model. The child Collection now synchronizes its Models with the server before the parent Model persists itself.
  Note: This feature is not yet production ready however, as the parent model needs to be considered as changed for modifications to the parent model.

### 0.9

* Implemented Kevlar.Collection::sync(), which synchronizes the Collection's model with the server. This method creates, updates, and deletes models on the server that have been
  added (if it's a new model), modified, or removed from the Collection.

### 0.8.4

* Fix for Kevlar.util.Object.isEqual() method to properly shallow compare arrays (i.e. when the `deep` flag === `false`)

### 0.8.3

* Fix for when a model is added/removed/reordered in an embedded collection of a parent model, that an attribute-specific change event (i.e. "change:attr") is fired for the nested collection.

### 0.8.2

* Removed recursive search for functions from `defaultValue` functionality in attributes.

### 0.8.1

* Made attributes with user-defined 'setters' be updated after attributes with no user-defined setter when providing a set of values to update the Model with.
* Changed the name of the Model's load() method to reload() (and provided a backward compatibility alias).

### 0.8

* Added a static method to Model (and all of its subclasses) called getAttributes(), to statically retrieve the Attributes defined for a given Model class without needing an instance.

### 0.7.1

* Removed the ability to call the this.\_super() method in a provided set config function to Attribute. Was really unnecessary.

### 0.7

* Added default values for each of the "primitive" attribute types. Boolean attributes default to `false`, Number attributes default to `0`, and String attributes default to the empty string (`""`), *unless* the `useNull` config is set to true, in which case they will default to `null` (to denote an "unset" attribute).

### 0.6.3

* Updated to Class.js 0.3.1

### 0.6.2

* Added the ability for Model::isModified() and Collection::isModified() to only return true if persisted attributes are modified. Using this fixes an issue where a parent model might be persisted even though the only change to it was an unpersisted attribute in a nested child model.

### 0.6.1

* Merge pull request to fix URL appending in RestProxy.

### 0.6

* Changed the behavior of Collection's 'add' and 'remove' events. The 'add' and 'remove' events are now fired once for each addition or removal of one or more models. Added 'addset' and 'removeset' events for responding to a set of additions/removals all at once.

### 0.5.1

* Added a 'changeset' event, for handling a set of changes to a model all at once.

### 0.5

* Implemented automatic data conversions for the different Attribute types.

### 0.4

* Implemented "embedded" collections, where change events "bubble" to parent models. 
* Implemented a range of other features / methods to fill in gaps, and make collections really usable.

### 0.3

* Implemented first Collection implementation.

### 0.2

* Implemented "embedded" models, where change events on nested embedded models "bubble" to parent models.

### 0.1.1

* Provide the old (previous) values of attributes to the Model's `change` event.

### 0.1.0

* Initial implementation
