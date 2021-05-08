//__________________________________TEST N°1 RETURN_______ Mesh var de la fonction(object)__________________
 var table = import_obj('./Table_01.obj',2,scene,0,-7,0,-8,new THREE.MeshPhongMaterial({ color: "#a68868" }));
//console.log(table.position);
 //![screen bug](./TP4/capture_ecran/console_log_obj_pos_hors_fonction.png)

 function import_obj(name,hauteur,scene,posX,posZ,coeff_rot_y,coeff_rot_x,material){
    var loader = new THREE.OBJLoader();
    loader.load(
            name,
            function(object){
                    obj=object.children[0];

                    var geometry = new THREE.Geometry().fromBufferGeometry(obj.geometry.clone());
                    var mesh = new THREE.Mesh(geometry,material);

                    scene.add(mesh);

                    var box = new THREE.BoxHelper( mesh, 0xffff00 ); //l'import peut créer un groupe de mash au lieu de un seul mesh donc boxhelper permet d'englober le groupe
                    box.geometry.computeBoundingBox();
                    var h = box.geometry.boundingBox.max.y - box.geometry.boundingBox.min.y 
                    var coeff = 1/h;
                    mesh.scale.x = hauteur * coeff;
                    mesh.scale.y = hauteur * coeff;
                    mesh.scale.z = hauteur * coeff;

                    mesh.rotation.y = coeff_rot_y * Math.PI / 16;
                    mesh.rotation.x = coeff_rot_x * Math.PI / 16;

                    var box2 = new THREE.BoxHelper( mesh, 0xffff00 );
                    box2.geometry.computeBoundingBox();
                    mesh.position.set(posX,-box2.geometry.boundingBox.min.y,posZ);
                    console.log(mesh.position);
                    //![screen bug](./TP4/capture_ecran/console_log_obj_pos_dans_fonction.png)

                    return mesh;
                   
            },
            function(xhr){console.log((xhr.loaded/xhr.total*100)+'% loaded');},
            function(error){console.log('An error happened');},
    )

}

//__________________________________TEST N°2 RETURN_______ Mesh var de la fonction entière__________________
function import_obj(name,hauteur,scene,posX,posZ,coeff_rot_y,coeff_rot_x,material){
    var mesh;
    var loader = new THREE.OBJLoader();
    loader.load(
            name,
            function(object){
                    obj=object.children[0];

                    var geometry = new THREE.Geometry().fromBufferGeometry(obj.geometry.clone());
                    mesh = new THREE.Mesh(geometry,material);

                    scene.add(mesh);

                    var box = new THREE.BoxHelper( mesh, 0xffff00 ); //l'import peut créer un groupe de mash au lieu de un seul mesh donc boxhelper permet d'englober le groupe
                    box.geometry.computeBoundingBox();
                    var h = box.geometry.boundingBox.max.y - box.geometry.boundingBox.min.y 
                    var coeff = 1/h;
                    mesh.scale.x = hauteur * coeff;
                    mesh.scale.y = hauteur * coeff;
                    mesh.scale.z = hauteur * coeff;

                    mesh.rotation.y = coeff_rot_y * Math.PI / 16;
                    mesh.rotation.x = coeff_rot_x * Math.PI / 16;

                    var box2 = new THREE.BoxHelper( mesh, 0xffff00 );
                    box2.geometry.computeBoundingBox();
                    mesh.position.set(posX,-box2.geometry.boundingBox.min.y,posZ);
                    console.log(mesh.position);
                    //![screen bug](./TP4/capture_ecran/console_log_obj_pos_dans_fonction.png)
                   
                    return mesh;
                   
            },
            function(xhr){console.log((xhr.loaded/xhr.total*100)+'% loaded');},
            function(error){console.log('An error happened');},
    )
    return mesh;

}



//_______________________________TEST PASSAGE EN PARAMETRE__________________________________________
var table;
import_obj('./Table_01.obj',2,scene,0,-7,0,-8,new THREE.MeshPhongMaterial({ color: "#a68868" }),table);
//console.log(table.position);
//![screen bug](./TP4/capture_ecran/console_log_obj_pos_hors_fonction.png)

function import_obj(name,hauteur,scene,posX,posZ,coeff_rot_y,coeff_rot_x,material,mesh){
    var loader = new THREE.OBJLoader();
    loader.load(
            name,
            function(object){
                    obj=object.children[0];

                    var geometry = new THREE.Geometry().fromBufferGeometry(obj.geometry.clone());
                    mesh = new THREE.Mesh(geometry,material);

                    scene.add(mesh);

                    var box = new THREE.BoxHelper( mesh, 0xffff00 ); //l'import peut créer un groupe de mash au lieu de un seul mesh donc boxhelper permet d'englober le groupe
                    box.geometry.computeBoundingBox();
                    var h = box.geometry.boundingBox.max.y - box.geometry.boundingBox.min.y 
                    var coeff = 1/h;
                    mesh.scale.x = hauteur * coeff;
                    mesh.scale.y = hauteur * coeff;
                    mesh.scale.z = hauteur * coeff;

                    mesh.rotation.y = coeff_rot_y * Math.PI / 16;
                    mesh.rotation.x = coeff_rot_x * Math.PI / 16;

                    var box2 = new THREE.BoxHelper( mesh, 0xffff00 );
                    box2.geometry.computeBoundingBox();
                    mesh.position.set(posX,-box2.geometry.boundingBox.min.y,posZ);
                    console.log(mesh.position);
                    //![screen bug](./TP4/capture_ecran/console_log_obj_pos_dans_fonction.png)
                   
            },
            function(xhr){console.log((xhr.loaded/xhr.total*100)+'% loaded');},
            function(error){console.log('An error happened');},
    )

}