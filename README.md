# Beam-WebPanel
#### Goal
This is a web UI for my another project - [Beam](https://github.com/Diarsid/Beam).

This UI serves as a personal web-panel - a representation and interactive view of user's personal web pages set, stored
in backend local service.
It is similar to different speed-dials or express-panels available in many browsers and has been inspired by a good old Opera 12 express-panel.

Used technologies - React.JS, AJAX, jQuery UI Sortable widget, react-modal, lodash, a lot of css.
Backend - [REST-like local service created using Java](https://github.com/Diarsid/Beam) (not included in this project).

#### Current status
Current version works satisfyingly, but it needs further improvements, fixes and feature additions to make it more flexible and stable.  
 
At the very first development stage I've concentrated on creating the base functionality in order to get it all working. Next goals are:
- implement Flux architecture to improve a data flow and application interaction with backend;
- basing on implemented Flux, streamline React components interactions and remove excessive data interchange between them;
- create UI settings feature in order to remove many of settings that are currently hardcoded.
