const messageWorkflow = {
  farmer: [
    {
      messages: [
        "Coucou ! Tu es qui ?",
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
