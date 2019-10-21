const keyboardEventInit = function( e ) {
    try {
        e.initKeyboardEvent(
            "keyup" // in DOMString typeArg
            , false // in boolean canBubbleArg
            , false // in boolean cancelableArg
            , window // in views::AbstractView viewArg
            , "+" // [test]in DOMString keyIdentifierArg | webkit event.keyIdentifier | IE9 event.key
            , 3 // [test]in unsigned long keyLocationArg | webkit event.keyIdentifier | IE9 event.location
            , true // [test]in boolean ctrlKeyArg | webkit event.shiftKey | old webkit event.ctrlKey | IE9 event.modifiersList
            , false // [test]shift | alt
            , true // [test]shift | alt
            , false // meta
            , false // altGraphKey
        );



        /*
        // Safari and IE9 throw Error here due keyCode, charCode and which is readonly
        // Uncomment this code block if you need legacy properties
        delete e.keyCode;
        _Object_defineProperty(e, {writable: true, configurable: true, value: 9})
        delete e.charCode;
        _Object_defineProperty(e, {writable: true, configurable: true, value: 9})
        delete e.which;
        _Object_defineProperty(e, {writable: true, configurable: true, value: 9})
        */

        return ((e["keyIdentifier"] || e["key"]) == "+" && (e["keyLocation"] || e["location"]) == 3) && (
            e.ctrlKey ?
                e.altKey ? // webkit
                    1
                    :
                    3
                :
                e.shiftKey ?
                    2 // webkit
                    :
                    4 // IE9
        ) || 9 // FireFox|w3c
            ;
    }
    catch ( __e__ ) { console.log(__e__); }
};

export default keyboardEventInit;
