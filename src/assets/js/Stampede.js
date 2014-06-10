define(['proj/Horse', 'threejs'], function(Horse) {
	var Stampede = function(scene) {
		var scope = this;
		this.horses = [];
        var locs = [];

        for (var i = 0, iLen = 32; i < iLen; i++) {
            for (var j = 0, jLen = 24; j < jLen; j++) {
                locs.push({x: (jLen / 2) * -150 + (j * 150) + ((i%2) * 75), y: 0, z: (i * (Math.random() * 15 + 135)) - 2900});
            }
        };

		var loader = new THREE.JSONLoader(true);
		loader.load("assets/models/horse.js", function(geometry) {
			morphColorsToFaceColors(geometry);
			geometry.computeMorphNormals();

            var material = new THREE.MeshPhongMaterial({
                color: 0xffffff,
                specular: 0xffffff,
                shininess: 20,
                morphTargets: true,
                morphNormals: true,
                vertexColors: THREE.FaceColors,
                shading: THREE.FlatShading
            });
            
            //var material = new THREE.MeshLambertMaterial( { color: 0x606060, morphTargets: true } );
            for (var i = 0, len = locs.length; i < len; i++) {
                meshAnim = new THREE.MorphAnimMesh(geometry, material);

                meshAnim.duration = 1000;

                var s = 0.35;
                meshAnim.scale.set(s, s, s);
                //meshAnim.position.y = 15;
                //meshAnim.rotation.y = -;

                meshAnim.castShadow = true;
                meshAnim.receiveShadow = true;

                scene.add(meshAnim);

                var horse = new Horse(meshAnim, locs[i].x, locs[i].y, locs[i].z);
                scope.horses.push(horse);
            };
		});

		function morphColorsToFaceColors(geometry) {
			if (geometry.morphColors && geometry.morphColors.length) {
				var colorMap = geometry.morphColors[0];
				for (var i = 0; i < colorMap.colors.length; i++) {
					geometry.faces[i].color = colorMap.colors[i];
				}
			}
		};

        this.freeze = function() {
            for (var i = 0, len = scope.horses.length; i < len; i++) {
                scope.horses[i].halt = true;
            }
        };

        this.thaw = function() {
            for (var i = 0, len = scope.horses.length; i < len; i++) {
                scope.horses[i].speedUp = true;
            }
        };

		this.animate = function() {
			for (var i = 0, len = scope.horses.length; i < len; i++) {
				scope.horses[i].animate();
			}
        };
	};

	return Stampede;
});

