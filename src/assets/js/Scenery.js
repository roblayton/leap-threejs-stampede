define(['threejs'], function() {
    var Scenery = function(scene, geometry, material) {
        var scope = this;
        scene.fog = new THREE.Fog( 0xffffff, 1, 5000 );
        scene.fog.color.setHSL( 0.6, 0, 1 );
		// lights
		var dirLight, hemiLight;
		
		hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
						hemiLight.color.setHSL( 0.6, 1, 0.6 );
						hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
						hemiLight.position.set( 0, 500, 0 );
						scene.add( hemiLight );

						//

						dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
						dirLight.color.setHSL( 0.1, 1, 0.95 );
						dirLight.position.set( -1, 1.75, 1 );
						dirLight.position.multiplyScalar( 50 );
						scene.add( dirLight );

						dirLight.castShadow = true;

						dirLight.shadowMapWidth = 2048;
						dirLight.shadowMapHeight = 2048;

						var d = 50;

						dirLight.shadowCameraLeft = -d;
						dirLight.shadowCameraRight = d;
						dirLight.shadowCameraTop = d;
						dirLight.shadowCameraBottom = -d;

						dirLight.shadowCameraFar = 3500;
						dirLight.shadowBias = -0.0001;
						dirLight.shadowDarkness = 0.35;
						//dirLight.shadowCameraVisible = true;

		// GROUND

						var groundGeo = new THREE.PlaneGeometry( 10000, 10000 );
						var groundMat = new THREE.MeshPhongMaterial( { ambient: 0xffffff, color: 0xffffff, specular: 0x050505 } );
						groundMat.color.setHSL( 0.095, 1, 0.75 );

						var ground = new THREE.Mesh( groundGeo, groundMat );
						ground.rotation.x = -Math.PI/2;
						ground.position.y = -33;
						scene.add( ground );

						ground.receiveShadow = true;

						// SKYDOME
						var vertexShader = document.getElementById( 'vertexShader' ).textContent;
						var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
						var uniforms = {
							topColor: 	 { type: "c", value: new THREE.Color( 0x0077ff ) },
							bottomColor: { type: "c", value: new THREE.Color( 0xffffff ) },
							offset:		 { type: "f", value: 33 },
							exponent:	 { type: "f", value: 0.6 }
						}
						uniforms.topColor.value.copy( hemiLight.color );

						scene.fog.color.copy( uniforms.bottomColor.value );

						var skyGeo = new THREE.SphereGeometry( 4000, 32, 15 );
						var skyMat = new THREE.ShaderMaterial( { vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide } );

						var sky = new THREE.Mesh( skyGeo, skyMat );
						scene.add( sky );
    };

    return Scenery;
});
