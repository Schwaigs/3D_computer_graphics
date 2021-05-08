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

        var sphere = new THREE.Mesh(
                new THREE.SphereGeometry(1,20,20),
                new THREE.MeshLambertMaterial( { color: "#FFFFFF" })
        );

        var box1 = new THREE.Mesh(
                new THREE.BoxGeometry(2,2,2),
                new THREE.MeshLambertMaterial( { color: "#FF8F77" })
        );
        box1.position.set(5,5,5); //origine du cube

        var sphere2 = new THREE.Mesh(
                new THREE.SphereGeometry(3,35,35),
                new THREE.MeshLambertMaterial( { color: "#3F90EC" })
        );
        sphere2.position.set(-4,-15,-2);

        var box2 = new THREE.Mesh(
                new THREE.BoxGeometry(1,1.25,1.25),
                new THREE.MeshLambertMaterial( { color: "#EC3F76" })
        );
        box2.position.set(-5,8,2);
        
        scene.add(sphere);
        scene.add(box1);
        scene.add(sphere2);
        scene.add(box2);

        //ajout de la source de lumière à la scène
        var pointLight = new THREE.PointLight( 0xffffff, 1, 100 );
        pointLight.position.set( 3, 3, 3 );

        //on place la lumière dans une sphere transparente
        var sphere_lum = new THREE.Mesh(
                new THREE.SphereGeometry(1,30,30),
                new THREE.MeshLambertMaterial( { color: "#FFFFFF", opacity :0.2, transparent: true })
        );
        sphere_lum.add(pointLight);
        sphere_lum.position.set(3,3,3);
        scene.add( sphere_lum );
        
        //paneau de controle de la position de la lumière
        dat_gui(sphere_lum);
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