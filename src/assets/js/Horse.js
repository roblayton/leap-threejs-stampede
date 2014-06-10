define(function() {
	var Horse = function(meshAnim, x, y, z) {
		var scope = this;

		var clock = new THREE.Clock();
		var morphs = [];

        this.halt = false;

        meshAnim.position.x = x;
        meshAnim.position.y = y;
        meshAnim.position.z = z;

        var startZ = meshAnim.position.z;

        morphs.push(meshAnim);

        var animSpeed = Math.random() * 100 + 900;
        var runSpeed = Math.random() * 1 + 1;

        var oAnimSpeed = animSpeed;
        var oRunSpeed = runSpeed;

        this.speedUp = false;
		this.animate = function() {
            if (scope.halt) {
                if (animSpeed > 1) {
                    animSpeed *= 0.97;
                    runSpeed *= 0.97;
                } else {
                    scope.halt = false;
                }
            }

            if (scope.speedUp) {
                if (animSpeed < oAnimSpeed) {
                    animSpeed *= 1.07;
                    runSpeed *= 1.07;
                } else {
                    scope.speedUp = false;
                }
            }

			var delta = clock.getDelta();
			for (var i = 0; i < morphs.length; i++) {
				morph = morphs[i];
				morph.updateAnimation(animSpeed * delta);
			}

            //if (meshAnim) {
                //if (meshAnim.position.z > 4000) {
                    //meshAnim.position.z = -2500;
                //} else {
                    //meshAnim.position.z += runSpeed;
                //}
            //}

		};
        
        this.meshAnim = meshAnim;
	};

	return Horse;
});

