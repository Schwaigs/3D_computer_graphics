# Rapport TP2 : Maillages

**1) Utiliser la classe OBJLoader (bibliothèque OBJLoader.js fournie) pour créer un Mesh dont la géométrie est décrite dans un fichier OBJ et l'ajouter à la scène.**

On essaie dans un premier temps d'ajouter un lapin à la scène. On crée une variable lapin ainsi qu'une instance de *OBJLoader*.

    var lapin;
    var loader = new THREE.OBJLoader();

Puis, on appelle la fonction load sur notre *OBJLoader*. On lui donne notre fichier .obj à importer. Ensuite, on associe l'objet à notre variable lapin et on effectue les différentes transformations voulues (position, changement de taille, rotation...).

    loader.load(
        'bunny.obj',
        function(object){
            lapin=object;
            lapin.position.set(0,-0.22,0);
            scene.add(lapin);
        },
        function(xhr){console.log((xhr.loaded/xhr.total*100)+'% loaded');},
        function(error){console.log('An error happened');},
    )

&nbsp;

**2) Vérifier que les données sont bien importées. Vous serez peut-être confrontés à un problème de sécurité.**

L'erreur de sécurité empêche effectivement d'importer correctement le lapin en obj. Pour régler le problème, on installe l'extension Live Server proposée par VSCode afin de faire tourner un serveur local.
![Live Server](./img/live_server.png)

&nbsp;

**3) Essayer d'importer différents objets. Que constate-t-on ?**

De même que pour le lapin dans le 1) on ajoute maintenant une vache à la scène avec le code ci-après.

    var cow;
    var loader2 = new THREE.OBJLoader();
    loader2.load(
        'cow.obj',
        function(object){
            cow=object;
            cow.position.set(-2,1.3,3);
            scene.add(cow);
        },
        function(xhr){console.log((xhr.loaded/xhr.total*100)+'% loaded');},
        function(error){console.log('An error happened');},
    )

On remarque que nos objets sont totalement disproportionnés, le lapin est à peine visible tant il est petit, tandis que la vache est énorme, elle couvre donc la quasi-totalité de notre scène de forêt.

![Vache](./img/vache_et_lapin_2.png)
![Lapin](./img/vache_et_lapin_3.png)

Pour palier à ce problème de proportion, on applique des transformations sur la taille de nos objets à l'aide de l'attribut *scale* dans function(object) du *load*.

Pour le lapin il s'agit d'augmenter sa taille :

    lapin.scale.x = 5;
    lapin.scale.y = 5;
    lapin.scale.z = 5;

Tandis que pour la vache il s'agit de la rendre plus petite :

    cow.scale.x = 0.35;
    cow.scale.y = 0.35;
    cow.scale.z = 0.35;

![Vache et Lapin rezise](./img/vache_et_lapin_resize.png)

&nbsp;

**4) Maintenant que tous les objets ont une hauteur standard, calculer la translation verticale pour que l'objet soit positionné à la hauteur du sol. Appliquer la translation verticale.**

En premier lieu, on calcule les dimensions de notre objet à l'aide d'une boîte englobante *BoxHelper*. Ainsi nous aurons accès aux coordonnées des minimums et maximums pour chaque axe de notre vache.

    var box = new THREE.BoxHelper( cow, 0xffff00 );         
    box.geometry.computeBoundingBox()
    cow.add(box);

![Vache Boxhelper](./img/vache_BoxHelper.png)

Puisque l'on souhaite placer notre vache au niveau du sol, il faut que notre translation amène la coordonnée minimum de celle-ci sur l'axe y à 0. On modifie donc la position de notre objet comme suit :

    cow.position.set(-2,-box.geometry.boundingBox.min.y,3);

On fait de même pour notre lapin ce qui nous donne le résultat ci-dessous.
![Vache lapin niveau sol](./img/vache_et_lapin_niveau_sol.png)

J'ai personnellement eu un peu de mal avec cette partie car le haut du sol que j'avais mis dans ma scène ne correspondait pas exactement au 0 sur l'axe z. Il a donc fallu que je modifie en premier lieu mon sol, c'est pourquoi je me suis servie d'un *AxesHelper* que l'on peut voir sur la capture d'écran précédente.

&nbsp;

**5) Refactorer maintenant le code pour en faire une fonction qui prenne en paramètre le nom du fichier et la hauteur cible pour importer autant d'objets que voulus et spécifier la taille cible.**

On crée une nouvelle fonction appelée import_obj, celle-ci prends plusieurs paramètres :

- name : le nom du fichier obj à importer
- hauteur : un coefficient de taille que l'on veut donner à notre objet
- scene : la scène à laquelle ajouter l'objet
- posX : la coordonnée en x pour savoir où le placer dans la scène
- posY : la coordonnée en y pour savoir où le placer dans la scène
- posZ : la coordonnée en z pour savoir où le placer dans la scène
- coeff_rot : nombre de rotations de pi/16 (soit 11,25°)

&nbsp;

    function import_obj(name,hauteur,scene,posX,posZ,coeff_rot){
        var loader = new THREE.OBJLoader();
    }

On écrit ensuite la fonction *load* comme présentée dans le 1).

    loader.load(
        name,
        function(object){
             ...
        },
        function(xhr){console.log((xhr.loaded/xhr.total*100)+'% loaded');},
        function(error){console.log('An error happened');},
    )

Dans la fonction(object) on commence par ajouter l'objet à la scène et on calcule les dimensions de notre objet avec sa *BoxHelper*

    obj=object;
    scene.add(obj);
    var box = new THREE.BoxHelper( obj, 0xffff00 );
    box.geometry.computeBoundingBox();

On calcule ensuite la hauteur h de notre objet ce qui nous permet de faire une mise à l'échelle de celui-ci. Ce coeff est ensuite multiplié par la hauteur souhaitée passée en paramètre afin de redéfinir la taille de l'objet.

    var h = box.geometry.boundingBox.max.y - box.geometry.boundingBox.min.y 
    var coeff = 1/h;
    obj.scale.x = hauteur * coeff;
    obj.scale.y = hauteur * coeff;
    obj.scale.z = hauteur * coeff;

Suite à la transformation qui a été effectuée sur la taille de l'objet, la *BoxHelper* créée précédemment ne correspond plus aux bonnes dimensions. On en fait alors une nouvelle pour la translation de mise au niveau du sol.

    var box2 = new THREE.BoxHelper( obj, 0xffff00 );
    box2.geometry.computeBoundingBox();
    obj.position.set(posX,-box2.geometry.boundingBox.min.y,posZ);

Enfin on applique la rotation passée en paramètre.

    obj.rotation.y = coeff_rot * Math.PI / 16;

Suite à la création de notre fonction import_obj() les ajouts d'objets se font à présent de la manière suivante :

    import_obj('bunny.obj',0.8,scene,2,2,-5);
    import_obj('cow.obj',2,scene,-2,3,0);

&nbsp;

**6) Agrémenter la scène de décors du TP1 avec des objets divers issus de fichiers .obj.**

J'ai cherché de nombreux modèles à importer sur Turbosquid, SketchFab et Poly mais il était parfois difficile de trouver des modèles 3D disponibles en .obj ce qui était un peu décevant. 

Voici quelques exemples de modèles que je n'ai malheureusement pas pu trouver dans le format souhaité :

![Retsuko](./img/mlt_retsuko.png)
![BMO](./img/mlt_BMO.png)
![Bill cipher](./img/mlt_bill_cipher.png)

J'ai toutefois trouvé des modèles en obj en tapant directement "OBJ" dans la barre de recherche des sites pour trouver ceux qui l'avaient mis dans le titre car il n'existait pas de filtre de recherches par format. Ma scène ressemblait alors à ça : 

![Plusieurs obj](./img/plusieurs_obj.png)
![Plusieurs obj 2](./img/plusieurs_obj_2.png)

&nbsp;

**7) On constate que les objets fournis avec le TP ne sont pas lisses. Trouver une méthode pour lisser les objets.**

Cette partie a été pour moi la plus difficile. J'ai en premier lieu, tenter de passer par la librairie three.js *SubdivisionModifier.js* qui se trouve [ici](https://github.com/mrdoob/three.js/blob/dev/examples/js/modifiers/SubdivisionModifier.js). N'arrivant pas au résultat voulu j'ai donc demandé de l'aide à mes camarades et après un peu de recherche j'en suis arrivée à la méthode décrite ci-après.

Pour lisser les objets on rajoute dans le load de notre fonction import_obj() un bloc de code entre les deux lignes suivante :

    obj=object;
    scene.add(obj); 

On récupère les informations liées à la géométrie de notre obj et on fusionne ses différents sommets avec la fonction *mergeVertices()*.

    var smooth = new THREE.Geometry().fromBufferGeometry(obj.geometry.clone());
    smooth.mergeVertices();

A la suite de cela on crée un nouveau Mesh qui se sert de notre *Geometry* comme base plutôt que d'un fichier .obj. Enfin on calcule les nouvelles normales de notre objet afin de rendre le lissage effectif.

    var obj_smooth = new THREE.Mesh(
        smooth,
        new THREE.MeshPhongMaterial({ color: "#b9b0ad" })
    );
    obj_smooth.geometry.computeVertexNormals();

La suite des instructions du load qui étaient faites sur obj utilisent maintenant obj_smooth. Le résultat obtenu sur la vache est le suivant :

![Vache lisse](./img/vache_smooth.png)


&nbsp;

**8) Sur le même principe que pour l'OBJLoader, utiliser la classe MTLLoader (bibliothèque MTLLoader.js fournie) pour importer un mesh et ses textures et l'ajouter à la scène.**

On crée une nouvelle fonction appelée import_mlt sur le même principe que importe_obj, celle-ci prends plusieurs paramètres :

- name_mtl : le nom du fichier mlt à importer
- name_obj : le nom du fichier obj à importer
- hauteur : un coefficient de taille que l'on veut donner à notre objet
- scene : la scène à laquelle ajouter l'objet
- posX : la coordonnée en x pour savoir où le placer dans la scène
- posY : la coordonnée en y pour savoir où le placer dans la scène
- posZ : la coordonnée en z pour savoir où le placer dans la scène
- coeff_rot : nombre de rotations de pi/16 (soit 11,25°)

&nbsp;

    function import_mtl(name_mtl,name_obj,hauteur,scene,posX,posZ,coeff_rot){
        var mtlloader = new THREE.MTLLoader();
    }

On écrit ensuite la fonction *load* de notre mtlloader.

     mtlloader.load(
        name_mtl,
        function(materials){
                ...
        },
        function(xhr){console.log((xhr.loaded/xhr.total*100)+'% loaded');},
        function(error){console.log('An error happened mtl');},
    )

Dans la fonction(materials) on a le même code que celui de import_obj() à l'exception près que l'on ajoute l'instruction setMaterial() qui permet de lier la texture à l'objet.

    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials)
    objLoader.load(...);

Grâce à notre fonction on ajoute un sabre à notre scène avec l'instruction suivante qui nous donne le résultat ci-après.

    import_mtl('saber.mtl','saber.obj',0.4,scene,4,-1,8)

![Saber texture](./img/sabre_texture.png)

Le sabre n'était clairement pas mon premier choix en terme d'import, en effet j'ai tenté d'ajouter de nombreux objets mlt à ma scène auparavant mais sans succès car les fichiers gratuits ne fonctionnaient pas correctement. Voici par exemple quelques modèles que j'ai voulus importer provenant de Turbosquid, SketchFab et Poly : 

![Marcy](./img/mlt_marcy.png)
![Chair](./img/mlt_chair.jpg)
![Tree](./img/mlt_tree.jpg)
![Journal](./img/mlt_journal.png)
![W](./img/mlt_W.jpg)

Ne sachant pas si le problème venait des fichiers ou de ma fonction, Arthur Laurain m'as alors envoyé les fichiers de son sabre et Lucas Schmidt a testé les mêmes fichiers que moi avec sa propre fonction.