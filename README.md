Kevlar is an MVC framework that I am developing while working at Jux (<a href="http://jux.com" target="_blank">jux.com</a> - make an account (3 form fields) and play).

My main intention and goal for writing this was to address limitations and, to be frank, mediocrity in some of the other frameworks that are out there.  Many are simplistic, and while this may make them supposedly flexible in some cases and reduce the initial amount of work required to get an app up and running, they aren't great for the long term maintenance and robustness that large applications require. Some also do not provide the flexibility and extensibility needed for large, complex, custom applications.

* <a href="docs/" target="_blank">API Docs</a>
* <a href="tests/" target="_blank">Tests</a>

This is currently a work in progress, and is alpha.

## Changelog:

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
