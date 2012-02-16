Kevlar is an MVC framework that I am developing while working at Jux ([jux.com](http://jux.com) - make an account (3 form fields) and play).

My main intention and goal for writing this was to address limitations and, to be frank, flat out mediocrity in some of the other frameworks that are out there.  Many are simplistic, and while this may make them supposedly flexible in some cases and reduce the initial amount of work required to get an app up and running, they aren't great for the long term maintenance and robustness that large applications require. Some also do not provide the flexibility and extensibility needed for large, complex, custom applications.

This is currently a work in progress, and is alpha.

## Changelog:

### 0.2

* Implemented "embedded" models, where change events on nested embedded models "bubble" to parent models.

### 0.1.1

* Provide the old (previous) values of attributes to the Model's `change` event.

### 0.1.0

* Initial implementation
