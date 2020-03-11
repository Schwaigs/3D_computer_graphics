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

        //paneau de controle graphique
        var gui = new dat.GUI();

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

        //ajout lapin et vache obj
        import_obj('bunny.obj',0.8,scene,2,2,-5);
        import_obj_smooth('cow.obj',2,scene,-2,3,0);
        //import_obj('Orange.obj',1.5,scene,4,-1,0);

        
        //Création du ShaderMaterial
        //Vertex shader
        myVertexShader = `
                varying vec3 normales;
                varying vec4 worldPos;
                void main() 
                {
                vec4 worldPos = modelMatrix * vec4(position, 1.0);  
                gl_Position = projectionMatrix * viewMatrix * worldPos;
                normales = normal;
                }`
        //Pixel shader
        myFragmentShader = `
                varying vec3 normales;
                varying vec4 worldPos;
                uniform vec3 pos_lum;
                uniform vec3 rgb;
                void main()
                { 
                vec3 lambert = dot((pos_lum - worldPos.xyz),normales) * rgb;
                gl_FragColor = vec4(lambert, 1.0);
                }`
        //déclaration du type et de son conteneur Vector3 du registre uniform
        myRGBUniform = { type: "v3", value: new THREE.Vector3() };
        myPosUniform_lum = { type: "v3", value: new THREE.Vector3("ici") };

        // on associe la déclaration type/conteneur au nom de la variable uniform "rgb"
        myUniforms = { rgb : myRGBUniform, pos_lum : myPosUniform_lum };

        shaderMaterialParams = { vertexShader: myVertexShader, fragmentShader: myFragmentShader, uniforms: myUniforms };
        shaderMaterial = new THREE.ShaderMaterial(shaderMaterialParams);

        shaderMaterial.uniforms.pos_lum.value.set(sun.position.x,sun.position.y,sun.position.z);
        console.log('lum position = ',shaderMaterial.uniforms.pos_lum.value); 

        dat_gui_position(sun,gui,shaderMaterial);

        //sphere pour support TP3
        geometry_sphere = new THREE.SphereGeometry(1,20,20);
        var sphere = new THREE.Mesh(geometry_sphere,shaderMaterial);
        sphere.position.set(2,1.5,-1);
        scene.add(sphere);

        //definition couleur de base de la sphere
        var r = 68;
        var g = 171;
        var b = 215;

        //on l'assigne au registre uniform déclaré dans le pixel shader
        shaderMaterial.uniforms.rgb.value.set(r%256/256,g%256/256,b%256/256);
        console.log('color = ',shaderMaterial.uniforms.rgb.value); 
        dat_gui_color(sphere,gui);

        //visualisation des normales
        var vertex_helper = new VertexNormalsHelper(sphere, 1, 0x00ff00, 0.5);
        scene.add(vertex_helper);

}

function animate() { //a compléter   
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);   
                   
}

function import_obj(name,hauteur,scene,posX,posZ,coeff_rot){
        var loader = new THREE.OBJLoader();
        loader.load(
                name,
                function(object){
                        obj=object.children[0];
                        scene.add(obj);

                        var box = new THREE.BoxHelper( obj, 0xffff00 ); //l'import peut créer un groupe de mash au lieu de un seul mesh donc boxhelper permet d'englober le groupe
                        box.geometry.computeBoundingBox();
                        var h = box.geometry.boundingBox.max.y - box.geometry.boundingBox.min.y 
                        var coeff = 1/h;
                        obj.scale.x = hauteur * coeff;
                        obj.scale.y = hauteur * coeff;
                        obj.scale.z = hauteur * coeff;

                        var box2 = new THREE.BoxHelper( obj, 0xffff00 );
                        box2.geometry.computeBoundingBox();
                        obj.position.set(posX,-box2.geometry.boundingBox.min.y,posZ);

                        obj.rotation.y = coeff_rot * Math.PI / 16;
                       
                },
                function(xhr){console.log((xhr.loaded/xhr.total*100)+'% loaded');},
                function(error){console.log('An error happened');},
        )
}


function import_mtl(name_mtl,name_obj,hauteur,scene,posX,posZ,coeff_rot){
        var mtlloader = new THREE.MTLLoader();
        mtlloader.load(
                name_mtl,
                function(materials){
                        //materials.preload();
                        var objLoader = new THREE.OBJLoader();
                        objLoader.setMaterials(materials)
                        objLoader.load(
                                name_obj,
                                function(object){
                                        scene.add(object);
                                        object.position.set(0,0,0);
                                        var box = new THREE.BoxHelper( object, 0xffff00 ); //l'import peut créer un groupe de mash au lieu de un seul mesh donc boxhelper permet d'englober le groupe
                                        box.geometry.computeBoundingBox();
                                        var h = box.geometry.boundingBox.max.y - box.geometry.boundingBox.min.y 
                                        var coeff = 1/h;
                                        object.scale.x = hauteur * coeff;
                                        object.scale.y = hauteur * coeff;
                                        object.scale.z = hauteur * coeff;

                                        var box2 = new THREE.BoxHelper( object, 0xffff00 );
                                        box2.geometry.computeBoundingBox();
                                        object.position.set(posX,-box2.geometry.boundingBox.min.y,posZ);

                                        object.rotation.y = coeff_rot * Math.PI / 16;
                                },
                                function(xhr){console.log((xhr.loaded/xhr.total*100)+'% loaded');},
                                function(error){console.log('An error happened obj');},
                        );
                },
                function(xhr){console.log((xhr.loaded/xhr.total*100)+'% loaded');},
                function(error){console.log('An error happened mtl');},
        )
}



function import_obj_smooth(name,hauteur,scene,posX,posZ,coeff_rot){
        var loader = new THREE.OBJLoader();
        loader.load(
                name,
                function(object){
                        obj=object.children[0];

                        var smooth = new THREE.Geometry().fromBufferGeometry(obj.geometry.clone());
                        smooth.mergeVertices();
                        var obj_smooth = new THREE.Mesh(smooth,new THREE.MeshPhongMaterial({ color: "#b9b0ad" }));
                        obj_smooth.geometry.computeVertexNormals();
                        scene.add(obj_smooth);

                        var box = new THREE.BoxHelper( obj_smooth, 0xffff00 ); //l'import peut créer un groupe de mash au lieu de un seul mesh donc boxhelper permet d'englober le groupe
                        box.geometry.computeBoundingBox();
                        var h = box.geometry.boundingBox.max.y - box.geometry.boundingBox.min.y 
                        var coeff = 1/h;
                        obj_smooth.scale.x = hauteur * coeff;
                        obj_smooth.scale.y = hauteur * coeff;
                        obj_smooth.scale.z = hauteur * coeff;

                        var box2 = new THREE.BoxHelper( obj_smooth, 0xffff00 );
                        box2.geometry.computeBoundingBox();
                        obj_smooth.position.set(posX,-box2.geometry.boundingBox.min.y,posZ);

                        obj_smooth.rotation.y = coeff_rot * Math.PI / 16;
                       
                },
                function(xhr){console.log((xhr.loaded/xhr.total*100)+'% loaded');},
                function(error){console.log('An error happened');},
        )
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
        var val_x = light_pos.add( parameters, 'lightx' ).min(-20).max(20).step(1).listen();
        var val_y = light_pos.add( parameters, 'lighty' ).min(-20).max(20).step(1).listen();
        var val_z = light_pos.add( parameters, 'lightz' ).min(-20).max(20).step(1).listen();
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

function dat_gui_color(element,gui){
        //valeurs de bases du panneau de contôle
        var parameters = {
                color: "#44abd7"
        };

        var shader_fold = gui.addFolder('Shader');
        //Définition des 3 valeurs sur lequelles ont peut influer 
        shader_fold.addColor( parameters, 'color' ).onChange(
                function() { 
                        var r = parseInt(parameters.color.substring(1,3),16);
                        var g = parseInt(parameters.color.substring(3,5),16);
                        var b = parseInt(parameters.color.substring(5,7),16);
                        element.material.uniforms.rgb.value.set(r%256/256,g%256/256,b%256/256);
                }
        );

        shader_fold.open();
}

init();
animate();