export const DefaultAISetting = async (entry) => {

  const Defaultsetting = {
    pointOfView: 'First person singular(i, me, my, mine)',
    formality: 'neutral',
    tone: ['Confident', 'Empathetic', 'Engaging'],
    language: 'British English',
    chatGPTVersion: 'GPT 4',
  };

  return {
    Defaultsetting,
  };
};
