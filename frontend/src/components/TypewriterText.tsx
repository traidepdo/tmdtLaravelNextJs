"use client";

import { useEffect, useState } from "react";

interface TypewriterTextProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
  className?: string;
}

export default function TypewriterText({
  words,
  typingSpeed = 90,
  deletingSpeed = 45,
  pauseTime = 1800,
  className = "",
}: TypewriterTextProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState(words[0] || "");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!words || words.length === 0) return;

    const currentWord = words[currentWordIndex];

    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      if (displayText.length < currentWord.length) {
        timer = setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
        }, typingSpeed);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseTime);
      }
    } else {
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length - 1));
        }, deletingSpeed);
      } else {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, pauseTime]);

  return (
    <span className={`inline-flex items-center ${className}`}>
      <span>{displayText}</span>
      <span className="inline-block w-1 h-[1em] bg-indigo-400 ml-1.5 animate-pulse rounded-full" />
    </span>
  );
}
