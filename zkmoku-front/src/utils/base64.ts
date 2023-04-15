

export const decodeBase64 = (input: string): string => {
  if (typeof window !== 'undefined') {
    return window.atob(input);
  } else {
    throw new Error('decodeBase64 can only be used in a browser environment');
  }
};

export const encodeBase64 = (input: string): string => {
  if (typeof window !== 'undefined') {
    return window.btoa(input);
  } else {
    throw new Error('encodeBase64 can only be used in a browser environment');
  }
};
