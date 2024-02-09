const messageWorkflow = {
  farmer: [
    {
      messages: [
        "Je peux regarder la télé ?",
        "Coucou ! Tu es qui ?",
        "Tu vas bien ?",
        "Tu parles pas ? Bon ben à plus tard !",
      ],
    },
    {
      messages: ["Que veux-tu encore ?", "Ça suffit maintenant !"],
      condition: {
        delayFromPreviousMessage: 10, // not implemented
      },
    },
  ],
};

export { messageWorkflow };
