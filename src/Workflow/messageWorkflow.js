const messageWorkflow = {
  farmer: [
    {
      messages: [
        "Qui es-tu ? ►",
        "Tu n'as rien à faire dans notre village ! ►",
        "Vas t-en !"
      ],
    },
    {
      messages: [
        "Tu ne fais pas partie du groupe des miliciens en jeep ? ►",
        "Désolé pour mon accueil brutal... ►",
        "Nous sommes sur les nerfs depuis quelques jours... ►",
        "depuis que ces miliciens sont venus et ont abattu des arbres... ►",
        "pour creuser le sol, à la recherche de matières premières précieuses. ►",
        "Nous cherchons un moyen pour chasser ces miliciens."
      ],
      condition: {
        delayFromPreviousMessage: 10, // not implemented
      },
    },
    {
      messages: [
        "Nous cherchons un moyen pour chasser ces miliciens. Peux-tu nous aider ?"
      ],
    },
  ],
};

export { messageWorkflow };
