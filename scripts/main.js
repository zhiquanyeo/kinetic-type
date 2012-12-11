//Bootstrap file
require(['engine/kineticobject'],
function(KTObject) {
    console.log('Bootstrapping Application');
    //console.log(KTObject);

    
    var canvas = document.getElementById('canvas');
    var elem1 = new KTObject();
    var elem2 = new KTObject();

    elem1.elem.innerText = 'Hello';
    elem2.elem.innerText = 'World';

    elem1.addToCanvas(canvas);
    elem2.addToCanvas(canvas);

    elem1.x = 100;
    elem1.y = 100;

    elem2.x = 300;
    elem2.y = 300;

    document.addEventListener('mousemove', function(evt) {
    	var angleVal = ((evt.clientY / 100) * 360) % 360;
    	elem2.rotation = angleVal;

    	elem1.x = evt.clientX;
    	elem1.y = evt.clientY;
    }, false);

});
