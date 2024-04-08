import { useEffect, useState } from 'react';

export const useTypingEffect = (texts: string[], speed: number = 150, onComplete: () => void) => {
  const [index, setIndex] = useState(0); // Index of the current text (word)
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (index >= texts.length) {
      onComplete(); // Callback when all texts have been typed out
      return;
    }

    if (isDeleting) {
      if (typedText.length === 0) {
        setIsDeleting(false);
        setIndex((prev) => prev + 1); // Move to next word
      } else {
        setTimeout(() => setTypedText((prev) => prev.slice(0, -1)), speed / 2);
      }
    } else {
      if (typedText === texts[index]) {
        setTimeout(() => setIsDeleting(true), speed * 10); // Pause before starting to delete
      } else {
        setTimeout(() => setTypedText((prev) => texts[index].substring(0, prev.length + 1)), speed);
      }
    }
  }, [texts, index, typedText, isDeleting, onComplete, speed]);

  return typedText;
};