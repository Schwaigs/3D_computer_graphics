var W = 1000;
var H = 700;

var container = document.querySelector('#threejsContainer');

var scene, camera, renderer, controls, raycaster, mouse, boxes, ball, clic, direction, posDepart, ballRadius;

function init() {        
        scene = new THREE.Scene();        

        camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 1000);
        posDepart = new THREE.Vector3(0, 3, -10);
        camera.position.set(posDepart.x, posDepart.y, posDepart.z);
        camera.lookAt(scene.position);
        scene.add(camera);
        
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(W, H);
        container.appendChild(renderer.domElement);

        //déplacement dans la scène à l'aide de la souris
        controls = new THREE.OrbitControls( camera, renderer.domElement );


        //source de lumière
        var pointLight_sun = new THREE.PointLight( 0xffffff, 1, 100 );
        pointLight_sun.position.set(0,10,-10);

        //représentation de la source de lumière par un soleil
        var sun = new THREE.Mesh(
                new THREE.SphereGeometry(1.5,120,120),
                new THREE.MeshBasicMaterial( { color: "#FFEF2E" })
        );
        sun.add(pointLight_sun);
        sun.position.set(0,10,-10);
        scene.add(sun);

        //paneau de controle graphique
        var gui = new dat.GUI();
        dat_gui_position(sun,gui,null);

        //sol
        var sol = new THREE.Mesh(
                new THREE.BoxGeometry(20,0.4,20),
                new THREE.MeshLambertMaterial( { color: "#7AF751" })
        );
        sol.position.set(0,-0.2,0);
        scene.add(sol);

        //création de la balle
        ballRadius = 0.5;
        ball = new THREE.Mesh(
                new THREE.SphereGeometry(ballRadius,30,30),
                new THREE.MeshLambertMaterial({ color: "#f9a40f" })
        );
        ball.position.set(posDepart.x, posDepart.y, posDepart.z);
        scene.add(ball);

        //effet de la balle
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();

        //Création table pour le chamboule tout
        var pied_geo = new THREE.CylinderGeometry(0.12,0.12,1.5,20);
        var table_mat = new THREE.MeshLambertMaterial( { color: "#AD6627" })
        var pied1 = new THREE.Mesh(pied_geo,table_mat);
        pied1.position.set(2.5,0.8,5);
        scene.add(pied1);
        var pied2 = new THREE.Mesh(pied_geo,table_mat);
        pied2.position.set(2.5,0.8,7);
        scene.add(pied2);
        var pied3 = new THREE.Mesh(pied_geo,table_mat);
        pied3.position.set(-2.5,0.8,7);
        scene.add(pied3);
        var pied4 = new THREE.Mesh(pied_geo,table_mat);
        pied4.position.set(-2.5,0.8,5);
        scene.add(pied4);
        var table_geo = new THREE.BoxGeometry(5.3,0.2,2.3);
        var table = new THREE.Mesh(table_geo,table_mat);
        table.position.set(0,1.5,6);
        scene.add(table);

        //elements du chamboule tout
        var box1 = new THREE.Mesh(
                new THREE.BoxGeometry(0.8,0.8,0.8),
                new THREE.MeshPhongMaterial( { color: "#958A9B", shininess: 100, specular: "#E2E2E2" })
        );
        box1.position.set(0,2,6);
        scene.add(box1);
        var box2 = new THREE.Mesh(
                new THREE.BoxGeometry(0.8,0.8,0.8),
                new THREE.MeshPhongMaterial( { color: "#958A9B", shininess: 100, specular: "#E2E2E2" })
        );
        box2.position.set(1,2,6);
        scene.add(box2);
        var box3 = new THREE.Mesh(
                new THREE.BoxGeometry(0.8,0.8,0.8),
                new THREE.MeshPhongMaterial( { color: "#958A9B", shininess: 100, specular: "#E2E2E2" })
        );
        box3.position.set(-1,2,6);
        scene.add(box3);
        boxes = [box1,box2,box3];


}

function animate() { //a compléter   
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
        window.addEventListener( 'mousedown', onClick, false );
        if (clic == true){
                throwBall();
        } 
}

function dat_gui_position(element,gui,shaderMaterial){
        //valeurs de bases du panneau de contôle
        var parameters = {
                lightx: element.position.x,
                lighty: element.position.y,
                lightz: element.position.z,
        };

        var light_pos = gui.addFolder('Position');
        //Définition des 3 valeurs sur lequelles ont peut influer 
        var val_x = light_pos.add( parameters, 'lightx' ).min(-50).max(50).step(1).listen();
        var val_y = light_pos.add( parameters, 'lighty' ).min(-50).max(50).step(1).listen();
        var val_z = light_pos.add( parameters, 'lightz' ).min(-50).max(50).step(1).listen();
        light_pos.open();
        val_x.onChange(
                function(value) { 
                        element.position.x = value;
                        shaderMaterial.uniforms.pos_lum.value.x = value;
                }
        );
        val_y.onChange(
                function(value) { 
                        element.position.y = value;
                        shaderMaterial.uniforms.pos_lum.value.y = value;
                }
        ); 
        val_z.onChange(
                function(value) { 
                        element.position.z = value;
                        shaderMaterial.uniforms.pos_lum.value.z = value;
                }
        ); 
}

function onClick( event ){
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        raycaster.setFromCamera( mouse, camera );
        direction=raycaster.ray.direction;
        clic = true;
}

function throwBall(){
        ball.position.z += (direction.z/10);
        ball.position.y += (direction.y/10);
        ball.position.x += (direction.x/10);
        console.log("Position de la balle = { "+ball.position.x+" , "+ball.position.y+" , "+ball.position.z+" }");
        collisionDetection();
        if (ball.position.z > 8){
                clic = false;
                ball.position.set(posDepart.x, posDepart.y, posDepart.z);
        }
}

function collisionDetection(){
        console.log("   Détection des collisions");
        for ( var i = 0; i < boxes.length; i++ ) {
                console.log("   Box "+i);
                boxes[i].geometry.computeBoundingBox();
                var geo = boxes[i].geometry.boundingBox;
                console.log("           minZ = "+(boxes[i].position.z+geo.min.z)+"  maxZ = "+(boxes[i].position.z+geo.max.z));
                
                var x = Math.max(boxes[i].position.x+geo.min.x, Math.min(ball.position.x, boxes[i].position.x+geo.max.x));
                var y = Math.max(boxes[i].position.y+geo.min.y, Math.min(ball.position.y, boxes[i].position.y+geo.max.y));
                var z = Math.max(boxes[i].position.z+geo.min.z, Math.min(ball.position.z, boxes[i].position.z+geo.max.z));
                console.log("           x = "+x+"  y = "+y+"  z = "+z);

                var distance = Math.sqrt(
                        (x - ball.position.x) * (x - ball.position.x) + 
                        (y - ball.position.y) * (y - ball.position.y) + 
                        (z - ball.position.z) * (z - ball.position.z)
                );

                console.log("           Distance = "+distance+"  Rayon = "+ballRadius);
                if (distance < ballRadius){
                        collision(i);
                }
        }
}

function collision(index){
        console.log("           Collision avec box "+index);
        boxes[index].material.color.set( "#00FF00" );
        boxes[index].position.z += (direction.z/10);
        boxes[index].position.y += (direction.y/10);
        boxes[index].position.x += (direction.x/10);
}

init();
animate();