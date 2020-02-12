var W = 1000;
var H = 700;

var container = document.querySelector('#threejsContainer');

var scene, camera, controls, renderer;

function init() {        
        scene = new THREE.Scene();        

        camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 1000);
        camera.position.set(0, 10, 10);
        camera.lookAt(scene.position);
        scene.add(camera);
        //scene.background = new THREE.Color( 0xff0000 ); 
        //change la couleur de fond de la scene pour rendre visibles nos mesh
        //car pour etre visible les meshLambertMaterial ont besoin d'une source de lumière.
        
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(W, H);
        container.appendChild(renderer.domElement);

        //axes
        var axesHelper = new THREE.AxesHelper( 5 );
        scene.add( axesHelper );

        //déplacement dans la scène à l'aide de la souris
        controls = new THREE.OrbitControls( camera, renderer.domElement );

        //source de lumiere dans une boule transparente
        var sun_light = new THREE.Mesh(
                new THREE.SphereGeometry(1.5,20,20),
                new THREE.MeshLambertMaterial( { color: "#FFEF2E", opacity :0.2, transparent: true })
        );
        sun_light.position.set(8,8,-8);
        var pointLight_sun = new THREE.PointLight( 0xffffff, 1, 100 );
        pointLight_sun.position.set( 8, 8, -8 );
        sun_light.add(pointLight_sun);
        scene.add(sun_light);

        //représentation de la source de lumière par un soleil
        var sun = new THREE.Mesh(
                new THREE.SphereGeometry(1.5,120,120),
                new THREE.MeshBasicMaterial( { color: "#FFEF2E" })
        );
        sun.position.set(8,8,-8);
        scene.add(sun);

        //paneau de controle de la position de la lumière
        dat_gui2(sun_light,sun);

        //sol
        var sol = new THREE.Mesh(
                new THREE.BoxGeometry(20,0.4,20),
                new THREE.MeshLambertMaterial( { color: "#7AF751" })
        );
        sol.position.set(0,-0.2,0);
        scene.add(sol);

        //arbre1
        var tronc = new THREE.Mesh(
                new THREE.CylinderGeometry(0.35,0.35,2,20),
                new THREE.MeshLambertMaterial( { color: "#AD6627" })
        );
        tronc.position.set(2,1,5);
        scene.add(tronc);
        var feuilles = new THREE.Mesh(
                new THREE.CylinderGeometry(0.01,1,3,40),
                new THREE.MeshLambertMaterial( { color: "#3ABC5C" })
        );
        feuilles.position.set(2,2.8,5);
        scene.add(feuilles);

        //arbre2
        var tronc2 = new THREE.Mesh(
                new THREE.CylinderGeometry(0.3,0.3,2,20),
                new THREE.MeshLambertMaterial( { color: "#AD6627" })
        );
        tronc2.position.set(0.2,1,5.5);
        scene.add(tronc2);
        var feuilles = new THREE.Mesh(
                new THREE.CylinderGeometry(0.01,0.7,2,40),
                new THREE.MeshLambertMaterial( { color: "#63F78A" })
        );
        feuilles.position.set(0.2,2,5.5);
        scene.add(feuilles);

        //ajout lapin obj
        var lapin;
        var loader = new THREE.OBJLoader();
        loader.load(
                'bunny.obj',
                function(object){
                        lapin=object;
                        lapin.position.set(0,-0.22,0);
                        lapin.scale.x = 5;
                        lapin.scale.y = 5;
                        lapin.scale.z = 5;
                        lapin.rotation.z = 10*Math.PI / 180;
                        scene.add(lapin);
                },
                function(xhr){console.log((xhr.loaded/xhr.total*100)+'% loaded');},
                function(error){console.log('An error happened');},
        )

        //ajout vache obj
        var cow;
        var loader2 = new THREE.OBJLoader();
        loader2.load(
                'cow.obj',
                function(object){
                        cow=object;
                        scene.add(cow);
                        
                        cow.scale.x = 0.35;
                        cow.scale.y = 0.35;
                        cow.scale.z = 0.35;
                        var box = new THREE.BoxHelper( cow, 0xffff00 ); //l'import peut créer un groupe de mash au lieu de un seul mesh donc boxhelper permet d'englober le groupe
                        
                        
                        box.geometry.computeBoundingBox()
                        cow.add(box);
                        cow.position.set(-2,-box.geometry.boundingBox.min.y,3);
                },
                function(xhr){console.log((xhr.loaded/xhr.total*100)+'% loaded');},
                function(error){console.log('An error happened');},
        )
        

}

function animate() { //a compléter        
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);       
}

function dat_gui(element){
        //valeurs de bases du panneau de contôle
        var parameters = {
                lightx: element.position.x,
                lighty: element.position.y,
                lightz: element.position.z,
        };

        var gui = new dat.GUI();

        var light_pos = gui.addFolder('Position');
        //Définition des 3 valeurs sur lequelles ont peut influer 
        var val_x = light_pos.add( parameters, 'lightx' ).min(-20).max(20).step(1).listen();
        var val_y = light_pos.add( parameters, 'lighty' ).min(-20).max(20).step(1).listen();
        var val_z = light_pos.add( parameters, 'lightz' ).min(-20).max(20).step(1).listen();
        light_pos.open();
        val_x.onChange(
                function(value) { 
                        element.position.x = value;
                }
        );
        val_y.onChange(
                function(value) { 
                        element.position.y = value;
                }
        ); 
        val_z.onChange(
                function(value) { 
                        element.position.z = value;
                }
        ); 
}

function dat_gui2(element_lum,representant){
        //valeurs de bases du panneau de contôle
        var parameters = {
                lightx: element_lum.position.x,
                lighty: element_lum.position.y,
                lightz: element_lum.position.z,
        };

        var gui = new dat.GUI();

        var light_pos = gui.addFolder('Position');
        //Définition des 3 valeurs sur lequelles ont peut influer 
        var val_x = light_pos.add( parameters, 'lightx' ).min(-20).max(20).step(1).listen();
        var val_y = light_pos.add( parameters, 'lighty' ).min(-20).max(20).step(1).listen();
        var val_z = light_pos.add( parameters, 'lightz' ).min(-20).max(20).step(1).listen();
        light_pos.open();
        val_x.onChange(
                function(value) { 
                        element_lum.position.x = value;
                        representant.position.x =value;
                }
        );
        val_y.onChange(
                function(value) { 
                        element_lum.position.y = value;
                        representant.position.y =value;
                }
        ); 
        val_z.onChange(
                function(value) { 
                        element_lum.position.z = value;
                        representant.position.z =value;
                }
        ); 
}

init();
animate();