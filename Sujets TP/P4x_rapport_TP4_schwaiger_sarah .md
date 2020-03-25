# Rapport n°3 P4x

## TP4

**1) Démarche**

- Je définis un objectif concret : "J'ai décidé de faire un moteur de physique (thème 2) simulant un chamboule-tout qui calculerait aussi le score du jour en comptant le nombre d'objet à terre à l'aide des colisions".

- Je me pose des questions : Quelles sont les étapes intermédiaires que je peux réaliser à partir de ce que je connais ? quels sont les sujets que je vais devoir étudier ?
J'esquisse quelques pistes d'étapes intermédiaires et de prolongements possibles :

    - Lancer la balle en ligne droite à vitesse constante

    - Regarder si la balle touche un objet.

    - Calculer la direction dans laquelle vont partir les objet en fonction de l'angle de collision.

    - Calculer la force du lancer et son impact sur l'objet?

    - Ajouter la gravité

    - Regarder si cet objet en fait tomber ensuite d'autre (en les poussant ou s'il était placé en dessous).

    - Compter le nombre d'objets à terre pour avoir un score et l'afficher le score dans la scene.

    - Comment lancer une balle ? Permettre plusieurs lancers ? Modifier l'angle et la force de celui ci ?

    - Ajouter la rotation des objets frappés



## développement
voir fichier objToMesh : besoin de la position pour placer les objet et gerer correctement collisons 

lancer la balle : utilisation du pointeur de souris, voir avec orbit control vu que y a pas cursor comme dans le whitestormjs
test de PointerLockControls : suit la camera pas un objet
test de TransformControls : difficulté à implementer  V à dit qu'il était mal fait
raycaster : recommender par V pour la lancer methode setFromCamera


utilisation des box Helper pour les collisions : commencer avec cibles sous forme de cube (pavés) pour que la boxhelper matche la forme comme une hit box (voir boundingbox)
pas la peine compliqe la vie raycaster : recommender par V pour collision méthode intersectObjects 