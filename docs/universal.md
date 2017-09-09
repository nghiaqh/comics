## Isomorphic architecture

###1. Concept:

	The application state and code is shared between client and server. After the server has received the request, it creates a new application instance and renders the view. Then it passes the state of the storages into the rendered HTML output.
	```
	<script>var STATE = ... </script>
	```

	The client loads the same code (which is built with Webpack or Browserify) and bootstraps the application from the shared state. The shared state is created by server and injected into the global scope as above. It means that our application can continue from the point where the server has finished.

	The user gets a fully rendered site at the first load like traditional app, but also able to continue the surfing with a super fast Single-page application (SPA).

	*Essentially:*

	* There is still code separation. We only take down the boundary between client and server code so that the libraries, testing and language can be reused.
	* Three things are supplied to client: pre-rendered view, raw data and the code to turn the raw data into the pre-rendered view.

	*Pros:*

	* Faster perceived load time: the page loads immediately to the user as no wait time for app to bootstrap. And SPA interactivity.
	* Search engine indexability: as the result of server side rendering.
	* Free progressive enhancements: page still works if js is disabled on client side.
	* Easier code maintenace: same code base to a certain extend.

	*Cons:*

	*
	*

###2. Implementation:
