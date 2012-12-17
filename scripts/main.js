//Bootstrap file
require.config({
    urlArgs: 'cb=' + Math.random() //This is here to stop caching
});
require(['engine/kineticobject', 'engine/kttext', 'engine/numberattribute',
    'engine/constraintcontainer', 'engine/ktsequence',
    'engine/ktengine', 'engine/constraints/change'],
function(KTObject, KTText, NumberAttribute, ConstraintContainer,
    KTSequence, KTEngine, ChangeConstraint) {
    console.log('Bootstrapping Application');
    //console.log(KTObject);

    
    var canvas = document.getElementById('canvas');
    

    var engine = new KTEngine(canvas);

    var sequence = new KTSequence("seqIntro");
    var introText = new KTText('txtIntro', 'demo start');

    introText.x = 400;
    introText.y = 300;

    introText.duration = 2000;
    introText.alphaAttr.addConstraint(new ChangeConstraint(introText, 2000, 0, 1));
    //TODO This needs to be looked at
    //introText.xAttr.addConstraint(new ChangeConstraint(introText, 2000, 400, 800));
    console.log(introText.xAttr._constraintArray);
    sequence.addChild(introText);

    // introText = new KTText('txtIntro2', 'demo start');
    // introText.x = 400;
    // introText.y = 300;

    // introText.delay = 2000;
    // introText.duration = 1000;

    // introText.xAttr.addConstraint(new ChangeConstraint(introText, 1000, 400, 800));
    // sequence.addChild(introText);

    sequence.calculateDuration();
    engine.addSequence(sequence);
    
    engine.start();
});
