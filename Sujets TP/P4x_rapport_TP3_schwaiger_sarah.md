# Rapport n°2 P4x

## TP3

**1) Ajouter un objet simple, de préférence ayant des surfaces arrondies (sphère, tore, donut, etc), à la manière du TP1. Cet objet servira de support de travail pour la suite. Changer le matériau de l'objet pour la classe ShaderMaterial. Un matériau utilisant des shaders nécessite de fournir le code pour le vertex shader et le pixel shader.**

Pour la création du vertex shader et du pixel shader on reprend le code de l'exemple *basicshader.html*.Puis on crée notre sphère simplement en lui associant le *shaderMaterial* de notre création comme suit :

    geometry_sphere = new THREE.SphereGeometry(1,25,25);
    var sphere = new THREE.Mesh(geometry_sphere,shaderMaterial);
    sphere.position.set(4,1.5,-1);

Le résultat obtenu est le suivant :  
![basic shader](./TP3/captures_ecran/sphere_shader_material.png)  

&nbsp;

**2) Vérifier que le programme utilise bien les shaders fournis par exemple en modifiant le code du pixel shader en changeant la couleur codée en dur.**  

On redéfinit la couleur que prendra notre shader avec l'instruction suivante :

    gl_FragColor = vec4(0.5, 0.0, 0.8, 1.0);

Et on observe alors le résultat ci-dessous, qui nous prouve le fonctionnement de notre shader.
![basic shader](./TP3/captures_ecran/sphere_shader_material_change_color.png)  

&nbsp;

**3) Modifier le pixel shader pour passer une couleur en tant qu'uniform pour modifier à la volée la couleur de l'objet.**  

On ajoute l'attribut uniform à notre pixel shader, qui est un vecteur à 3 dimensions selon le modèle rgb. On remplace alors aussi le vecteur gl_FragColor et on ajoute le paramètre rgb à notre shaderMaterial comme dans l'exemple *uniform.html*.

    uniform vec3 rgb;

    gl_FragColor = vec4(rgb, 1.0);

La couleur du shader dépend alors de 3 variables r, g et b qui sont définits après l'instanciation de notre sphère.

&nbsp;

**4) Connecter la valeur de cette couleur sur une interface dat-gui. Observez les changements de couleurs en fonction de vos changements dans l'interface.**  

Dans un premier temps j'ai souhaité changer la couleur du Mesh à l'aide d'une interface spécifique aux couleurs, semblable à celle ci-après.

![color gui](./TP3/captures_ecran/color_gui.png)  

J'ai alors créé une nouvelle fonction *dat_gui_color()*. Pour cela je me suis inspirée de ce que j'ai trouvé sur [ce forum](https://discourse.threejs.org/t/select-objects-with-mouse-and-change-color-with-dat-gui-solved/4804/4). Je souhaitais récupérer pour l'initialisation, la couleur de mon mesh à l'aide de l'instruction suivante :

    color: element.material.uniforms.rgb.value,

Puis il s'agissait de modifier la couleur du mesh à l'aide d'un *setStyle()* prenant en paramètre une valeur en hexadécimal.

    element.marerial.color.setStyle(value);

Le résultat ne compilant absolument pas, je me suis alors tournée vers la solution de gérer les valeurs de r, g et b indépendamment. Ces dernières sont stockées dans notre vecteur uniform sous forme de flotant entre 0 et 1. On les multiplie alors par 255 pour obtenir leur valeur sur 8 bits, puis on divise par 1 afin d'avoir des valeurs entières.

    color_r : ((element.material.uniforms.rgb.value.x)*255)/1,
    color_g : ((element.material.uniforms.rgb.value.y)*255)/1,
    color_b : ((element.material.uniforms.rgb.value.z)*255)/1,

Puis, j'ai suivis simplement le même modèle que le changement de position de mon soleil. Cela m'a alors permis d'obtenir le résultat suivant :

![gui rbg](./TP3/captures_ecran/sphere_shader_material_change_color_gui.png)

Cependant, en faisant varier les couleurs je me rends compte que celles-ci réagissent assez bizarrement. Le résultat obtenu ne correspondant pas toujours à celui attendu. Le plus gros bug étant la disparition d'une couleur quand on la met à 255.

![gui bug rbg](./TP3/captures_ecran/bug_sphere_shader_material_change_color_gui.png)

Le problème vient en fait du %255/255 que l'on applique à nos couleurs pour les reconvertir sous forme de flottant entre 0 et 1. En effet, 255%255 équivaut à un 0. On remplace alors dans le code tous les 255 par 256 pour résoudre le souci.

Enfin, pour régler mon souci de correspondance de couleurs, j'ai demandé de l'aide à Elio afin de mettre en place mon idée de base sur l'interface spécifique aux couleurs.

Ne sachant toujours pas comment récupérer la couleur de mon Mesh sous forme hexadécimale, j'ai simplement entré un dur le code couleur correspondant à celui que je lui assigne lors de sa création dans la fonction init().

    var parameters = {
        color: "#44abd7"
    };

Puis lors du changement de couleur je passe à présent par des substring de la valeur héxadécimale, que je stocke ensuite en flottant comme expliqué auparavant.

    var b = parseInt(parameters.color.substring(5,7),16);
    element.material.uniforms.rgb.value.set(r%256/256,g%256/256,b%256/256);

Ce qui me donne ainsi, le résultat ci-dessous :
![gui hexa](./TP3/captures_ecran/resolve_sphere_shader_material_change_color_gui.png)

&nbsp;

**5) Utiliser la classe VertexNormalsHelper pour visualiser les normales de votre objet.**

Dans un premier temps j'importe la librairie *VertexNormalsHelper* de three.js qui se trouve [ici](https://github.com/mrdoob/three.js/blob/master/examples/jsm/helpers/VertexNormalsHelper.js). Afin de pouvoir supprimer les imports d'autres librairies, je place un "THREE." devant chaque objet.

Ensuite j'instancie mon VertexNormalsHelper en lui donnant en paramètre le Mesh concerné, la longueur des normales, leur couleur et enfin leur épaisseur.

    var vertex_helper = new VertexNormalsHelper(sphere, 1, 0x00ff00, 0.5);
    scene.add(vertex_helper);

Je réduis ensuite le nombre de segment de ma sphère quand je la créer afin d'obtenir un résultat plus visible.
![vertex](./TP3/captures_ecran/sphere_shader_VertexNormalsHelper.png)

&nbsp;

**6) Transmettre les normales du mesh depuis le vertex shader au pixel shader. Vous devrez utiliser la fonctionnalité varying de GLSL.**

&nbsp;

**7) Passer la position DANS LE REPERE DE LA SCENE de la surface de l'objet du vertex shader au pixel shader. Faire attention aux repères utilisés.**

&nbsp;

**8) Passer la position DANS LE REPERE DE LA SCENE de la surface de l'objet du vertex shader au pixel shader. Faire attention aux repères utilisés.**

&nbsp;

**9) Avec la couleur, la normale, la position de la surface et la position de lumière, il y a maintenant tout ce qu'il faut pour calculer un éclairage de Lambert (dot product/cosinus).**

&nbsp;

**10) Varier la position de votre lumière et observez les changements.**

&nbsp;

**11) Ajouter un jeu de test fiable prouvant que le calcul d'éclairage est juste.**

&nbsp;

**12) On peut éventuellement prendre en compte aussi la couleur de la lumière en multipliant le résultat du calcul d'éclairage par cette couleur.**

&nbsp;

**13) Utiliser les valeurs calculées de l'éclairage de Lambert comme critère de seuillage pour obtenir des aplats de couleurs grâce au pixel shader.**

&nbsp;

**14) A l'aide de l'annexe 1, essayez d'implémenter l'algorithme d'éclairage de Phong avec les shaders.**

&nbsp;

**15) S'inspirer de l'exemple fourni avec lenna pour comprendre comment accéder à une texture depuis un shader.**

&nbsp;

**16) De la même manière que pour les normales, les meshs disposent potentiellement d'un attribut d'UV. Vérifier que votre mesh dispose d'UV (attributes, varying, passage au pixel shader). S'inspirer des questions sur les normales. Utiliser les UVs pour échantillonner une texture.**

&nbsp;

**17) Essayer de remplacer la source de lumière ponctuelle par une source directionnelle. Qu'est-ce que cela change dans vos calculs d'éclairage ?**

&nbsp;

**18) Essayer de gérer une lumière directionnelle et une seconde lumière ponctuelle.**

&nbsp;

**19) Trouver un moyen d'organiser le code GLSL dans des fichiers séparés, avec dans l'idéal, un fichier par programme GLSL.**