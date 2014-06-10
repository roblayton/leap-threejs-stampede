define(['core/utils/Mapper', 'proj/Scenery', 'proj/Stampede', 'threejs', 'Leap', 'use!TrackballControls', 'TweenMax'], function(Mapper, Scenery, Stampede) {
	var ThreeController = function(container, options) {
		options = options || {};
		var scope = this;
		var callback = options.callbacks.onRender;
		var camRadius = 690;
        var active = false;
        var startFrame;

		// Scene
		var scene = new THREE.Scene();
		// ------

        var camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.y = 75;
        camera.target = new THREE.Vector3( 0, 0, 0 );
        camera.position.x = -150;
        camera.position.z = 300;

		var fov = camera.fov;

        var follow = false;
        // -----

		// Renderer
		var renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		//renderer.shadowMapEnabled = true;
		container.appendChild(renderer.domElement);
		// Controls
		var controls = new THREE.TrackballControls(camera, renderer.domElement);
		controls.target.set(0, 100, 0);
		// ------

		// ------
        //

		// Scenery
        var scenery = new Scenery(scene);

        var stampede = new Stampede(scene);

        var theta = 0;
        function render() {
            //theta += 0.1;
            stampede.animate();
			requestAnimationFrame(render);
			controls.update();
            //camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
            //camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );

            camera.lookAt( camera.target );

            renderer.render( scene, camera );
        }

        render();

		var v = function(x, y, z) {
			return new THREE.Vector3(x, y, z);
		};

        var currentTarget;

        // Target a horse
        var changeTarget = function(t) {
            t.add(camera);
            camera.target.y = 200;
            camera.position.y = 225;
            camera.position.z = -75;
            camera.position.x = 0;
            currentTarget = t;
        };

        var dropTarget = function() {
            currentTarget.remove(camera);
            currentTarget = null;
            camera.position.y = 75;
            camera.target = new THREE.Vector3( 0, 0, 0 );
            camera.position.x = -150;
            camera.position.z = 300;
        };

        /*
        setTimeout(function() {
            changeTarget(stampede.horses[50].meshAnim);
        }, 1000);

        // Deselect target
        setTimeout(function() {
            dropTarget();
        }, 2000);
        */

        var gesture, lastGesture, timer, gestured = false, isTimeModeOn = false;
        var isOffscreen = true;

        Leap.loop(function(frame) {
			var hands = frame.hands.length;
            var fingers = frame.pointables.length;

            if (!hands) {
                clearTimeout(timer);
                options.callbacks.onGesture('');
                gestured = false;
				isOffscreen = true;
            } else {
				isOffscreen = false;
            }

            if (hands == 2 && fingers == 10) {
                gesture = 'time mode';
                if (!gestured) {
                    options.callbacks.onGesture('...');
                }
            }

            if (isTimeModeOn) {
                if (hands == 1 && (fingers == 4 || fingers == 5)) {
                    gesture = 'speed up';
                    if (!gestured) {
                        options.callbacks.onGesture('...');
                    }
                }

                if (hands == 1 && fingers == 0) {
                    gesture = 'freeze';
                    if (!gestured) {
                        options.callbacks.onGesture('...');
                    }
                }
            } else {
                if (hands == 1 && fingers == 0) {
                    gesture = 'horseback';
                    if (!gestured) {
                        options.callbacks.onGesture('...');
                    }
                }
                
                if (hands == 1 && fingers == 5) {
                    gesture = 'free fly';
                    if (!gestured) {
                        options.callbacks.onGesture('...');
                    }
                }
            }

            //if (hands == 2 && fingers == 8) {
                //options.callbacks.onGesture('speed up');
                //stampede.thaw();
            //}

            if (gesture != lastGesture) {
                lastGesture = gesture;

                if (gesture == 'time mode') {
					startTimer(function() {
                        gestured = true;
                        options.callbacks.onGesture(gesture);
                        isTimeModeOn = true;
					});
                }

                if (gesture == 'freeze') {
                    console.log(gesture);
					startTimer(function() {
                        gestured = true;
                        options.callbacks.onGesture(gesture);
                        stampede.freeze();
                    });
                }

                if (gesture == 'speed up') {
                    console.log(gesture);
					startTimer(function() {
                        gestured = true;
                        options.callbacks.onGesture(gesture);
                        stampede.thaw();
                    });
                }

                if (gesture == 'horseback') {
					startTimer(function() {
                        gestured = true;
                        options.callbacks.onGesture(gesture);
                        changeTarget(stampede.horses[60].meshAnim);
                    });
                }

                if (gesture == 'free fly') {
					startTimer(function() {
                        gestured = true;
                        options.callbacks.onGesture(gesture);
                        if (currentTarget) {
                            dropTarget();
                        }
                    });
                }
            }

            // Camera control

            if (!active) {
                startFrame = frame;
                active = true;
            } else {
                var f = startFrame.translation(frame);
                // Limit y-axis betwee 0 and 180 degrees
                curY = Mapper.map(f[1], - 300, 300, 0, 179);

                // Assign rotation coordinates
                rotateX = f[0];
                rotateY = - curY;

                // Adjust 3D spherical coordinates of the camera
                var newX = camRadius * Math.sin(rotateY * Math.PI / 180) * Math.cos(rotateX * Math.PI / 180);
                var newZ = camRadius * Math.sin(rotateY * Math.PI / 180) * Math.sin(rotateX * Math.PI / 180);
                var newY = camRadius * Math.cos(rotateY * Math.PI / 180);

                if (!isTimeModeOn) {
                    if (gesture != 'horseback') {
                        TweenMax.to(camera.position, 1, {
                            x: newX,
                            y: newY,
                            z: newZ
                        });
                    } else {
                        TweenMax.to(camera.target, 1, {
                            x: -newX,
                            //y: newY,
                            z: newZ
                        });
                    }
                }

                //if (gesture == 'horseback') {
                    //var zoom = Math.max(0, f[2] + 200);
                    //var zoomFactor = 1 / (1 + (zoom / 150));
                    //camera.fov = fov * zoomFactor;
                //}
            }
        });

		var startTimer = function(callback) {
			clearTimeout(timer);
			timer = setTimeout(function() {
				if (!isOffscreen) {
					callback();
				}
			},
			1000);
		};

	};

	return ThreeController;
});

