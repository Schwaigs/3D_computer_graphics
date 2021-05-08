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

        //déplacement dans la scène à l'aide de la souris
        controls = new THREE.OrbitControls( camera, renderer.domElement );

        //source de lumière
        var pointLight_sun = new THREE.PointLight( 0xffffff, 1, 100 );
        pointLight_sun.position.set( 8, 8, -8 );

        //représentation de la source de lumière par un soleil
        var sun = new THREE.Mesh(
                new THREE.SphereGeometry(1.5,120,120),
                new THREE.MeshBasicMaterial( { color: "#FFEF2E" })
        );
        sun.add(pointLight_sun);
        sun.position.set(8,8,-8);
        scene.add(sun);

        //paneau de controle de la position de la lumière
        dat_gui(sun);

        //sol
        var sol = new THREE.Mesh(
                new THREE.BoxGeometry(20,0.2,20),
                new THREE.MeshLambertMaterial( { color: "#7AF751" })
        );
        sol.position.set(0,0,0);
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

init();
animate();