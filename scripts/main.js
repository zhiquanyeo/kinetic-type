//Bootstrap file
require(['engine/kineticobject', 'engine/kttext'],
function(KTObject, KTText) {
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

    	elem1.x = evt.clientX;
    	elem1.y = evt.clientY;
    }, false);

});
