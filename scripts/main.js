//Bootstrap file
require.config({
    urlArgs: 'cb=' + Math.random(), //This is here to stop caching
});
require(['engine/kineticobject', 'engine/kttext', 'engine/numberattribute', 
    'engine/constraintcontainer', 'engine/ktsequence'],
function(KTObject, KTText, NumberAttribute, ConstraintContainer, KTSequence) {
    console.log('Bootstrapping Application');
    //console.log(KTObject);

    
    var canvas = document.getElementById('canvas');
    var elem1 = new KTObject();
    var elem2 = new KTObject();
    var text1 = new KTText();

    elem1.elem.innerText = 'Hello';
    elem2.elem.innerText = 'World';
    text1.text = 'Wassup';

    elem1.addToCanvas(canvas);
    elem2.addToCanvas(canvas);
    text1.addToCanvas(canvas);

    elem1.x = 100;
    elem1.y = 100;

    elem2.x = 300;
    elem2.y = 300;

    text1.x = 0;
    text1.y = 0;

    document.addEventListener('mousemove', function(evt) {
    	var angleVal = ((evt.clientY / 100) * 360) % 360;
    	elem2.rotation = angleVal;

    	elem1.x = evt.clientX - (elem1.width / 2);
    	elem1.y = evt.clientY - (elem1.height / 2);

        text1.fontSize = evt.clientY / 10;
    }, false);

    //KTAttribute testing
    var attr1 = new NumberAttribute(1);
    console.log(attr1.numberVal);

    //ConstraintContainer test
    function testFunc1() {
        console.log('I am Test Func 1');
    }

    function testFunc2() {
        console.log('I am Test Func 2');
    }

    var seq = new KTSequence('hi');
    
});
