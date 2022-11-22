# Controllers

Controllers are end points to service requests. They are designed to be app agnosting (i.e. same controller can process any request be it from HTTP or any from of RPC).

Each controller must implement the BaseController - exposing atleast "exec" method, but they can also expose
"sanitize" and "validate" methods.

## App Type Controllers

Every base controller will have to transformed into the application type controller, which deals with input and output conversions, error handling etc. Fro example, 404 controller needs a convertor to turn it into an express controller. This convertor is also tied to controller factory, which can convert any controller into app type controller directly.
