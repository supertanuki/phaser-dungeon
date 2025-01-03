const messageWorkflow = {
  farmer: [
    {
      messages: [
        "Qui es-tu ? ►",
        "Tu n'as rien à faire dans notre village ! ►",
        "Vas t-en !",
      ],
    },
    {
      messages: [
        "Tu ne fais pas partie des miliciens qui tournent autour du village ? ►",
        "Désolé pour mon accueil brutal... ►",
        "Nous sommes sur les nerfs depuis quelques jours... ►",
        "depuis que ces miliciens sont venus et ont abattu des arbres... ►",
        "pour creuser le sol, à la recherche de matières premières précieuses. ►",
        "Nous cherchons un moyen pour chasser ces miliciens.",
      ],
    },
    {
      messages: [
        "Nous cherchons un moyen pour chasser ces miliciens. Peux-tu nous aider ?",
      ],
    },
    {
      messages: [
        "Quoi ??? Tu veux travailler à la mine ??? ►",
        "C'est très dangereux... ►",
        "Ok, comme tu veux, voici une tenue adaptée.",
      ],
      dependingOn: [
        'miner_met',
      ],
      unlockEvents: [
        'mine_clothes_found',
      ],
    },
    {
      messages: [
        "Ta tenue te convient ? Bon courage et sois prudente à la mine !",
      ],
    },
  ],
  miner: [
    {
      messages: [
        "Stop ! On ne passe pas. ►",
        "Veux-tu travailler à la mine et te faire un peu d'argent ? ►",
        "Oh, c'est pas un travail pour une femme... ►",
        "Mais qu'importe ! On a besoin de beaucoup d'ouvriers. ►",
        "Mais tu n'es pas habillée correctement pour travailler... ►",
        "Vas voir au village pour trouver une tenue adaptée.",
      ],
      unlockEvents: [
        'miner_met',
      ],
    },
    {
      messages: [
        "As-tu demandé à un villageois une tenue adaptée pour travailler à la mine ?",
      ],
    },
    {
      messages: [
        "Tu fais grise mine dans ta nouvelle tenue, mais ça va, ça passe, on t'attend à la mine !",
      ],
      dependingOn: [
        'mine_clothes_found',
      ],
      unlockEvents: [
        'miner_clothes_validated',
      ],
    },
    {
      messages: [
        "Tu vas pouvoir commencer à bosser !",
      ],
    },
  ],
};

export { messageWorkflow };
