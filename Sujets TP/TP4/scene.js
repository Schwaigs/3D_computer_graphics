var W = 1000;
var H = 700;
//le vecteur accélération qui est composé uniquement de la gravite (divisé par 40 pour ralentir son effet et avoir une animation plus lente)
var a = new THREE.Vector3(0,-0.255,0);
//vecteurs vitesses initiaux servants pour la chute de chaque cible
var v_boxes = [new THREE.Vector3(0,0,0),new THREE.Vector3(0,0,0),new THREE.Vector3(0,0,0)]; 
var clock = new THREE.Clock(true);
//position de départ de la balle et donc aussi celle de la camera
var posDepart = new THREE.Vector3(0, 3, -10);
//position précedente de notre balle
var b_prec_pos = posDepart.clone();

var container = document.querySelector('#threejsContainer');

var scene, camera, renderer, controls, raycaster, mouse, boxes, ball, clic, direction, ballRadius, table, pieds, timeStep, sol;

function init() {        
        scene = new THREE.Scene();        

        camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 1000);
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
        sol = new THREE.Mesh(
                new THREE.BoxGeometry(40,0.4,40),
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
        var pied_geo = new THREE.BoxGeometry(0.24,1.5,0.24);
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
        pieds = [pied1,pied2,pied3,pied4];
        var table_geo = new THREE.BoxGeometry(5.3,0.2,2.3);
        table = new THREE.Mesh(table_geo,table_mat);
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

function animate() {  
        requestAnimationFrame(animate);
        controls.update();
        physicUpdate();
        renderer.render(scene, camera);
        window.addEventListener( 'mousedown', onClick, false );
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
        if (!clic){
                //recupère les coordonnées de la souris
                mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
                mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
                //créer le rayon dans la scene partant de la caméra et passant par les coordonnées
                raycaster.setFromCamera( mouse, camera );
                //le vecteur direction correspond à notre vecteur vitesse de la balle
                direction=raycaster.ray.direction;
                //on le muliplie par 0.5 pour avoir une animation plus lente
                direction.multiplyScalar(0.5);
                clic = true;
        }
}

function throwBall(){
        //met à jour l'ancienne position de la balle
        b_prec_pos = ball.position.clone();
        //calcul du nouveau vecteur vitesse
        direction.add(a.clone().multiplyScalar(timeStep));
        //calcul du nouveau vecteur position
        ball.position.add(direction);
        //on vérifie que la balle n'est pas en collision avec le sol, un des pieds de la table ou qu'elle n'est pas sortie de la scène
        var backS = sol.position.z + (sol.geometry.parameters.depth/2);
        var rightS = sol.position.x + (sol.geometry.parameters.width/2);
        var leftS = sol.position.x - (sol.geometry.parameters.width/2);
        if (ball.position.y < ballRadius || ball.position.z > backS || ball.position.x > rightS || ball.position.x < leftS || collisionDetection(pieds[0]) < ballRadius 
             || collisionDetection(pieds[1]) < ballRadius || collisionDetection(pieds[2]) < ballRadius || collisionDetection(pieds[3]) < ballRadius ){
                clic = false;
                //replace la balle à sa position de départ
                ball.position.set(posDepart.x, posDepart.y, posDepart.z);
        }
        else{
                //on regarde si la balle est en collision avec la planche de la table
                if ( collisionDetection(table) < ballRadius ){
                        //si la balle a un point plus bas que le haut table alors qu'à sa précédente position elle était au dessus 
                        //alors on la repositionne sur la table pour la faire rouler dessus
                        if( (ball.position.y - ballRadius < table.position.y + (table.geometry.parameters.height/2)) && 
                                (b_prec_pos.y - ballRadius >= table.position.y + (table.geometry.parameters.height/2)) ){
                                ball.position.y = (table.position.y + (table.geometry.parameters.height/2)) + ballRadius;
                        }
                        //sinon c'est quelle tape la table sur un des bords donc elle reviens à sa position initiale
                        else{
                                clic = false;
                                ball.position.set(posDepart.x, posDepart.y, posDepart.z);
                        }
                }
                
                //on regarde si elle est en collision avec une des cible
                for ( var i = 0; i < boxes.length; i++ ) {
                        var distance = collisionDetection(boxes[i]);
                        //si la distance est plus petite que le rayon, alors la balle et la box sont en collision
                        if (distance < ballRadius){
                                collision(i);
                        }
                        //sinon on applique simplement la gravité à notre box 
                        else{
                                physicBox(null,i);
                        }
                }
                
        }
}

function collisionDetection(element){
        //Calcule la distance du point de l'élément(BoxGeometry) le plus proche du centre de la balle
        element.geometry.computeBoundingBox();
        var geo = element.geometry.boundingBox;
        
        var x = Math.max(element.position.x+geo.min.x, Math.min(ball.position.x, element.position.x+geo.max.x));
        var y = Math.max(element.position.y+geo.min.y, Math.min(ball.position.y, element.position.y+geo.max.y));
        var z = Math.max(element.position.z+geo.min.z, Math.min(ball.position.z, element.position.z+geo.max.z));

        var distance = Math.sqrt(
                (x - ball.position.x) * (x - ball.position.x) + 
                (y - ball.position.y) * (y - ball.position.y) + 
                (z - ball.position.z) * (z - ball.position.z)
        );
        return distance
}

function collision(index){
        //on regarde si notre box est encore sur la table
        var onTable = boxOnTable(index);
        //si oui la balle va simplement pousser la box dans la même direction mais il n'y aura pas de décalage vers le sol
        if(onTable){
                //même vecteur vitesse que la balle sauf pas sur y
                var v = new THREE.Vector3(direction.clone().x, 0, direction.clone().z);
                //calcul du nouveau vecteur position
                boxes[index].position.add(v);
        }
        //sinon la balle va pousser la box et en plus cette dernière va subir la gravité
        else{
                physicBox(direction,index);
        }
        
}

function boxOnTable(index){
        //regarde si notre cible est posée sur la table ou en est entièrement sortie
        //calcul les bords de la table
        var frontT = table.position.z - (table.geometry.parameters.depth/2);
        var backT = table.position.z + (table.geometry.parameters.depth/2);
        var rightT = table.position.x + (table.geometry.parameters.width/2);
        var leftT = table.position.x - (table.geometry.parameters.width/2);
        
        //calcule la positon des bord de la cible
        var frontB = boxes[index].position.z - (boxes[index].geometry.parameters.depth/2);
        var backB = boxes[index].position.z + (boxes[index].geometry.parameters.depth/2);
        var rightB = boxes[index].position.x + (boxes[index].geometry.parameters.width/2);
        var leftB = boxes[index].position.x - (boxes[index].geometry.parameters.width/2);
        
        if ( frontB > backT || backB < frontT || rightB < leftT || leftB > rightT ){
                return false;
        }

        return true;
}


function physicUpdate(){
        //met à jour le temps passé entre les deux rafraichissements
        timeStep = clock.getDelta();
        //regarde si la balle est lancée 
        if (clic == true){
                throwBall();
        }
        //sinon on applique simplement la gravité à toutes nos cibles
        else {
                for ( var i = 0; i < boxes.length; i++ ) {
                        physicBox(null,i);
                }
        }
}

function physicBox(direc,i){
        //regarde si la box est en collision avec la table ou le sol
        var onTable = boxOnTable(i);
        //si en colision avec aucun des deux alors en chute
        if ( !onTable  && (boxes[i].position.y - (boxes[i].geometry.parameters.height/2)) > 0 ){
                //calcul du nouveau vecteur vitesse
                v_boxes[i].add(a.clone().multiplyScalar(timeStep));
                //calcul du nouveau vecteur position
                if (direc != null){
                        //si la box est pousée par la balle on ajoute un multiple de notre vecteur direction en plus de la gravité
                        var k_direction = direc.clone().multiplyScalar(0.15);
                        v_boxes[i].add(k_direction);
                }
                boxes[i].position.add(v_boxes[i]);
                //on verifie qu'avec la nouvelle position la box ne traverse pas le sol
                if( (boxes[i].position.y - (boxes[i].geometry.parameters.height/2)) < 0 ){
                        boxes[i].position.y = boxes[i].geometry.parameters.height/2;
                }
        }
}

init();
animate();