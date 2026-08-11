import { useState } from 'react';

export function useCopyContract(address) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(address);
    setIsCopied(true);
    window.setTimeout(() => setIsCopied(false), 1800);
  };

  return [isCopied, copy];
}
