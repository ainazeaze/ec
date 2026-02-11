import React, { useState, useEffect } from "react";

// localStorage utilities
const STORAGE_KEYS = {
  QUIZ_HISTORY: "quizCivique_history",
  QUESTION_STATS: "quizCivique_questionStats",
  BOOKMARKS: "quizCivique_bookmarks",
};

const getStorageItem = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("localStorage error:", e);
  }
};

// Generate a simple hash for a question (used for tracking)
const getQuestionHash = (question) => {
  const str = question.q + question.r;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(36);
};

const allQuestions = [
  // PRINCIPES ET VALEURS DE LA RÉPUBLIQUE
  {
    q: 'Complétez les paroles de la Marseillaise "Allons enfants de la patrie..."',
    r: "Le jour de gloire est arrivé",
    theme: "Principes et valeurs",
  },
  {
    q: "Dans le cadre d'un entretien d'embauche, que peut-on demander au candidat ?",
    r: "Ses compétences professionnelles",
    theme: "Principes et valeurs",
  },
  {
    q: "Déclarer ses revenus aux services fiscaux est :",
    r: "Obligatoire",
    theme: "Principes et valeurs",
  },
  {
    q: "En France, les impôts permettent de financer les dépenses publiques. Quelle proposition est correcte ?",
    r: "Toute personne résidant en France doit payer des impôts selon ses revenus",
    theme: "Principes et valeurs",
  },
  {
    q: "La liberté d'association est :",
    r: "Un droit fondamental garanti par la loi",
    theme: "Principes et valeurs",
  },
  {
    q: "La liberté d'expression sur les réseaux sociaux en France est :",
    r: "Encadrée par la loi",
    theme: "Principes et valeurs",
  },
  {
    q: "Lequel de ces prénoms évoque un symbole de la République ?",
    r: "Marianne",
    theme: "Principes et valeurs",
  },
  {
    q: "Lequel de ces symboles représente la République française ?",
    r: "Marianne",
    theme: "Principes et valeurs",
  },
  {
    q: "Où peut-on voir la devise de la République ?",
    r: "Sur les bâtiments publics",
    theme: "Principes et valeurs",
  },
  {
    q: "Lesquels sont des symboles officiels de la République française ?",
    r: "Le drapeau tricolore, la Marseillaise, Marianne, la devise",
    theme: "Principes et valeurs",
  },
  {
    q: "Peut-on brûler publiquement un drapeau français ?",
    r: "Non, c'est une infraction pénale",
    theme: "Principes et valeurs",
  },
  {
    q: "Quand la sécurité sociale a-t-elle été établie en France ?",
    r: "1945",
    theme: "Principes et valeurs",
  },
  {
    q: "Que commémore la fête nationale ?",
    r: "La prise de la Bastille (14 juillet 1789)",
    theme: "Principes et valeurs",
  },
  {
    q: "Que porte Marianne sur la tête ?",
    r: "Un bonnet phrygien",
    theme: "Principes et valeurs",
  },
  {
    q: 'Que signifie le mot "fraternité" dans la devise française ?',
    r: "La solidarité entre les citoyens",
    theme: "Principes et valeurs",
  },
  {
    q: "Quel symbole de la République peut-on voir sur les maillots de l'équipe de France ?",
    r: "Le coq",
    theme: "Principes et valeurs",
  },
  {
    q: "Quelle est la devise de la République française ?",
    r: "Liberté, Égalité, Fraternité",
    theme: "Principes et valeurs",
  },
  {
    q: "Qu'est-ce que la liberté d'association ?",
    r: "Le droit de créer ou rejoindre librement une association",
    theme: "Principes et valeurs",
  },
  {
    q: "Qu'est-ce qu'une liberté ?",
    r: "Le droit de faire tout ce qui ne nuit pas à autrui",
    theme: "Principes et valeurs",
  },
  {
    q: "Selon la Constitution, la France est une République...",
    r: "Indivisible, laïque, démocratique et sociale",
    theme: "Principes et valeurs",
  },
  {
    q: "Sur quel document peut-on voir Marianne ?",
    r: "Timbres, pièces de monnaie, documents officiels",
    theme: "Principes et valeurs",
  },
  {
    q: "Une des valeurs de la devise républicaine est l'Égalité. Qu'est-ce que cela signifie ?",
    r: "Tous les citoyens ont les mêmes droits devant la loi",
    theme: "Principes et valeurs",
  },
  {
    q: "Une personne peut-elle changer librement de religion en France ?",
    r: "Oui",
    theme: "Principes et valeurs",
  },
  {
    q: "Selon le principe de laïcité, que signifie la neutralité de l'État ?",
    r: "L'État ne privilégie aucune religion",
    theme: "Principes et valeurs",
  },
  {
    q: "Que peut faire un usager du service public dans une mairie ?",
    r: "Porter des signes religieux",
    theme: "Principes et valeurs",
  },
  {
    q: "En France, il est possible pour l'État de financer :",
    r: "Les établissements scolaires privés sous contrat",
    theme: "Principes et valeurs",
  },
  {
    q: "En quelle année la loi de séparation des Églises et de l'État a-t-elle été votée ?",
    r: "1905",
    theme: "Principes et valeurs",
  },
  {
    q: "Que dit la loi de 1905 ?",
    r: "La séparation des Églises et de l'État",
    theme: "Principes et valeurs",
  },
  {
    q: "Que garantit le principe de laïcité ?",
    r: "La liberté de croire ou de ne pas croire",
    theme: "Principes et valeurs",
  },
  {
    q: "Quel jour célèbre-t-on officiellement la laïcité en France ?",
    r: "Le 9 décembre",
    theme: "Principes et valeurs",
  },
  {
    q: "Quel terme désigne précisément la haine ou les préjugés contre les Juifs ?",
    r: "L'antisémitisme",
    theme: "Principes et valeurs",
  },
  {
    q: "Quel texte est considéré comme le texte fondateur de la laïcité ?",
    r: "La loi de 1905",
    theme: "Principes et valeurs",
  },
  {
    q: "Quelle institution française doit rester neutre en matière de religion ?",
    r: "L'État et les services publics",
    theme: "Principes et valeurs",
  },
  {
    q: "Qu'est-ce que la laïcité ?",
    r: "La séparation des Églises et de l'État",
    theme: "Principes et valeurs",
  },
  {
    q: "À l'école, la charte de la laïcité permet de :",
    r: "Rappeler les règles de la laïcité",
    theme: "Principes et valeurs",
  },
  {
    q: "Qui doit respecter la neutralité religieuse dans les services publics ?",
    r: "Les agents publics",
    theme: "Principes et valeurs",
  },
  {
    q: "Une personne déclare ne croire en aucun dieu. On peut dire :",
    r: "Qu'elle est athée",
    theme: "Principes et valeurs",
  },
  {
    q: "Quel symbole religieux peut être porté dans une école publique dans le respect de la laïcité ?",
    r: "Les signes discrets",
    theme: "Principes et valeurs",
  },

  // SYSTÈME INSTITUTIONNEL ET POLITIQUE
  {
    q: "Comment est désigné le Premier ministre ?",
    r: "Nommé par le président de la République",
    theme: "Système institutionnel",
  },
  {
    q: "À qui appartient la souveraineté nationale ?",
    r: "Au peuple",
    theme: "Système institutionnel",
  },
  {
    q: "Qui est élu lors des élections municipales ?",
    r: "Les conseillers municipaux",
    theme: "Système institutionnel",
  },
  {
    q: "L'inscription sur les listes électorales est :",
    r: "Obligatoire pour voter",
    theme: "Système institutionnel",
  },
  {
    q: "Quelle condition est nécessaire pour voter aux élections présidentielles ?",
    r: "Être citoyen français, majeur et inscrit sur les listes électorales",
    theme: "Système institutionnel",
  },
  {
    q: "Quelles sont les fonctions du maire ?",
    r: "Officier d'état civil, représentant de l'État, chef de l'administration communale",
    theme: "Système institutionnel",
  },
  {
    q: "Une personne veut s'inscrire sur les listes électorales. Où peut-elle s'inscrire ?",
    r: "À la mairie de son domicile",
    theme: "Système institutionnel",
  },
  {
    q: "À quel âge peut-on devenir électeur ?",
    r: "18 ans",
    theme: "Système institutionnel",
  },
  {
    q: "En France, est-ce obligatoire de voter ?",
    r: "Non",
    theme: "Système institutionnel",
  },
  {
    q: "A-t-on le droit de ne pas respecter une loi ?",
    r: "Non",
    theme: "Système institutionnel",
  },
  {
    q: "Comment sont désignés les députés ?",
    r: "Élus au suffrage universel direct",
    theme: "Système institutionnel",
  },
  {
    q: "Qui vote les lois ?",
    r: "Le Parlement",
    theme: "Système institutionnel",
  },
  {
    q: "Quels sont les trois pouvoirs concernés par la séparation des pouvoirs ?",
    r: "Législatif, exécutif, judiciaire",
    theme: "Système institutionnel",
  },
  {
    q: "Qu'est-ce que l'État de droit ?",
    r: "Un État où tous sont soumis à la loi",
    theme: "Système institutionnel",
  },
  {
    q: "Quelle est la durée du mandat du conseil municipal et du maire ?",
    r: "6 ans",
    theme: "Système institutionnel",
  },
  {
    q: "Qui est élu lors des élections législatives ?",
    r: "Les députés",
    theme: "Système institutionnel",
  },
  {
    q: "Quelle est la durée du mandat du Président de la République ?",
    r: "5 ans",
    theme: "Système institutionnel",
  },
  {
    q: "Quelle est la durée du mandat des députés ?",
    r: "5 ans",
    theme: "Système institutionnel",
  },
  {
    q: "Quelle est la durée du mandat des sénateurs ?",
    r: "6 ans",
    theme: "Système institutionnel",
  },
  {
    q: "Qui dirige l'action du gouvernement ?",
    r: "Le Premier ministre",
    theme: "Système institutionnel",
  },
  {
    q: "En France, est-ce possible d'adhérer à un parti politique ?",
    r: "Oui",
    theme: "Système institutionnel",
  },
  {
    q: "Qui sanctionne l'auteur d'un vol ?",
    r: "La justice",
    theme: "Système institutionnel",
  },
  {
    q: "Qui gère les collèges publics ?",
    r: "Le département",
    theme: "Système institutionnel",
  },
  {
    q: "Qui gère les écoles primaires et maternelles publiques ?",
    r: "La commune",
    theme: "Système institutionnel",
  },
  {
    q: "Comment sont désignés les maires ?",
    r: "Élus par les conseillers municipaux",
    theme: "Système institutionnel",
  },
  {
    q: "Quelle collectivité territoriale est responsable des transports régionaux ?",
    r: "La région",
    theme: "Système institutionnel",
  },
  {
    q: "Qui assure l'intérim du président de la République en cas de décès ?",
    r: "Le président du Sénat",
    theme: "Système institutionnel",
  },
  {
    q: "Quel est le rôle du Conseil constitutionnel ?",
    r: "Vérifier la conformité des lois à la Constitution",
    theme: "Système institutionnel",
  },
  {
    q: "Combien y a-t-il de départements en France ?",
    r: "101",
    theme: "Système institutionnel",
  },
  {
    q: "Comment est organisé le découpage administratif de la France ?",
    r: "Communes, départements, régions",
    theme: "Système institutionnel",
  },
  {
    q: "Qui représente l'État dans un département ?",
    r: "Le préfet",
    theme: "Système institutionnel",
  },
  {
    q: "Quel est le rôle du Président de la République ?",
    r: "Chef de l'État, garant de la Constitution",
    theme: "Système institutionnel",
  },
  {
    q: "Quel est le rôle du Premier ministre ?",
    r: "Diriger l'action du gouvernement",
    theme: "Système institutionnel",
  },
  {
    q: "Quel est le rôle du Défenseur des droits ?",
    r: "Protéger les droits des citoyens face à l'administration",
    theme: "Système institutionnel",
  },
  {
    q: "En quelle année la citoyenneté européenne a-t-elle été créée ?",
    r: "1992",
    theme: "Système institutionnel",
  },
  {
    q: "Quel est le dernier État à avoir intégré l'Union Européenne en 2013 ?",
    r: "La Croatie",
    theme: "Système institutionnel",
  },
  {
    q: "Qui a composé l'hymne de l'Union européenne ?",
    r: "Beethoven",
    theme: "Système institutionnel",
  },
  {
    q: "Quand est célébrée la journée de l'Europe ?",
    r: "Le 9 mai",
    theme: "Système institutionnel",
  },
  {
    q: "Où est le siège de la Banque centrale européenne ?",
    r: "Francfort",
    theme: "Système institutionnel",
  },
  {
    q: "Où est le siège de la Commission européenne ?",
    r: "Bruxelles",
    theme: "Système institutionnel",
  },
  {
    q: "Qui siège au Parlement européen ?",
    r: "Les députés européens",
    theme: "Système institutionnel",
  },
  {
    q: "Combien d'États font partie de l'Union européenne au 1er janvier 2025 ?",
    r: "27",
    theme: "Système institutionnel",
  },
  {
    q: "En quelle année le traité de Maastricht a-t-il été signé ?",
    r: "1992",
    theme: "Système institutionnel",
  },
  {
    q: "Quel traité concerne la construction de l'Union européenne ?",
    r: "Le traité de Maastricht",
    theme: "Système institutionnel",
  },
  {
    q: "Quel État a quitté l'Union Européenne en 2020 ?",
    r: "Le Royaume-Uni",
    theme: "Système institutionnel",
  },
  {
    q: "Quelle est la devise de l'Union européenne ?",
    r: "Unie dans la diversité",
    theme: "Système institutionnel",
  },
  {
    q: "Quel est l'hymne de l'Union Européenne ?",
    r: "L'Ode à la joie",
    theme: "Système institutionnel",
  },
  {
    q: "De quoi est composé le drapeau européen ?",
    r: "12 étoiles dorées sur fond bleu",
    theme: "Système institutionnel",
  },
  {
    q: "Qui élit les députés européens ?",
    r: "Les citoyens de l'Union européenne",
    theme: "Système institutionnel",
  },
  {
    q: "Où est le siège du Parlement européen ?",
    r: "Strasbourg",
    theme: "Système institutionnel",
  },
  {
    q: "Qui peut se présenter aux élections présidentielles ?",
    r: "Tout citoyen français de plus de 18 ans ayant 500 parrainages d'élus",
    theme: "Système institutionnel",
  },
  {
    q: "Quelle condition faut-il remplir pour être candidat aux élections municipales ?",
    r: "Avoir 18 ans et être inscrit sur les listes électorales de la commune",
    theme: "Système institutionnel",
  },
  {
    q: "Parmi ces autorités, laquelle est élue ?",
    r: "Le maire",
    theme: "Système institutionnel",
  },
  {
    q: "Quelle est l'une des voies possibles pour modifier la Constitution ?",
    r: "Le référendum ou le Congrès",
    theme: "Système institutionnel",
  },
  {
    q: "Quelle condition est obligatoire pour se présenter à l'élection présidentielle ?",
    r: "Avoir au moins 500 parrainages d'élus",
    theme: "Système institutionnel",
  },
  {
    q: "Les citoyens de l'UE peuvent-ils voter aux élections locales dans un autre État de l'Union ?",
    r: "Oui, aux élections municipales et européennes",
    theme: "Système institutionnel",
  },

  // DROITS ET DEVOIRS
  {
    q: "À quoi sert le droit de grève ?",
    r: "À défendre ses intérêts professionnels",
    theme: "Droits et devoirs",
  },
  {
    q: "Au nom de quoi l'État justifie-t-il la restriction des droits ?",
    r: "L'ordre public et l'intérêt général",
    theme: "Droits et devoirs",
  },
  {
    q: "Que dit l'article 1er de la Constitution française ?",
    r: "La France est une République indivisible, laïque, démocratique et sociale",
    theme: "Droits et devoirs",
  },
  {
    q: "Que garantit la liberté de la presse ?",
    r: "Le droit d'informer et d'être informé librement",
    theme: "Droits et devoirs",
  },
  {
    q: "Que permet la liberté de circulation ?",
    r: "De se déplacer librement sur le territoire",
    theme: "Droits et devoirs",
  },
  {
    q: "Que signifie être citoyen d'un État ?",
    r: "Avoir des droits et des devoirs envers cet État",
    theme: "Droits et devoirs",
  },
  {
    q: "Que sont les droits fondamentaux ?",
    r: "Les droits essentiels garantis à tout être humain",
    theme: "Droits et devoirs",
  },
  {
    q: "Quel droit protège une personne contre une arrestation arbitraire ?",
    r: "La sûreté",
    theme: "Droits et devoirs",
  },
  {
    q: "Quel est le texte fondateur établissant les droits et devoirs de chaque citoyen ?",
    r: "La Déclaration des Droits de l'Homme et du Citoyen de 1789",
    theme: "Droits et devoirs",
  },
  {
    q: "Quelle situation est une atteinte à la dignité humaine ?",
    r: "La torture, l'esclavage",
    theme: "Droits et devoirs",
  },
  {
    q: "Qu'est-ce que la liberté d'expression ?",
    r: "Le droit de s'exprimer librement dans le respect de la loi",
    theme: "Droits et devoirs",
  },
  {
    q: "Tous les citoyens français ont-ils une religion ?",
    r: "Non",
    theme: "Droits et devoirs",
  },
  {
    q: "À quel âge est la majorité numérique en France ?",
    r: "15 ans",
    theme: "Droits et devoirs",
  },
  {
    q: "En France, la conduite sans permis d'une moto est :",
    r: "Interdite",
    theme: "Droits et devoirs",
  },
  {
    q: "En quoi consiste le devoir de solidarité ?",
    r: "Contribuer à l'entraide et au bien commun",
    theme: "Droits et devoirs",
  },
  {
    q: "Est-ce légal d'être marié à plusieurs personnes en même temps ?",
    r: "Non",
    theme: "Droits et devoirs",
  },
  {
    q: "Est-ce obligatoire de déclarer ses impôts chaque année en France ?",
    r: "Oui",
    theme: "Droits et devoirs",
  },
  {
    q: "Est-il obligatoire de porter secours à une personne en danger ?",
    r: "Oui",
    theme: "Droits et devoirs",
  },
  {
    q: "Être juré d'assises est :",
    r: "Un devoir civique",
    theme: "Droits et devoirs",
  },
  {
    q: "La vente d'alcool en France est interdite aux personnes de moins de :",
    r: "18 ans",
    theme: "Droits et devoirs",
  },
  {
    q: "Le non-respect du code de la route est :",
    r: "Une infraction",
    theme: "Droits et devoirs",
  },
  {
    q: "Pour quel motif peut-on limiter la liberté d'expression ?",
    r: "Propos racistes, diffamatoires ou incitation à la haine",
    theme: "Droits et devoirs",
  },
  {
    q: "Que doit faire un citoyen s'il est appelé à être juré d'assises ?",
    r: "Se présenter",
    theme: "Droits et devoirs",
  },
  {
    q: "Quel est l'âge de la majorité civile en France ?",
    r: "18 ans",
    theme: "Droits et devoirs",
  },
  {
    q: "Quel est l'un des devoirs principaux d'un citoyen français ?",
    r: "Respecter les lois",
    theme: "Droits et devoirs",
  },
  {
    q: "Quelle est l'infraction la plus grave ?",
    r: "Le crime",
    theme: "Droits et devoirs",
  },
  {
    q: "Qu'est-ce que la citoyenneté numérique ?",
    r: "L'usage responsable d'internet",
    theme: "Droits et devoirs",
  },
  {
    q: "Qu'est-ce que le devoir de mémoire ?",
    r: "Se souvenir des événements tragiques",
    theme: "Droits et devoirs",
  },
  {
    q: "Qui peut être appelé à faire partie d'un jury d'assises ?",
    r: "Tout citoyen français de plus de 23 ans inscrit sur les listes électorales",
    theme: "Droits et devoirs",
  },
  {
    q: "Laquelle de ces citations est inscrite dans la DDHC de 1789 ?",
    r: "Les hommes naissent et demeurent libres et égaux en droits",
    theme: "Droits et devoirs",
  },
  {
    q: "L'article 4 de la DDHC affirme que \"la liberté consiste à pouvoir faire tout ce qui ne nuit pas à autrui\". Qu'est-ce que cela signifie ?",
    r: "On est libre tant qu'on ne porte pas atteinte aux droits des autres",
    theme: "Droits et devoirs",
  },
  {
    q: "Quel texte affirme que tous les hommes naissent libres et égaux en droits ?",
    r: "La Déclaration des Droits de l'Homme et du Citoyen de 1789",
    theme: "Droits et devoirs",
  },
  {
    q: "Suite à une interpellation par la police, il est possible de :",
    r: "Garder le silence et demander un avocat",
    theme: "Droits et devoirs",
  },
  {
    q: "Dans lequel de ces endroits est-on autorisé à fumer ?",
    r: "À l'extérieur",
    theme: "Droits et devoirs",
  },
  {
    q: "Lequel de ces crimes ou délits peut entraîner la privation des droits civils et politiques ?",
    r: "Les crimes graves",
    theme: "Droits et devoirs",
  },
  {
    q: "Pour obtenir une carte d'identité, il faut :",
    r: "Fournir un justificatif de domicile et une photo d'identité",
    theme: "Droits et devoirs",
  },
  {
    q: "Une personne privée de ses droits civils et politiques pendant 5 ans :",
    r: "Ne peut pas voter ni se présenter à une élection",
    theme: "Droits et devoirs",
  },

  // HISTOIRE, GÉOGRAPHIE ET CULTURE
  {
    q: "Parmi ces textes, lequel a été adopté sous Napoléon Ier ?",
    r: "Le Code civil",
    theme: "Histoire et culture",
  },
  {
    q: "Que signifie la date du 14 juillet pour les Français ?",
    r: "La fête nationale",
    theme: "Histoire et culture",
  },
  {
    q: "Pourquoi l'année 1958 est importante pour la France ?",
    r: "Création de la Ve République",
    theme: "Histoire et culture",
  },
  {
    q: "Lequel de ces pays est un pays fondateur de l'Union Européenne ?",
    r: "France, Allemagne, Italie, Belgique, Pays-Bas, Luxembourg",
    theme: "Histoire et culture",
  },
  {
    q: "Simone Veil est une figure importante. Elle a notamment :",
    r: "Fait adopter la loi sur l'IVG (1975)",
    theme: "Histoire et culture",
  },
  {
    q: "Dans quelle région est située une partie des plages du débarquement ?",
    r: "Normandie",
    theme: "Histoire et culture",
  },
  {
    q: "Dans quelle ville les rois de France étaient-ils couronnés ?",
    r: "Reims",
    theme: "Histoire et culture",
  },
  {
    q: "Quel roi de France a été guillotiné pendant la Révolution française ?",
    r: "Louis XVI",
    theme: "Histoire et culture",
  },
  {
    q: "En quelle année a débuté la Révolution française ?",
    r: "1789",
    theme: "Histoire et culture",
  },
  {
    q: "En quelle année Napoléon Ier est-il devenu empereur ?",
    r: "1804",
    theme: "Histoire et culture",
  },
  {
    q: "De quand date l'appel à la résistance du général de Gaulle ?",
    r: "18 juin 1940",
    theme: "Histoire et culture",
  },
  {
    q: "Qu'est-ce que la Shoah ?",
    r: "Le génocide des Juifs par les nazis",
    theme: "Histoire et culture",
  },
  {
    q: "Quel pays a été une colonie française ?",
    r: "Algérie, Sénégal, Vietnam, Maroc",
    theme: "Histoire et culture",
  },
  {
    q: "Qui a rendu l'école gratuite, laïque et obligatoire ?",
    r: "Jules Ferry",
    theme: "Histoire et culture",
  },
  {
    q: "Depuis quand les Français élisent-ils le président au suffrage universel direct ?",
    r: "1962",
    theme: "Histoire et culture",
  },
  {
    q: "En quelle année l'Union européenne a-t-elle été fondée ?",
    r: "1992",
    theme: "Histoire et culture",
  },
  {
    q: "Quand a eu lieu la Seconde guerre mondiale ?",
    r: "1939-1945",
    theme: "Histoire et culture",
  },
  {
    q: "Quand a eu lieu la Première guerre mondiale ?",
    r: "1914-1918",
    theme: "Histoire et culture",
  },
  {
    q: "Sous quel président a été abolie la peine de mort en France ?",
    r: "François Mitterrand",
    theme: "Histoire et culture",
  },
  {
    q: "Que célèbre-t-on le 8 mai ?",
    r: "La victoire de 1945",
    theme: "Histoire et culture",
  },
  {
    q: "Quelle est la première étape de la construction européenne en 1951 ?",
    r: "La CECA",
    theme: "Histoire et culture",
  },
  {
    q: "Qui était une figure de la Résistance française ?",
    r: "Jean Moulin",
    theme: "Histoire et culture",
  },
  {
    q: "Le 11 novembre est un jour férié. À quoi correspond cette date ?",
    r: "L'armistice de 1918",
    theme: "Histoire et culture",
  },
  {
    q: "Depuis quand l'esclavage a-t-il été aboli en France ?",
    r: "1848",
    theme: "Histoire et culture",
  },
  {
    q: "Qui a aboli l'esclavage en France ?",
    r: "Victor Schœlcher",
    theme: "Histoire et culture",
  },
  {
    q: "Depuis quelle année l'école publique est-elle gratuite ?",
    r: "1881",
    theme: "Histoire et culture",
  },
  {
    q: "En 1944, qu'est-ce qui a changé pour les femmes ?",
    r: "Elles ont obtenu le droit de vote",
    theme: "Histoire et culture",
  },
  {
    q: "Quelle organisation a été créée en 1945 ?",
    r: "L'ONU",
    theme: "Histoire et culture",
  },
  {
    q: "En quelle année l'euro est-il devenu la monnaie officielle ?",
    r: "2002",
    theme: "Histoire et culture",
  },
  {
    q: "À quelle date Paris a-t-elle été libérée ?",
    r: "25 août 1944",
    theme: "Histoire et culture",
  },
  {
    q: "Quel était le principal port français impliqué dans la traite négrière ?",
    r: "Nantes",
    theme: "Histoire et culture",
  },
  {
    q: "Quel philosophe des Lumières a dénoncé l'esclavage ?",
    r: "Voltaire, Montesquieu",
    theme: "Histoire et culture",
  },
  {
    q: "Quelle œuvre a été écrite par Victor Hugo ?",
    r: "Les Misérables",
    theme: "Histoire et culture",
  },
  {
    q: "Quel peintre est français ?",
    r: "Claude Monet, Auguste Renoir",
    theme: "Histoire et culture",
  },
  {
    q: "Quel plat est une spécialité de la cuisine française ?",
    r: "Le cassoulet, le bœuf bourguignon",
    theme: "Histoire et culture",
  },
  {
    q: "Qui était Marie Curie ?",
    r: "Une physicienne, double prix Nobel",
    theme: "Histoire et culture",
  },
  {
    q: 'Qui a peint "La liberté guidant le peuple" ?',
    r: "Eugène Delacroix",
    theme: "Histoire et culture",
  },
  {
    q: "Dans quel musée parisien est exposée la Joconde ?",
    r: "Le Louvre",
    theme: "Histoire et culture",
  },
  {
    q: "Quel château symbolise le pouvoir royal de Louis XIV ?",
    r: "Le château de Versailles",
    theme: "Histoire et culture",
  },
  {
    q: "Où peut-on voir des peintures préhistoriques en France ?",
    r: "Grotte de Lascaux",
    theme: "Histoire et culture",
  },
  {
    q: "Quel peintre célèbre a peint les Nymphéas ?",
    r: "Claude Monet",
    theme: "Histoire et culture",
  },
  {
    q: "Pendant quelles journées peut-on visiter gratuitement des lieux culturels ?",
    r: "Les Journées du patrimoine",
    theme: "Histoire et culture",
  },
  {
    q: "Que symbolise le 1er mai ?",
    r: "La fête du Travail",
    theme: "Histoire et culture",
  },
  {
    q: "Qui était Monsieur Rouget de Lisle ?",
    r: "L'auteur de la Marseillaise",
    theme: "Histoire et culture",
  },
  {
    q: "À quelle occasion a été construite la Tour Eiffel ?",
    r: "L'Exposition universelle de 1889",
    theme: "Histoire et culture",
  },
  {
    q: "Quelle chaîne de montagnes est située entre la France et l'Italie ?",
    r: "Les Alpes",
    theme: "Histoire et culture",
  },
  {
    q: "Qui était Molière ?",
    r: "Un dramaturge français du XVIIe siècle",
    theme: "Histoire et culture",
  },
  {
    q: "Qui était Charles Baudelaire ?",
    r: "Un poète français",
    theme: "Histoire et culture",
  },
  {
    q: "Qui était George Sand ?",
    r: "Une écrivaine française",
    theme: "Histoire et culture",
  },
  {
    q: "Qui était Simone de Beauvoir ?",
    r: "Une écrivaine et philosophe féministe",
    theme: "Histoire et culture",
  },
  {
    q: "Qui était Albert Camus ?",
    r: "Un écrivain, prix Nobel de littérature",
    theme: "Histoire et culture",
  },
  {
    q: "Qui était Marguerite Yourcenar ?",
    r: "Une écrivaine, 1re femme à l'Académie française",
    theme: "Histoire et culture",
  },
  {
    q: "Qui était Paul Cézanne ?",
    r: "Un peintre français",
    theme: "Histoire et culture",
  },
  {
    q: "Qui était Auguste Rodin ?",
    r: "Un sculpteur français",
    theme: "Histoire et culture",
  },
  {
    q: "Qui était Auguste Renoir ?",
    r: "Un peintre impressionniste",
    theme: "Histoire et culture",
  },
  {
    q: "Quel musée est situé à Paris ?",
    r: "Le Louvre, le musée d'Orsay",
    theme: "Histoire et culture",
  },
  {
    q: "Quel monument historique se trouve sur une île en Normandie ?",
    r: "Le Mont-Saint-Michel",
    theme: "Histoire et culture",
  },
  {
    q: "Quelle ville française fait partie des 10 plus grandes métropoles ?",
    r: "Paris, Lyon, Marseille",
    theme: "Histoire et culture",
  },
  {
    q: "Quelle île fait partie des Antilles françaises ?",
    r: "La Martinique, la Guadeloupe",
    theme: "Histoire et culture",
  },
  {
    q: "Quelle est la plus haute montagne de France ?",
    r: "Le Mont Blanc",
    theme: "Histoire et culture",
  },
  {
    q: "Quelle île française est située dans l'océan indien ?",
    r: "La Réunion",
    theme: "Histoire et culture",
  },
  {
    q: "Quel département français a une frontière avec le Brésil ?",
    r: "La Guyane",
    theme: "Histoire et culture",
  },
  {
    q: "De quelle ville française décolle la fusée Ariane ?",
    r: "Kourou",
    theme: "Histoire et culture",
  },
  {
    q: "Quelle mer ou océan borde la France métropolitaine ?",
    r: "L'océan Atlantique, la mer Méditerranée",
    theme: "Histoire et culture",
  },
  {
    q: "Quelle mer se situe entre la France et l'Angleterre ?",
    r: "La Manche",
    theme: "Histoire et culture",
  },
  {
    q: "Qu'est-ce que la France d'outre-mer ?",
    r: "Les territoires français hors d'Europe",
    theme: "Histoire et culture",
  },
  {
    q: "Quelle est la population approximative de la France en 2025 ?",
    r: "68 millions d'habitants",
    theme: "Histoire et culture",
  },
  {
    q: "Quel est le principal port maritime de France ?",
    r: "Marseille",
    theme: "Histoire et culture",
  },
  {
    q: "Combien y a-t-il de régions en France métropolitaine ?",
    r: "13",
    theme: "Histoire et culture",
  },
  {
    q: "Quelle chaîne de montagnes est située entre la France et l'Espagne ?",
    r: "Les Pyrénées",
    theme: "Histoire et culture",
  },
  {
    q: "Quel est le chef-lieu de la région Auvergne-Rhône-Alpes ?",
    r: "Lyon",
    theme: "Histoire et culture",
  },
  {
    q: "Quel est le chef-lieu de la région Bretagne ?",
    r: "Rennes",
    theme: "Histoire et culture",
  },
  {
    q: "Quel est le chef-lieu de la région Provence-Alpes-Côte d'Azur ?",
    r: "Marseille",
    theme: "Histoire et culture",
  },
  {
    q: "Quel est le 101ème département français depuis 2011 ?",
    r: "Mayotte",
    theme: "Histoire et culture",
  },
  {
    q: "Quel fleuve traverse Paris ?",
    r: "La Seine",
    theme: "Histoire et culture",
  },
  {
    q: "Qui a été président de la Ve République ?",
    r: "Charles de Gaulle",
    theme: "Histoire et culture",
  },
  {
    q: "Quel est l'objectif des lois scolaires de la IIIe République ?",
    r: "Rendre l'école gratuite, laïque et obligatoire",
    theme: "Histoire et culture",
  },
  {
    q: "Lequel de ces personnages a un lien avec la République française ?",
    r: "Charles de Gaulle",
    theme: "Histoire et culture",
  },
  {
    q: "Quelle organisation a été créée en 1945 après la Seconde Guerre mondiale ?",
    r: "L'ONU",
    theme: "Histoire et culture",
  },
  {
    q: "En quelle année l'euro est-il devenu la monnaie officielle de la France ?",
    r: "2002",
    theme: "Histoire et culture",
  },
  {
    q: "Qui était un célèbre compositeur français ?",
    r: "Claude Debussy",
    theme: "Histoire et culture",
  },
  {
    q: "Quelle ville française fait partie des 10 plus grandes métropoles du pays ?",
    r: "Paris",
    theme: "Histoire et culture",
  },
  {
    q: "Quelle île est française ?",
    r: "La Corse",
    theme: "Histoire et culture",
  },
  {
    q: "Quelle île est un département d'outre-mer français ?",
    r: "La Martinique",
    theme: "Histoire et culture",
  },
  {
    q: "Quelle île française se trouve au sud-est du continent africain ?",
    r: "La Réunion",
    theme: "Histoire et culture",
  },
  {
    q: "Quelle région française est réputée pour ses stations de ski ?",
    r: "Auvergne-Rhône-Alpes",
    theme: "Histoire et culture",
  },

  // VIVRE DANS LA SOCIÉTÉ FRANÇAISE
  {
    q: "Où faut-il déclarer la naissance d'un enfant ?",
    r: "À la mairie",
    theme: "Vivre en France",
  },
  {
    q: "Quel mariage est reconnu légalement ?",
    r: "Le mariage civil",
    theme: "Vivre en France",
  },
  {
    q: "Le stationnement sur une place réservée aux personnes handicapées :",
    r: "Est interdit et passible d'une amende",
    theme: "Vivre en France",
  },
  {
    q: "Quand faut-il déclarer son enfant au service d'état civil ?",
    r: "Dans les 5 jours suivant la naissance",
    theme: "Vivre en France",
  },
  {
    q: "Quel numéro d'urgence permet d'appeler la police ?",
    r: "17",
    theme: "Vivre en France",
  },
  {
    q: "Quel numéro d'urgence permet d'appeler le SAMU ?",
    r: "15",
    theme: "Vivre en France",
  },
  {
    q: "Auprès de quelle institution inscrire ses enfants à l'école publique ?",
    r: "La mairie",
    theme: "Vivre en France",
  },
  {
    q: "En cas de divorce, qui exerce l'autorité parentale ?",
    r: "Les deux parents",
    theme: "Vivre en France",
  },
  {
    q: "Quelle aide permet d'avoir un avocat gratuitement ?",
    r: "L'aide juridictionnelle",
    theme: "Vivre en France",
  },
  {
    q: "Qui peut demander le divorce ?",
    r: "L'un ou les deux époux",
    theme: "Vivre en France",
  },
  {
    q: "Auprès de quel organisme demander le remboursement des frais de santé ?",
    r: "L'Assurance maladie (CPAM)",
    theme: "Vivre en France",
  },
  {
    q: "La contraception :",
    r: "Est accessible à tous",
    theme: "Vivre en France",
  },
  {
    q: "À quoi sert la carte Vitale ?",
    r: "À être remboursé des frais de santé",
    theme: "Vivre en France",
  },
  {
    q: "À quoi sert une mutuelle santé ?",
    r: "À compléter les remboursements de l'Assurance maladie",
    theme: "Vivre en France",
  },
  {
    q: "Qu'est-ce que le tiers payant ?",
    r: "Ne pas avancer les frais de santé",
    theme: "Vivre en France",
  },
  {
    q: "L'inscription à l'Assurance maladie est :",
    r: "Obligatoire",
    theme: "Vivre en France",
  },
  {
    q: "L'avortement est-il possible en France ?",
    r: "Oui",
    theme: "Vivre en France",
  },
  {
    q: "Travailler sans être déclaré est :",
    r: "Interdit",
    theme: "Vivre en France",
  },
  {
    q: "Qu'est-ce que le SMIC ?",
    r: "Le salaire minimum légal",
    theme: "Vivre en France",
  },
  {
    q: "Quelle est la première démarche pour chercher un emploi ?",
    r: "S'inscrire à France Travail",
    theme: "Vivre en France",
  },
  {
    q: "Quelle est la durée légale du temps de travail par semaine ?",
    r: "35 heures",
    theme: "Vivre en France",
  },
  {
    q: "Qui peut demander un congé parental d'éducation ?",
    r: "Le père ou la mère",
    theme: "Vivre en France",
  },
  {
    q: "Une femme peut-elle créer son entreprise ?",
    r: "Oui",
    theme: "Vivre en France",
  },
  {
    q: "Quels textes définissent les règles au travail ?",
    r: "Le Code du travail et les conventions collectives",
    theme: "Vivre en France",
  },
  {
    q: "Quelles affaires sont traitées par le conseil de prud'hommes ?",
    r: "Les conflits entre employeurs et salariés",
    theme: "Vivre en France",
  },
  {
    q: "Qui a le droit de se syndiquer ?",
    r: "Tout salarié",
    theme: "Vivre en France",
  },
  {
    q: "Peut-on licencier une femme enceinte en raison de sa grossesse ?",
    r: "Non",
    theme: "Vivre en France",
  },
  {
    q: "L'instruction des enfants est obligatoire de :",
    r: "3 à 16 ans",
    theme: "Vivre en France",
  },
  {
    q: "Quelle est la définition de l'autorité parentale ?",
    r: "Les droits et devoirs des parents envers leurs enfants",
    theme: "Vivre en France",
  },
  {
    q: "Quel motif d'absence est accepté par l'école ?",
    r: "La maladie",
    theme: "Vivre en France",
  },
  {
    q: "Jusqu'à quel âge l'école est-elle obligatoire ?",
    r: "16 ans",
    theme: "Vivre en France",
  },
  {
    q: "À quel âge commence l'instruction obligatoire des enfants ?",
    r: "3 ans",
    theme: "Vivre en France",
  },
  {
    q: "Comment s'appellent les établissements après l'école élémentaire ?",
    r: "Les collèges",
    theme: "Vivre en France",
  },
  {
    q: "Les enfants en situation de handicap ont-ils le droit d'être scolarisés ?",
    r: "Oui",
    theme: "Vivre en France",
  },
  {
    q: "Quelle est la durée du congé paternité depuis 2021 ?",
    r: "28 jours",
    theme: "Vivre en France",
  },
  {
    q: "Est-ce possible de punir physiquement ses enfants ?",
    r: "Non",
    theme: "Vivre en France",
  },
  {
    q: "Quelle action peut réaliser le locataire d'un logement sans l'autorisation du propriétaire ?",
    r: "Faire de petits travaux d'entretien courant",
    theme: "Vivre en France",
  },
  {
    q: "Si une machine à laver est cassée, il est possible de :",
    r: "La déposer à la déchetterie",
    theme: "Vivre en France",
  },
  {
    q: "Dans quel cas faut-il déclarer son enfant au service d'état civil ?",
    r: "À la naissance",
    theme: "Vivre en France",
  },
  {
    q: "Qu'est-ce que le principe de confidentialité dans le domaine de la santé ?",
    r: "Le secret médical",
    theme: "Vivre en France",
  },
  {
    q: "Une personne étrangère, en situation régulière, peut créer son entreprise :",
    r: "Oui, sous certaines conditions selon le titre de séjour",
    theme: "Vivre en France",
  },
  {
    q: "Est-il possible de licencier une femme enceinte ou en congé maternité, en raison de sa grossesse ?",
    r: "Non, c'est interdit",
    theme: "Vivre en France",
  },
  {
    q: "Des parents ne respectent pas l'obligation d'instruction. Quelle sanction maximale risquent-ils ?",
    r: "Une amende et/ou une peine de prison",
    theme: "Vivre en France",
  },
  {
    q: "En tant que parent d'élève, il est possible de :",
    r: "Participer à la vie de l'école et rencontrer les enseignants",
    theme: "Vivre en France",
  },
  {
    q: "Quelle instruction est prévue pour les enfants qui ne parlent pas français ?",
    r: "Des dispositifs d'accueil spécifiques",
    theme: "Vivre en France",
  },
  {
    q: "S'agissant de l'accueil des enfants en situation de handicap à l'école :",
    r: "Ils ont le droit d'être scolarisés comme les autres enfants",
    theme: "Vivre en France",
  },
];

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
// Pools of plausible wrong answers by category
const wrongAnswerPools = {
  // Years (historical dates)
  years: [
    "1715",
    "1750",
    "1776",
    "1783",
    "1791",
    "1793",
    "1795",
    "1799",
    "1801",
    "1810",
    "1815",
    "1830",
    "1848",
    "1852",
    "1870",
    "1871",
    "1875",
    "1889",
    "1898",
    "1901",
    "1906",
    "1914",
    "1918",
    "1920",
    "1936",
    "1940",
    "1944",
    "1946",
    "1954",
    "1958",
    "1962",
    "1968",
    "1974",
    "1981",
    "1989",
    "1995",
    "1999",
    "2000",
    "2005",
    "2008",
  ],

  // Full dates (day + month + year)
  fullDates: [
    "14 juillet 1789",
    "26 août 1789",
    "21 septembre 1792",
    "21 janvier 1793",
    "9 thermidor an II",
    "18 brumaire an VIII",
    "2 décembre 1804",
    "18 juin 1815",
    "27 juillet 1830",
    "24 février 1848",
    "2 décembre 1851",
    "4 septembre 1870",
    "28 juin 1914",
    "11 novembre 1918",
    "22 juin 1940",
    "6 juin 1944",
    "8 mai 1945",
    "27 octobre 1946",
    "4 octobre 1958",
    "21 décembre 1958",
    "28 septembre 1958",
    "19 mars 1962",
    "22 août 1962",
  ],

  // Calendar dates (day + month, no year)
  calendarDates: [
    "Le 1er janvier",
    "Le 14 février",
    "Le 8 mars",
    "Le 1er mai",
    "Le 8 mai",
    "Le 14 juillet",
    "Le 15 août",
    "Le 1er novembre",
    "Le 11 novembre",
    "Le 25 décembre",
    "Le 21 juin",
    "Le 22 septembre",
  ],

  // Durations in years
  mandateDurations: [
    "1 an",
    "2 ans",
    "3 ans",
    "4 ans",
    "5 ans",
    "6 ans",
    "7 ans",
    "9 ans",
    "10 ans",
  ],

  // Ages
  ages: [
    "13 ans",
    "14 ans",
    "15 ans",
    "16 ans",
    "17 ans",
    "18 ans",
    "21 ans",
    "23 ans",
    "25 ans",
    "30 ans",
    "35 ans",
    "40 ans",
  ],

  // Small numbers (counts)
  smallNumbers: [
    "5",
    "7",
    "9",
    "12",
    "13",
    "15",
    "18",
    "22",
    "25",
    "27",
    "28",
    "50",
    "96",
    "101",
  ],

  // Work hours
  workHours: [
    "32 heures",
    "35 heures",
    "37 heures",
    "39 heures",
    "40 heures",
    "42 heures",
  ],

  // Days duration
  daysDuration: [
    "3 jours",
    "5 jours",
    "7 jours",
    "10 jours",
    "14 jours",
    "21 jours",
    "28 jours",
    "30 jours",
  ],

  // Emergency numbers
  emergencyNumbers: ["15", "17", "18", "112", "114", "115", "119", "116 000"],

  // Yes/No answers
  yesNo: ["Oui", "Non", "Parfois", "Cela dépend"],

  // French historical figures (names)
  historicalFigures: [
    "Napoléon Bonaparte",
    "Charles de Gaulle",
    "Jean Jaurès",
    "Léon Blum",
    "Georges Clemenceau",
    "Louis XIV",
    "Louis XVI",
    "Robespierre",
    "Danton",
    "Marat",
    "La Fayette",
    "Talleyrand",
    "Thiers",
    "Gambetta",
    "Jean Moulin",
    "Pierre Mendès France",
    "Robert Schuman",
    "Simone Veil",
    "François Mitterrand",
    "Jacques Chirac",
    "Valéry Giscard d'Estaing",
  ],

  // Person descriptions (for "Qui était X?" questions where answer describes the person)
  personDescriptions: [
    "Un écrivain, prix Nobel de littérature",
    "Une écrivaine, 1re femme à l'Académie française",
    "Une écrivaine et philosophe féministe",
    "Un écrivain français",
    "Une écrivaine française",
    "Un poète français",
    "Un dramaturge français du XVIIe siècle",
    "Un peintre français",
    "Un peintre impressionniste",
    "Un sculpteur français",
    "Une physicienne, double prix Nobel",
    "Un compositeur français",
    "Un général et homme d'État",
    "Un résistant français",
    "Un homme politique français",
    "Une femme politique française",
    "Un philosophe des Lumières",
    "Un roi de France",
    "Un empereur français",
    "Un révolutionnaire français",
    "L'auteur de la Marseillaise",
    "Un ministre de la Ve République",
    "Un président de la République",
    "Un Premier ministre français",
  ],

  // French writers and artists (names)
  writers: [
    "Victor Hugo",
    "Émile Zola",
    "Honoré de Balzac",
    "Gustave Flaubert",
    "Marcel Proust",
    "Albert Camus",
    "Jean-Paul Sartre",
    "Simone de Beauvoir",
    "Voltaire",
    "Rousseau",
    "Montesquieu",
    "Diderot",
    "Molière",
    "Racine",
    "Corneille",
    "La Fontaine",
    "Baudelaire",
    "Rimbaud",
    "Verlaine",
    "George Sand",
    "Marguerite Yourcenar",
    "Colette",
  ],

  painters: [
    "Claude Monet",
    "Auguste Renoir",
    "Paul Cézanne",
    "Édouard Manet",
    "Edgar Degas",
    "Henri Matisse",
    "Pablo Picasso",
    "Georges Braque",
    "Eugène Delacroix",
    "Jacques-Louis David",
    "Gustave Courbet",
    "Camille Pissarro",
    "Henri de Toulouse-Lautrec",
    "Paul Gauguin",
  ],

  composers: [
    "Beethoven",
    "Mozart",
    "Bach",
    "Vivaldi",
    "Chopin",
    "Debussy",
    "Ravel",
    "Berlioz",
    "Bizet",
    "Saint-Saëns",
    "Fauré",
  ],

  // French cities (including historically significant ones)
  frenchCities: [
    "Paris",
    "Lyon",
    "Marseille",
    "Toulouse",
    "Nice",
    "Nantes",
    "Strasbourg",
    "Montpellier",
    "Bordeaux",
    "Lille",
    "Rennes",
    "Reims",
    "Le Havre",
    "Toulon",
    "Grenoble",
    "Dijon",
    "Angers",
    "Nîmes",
    "Aix-en-Provence",
    "Brest",
    "Tours",
    "Orléans",
    "Versailles",
    "Saint-Denis",
    "Chartres",
    "Rouen",
    "Avignon",
    "Poitiers",
    "La Rochelle",
    "Clermont-Ferrand",
    "Metz",
    "Nancy",
    "Amiens",
    "Limoges",
    "Perpignan",
    "Besançon",
    "Caen",
  ],

  // European cities
  europeanCities: [
    "Bruxelles",
    "Strasbourg",
    "Luxembourg",
    "Francfort",
    "Berlin",
    "Amsterdam",
    "La Haye",
    "Rome",
    "Madrid",
    "Lisbonne",
    "Vienne",
    "Prague",
    "Varsovie",
    "Copenhague",
    "Stockholm",
    "Helsinki",
  ],

  // French regions
  frenchRegions: [
    "Île-de-France",
    "Auvergne-Rhône-Alpes",
    "Nouvelle-Aquitaine",
    "Occitanie",
    "Hauts-de-France",
    "Provence-Alpes-Côte d'Azur",
    "Grand Est",
    "Pays de la Loire",
    "Bretagne",
    "Normandie",
    "Bourgogne-Franche-Comté",
    "Centre-Val de Loire",
    "Corse",
  ],

  // European countries
  europeanCountries: [
    "La France",
    "L'Allemagne",
    "L'Italie",
    "L'Espagne",
    "Le Portugal",
    "La Belgique",
    "Les Pays-Bas",
    "Le Luxembourg",
    "L'Autriche",
    "La Pologne",
    "La Grèce",
    "La Suède",
    "Le Danemark",
    "La Finlande",
    "L'Irlande",
    "La Croatie",
    "La Roumanie",
    "La Bulgarie",
    "La Hongrie",
    "La République tchèque",
    "Le Royaume-Uni",
    "La Suisse",
    "La Norvège",
  ],

  // French institutions
  institutions: [
    "Le Parlement",
    "L'Assemblée nationale",
    "Le Sénat",
    "Le gouvernement",
    "Le Conseil constitutionnel",
    "Le Conseil d'État",
    "La Cour de cassation",
    "La Cour des comptes",
    "Le Défenseur des droits",
    "Le Conseil économique et social",
  ],

  // Local authorities
  localAuthorities: [
    "La commune",
    "Le département",
    "La région",
    "L'intercommunalité",
    "La métropole",
    "La préfecture",
    "La sous-préfecture",
  ],

  // Political roles
  politicalRoles: [
    "Le Président de la République",
    "Le Premier ministre",
    "Le président du Sénat",
    "Le président de l'Assemblée nationale",
    "Le ministre de l'Intérieur",
    "Le ministre de la Justice",
    "Le préfet",
    "Le maire",
    "Le député",
    "Le sénateur",
  ],

  // French monuments
  monuments: [
    "La Tour Eiffel",
    "Le Louvre",
    "Notre-Dame de Paris",
    "Le château de Versailles",
    "Le Mont-Saint-Michel",
    "Le Panthéon",
    "L'Arc de Triomphe",
    "Les Invalides",
    "Le Sacré-Cœur",
    "La Sainte-Chapelle",
    "Le Centre Pompidou",
    "Le musée d'Orsay",
  ],

  // Geographic features
  mountains: [
    "Les Alpes",
    "Les Pyrénées",
    "Le Massif central",
    "Les Vosges",
    "Le Jura",
    "Le Mont Blanc",
    "Le Pic du Midi",
    "Le Puy de Dôme",
  ],

  rivers: [
    "La Seine",
    "La Loire",
    "Le Rhône",
    "La Garonne",
    "Le Rhin",
    "La Meuse",
    "La Moselle",
    "La Dordogne",
    "L'Adour",
    "La Somme",
  ],

  seas: [
    "La Méditerranée",
    "L'océan Atlantique",
    "La Manche",
    "La mer du Nord",
    "L'océan Indien",
    "L'océan Pacifique",
  ],

  // French overseas territories
  overseas: [
    "La Guadeloupe",
    "La Martinique",
    "La Guyane",
    "La Réunion",
    "Mayotte",
    "La Nouvelle-Calédonie",
    "La Polynésie française",
    "Saint-Pierre-et-Miquelon",
    "Wallis-et-Futuna",
    "Saint-Martin",
    "Saint-Barthélemy",
  ],

  // Republic symbols
  symbols: [
    "Le drapeau tricolore",
    "La Marseillaise",
    "Marianne",
    "Le coq",
    "La devise",
    "Le bonnet phrygien",
    "Le faisceau de licteur",
    "La cocarde",
  ],

  // Legal/rights concepts
  legalConcepts: [
    "La liberté d'expression",
    "La liberté de la presse",
    "La liberté d'association",
    "La liberté de réunion",
    "La liberté de circulation",
    "Le droit de vote",
    "Le droit de grève",
    "Le droit à l'éducation",
    "Le droit au travail",
    "La présomption d'innocence",
    "Le droit à un procès équitable",
  ],

  // Infractions
  infractions: [
    "La contravention",
    "Le délit",
    "Le crime",
    "L'infraction pénale",
    "L'amende",
    "L'emprisonnement",
  ],

  // School levels
  schoolLevels: [
    "L'école maternelle",
    "L'école élémentaire",
    "Le collège",
    "Le lycée",
    "L'université",
    "Les grandes écoles",
  ],

  // Administrative documents
  documents: [
    "La carte d'identité",
    "Le passeport",
    "Le permis de conduire",
    "La carte Vitale",
    "L'acte de naissance",
    "Le livret de famille",
    "Le certificat de nationalité",
    "La carte électorale",
  ],

  // Population numbers (millions)
  populationNumbers: [
    "58 millions d'habitants",
    "62 millions d'habitants",
    "65 millions d'habitants",
    "68 millions d'habitants",
    "70 millions d'habitants",
    "72 millions d'habitants",
  ],

  // Celebrations and commemorations
  celebrations: [
    "La fête nationale",
    "La fête du Travail",
    "La victoire de 1945",
    "L'armistice de 1918",
    "La prise de la Bastille",
    "La Révolution française",
    "La libération de Paris",
    "La fin de la Seconde Guerre mondiale",
    "La journée de l'Europe",
    "La journée de la laïcité",
    "Les Journées du patrimoine",
    "La fête de la musique",
  ],

  // Treaties and laws
  treatiesAndLaws: [
    "Le traité de Maastricht",
    "Le traité de Rome",
    "Le traité de Lisbonne",
    "Le traité de Versailles",
    "Le traité de Paris",
    "La loi de 1905",
    "La loi de 1881",
    "Le Code civil",
    "La Constitution de 1958",
    "La Déclaration des Droits de l'Homme et du Citoyen de 1789",
  ],

  // Organizations
  organizations: [
    "L'ONU",
    "L'Union européenne",
    "La CECA",
    "L'OTAN",
    "Le Conseil de l'Europe",
    "L'UNESCO",
    "L'OMS",
    "Le FMI",
    "La Banque mondiale",
  ],

  // Literary works
  literaryWorks: [
    "Les Misérables",
    "Germinal",
    "Madame Bovary",
    "Le Père Goriot",
    "Les Fleurs du mal",
    "L'Étranger",
    "Le Petit Prince",
    "Notre-Dame de Paris",
    "Les Trois Mousquetaires",
    "Le Rouge et le Noir",
    "Candide",
  ],

  // Artworks
  artworks: [
    "La Joconde",
    "La liberté guidant le peuple",
    "Les Nymphéas",
    "Le Penseur",
    "Le Déjeuner sur l'herbe",
    "La Vénus de Milo",
    "La Victoire de Samothrace",
    "Le Radeau de la Méduse",
  ],

  // Foods/dishes
  dishes: [
    "Le cassoulet",
    "Le bœuf bourguignon",
    "La ratatouille",
    "La quiche lorraine",
    "Le coq au vin",
    "La bouillabaisse",
    "Les crêpes",
    "Le foie gras",
    "Le camembert",
    "La baguette",
    "Les croissants",
  ],

  // Designation methods (Comment sont désignés...?)
  designationMethods: [
    "Élus au suffrage universel direct",
    "Élus au suffrage universel indirect",
    "Élus par les conseillers municipaux",
    "Élus par les conseillers régionaux",
    "Élus par les grands électeurs",
    "Nommé par le président de la République",
    "Nommé par le Premier ministre",
    "Nommé par le gouvernement",
    "Désigné par le Parlement",
    "Coopté par ses pairs",
  ],

  // Legal status (... est : Obligatoire/Interdit/etc.)
  legalStatus: [
    "Obligatoire",
    "Obligatoire pour voter",
    "Interdit",
    "Interdit et passible d'une amende",
    "Autorisé",
    "Facultatif",
    "Un droit fondamental garanti par la loi",
    "Encadrée par la loi",
    "Un devoir civique",
    "Une infraction",
    "Une infraction pénale",
    "Libre et volontaire",
  ],

  // Role descriptions (Quel est le rôle de...?)
  roleDescriptions: [
    "Chef de l'État, garant de la Constitution",
    "Diriger l'action du gouvernement",
    "Vérifier la conformité des lois à la Constitution",
    "Protéger les droits des citoyens face à l'administration",
    "Voter les lois et contrôler le gouvernement",
    "Représenter l'État dans le département",
    "Assurer l'ordre public et la sécurité",
    "Gérer les affaires de la commune",
    "Rendre la justice au nom du peuple français",
    "Défendre les intérêts de la nation",
  ],

  // Elected officials / Who is elected (Qui est élu...?)
  electedOfficials: [
    "Les députés",
    "Les sénateurs",
    "Les conseillers municipaux",
    "Les conseillers départementaux",
    "Les conseillers régionaux",
    "Les députés européens",
    "Le président de la République",
    "Les maires",
  ],

  // Who does something (Qui vote/gère/dirige...?)
  politicalActors: [
    "Le Parlement",
    "L'Assemblée nationale",
    "Le Sénat",
    "Le gouvernement",
    "Le président de la République",
    "Le Premier ministre",
    "Le président du Sénat",
    "Le Conseil constitutionnel",
    "Le préfet",
    "Le maire",
    "La justice",
    "Les agents publics",
    "Les citoyens",
  ],

  // Mottos/devises
  mottos: [
    "Liberté, Égalité, Fraternité",
    "Unie dans la diversité",
    "In varietate concordia",
    "Fluctuat nec mergitur",
    "Montjoie Saint Denis",
  ],

  // Hymns
  hymns: [
    "La Marseillaise",
    "L'Ode à la joie",
    "Le Chant du Départ",
    "La Carmagnole",
    "L'Internationale",
  ],

  // Flag/emblem descriptions
  flagDescriptions: [
    "12 étoiles dorées sur fond bleu",
    "Trois bandes verticales bleu, blanc, rouge",
    "Un coq sur fond tricolore",
    "Une croix blanche sur fond rouge",
    "Des étoiles sur fond bleu avec des bandes rouges et blanches",
  ],

  // Administrative structure
  administrativeStructure: [
    "Communes, départements, régions",
    "Régions, départements, communes",
    "Cantons, arrondissements, régions",
    "Provinces, départements, communes",
    "Communes, cantons, départements",
  ],

  // Three powers
  threePowers: [
    "Législatif, exécutif, judiciaire",
    "Législatif, administratif, judiciaire",
    "Exécutif, législatif, militaire",
    "Politique, économique, judiciaire",
    "National, régional, local",
  ],

  // Where to see/find things
  locationAnswers: [
    "Sur les bâtiments publics",
    "Dans les mairies",
    "Dans les écoles",
    "Sur les documents officiels",
    "À l'Assemblée nationale",
    "Au Palais de l'Élysée",
    "Dans les tribunaux",
    "Dans les préfectures",
  ],

  // On which documents
  documentLocations: [
    "Timbres, pièces de monnaie, documents officiels",
    "La carte d'identité",
    "Le passeport",
    "Les actes officiels",
    "Les documents administratifs",
    "Les papiers d'état civil",
  ],

  // Headwear/clothing items
  clothingItems: [
    "Un bonnet phrygien",
    "Une couronne de laurier",
    "Un béret",
    "Une cocarde tricolore",
    "Un chapeau à plumes",
  ],

  // Voting/citizenship conditions
  citizenshipConditions: [
    "Être citoyen français, majeur et inscrit sur les listes électorales",
    "Avoir la nationalité française et être majeur",
    "Être majeur et résider en France",
    "Être inscrit sur les listes électorales",
    "Avoir 18 ans révolus",
  ],

  // What someone should do
  civicActions: [
    "Se présenter",
    "Voter",
    "S'inscrire sur les listes électorales",
    "Payer ses impôts",
    "Respecter les lois",
    "Participer à la vie citoyenne",
  ],

  // Discrimination/hate terms
  discriminationTerms: [
    "L'antisémitisme",
    "Le racisme",
    "La xénophobie",
    "L'homophobie",
    "Le sexisme",
    "La discrimination",
  ],

  // Reasons for limiting rights
  rightsLimitationReasons: [
    "L'ordre public et l'intérêt général",
    "La sécurité nationale",
    "La protection des mineurs",
    "Le respect de la vie privée",
    "La dignité humaine",
    "Propos racistes, diffamatoires ou incitation à la haine",
  ],

  // Belief states
  beliefStates: [
    "Qu'elle est athée",
    "Qu'elle est agnostique",
    "Qu'elle est croyante",
    "Qu'elle est laïque",
    "Qu'elle est libre de ses convictions",
  ],

  // Rights protected
  protectedRights: [
    "La sûreté",
    "La liberté",
    "La dignité",
    "La vie privée",
    "La propriété",
    "L'intégrité physique",
  ],

  // Human dignity violations
  dignityViolations: [
    "La torture, l'esclavage",
    "Les traitements inhumains",
    "La discrimination",
    "Le travail forcé",
    "Les châtiments corporels",
  ],

  // Who can do something (family/civil)
  familyActors: [
    "L'un ou les deux époux",
    "Le père ou la mère",
    "Les deux parents",
    "Tout citoyen majeur",
    "Le tuteur légal",
    "La personne concernée",
  ],

  // Age ranges for obligations
  ageRanges: [
    "3 à 16 ans",
    "6 à 16 ans",
    "3 à 18 ans",
    "6 à 18 ans",
    "De la naissance à 18 ans",
  ],

  // War date ranges
  warDateRanges: [
    "1914-1918",
    "1939-1945",
    "1870-1871",
    "1940-1944",
    "1954-1962",
  ],

  // Where to register/inscribe
  registrationPlaces: [
    "À la mairie",
    "À la mairie de son domicile",
    "À la préfecture",
    "Au tribunal",
    "En ligne sur le site du gouvernement",
    "Au consulat",
  ],

  // Religious signs in schools
  religiousSigns: [
    "Les signes discrets",
    "Les signes ostensibles",
    "Aucun signe religieux",
    "Tous les signes religieux",
    "Uniquement les croix",
  ],

  // Candidacy conditions
  candidacyConditions: [
    "Avoir au moins 500 parrainages d'élus",
    "Avoir 18 ans et être inscrit sur les listes électorales de la commune",
    "Tout citoyen français de plus de 18 ans ayant 500 parrainages d'élus",
    "Avoir la nationalité française depuis plus de 5 ans",
    "Être né en France",
  ],

  // Constitution modification methods
  constitutionModification: [
    "Le référendum ou le Congrès",
    "Le vote du Parlement seul",
    "Le décret présidentiel",
    "La décision du Conseil constitutionnel",
    "Le vote populaire uniquement",
  ],

  // DDHC quotes
  ddchQuotes: [
    "Les hommes naissent et demeurent libres et égaux en droits",
    "Liberté, Égalité, Fraternité",
    "La loi est l'expression de la volonté générale",
    "Nul ne peut être inquiété pour ses opinions",
  ],

  // Police interpellation rights
  policeRights: [
    "Garder le silence et demander un avocat",
    "Refuser de répondre aux questions",
    "Demander un interprète",
    "Être informé des charges",
  ],

  // Smoking locations
  smokingLocations: [
    "À l'extérieur",
    "Dans les lieux publics fermés",
    "Dans les restaurants",
    "Nulle part",
  ],

  // ID card requirements
  idCardRequirements: [
    "Fournir un justificatif de domicile et une photo d'identité",
    "Payer une taxe",
    "Avoir un emploi",
    "Être propriétaire",
  ],

  // Fifth Republic presidents
  fifthRepublicPresidents: [
    "Charles de Gaulle",
    "Georges Pompidou",
    "Valéry Giscard d'Estaing",
    "François Mitterrand",
    "Jacques Chirac",
    "Nicolas Sarkozy",
    "Emmanuel Macron",
  ],

  // School law objectives
  schoolLawObjectives: [
    "Rendre l'école gratuite, laïque et obligatoire",
    "Créer des écoles privées",
    "Enseigner la religion",
    "Former les élites",
  ],

  // French composers
  frenchComposers: [
    "Claude Debussy",
    "Maurice Ravel",
    "Hector Berlioz",
    "Camille Saint-Saëns",
    "Gabriel Fauré",
  ],

  // French islands
  frenchIslands: [
    "La Corse",
    "La Martinique",
    "La Guadeloupe",
    "La Réunion",
    "Mayotte",
  ],

  // Tenant actions
  tenantActions: [
    "Faire de petits travaux d'entretien courant",
    "Modifier la structure du logement",
    "Changer les fenêtres",
    "Abattre une cloison",
  ],

  // Waste disposal
  wasteDisposal: [
    "La déposer à la déchetterie",
    "La jeter dans la rue",
    "La laisser sur le trottoir",
    "L'enterrer dans le jardin",
  ],

  // Health confidentiality
  healthConfidentiality: [
    "Le secret médical",
    "La transparence totale",
    "Le partage avec l'employeur",
    "L'accès libre aux dossiers",
  ],

  // Parent sanctions
  parentSanctions: [
    "Une amende et/ou une peine de prison",
    "Un simple avertissement",
    "Aucune sanction",
    "Le retrait de la garde",
  ],

  // Parent school participation
  parentSchoolParticipation: [
    "Participer à la vie de l'école et rencontrer les enseignants",
    "Enseigner en classe",
    "Décider du programme scolaire",
    "Choisir les enseignants",
  ],

  // Language support
  languageSupport: [
    "Des dispositifs d'accueil spécifiques",
    "Aucun dispositif particulier",
    "L'exclusion temporaire",
    "Le redoublement obligatoire",
  ],

  // Disability schooling
  disabilitySchooling: [
    "Ils ont le droit d'être scolarisés comme les autres enfants",
    "Ils doivent aller dans des écoles spécialisées",
    "Ils ne peuvent pas être scolarisés",
    "C'est au choix des parents uniquement",
  ],

  // EU voting rights
  euVotingRights: [
    "Oui, aux élections municipales et européennes",
    "Non, jamais",
    "Oui, à toutes les élections",
    "Uniquement aux élections européennes",
  ],
};

// Detect the type of answer to generate appropriate wrong answers
function detectAnswerType(answer, question) {
  const a = answer.toLowerCase();
  const q = question.toLowerCase();

  // === ANSWER-BASED DETECTION (check the format of the answer first) ===

  // Year patterns
  if (/^(1[0-9]{3}|20[0-2][0-9])$/.test(answer)) return "years";

  // War date ranges (1914-1918, 1939-1945)
  if (/^\d{4}-\d{4}$/.test(answer)) return "warDateRanges";

  // Full dates (day + month + year)
  if (
    /^\d{1,2}\s+(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+\d{4}$/.test(
      a,
    )
  )
    return "fullDates";

  // Calendar dates (Le 9 mai, Le 14 juillet)
  if (
    /^le\s+\d{1,2}(er)?\s+(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)$/.test(
      a,
    )
  )
    return "calendarDates";

  // Age ranges (3 à 16 ans)
  if (/^\d+\s+à\s+\d+\s+ans$/.test(a)) return "ageRanges";

  // Duration patterns
  if (/^\d+\s+ans?$/.test(a)) {
    if (
      q.includes("âge") ||
      q.includes("majorité") ||
      q.includes("moins de") ||
      q.includes("plus de")
    )
      return "ages";
    return "mandateDurations";
  }
  if (/^\d+\s+heures?$/.test(a)) return "workHours";
  if (/^\d+\s+jours?$/.test(a) || /dans les \d+ jours/.test(a))
    return "daysDuration";

  // Small numbers
  if (/^\d{1,3}$/.test(answer)) {
    if (q.includes("numéro") || q.includes("appeler") || q.includes("urgence"))
      return "emergencyNumbers";
    return "smallNumbers";
  }

  // Yes/No
  if (["oui", "non"].includes(a)) return "yesNo";

  // Designation methods (Élus par..., Nommé par...)
  if (/^(élus?|nommée?|désignée?)\s+(par|au)/i.test(a))
    return "designationMethods";

  // Legal status answers (Obligatoire, Interdit, Un droit fondamental...)
  if (
    /^(obligatoire|interdit|autorisé|facultatif|un droit fondamental|encadrée par la loi|un devoir civique|une infraction|libre et volontaire)/i.test(
      a,
    )
  )
    return "legalStatus";

  // Belief states (Qu'elle est athée...)
  if (/^qu'(elle|il) est /i.test(a)) return "beliefStates";

  // Check if answer is a person description (starts with "Un/Une")
  const isPersonDescription =
    /^(un |une )(écrivain|peintre|sculpteur|physicien|compositeur|dramaturge|poète|général|résistant|homme politique|femme politique|philosophe|roi|empereur|révolutionnaire|auteur|ministre|président|premier ministre)/i.test(
      a,
    );
  if (isPersonDescription) return "personDescriptions";

  // === QUESTION-BASED DETECTION ===

  // How is someone designated/elected
  if (
    q.includes("comment") &&
    (q.includes("désigné") || q.includes("élu") || q.includes("choisi"))
  )
    return "designationMethods";

  // Who is elected
  if (
    q.includes("qui est élu") ||
    q.includes("qui élit") ||
    q.includes("élections")
  ) {
    if (
      a.includes("les ") &&
      (a.includes("députés") ||
        a.includes("conseillers") ||
        a.includes("sénateurs"))
    )
      return "electedOfficials";
    if (a.includes("citoyens")) return "politicalActors";
    return "electedOfficials";
  }

  // Role questions
  if (
    q.includes("quel est le rôle") ||
    q.includes("quelles sont les fonctions")
  )
    return "roleDescriptions";

  // Who does something (Qui vote/gère/dirige/sanctionne/assure...)
  if (
    (q.includes("qui vote") ||
      q.includes("qui gère") ||
      q.includes("qui dirige") ||
      q.includes("qui sanctionne") ||
      q.includes("qui assure") ||
      q.includes("qui représente") ||
      q.includes("qui siège") ||
      q.includes("qui doit")) &&
    !q.includes("qui était") &&
    !q.includes("qui a")
  ) {
    return "politicalActors";
  }

  // What is the motto/devise
  if (q.includes("devise")) return "mottos";

  // What is the hymn
  if (q.includes("hymne") && !q.includes("qui a composé")) return "hymns";

  // Flag composition
  if (q.includes("composé") && q.includes("drapeau")) return "flagDescriptions";

  // Administrative structure
  if (
    q.includes("découpage") ||
    (q.includes("organisé") && q.includes("administratif"))
  )
    return "administrativeStructure";

  // Three powers
  if (q.includes("trois pouvoirs") || q.includes("séparation des pouvoirs"))
    return "threePowers";

  // Where to see something
  if (
    q.includes("où peut-on voir") ||
    (q.includes("où peut-on") && q.includes("voir"))
  )
    return "locationAnswers";

  // On which document
  if (q.includes("sur quel document")) return "documentLocations";

  // What does someone wear
  if (q.includes("que porte") || q.includes("sur la tête"))
    return "clothingItems";

  // Conditions for voting/citizenship
  if (
    q.includes("condition") &&
    (q.includes("voter") || q.includes("élection"))
  )
    return "citizenshipConditions";

  // What should someone do
  if (q.includes("que doit faire") || q.includes("que doit-on faire"))
    return "civicActions";

  // Discrimination terms
  if (
    q.includes("haine") ||
    q.includes("préjugés") ||
    (q.includes("terme") && q.includes("désigne"))
  )
    return "discriminationTerms";

  // Rights limitation reasons
  if (
    q.includes("au nom de quoi") ||
    (q.includes("motif") && q.includes("limiter"))
  )
    return "rightsLimitationReasons";

  // Protected rights
  if (q.includes("quel droit protège")) return "protectedRights";

  // Dignity violations
  if (q.includes("atteinte") && q.includes("dignité"))
    return "dignityViolations";

  // Who can do something (family context)
  if (
    q.includes("qui peut") &&
    (q.includes("divorce") || q.includes("congé") || q.includes("parental"))
  )
    return "familyActors";
  if (q.includes("qui exerce") && q.includes("autorité parentale"))
    return "familyActors";

  // Where to register/inscribe
  if (
    q.includes("où") &&
    (q.includes("inscrire") ||
      q.includes("déclarer") ||
      q.includes("s'inscrire"))
  )
    return "registrationPlaces";

  // Religious signs in schools
  if (q.includes("symbole religieux") && q.includes("école"))
    return "religiousSigns";

  // Candidacy conditions
  if (
    q.includes("condition") &&
    (q.includes("candidat") ||
      q.includes("présenter") ||
      q.includes("présidentielle"))
  )
    return "candidacyConditions";
  if (q.includes("qui peut se présenter")) return "candidacyConditions";

  // Constitution modification
  if (q.includes("modifier") && q.includes("constitution"))
    return "constitutionModification";

  // DDHC quotes
  if (
    (q.includes("citation") && q.includes("ddhc")) ||
    q.includes("inscrite dans la ddhc")
  )
    return "ddchQuotes";

  // Police interpellation
  if (
    q.includes("interpellation") ||
    (q.includes("police") && q.includes("possible"))
  )
    return "policeRights";

  // Smoking locations
  if (q.includes("autorisé à fumer") || q.includes("fumer"))
    return "smokingLocations";

  // ID card requirements
  if (q.includes("carte d'identité") && q.includes("faut"))
    return "idCardRequirements";

  // Fifth Republic presidents
  if (q.includes("président") && q.includes("ve république"))
    return "fifthRepublicPresidents";

  // School law objectives
  if (
    q.includes("lois scolaires") ||
    (q.includes("objectif") && q.includes("école"))
  )
    return "schoolLawObjectives";

  // French composers
  if (q.includes("compositeur") && q.includes("français"))
    return "frenchComposers";

  // French islands
  if (
    q.includes("île") &&
    (q.includes("française") || q.includes("département"))
  )
    return "frenchIslands";

  // Tenant actions
  if (q.includes("locataire") && q.includes("sans l'autorisation"))
    return "tenantActions";

  // Waste disposal
  if (q.includes("machine à laver") || q.includes("cassée"))
    return "wasteDisposal";

  // Health confidentiality
  if (q.includes("confidentialité") && q.includes("santé"))
    return "healthConfidentiality";

  // Parent sanctions
  if (
    q.includes("sanction") &&
    q.includes("parent") &&
    q.includes("instruction")
  )
    return "parentSanctions";

  // Parent school participation
  if (q.includes("parent d'élève") && q.includes("possible"))
    return "parentSchoolParticipation";

  // Language support
  if (q.includes("instruction") && q.includes("ne parlent pas français"))
    return "languageSupport";

  // Disability schooling
  if (q.includes("handicap") && q.includes("école"))
    return "disabilitySchooling";

  // EU voting rights
  if (q.includes("citoyens de l'ue") && q.includes("voter"))
    return "euVotingRights";

  // Legal status questions (... est :)
  if (
    q.match(/\s+est\s*:?\s*$/) ||
    q.includes("est-ce obligatoire") ||
    q.includes("est-ce légal") ||
    q.includes("est-ce possible") ||
    q.includes("est-il obligatoire") ||
    q.includes("a-t-on le droit")
  )
    return "legalStatus";

  // People - check question context
  if (
    q.includes("qui a") ||
    q.includes("qui était") ||
    q.includes("qui est") ||
    q.includes("quel roi") ||
    q.includes("quel philosophe") ||
    q.includes("quel peintre") ||
    q.includes("figure")
  ) {
    if (q.includes("peintre") || q.includes("peint")) return "painters";
    if (q.includes("composé") || q.includes("musique")) return "composers";
    if (
      q.includes("écrit") ||
      q.includes("œuvre") ||
      q.includes("écrivain") ||
      q.includes("poète")
    )
      return "writers";
    return "historicalFigures";
  }

  // Places - Cities
  if (
    q.includes("quelle ville") ||
    q.includes("où est") ||
    q.includes("siège") ||
    q.includes("quel port") ||
    q.includes("décolle")
  ) {
    if (
      q.includes("france") ||
      q.includes("français") ||
      q.includes("rois de france") ||
      (q.includes("port") && !q.includes("européen")) ||
      q.includes("décolle") ||
      q.includes("couronnés")
    ) {
      return "frenchCities";
    }
    if (
      q.includes("européen") ||
      q.includes("europe") ||
      q.includes("ue") ||
      q.includes("union") ||
      q.includes("banque centrale") ||
      q.includes("commission") ||
      q.includes("parlement européen")
    ) {
      return "europeanCities";
    }
    return "frenchCities";
  }
  if (q.includes("région") || q.includes("chef-lieu")) return "frenchRegions";
  if (
    (q.includes("pays") || q.includes("état")) &&
    (q.includes("quitté") || q.includes("intégré") || q.includes("fondateur"))
  )
    return "europeanCountries";
  if (q.includes("fleuve") || q.includes("rivière") || q.includes("traverse"))
    return "rivers";
  if (q.includes("montagne") || q.includes("chaîne")) return "mountains";
  if (
    (q.includes("mer") && !q.includes("premier")) ||
    q.includes("océan") ||
    q.includes("borde")
  )
    return "seas";
  if (
    q.includes("île") ||
    q.includes("outre-mer") ||
    q.includes("antilles") ||
    q.includes("océan indien") ||
    (q.includes("département") && q.includes("frontière"))
  )
    return "overseas";
  if (q.includes("musée") || q.includes("monument") || q.includes("château"))
    return "monuments";

  // Institutions
  if (q.includes("institution") || q.includes("quelle collectivité"))
    return "localAuthorities";

  // Symbols
  if (q.includes("symbole") && !q.includes("fête")) return "symbols";

  // Legal
  if (q.includes("infraction") && q.includes("plus grave"))
    return "infractions";

  // Population
  if (q.includes("population") || q.includes("habitants"))
    return "populationNumbers";

  // School
  if (q.includes("établissement") && q.includes("après")) return "schoolLevels";

  // Celebrations and commemorations
  if (
    q.includes("célèbre") ||
    q.includes("commémore") ||
    q.includes("symbolise") ||
    (q.includes("correspond") && q.includes("date")) ||
    q.includes("jour férié") ||
    (q.includes("signifie") && q.includes("date"))
  )
    return "celebrations";

  // Treaties and laws
  if (
    q.includes("traité") ||
    (q.includes("texte") &&
      (q.includes("fondateur") || q.includes("fondatrice")))
  )
    return "treatiesAndLaws";

  // Organizations
  if (
    (q.includes("organisation") && q.includes("créée")) ||
    (q.includes("première étape") && q.includes("construction"))
  )
    return "organizations";

  // Literary works
  if (q.includes("œuvre") && q.includes("écrite")) return "literaryWorks";

  // Foods
  if (q.includes("plat") || q.includes("spécialité") || q.includes("cuisine"))
    return "dishes";

  // Default: return null to use theme-based fallback
  return null;
}

function generateWrongAnswers(
  correctAnswer,
  allAnswers,
  count = 3,
  question = null,
) {
  let pool = [];

  // Try to detect answer type and get appropriate pool
  if (question) {
    const answerType = detectAnswerType(correctAnswer, question.q);
    if (answerType && wrongAnswerPools[answerType]) {
      pool = wrongAnswerPools[answerType].filter(
        (a) =>
          a !== correctAnswer &&
          a.toLowerCase() !== correctAnswer.toLowerCase(),
      );
    }
  }

  // If we have enough type-matched answers, use them
  if (pool.length >= count) {
    return shuffleArray(pool).slice(0, count);
  }

  // Fallback: use answers from the same theme
  if (question) {
    const themeAnswers = allQuestions
      .filter((q) => q.theme === question.theme && q.r !== correctAnswer)
      .map((q) => q.r);
    pool = [...new Set([...pool, ...themeAnswers])];
  }

  // If still not enough, add from general pool (but filter to avoid obvious mismatches)
  if (pool.length < count) {
    const remaining = allAnswers.filter(
      (a) =>
        a !== correctAnswer &&
        !pool.includes(a) &&
        // Avoid mixing very different answer types
        (correctAnswer.length < 20 ? a.length < 30 : true) &&
        (correctAnswer.length > 50 ? a.length > 20 : true),
    );
    pool = [...pool, ...remaining];
  }

  const shuffled = shuffleArray(pool);
  return shuffled.slice(0, count);
}

export default function QuizCivique() {
  const [gameState, setGameState] = useState("start");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [history, setHistory] = useState([]);

  // New state for features
  const [quizMode, setQuizMode] = useState("normal"); // normal, bookmarks
  const [stats, setStats] = useState({ quizzes: 0, avgScore: 0, bestScore: 0 });
  const [bookmarks, setBookmarks] = useState([]);
  const [questionStats, setQuestionStats] = useState({});

  const allAnswers = allQuestions.map((q) => q.r);

  // Load data from localStorage on mount
  useEffect(() => {
    const history = getStorageItem(STORAGE_KEYS.QUIZ_HISTORY, []);
    const savedBookmarks = getStorageItem(STORAGE_KEYS.BOOKMARKS, []);
    const savedStats = getStorageItem(STORAGE_KEYS.QUESTION_STATS, {});

    setBookmarks(savedBookmarks);
    setQuestionStats(savedStats);

    // Calculate stats from history
    if (history.length > 0) {
      const total = history.length;
      const avg = Math.round(
        history.reduce((sum, h) => sum + h.percentage, 0) / total,
      );
      const best = Math.max(...history.map((h) => h.percentage));
      setStats({ quizzes: total, avgScore: avg, bestScore: best });
    }
  }, []);

  // Official test format: questions per theme
  const QUESTIONS_PER_THEME = {
    "Principes et valeurs": 11,
    "Système institutionnel": 6,
    "Droits et devoirs": 11,
    "Histoire et culture": 8,
    "Vivre en France": 4,
  };
  const TOTAL_QUESTIONS = 40;

  // Select questions following official test format
  const selectQuestionsWithSpacing = (mode) => {
    // Read fresh from localStorage to avoid stale state issues
    const savedBookmarks = getStorageItem(STORAGE_KEYS.BOOKMARKS, []);

    if (mode === "bookmarks") {
      // Review bookmarked questions only
      const bookmarkedQuestions = allQuestions.filter((q) =>
        savedBookmarks.includes(getQuestionHash(q)),
      );
      if (bookmarkedQuestions.length === 0) return [];
      const shuffled = shuffleArray(bookmarkedQuestions);
      return shuffled.slice(0, Math.min(TOTAL_QUESTIONS, shuffled.length));
    }

    // Normal mode: select fixed number of questions per theme (official format)
    const selectedQuestions = [];

    // Group questions by theme
    const questionsByTheme = {};
    for (const q of allQuestions) {
      if (!questionsByTheme[q.theme]) {
        questionsByTheme[q.theme] = [];
      }
      questionsByTheme[q.theme].push(q);
    }

    // Select the required number from each theme
    for (const [theme, count] of Object.entries(QUESTIONS_PER_THEME)) {
      const themeQuestions = questionsByTheme[theme] || [];
      const shuffled = shuffleArray(themeQuestions);
      const selected = shuffled.slice(0, Math.min(count, shuffled.length));
      selectedQuestions.push(...selected);
    }

    // Shuffle the final selection so themes are mixed
    return shuffleArray(selectedQuestions);
  };

  // Update question stats after answering
  const updateQuestionStats = (question, isCorrect) => {
    const hash = getQuestionHash(question);
    const current = questionStats[hash] || {
      timesAsked: 0,
      timesCorrect: 0,
      weight: 0.5,
    };

    const newStats = {
      ...current,
      timesAsked: current.timesAsked + 1,
      timesCorrect: current.timesCorrect + (isCorrect ? 1 : 0),
      weight: isCorrect
        ? Math.max(0.1, current.weight - 0.1) // Correct: decrease weight
        : Math.min(1, current.weight + 0.2), // Wrong: increase weight
      lastAsked: new Date().toISOString().split("T")[0],
    };

    const updatedStats = { ...questionStats, [hash]: newStats };
    setQuestionStats(updatedStats);
    setStorageItem(STORAGE_KEYS.QUESTION_STATS, updatedStats);
  };

  // Save quiz result to history
  const saveQuizResult = (finalScore, total) => {
    const history = getStorageItem(STORAGE_KEYS.QUIZ_HISTORY, []);
    const newEntry = {
      date: new Date().toISOString().split("T")[0],
      score: finalScore,
      total: total,
      percentage: Math.round((finalScore / total) * 100),
      mode: quizMode,
    };
    history.push(newEntry);
    setStorageItem(STORAGE_KEYS.QUIZ_HISTORY, history);

    // Update stats display
    const avg = Math.round(
      history.reduce((sum, h) => sum + h.percentage, 0) / history.length,
    );
    const best = Math.max(...history.map((h) => h.percentage));
    setStats({ quizzes: history.length, avgScore: avg, bestScore: best });
  };

  // Toggle bookmark for current question
  const toggleBookmark = () => {
    const hash = getQuestionHash(questions[currentIndex]);
    let newBookmarks;
    if (bookmarks.includes(hash)) {
      newBookmarks = bookmarks.filter((b) => b !== hash);
    } else {
      newBookmarks = [...bookmarks, hash];
    }
    setBookmarks(newBookmarks);
    setStorageItem(STORAGE_KEYS.BOOKMARKS, newBookmarks);
  };

  // Check if current question is bookmarked
  const isCurrentBookmarked = () => {
    if (!questions[currentIndex]) return false;
    return bookmarks.includes(getQuestionHash(questions[currentIndex]));
  };

  const startQuiz = (mode = "normal") => {
    console.log(allQuestions.length);

    setQuizMode(mode);
    const selected = selectQuestionsWithSpacing(mode);
    if (selected.length === 0) {
      alert("Aucune question dans vos favoris !");
      return;
    }
    setQuestions(selected);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setHistory([]);
    setGameState("playing");
    prepareAnswers(selected[0]);
  };

  const prepareAnswers = (question) => {
    const wrongAnswers = generateWrongAnswers(
      question.r,
      allAnswers,
      3,
      question,
    );
    const allOptions = shuffleArray([question.r, ...wrongAnswers]);
    setAnswers(allOptions);
  };

  const handleAnswer = (answer) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);

    const isCorrect = answer === questions[currentIndex].r;
    if (isCorrect) {
      setScore((s) => s + 1);
    }

    // Update spaced repetition stats
    updateQuestionStats(questions[currentIndex], isCorrect);

    setHistory((h) => [
      ...h,
      {
        question: questions[currentIndex].q,
        correct: questions[currentIndex].r,
        selected: answer,
        isCorrect,
      },
    ]);
  };

  const nextQuestion = () => {
    const totalQuestions = questions.length;
    if (currentIndex + 1 >= totalQuestions) {
      // Save quiz result when finished
      const finalScore =
        score + (selectedAnswer === questions[currentIndex].r ? 0 : 0);
      saveQuizResult(score, totalQuestions);
      setGameState("finished");
    } else {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setSelectedAnswer(null);
      setShowResult(false);
      prepareAnswers(questions[nextIdx]);
    }
  };

  const getScoreColor = () => {
    const total = questions.length || 40;
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreMessage = () => {
    const total = questions.length || 40;
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "Félicitations ! Vous avez réussi !";
    if (percentage >= 60) return "Pas mal, mais continuez à réviser !";
    return "Courage, révisez et réessayez !";
  };

  if (gameState === "start") {
    console.log(allQuestions.length);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center">
          <div className="text-6xl mb-4">🇫🇷</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Quiz Examen Civique
          </h1>
          <h2 className="text-xl text-indigo-600 mb-6">
            Niveau Naturalisation
          </h2>

          {/* Stats Card */}
          {stats.quizzes > 0 && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-6">
              <div className="flex justify-around text-center">
                <div>
                  <p className="text-2xl font-bold text-indigo-600">
                    {stats.quizzes}
                  </p>
                  <p className="text-xs text-gray-500">Quiz</p>
                </div>
                <div className="border-l border-gray-200 pl-4">
                  <p className="text-2xl font-bold text-indigo-600">
                    {stats.avgScore}%
                  </p>
                  <p className="text-xs text-gray-500">Moyenne</p>
                </div>
                <div className="border-l border-gray-200 pl-4">
                  <p className="text-2xl font-bold text-green-600">
                    {stats.bestScore}%
                  </p>
                  <p className="text-xs text-gray-500">Meilleur</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-gray-700 mb-2">
              📋 <strong>40 questions</strong> tirées aléatoirement de la liste
              officielles de {allQuestions.length} questions.
            </p>
            <p className="text-gray-700 mb-2">
              ✅ <strong>32 bonnes réponses</strong> minimum pour réussir (80%)
            </p>
            <p className="text-gray-700">⏱️ Pas de limite de temps</p>
          </div>

          {/* Main Quiz Button */}
          <button
            onClick={() => startQuiz("normal")}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-colors text-lg mb-3"
          >
            Commencer le Quiz
          </button>

          {/* Bookmarks Button */}
          {bookmarks.length > 0 && (
            <button
              onClick={() => startQuiz("bookmarks")}
              className="w-full py-3 px-4 rounded-xl font-semibold transition-colors bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
            >
              Revoir mes favoris
              <span className="ml-2 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
                {bookmarks.length}
              </span>
            </button>
          )}
        </div>
      </div>
    );
  }

  if (gameState === "finished") {
    const totalQuestions = questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= 80;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center mb-6">
            <div className="text-6xl mb-4">{passed ? "🎉" : "📚"}</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Quiz Terminé !
            </h1>
            <p className={`text-5xl font-bold mb-2 ${getScoreColor()}`}>
              {score} / {totalQuestions}
            </p>
            <p className="text-2xl text-gray-600 mb-4">{percentage}%</p>
            <div
              className={`inline-block px-6 py-2 rounded-full text-lg font-semibold mb-4 ${
                passed
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {passed ? "✅ RÉUSSI" : "❌ NON RÉUSSI"}
            </div>
            <p className="text-lg text-gray-600 mb-6">{getScoreMessage()}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setGameState("start")}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-xl transition-colors"
              >
                Accueil
              </button>
              <button
                onClick={() => startQuiz(quizMode)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
              >
                Recommencer
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              📊 Récapitulatif
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {history.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border-l-4 ${
                    item.isCorrect
                      ? "bg-green-50 border-green-500"
                      : "bg-red-50 border-red-500"
                  }`}
                >
                  <p className="font-medium text-gray-800 text-sm mb-1">
                    {idx + 1}. {item.question}
                  </p>
                  {!item.isCorrect && (
                    <p className="text-red-600 text-sm">
                      ❌ Votre réponse : {item.selected}
                    </p>
                  )}
                  <p className="text-green-600 text-sm">
                    ✅ Bonne réponse : {item.correct}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-500">
              Question {currentIndex + 1} / {totalQuestions}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-indigo-600">
                Score : {score} / {currentIndex + (showResult ? 1 : 0)}
              </span>
              {/* Bookmark Button */}
              <button
                onClick={toggleBookmark}
                className={`p-1.5 rounded-lg transition-colors ${
                  isCurrentBookmarked()
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                }`}
                title={
                  isCurrentBookmarked()
                    ? "Retirer des favoris"
                    : "Ajouter aux favoris"
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill={isCurrentBookmarked() ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full">
              {currentQuestion.theme}
            </span>
            {quizMode !== "normal" && (
              <span
                className={`inline-block text-xs px-3 py-1 rounded-full ${
                  quizMode === "weak"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {quizMode === "weak" ? "Points faibles" : "Favoris"}
              </span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            {currentQuestion.q}
          </h2>

          <div className="space-y-3 mb-6">
            {answers.map((answer, idx) => {
              let buttonClass =
                "w-full p-4 rounded-xl border-2 text-left transition-all ";

              if (showResult) {
                if (answer === currentQuestion.r) {
                  buttonClass += "border-green-500 bg-green-50 text-green-800";
                } else if (answer === selectedAnswer) {
                  buttonClass += "border-red-500 bg-red-50 text-red-800";
                } else {
                  buttonClass += "border-gray-200 bg-gray-50 text-gray-500";
                }
              } else {
                buttonClass +=
                  "border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(answer)}
                  disabled={showResult}
                  className={buttonClass}
                >
                  <span className="font-medium">
                    {String.fromCharCode(65 + idx)}.
                  </span>{" "}
                  {answer}
                  {showResult && answer === currentQuestion.r && (
                    <span className="float-right">✅</span>
                  )}
                  {showResult &&
                    answer === selectedAnswer &&
                    answer !== currentQuestion.r && (
                      <span className="float-right">❌</span>
                    )}
                </button>
              );
            })}
          </div>

          {showResult && (
            <div
              className={`p-4 rounded-xl mb-4 ${
                selectedAnswer === currentQuestion.r
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {selectedAnswer === currentQuestion.r ? (
                <p className="font-semibold">✅ Bonne réponse !</p>
              ) : (
                <div>
                  <p className="font-semibold">❌ Mauvaise réponse</p>
                  <p className="text-sm mt-1">
                    La bonne réponse était :{" "}
                    <strong>{currentQuestion.r}</strong>
                  </p>
                </div>
              )}
            </div>
          )}

          {showResult && (
            <button
              onClick={nextQuestion}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-colors"
            >
              {currentIndex + 1 >= 40
                ? "Voir les résultats"
                : "Question suivante →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
