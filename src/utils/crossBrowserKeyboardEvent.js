const _keyboardEvent_properties_dictionary = {
    "char": "",
    "key": "",
    "location": 0,
    "ctrlKey": false,
    "shiftKey": false,
    "altKey": false,
    "metaKey": false,
    "repeat": false,
    "locale": "",

    "detail": 0,
    "bubbles": false,
    "cancelable": false,

    //legacy properties
    "keyCode": 0,
    "charCode": 0,
    "which": 0
};

const own = Function.prototype.call.bind(Object.prototype.hasOwnProperty)

const _Object_defineProperty = Object.defineProperty || function(obj, prop, val) {
    if( "value" in val ) {
        obj[prop] = val["value"];
    }
}

const crossBrowser_initKeyboardEvent = (type, dict) => {
    let e;
    if( window._initKeyboardEvent_type ) {
        e = document.createEvent( "KeyboardEvent" );
    }
    else {
        e = document.createEvent( "Event" );
    }
    var _prop_name
        , localDict = {};

    for( _prop_name in _keyboardEvent_properties_dictionary ) {
        localDict[_prop_name] = (own(dict, _prop_name) && dict || _keyboardEvent_properties_dictionary)[_prop_name];
    }

    let _ctrlKey = localDict["ctrlKey"]
        , _shiftKey = localDict["shiftKey"]
        , _altKey = localDict["altKey"]
        , _metaKey = localDict["metaKey"]
        , _altGraphKey = localDict["altGraphKey"]

        , _modifiersListArg = window._initKeyboardEvent_type > 3 ? (
            (_ctrlKey ? "Control" : "")
            + (_shiftKey ? " Shift" : "")
            + (_altKey ? " Alt" : "")
            + (_metaKey ? " Meta" : "")
            + (_altGraphKey ? " AltGraph" : "")
        ).trim() : null

        , _key = localDict["key"] + ""
        , _char = localDict["char"] + ""
        , _location = localDict["location"]
        , _keyCode = localDict["keyCode"] || (localDict["keyCode"] = _key && _key.charCodeAt( 0 ) || 0)
        , _charCode = localDict["charCode"] || (localDict["charCode"] = _char && _char.charCodeAt( 0 ) || 0)

        , _bubbles = localDict["bubbles"]
        , _cancelable = localDict["cancelable"]

        , _repeat = localDict["repeat"]
        , _locale = localDict["locale"]
        , _view = window
    ;

    localDict["which"] || (localDict["which"] = localDict["keyCode"]);

    if( "initKeyEvent" in e ) {//FF
        //https://developer.mozilla.org/en/DOM/event.initKeyEvent
        e.initKeyEvent( type, _bubbles, _cancelable, _view, _ctrlKey, _altKey, _shiftKey, _metaKey, _keyCode, _charCode );
    }
    else if(  window._initKeyboardEvent_type && "initKeyboardEvent" in e ) {//https://developer.mozilla.org/en/DOM/KeyboardEvent#initKeyboardEvent()
        if( window._initKeyboardEvent_type == 1 ) { // webkit
            //http://stackoverflow.com/a/8490774/1437207
            //https://bugs.webkit.org/show_bug.cgi?id=13368
            e.initKeyboardEvent( type, _bubbles, _cancelable, _view, _key, _location, _ctrlKey, _shiftKey, _altKey, _metaKey, _altGraphKey );
        }
        else if( window._initKeyboardEvent_type == 2 ) { // old webkit
            //http://code.google.com/p/chromium/issues/detail?id=52408
            e.initKeyboardEvent( type, _bubbles, _cancelable, _view, _ctrlKey, _altKey, _shiftKey, _metaKey, _keyCode, _charCode );
        }
        else if( window._initKeyboardEvent_type == 3 ) { // webkit
            e.initKeyboardEvent( type, _bubbles, _cancelable, _view, _key, _location, _ctrlKey, _altKey, _shiftKey, _metaKey, _altGraphKey );
        }
        else if( window._initKeyboardEvent_type == 4 ) { // IE9
            //http://msdn.microsoft.com/en-us/library/ie/ff975297(v=vs.85).aspx
            e.initKeyboardEvent( type, _bubbles, _cancelable, _view, _key, _location, _modifiersListArg, _repeat, _locale );
        }
        else { // FireFox|w3c
            //http://www.w3.org/TR/DOM-Level-3-Events/#events-KeyboardEvent-initKeyboardEvent
            //https://developer.mozilla.org/en/DOM/KeyboardEvent#initKeyboardEvent()
            e.initKeyboardEvent( type, _bubbles, _cancelable, _view, _char, _key, _location, _modifiersListArg, _repeat, _locale );
        }
    }
    else {
        e.initEvent(type, _bubbles, _cancelable)
    }

    for( _prop_name in _keyboardEvent_properties_dictionary )if( own( _keyboardEvent_properties_dictionary, _prop_name ) ) {
        if( e[_prop_name] != localDict[_prop_name] ) {
            try {
                delete e[_prop_name];
                _Object_defineProperty( e, _prop_name, { writable: true, "value": localDict[_prop_name] } );
            }
            catch(e) {
                //Some properties is read-only
            }

        }
    }

    return e;
}

export default crossBrowser_initKeyboardEvent;
