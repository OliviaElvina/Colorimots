// Vérification du chargement du script par un affichage console
console.log('Le script est bien chargé');

// On initialise les variables dont on aura besoin dans la fonction sendText()
var tableauToken = [] ;
var tokenPrecedent = "";

// Utilisation de jQuery pour cacher/afficher les images
$("#divImg1").hide();
$("#divImg2").hide();


// fonction qui permet de lancer l'analyse du texte lorsque l'on clique sur l'un des trois boutons
async function sendText(cat) {
    // ON RÉCUPÈRE LES VARIABLES À ENVOYER AU SERVEUR
    var inText = document.getElementById('exampleTextarea').value;

    // ON EMBALLE TOUT ÇA DANS UN JSON
    var colis = {
        inText: inText
    }
    console.log('Envoi colis:',colis);

    // PARAMÈTRES DE LA REQUÊTE
    const requete = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(colis)
    };

    // ENVOI ET RÉCUPÉRATION DE LA RÉPONSE
    const response = await fetch('/analyze/', requete)
    const data = await response.json();
    console.log(data);

    //on crée une variable associée à la div de sortie du texte
    var outText = document.getElementById('outText');
    outText.innerHTML = ""; // vider la div si elle contenait déjà qqc
    var textSortie = "";

    //Traite le cas où on clique sur le bouton "verbe"
    if (cat=='verbe'){
        tableauToken = [];
        tokenPrecedent = data.reponse[0];
        //quand on clique sur le bouton verbe, il faut afficher l'image associée et cacher l'autre
        $("#divImg1").hide();
        $("#divImg2").show();
        for (token in data.reponse) {       //on parcourt tous les tokens de la phrase
            var tokenTuple = data.reponse[token];
            //On ajoute toutes les informations récupérés dans Views dans le tableau "tableauToken", on s'en servira pour l'affichage des informations
            tableauToken.push([tokenTuple[0], tokenTuple[1], tokenTuple[2], tokenTuple[3], tokenTuple[4], tokenTuple[5], tokenTuple[6], tokenTuple[7]]);
            //si le token est un verbe ou un auxiliaire, alors on regarde quel est son nombre ou son mode pour le coloriser
            if (tokenTuple[1]=="VERB" || tokenTuple[1]=="AUX"){
              console.log(tokenTuple[0], tokenTuple[1], tokenTuple[2], tokenTuple[3], tokenTuple[4], tokenTuple[5], tokenTuple[6], tokenTuple[7]);
              if (tokenTuple[3]=="Singulier"){
                textSortie += ' ' + '<span style="color:red" class="clique" onclick="explain('+token+')">' + tokenTuple[0] + '</span>';
              }else if (tokenTuple[3]=="Pluriel"){
                textSortie += ' ' + '<span style="color:DarkRed" class="clique" onclick="explain('+token+')">' + tokenTuple[0] + '</span>';
              }else if (tokenTuple[5]=="Infinitif"){
                textSortie += ' ' + '<span style="color:orange" class="clique" onclick="explain('+token+')">' + tokenTuple[0] + '</span>';
              }else if (tokenTuple[5]=="Participe"){
                textSortie += ' ' + '<span style="color:DeepPink" class="clique" onclick="explain('+token+')">' + tokenTuple[0] + '</span>';
              }else{
                textSortie += ' ' + '<span style="color:SaddleBrown" class="clique" onclick="explain('+token+')">' + tokenTuple[0] + '</span>';
              }
            }else{
              // On établit une liste de règles pour gérer les espaces
              if (tokenTuple[0]=="." || tokenTuple[0]=="," || tokenTuple[0]==")" || tokenTuple[0][0]=="-" || tokenPrecedent[tokenPrecedent.length-1] == "'" || tokenPrecedent=="("){
                textSortie += tokenTuple[0];
              }else{
                textSortie += ' ' + tokenTuple[0];
              }
            }
            tokenPrecedent = tokenTuple[0];
        }
        console.log(tableauToken);


    //Traite le cas où on clique sur le bouton "nom", même principe que pour les verbes
    }else if (cat=='nom'){
        tableauToken = [];
        tokenPrecedent = data.reponse[0];
        $("#divImg1").hide();
        $("#divImg2").hide();
        for (token in data.reponse) {
            var tokenTuple = data.reponse[token];
            tableauToken.push([tokenTuple[0], tokenTuple[1], tokenTuple[2], tokenTuple[3], tokenTuple[4], tokenTuple[5], tokenTuple[6], tokenTuple[7]]);
            if (tokenTuple[1]=="NOUN"){
              console.log(tokenTuple[0], tokenTuple[1], tokenTuple[2], tokenTuple[3], tokenTuple[4], tokenTuple[5], tokenTuple[6], tokenTuple[7]);
              if (tokenTuple[3]=="Singulier" && tokenTuple[4]=="Masculin"){
                textSortie += ' ' + '<span style="color:DodgerBlue" class="clique" onclick="explain('+token+')">' + tokenTuple[0] + '</span>';
              }else if (tokenTuple[3]=="Singulier" && tokenTuple[4]=="Féminin"){
                textSortie += ' ' + '<span style="color:MediumTurquoise" class="clique" onclick="explain('+token+')">' + tokenTuple[0] + '</span>';
              }else if (tokenTuple[3]=="Pluriel" && tokenTuple[4]=="Masculin"){
                textSortie += ' ' + '<span style="color:#000095" class="clique" onclick="explain('+token+')">' + tokenTuple[0] + '</span>';
              }else if (tokenTuple[3]=="Pluriel" && tokenTuple[4]=="Féminin"){
                textSortie += ' ' + '<span style="color:Teal" class="clique" onclick="explain('+token+')">' + tokenTuple[0] + '</span>';
              }else{
                textSortie += ' ' + '<span style="color:DarkSlateBlue" class="clique" onclick="explain('+token+')">' + tokenTuple[0] + '</span>';
              }
            }else{
              if (tokenTuple[0]=="." || tokenTuple[0]=="," || tokenTuple[0]==")" || tokenTuple[0][0]=="-" || tokenPrecedent[tokenPrecedent.length-1] == "'" || tokenPrecedent=="("){
                textSortie += tokenTuple[0];
              }else{
                textSortie += ' ' + tokenTuple[0];
              }
            }
            tokenPrecedent = tokenTuple[0];
        }

    //Traite le cas où on clique sur le bouton "adjectif"
    }else{
        tableauToken = [];
        tokenPrecedent = data.reponse[0];
        $("#divImg1").show();
        $("#divImg2").hide();
        for (token in data.reponse) {
            var tokenTuple = data.reponse[token];
            tableauToken.push([tokenTuple[0], tokenTuple[1], tokenTuple[2], tokenTuple[3], tokenTuple[4], tokenTuple[5], tokenTuple[6], tokenTuple[7]]);
            if (tokenTuple[1]=="ADJ"){
              console.log(tokenTuple[0], tokenTuple[1], tokenTuple[2], tokenTuple[3], tokenTuple[4], tokenTuple[5], tokenTuple[6], tokenTuple[7]);
              if (tokenTuple[3]=="Singulier" && tokenTuple[4]=="Masculin"){
                textSortie += ' ' + '<span style="color:Lime" class="clique" onclick="explain('+token+')">' + tokenTuple[0] + '</span>';
              }else if (tokenTuple[3]=="Singulier" && tokenTuple[4]=="Féminin"){
                textSortie += ' ' + '<span style="color:SpringGreen" class="clique" onclick="explain('+token+')">' + tokenTuple[0] + '</span>';
              }else if (tokenTuple[3]=="Pluriel" && tokenTuple[4]=="Masculin"){
                textSortie += ' ' + '<span style="color:DarkGreen" class="clique" onclick="explain('+token+')">' + tokenTuple[0] + '</span>';
              }else if (tokenTuple[3]=="Pluriel" && tokenTuple[4]=="Féminin"){
                textSortie += ' ' + '<span style="color:MediumSeaGreen" class="clique" onclick="explain('+token+')">' + tokenTuple[0] + '</span>';
              }else{
                textSortie += ' ' + '<span style="color:OliveDrab" class="clique" onclick="explain('+token+')">' + tokenTuple[0] + '</span>';
              }
            }else{
              if (tokenTuple[0]=="." || tokenTuple[0]=="," || tokenTuple[0]==")" || tokenTuple[0][0]=="-" || tokenPrecedent[tokenPrecedent.length-1] == "'" || tokenPrecedent=="("){
                textSortie += tokenTuple[0];
              }else{
                textSortie += ' ' + tokenTuple[0];
              }
            }
            tokenPrecedent = tokenTuple[0];
        }
    }

    //on imprime le texte colorisé dans la div de sortie de texte
    console.log(textSortie);
    outText.innerHTML = textSortie;
}


// Fonction permettant d'afficher les informations des mots
async function explain(token) {
  //on crée une variable associée à la div de sortie des informations
  var outInfo = document.getElementById('outInfos');
  outInfo.innerHTML = "";

  //on affiche les informations voulues selon la catégorie du mot
  if (tableauToken[token][1] == "VERB"){
    outInfo.innerHTML = "Mot : "+tableauToken[token][0]+"<br>Nature : Verbe<br>Infinitif : "+tableauToken[token][2]+"<br>Personne : "+tableauToken[token][7]+"<br>Temps : "+tableauToken[token][6]+"<br>Mode : "+tableauToken[token][5]+"<br>";
  }else if (tableauToken[token][1] == "AUX"){
    outInfo.innerHTML = "Mot : "+tableauToken[token][0]+"<br>Nature : Verbe Auxiliaire<br>Infinitif : "+tableauToken[token][2]+"<br>Personne : "+tableauToken[token][7]+"<br>Temps : "+tableauToken[token][6]+"<br>Mode : "+tableauToken[token][5]+"<br>";
  }else if (tableauToken[token][1] == "NOUN"){
    outInfo.innerHTML = "Mot : "+tableauToken[token][0]+"<br>Nature : Nom<br>Forme du dictionnaire : "+tableauToken[token][2]+"<br>Genre : "+tableauToken[token][4]+"<br>Nombre : "+tableauToken[token][3]+"<br>";
  }else if (tableauToken[token][1] == "ADJ"){
    outInfo.innerHTML = "Mot : "+tableauToken[token][0]+"<br>Nature : Adjectif<br>Forme du dictionnaire : "+tableauToken[token][2]+"<br>Genre : "+tableauToken[token][4]+"<br>Nombre : "+tableauToken[token][3]+"<br>";
  }


}
