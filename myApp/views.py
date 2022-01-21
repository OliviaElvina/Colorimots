from django.shortcuts import render
import spacy, json
from django.http import JsonResponse

nlp = spacy.load("fr_core_news_md")

# Create your views here.
def home(request):
    return render(request, 'home.html')

def analyze(request):
    """
        Fonction analyze qui permettra de récupérer des éléments dans le javascript
    """

    colis = json.loads(request.body)
    text = colis['inText']
    print("A analyser :",text)

    output = nlp(text)
    rep = []
    for token in output:

        """Ici on va récupérer toutes les informations de Spacy qui nous intéressent dans un tableau afin
            de les utiliser dans notre fichier javascript pour l'affichage des informations des tokens.
            On met des conditions pour avoir des termes propres et complets en sortie.
        """

        tokNbre = token.morph.get("Number")
        tokGenre = token.morph.get("Gender")
        tempVForm = token.morph.get("VerbForm")
        tempVMode = token.morph.get("Mood")
        tokVMode = ""       #ici on n'utilise qu'une seule variable pour le mode, séparé en deux par SpaCy
        tokVTemps = token.morph.get("Tense")
        tokVPersonne = token.morph.get("Person")

        #Pour le nombre
        if tokNbre == ['Sing']:
            tokNbre = "Singulier"
        elif tokNbre == ['Plur']:
            tokNbre = "Pluriel"

        # Pour le genre
        if tokGenre == ['Fem']:
            tokGenre = "Féminin"
        elif tokGenre == ['Masc']:
            tokGenre = "Masculin"

        # Pour le mode
        if tempVMode == ['Ind']:
            tokVMode = "Indicatif"
        elif tempVMode == ['Cnd']:
            tokVMode = "Conditionnel"
        elif tempVMode == ['Sub']:
            tokVMode = "Subjonctif"
        elif tempVForm == ['Part']:
            tokVMode = "Participe"
        elif tempVForm == ['Inf']:
            tokVMode = "Infinitif"

        # Pour le temps
        if tokVTemps == ['Pres']:
            tokVTemps = "Présent"
        elif tokVTemps == ['Past']:
            tokVTemps = "Passé"
        elif tokVTemps == ['Fut']:
            tokVTemps = "Futur"
        elif tokVTemps == ['Imp']:
            tokVTemps = "Imparfait"

        # Pour la personne des verbes
        if tokNbre == "Singulier":
            if tokVPersonne == ['1']:
                tokVPersonne = "Première personne du singulier"
            if tokVPersonne == ['2']:
                tokVPersonne = "Deuxième personne du singulier"
            if tokVPersonne == ['3']:
                tokVPersonne = "Troisième personne du singulier"
        elif tokNbre == "Pluriel":
            if tokVPersonne == ['1']:
                tokVPersonne = "Première personne du pluriel"
            if tokVPersonne == ['2']:
                tokVPersonne = "Deuxième personne du pluriel"
            if tokVPersonne == ['3']:
                tokVPersonne = "Troisième personne du pluriel"

        # On met le tout dans un tableau pour l'envoyer
        rep.append((token.text, token.pos_, token.lemma_, tokNbre, tokGenre, tokVMode, tokVTemps, tokVPersonne))
    print(rep)

    #On met tout dans un fichier json
    return JsonResponse({ "reponse":rep })
