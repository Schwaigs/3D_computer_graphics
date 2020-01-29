var W = 1000;
var H = 700;

var container = document.querySelector('#threejsContainer');

var scene, camera;

function init() {        
        scene = new THREE.Scene();        

        camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 1000);
        camera.position.set(0, 10, 10);
        camera.lookAt(scene.position);
        scene.add(camera);
        
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(W, H);
        container.appendChild(renderer.domElement);
        
        var sphere = new THREE.Mesh(
                new THREE.SphereGeometry(1,20,20),
                new THREE.MeshBasicMaterial( { color: "#FFFFFF" })
        );

        var box1 = new THREE.Mesh(
                new THREE.BoxGeometry(2,2,2),
                new THREE.MeshBasicMaterial( { color: "#FF8F77" })
        );
        box1.position.set(5,5,5); //origine du cube

        var sphere2 = new THREE.Mesh(
                new THREE.SphereGeometry(3,35,35),
                new THREE.MeshBasicMaterial( { color: "#3F90EC" })
        );
        sphere2.position.set(-4,-15,-2);

        var box2 = new THREE.Mesh(
                new THREE.BoxGeometry(1,1.25,1.25),
                new THREE.MeshBasicMaterial( { color: "#EC3F76" })
        );
        box2.position.set(-5,8,2);
        
        scene.add(sphere);
        scene.add(box1);
        scene.add(sphere2);
        scene.add(box2);
}

function animate() { //a compléter        
        requestAnimationFrame(animate);
        renderer.render(scene, camera);       
}


init();
animate();
