const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const newDelayMethod = (ms: number) => {
  const { promise, resolve } = Promise.withResolvers();

  setTimeout(resolve, ms);

  return promise;
};

export { delay };
