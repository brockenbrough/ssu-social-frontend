import React, { useState, useEffect, useRef } from 'react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

function EmojiPickerButton({ 
  onEmojiSelect, 
  pickerPosition, 
  onPickerToggle,  //Not required
  textareaRef, 
  size = "", 
  margin = "", 
  padding = "" 
}) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [randomEmoji, setRandomEmoji] = useState(getRandomEmoji());
  const emojiPickerRef = useRef(null);
  const emojiButtonRef = useRef(null);

  function getRandomEmoji() {
    const faceEmojis = Object.values(data.emojis).filter(
      (emoji) =>
        emoji.keywords &&
        emoji.keywords.some((keyword) =>
          [
            "face",
            "smile",
            "happy",
            "sad",
            "angry",
            "expression",
            "dog",
          ].includes(keyword)
        )
    );

    const randomIndex = Math.floor(Math.random() * faceEmojis.length);
    return faceEmojis[randomIndex]?.skins[0]?.native;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setRandomEmoji(getRandomEmoji());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleEmojiButtonClick = () => {
    setShowEmojiPicker((prev) => {
      const newState = !prev;
      if (onPickerToggle) {
        onPickerToggle(newState);
      } 
      return newState;
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target) &&
        textareaRef.current &&
        !textareaRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
        if (onPickerToggle) {
          onPickerToggle(false); 
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [textareaRef]);

  return (
    <div className="relative">
      <button
        ref={emojiButtonRef}
        type="button"
        onClick={handleEmojiButtonClick}
        className={`text-${size} bg-transparent cursor-pointer ${margin} ${padding} relative z-10 -mt-1`}
      >
        {randomEmoji}
      </button>

      {showEmojiPicker && (
        <div
          ref={emojiPickerRef}
          className="absolute bottom-12"
          style={{ left: pickerPosition }}
        >
          <Picker
            data={data}
            onEmojiSelect={(emoji) => {
              onEmojiSelect(emoji.native);
              setShowEmojiPicker(false);
            }}
            theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
          />
        </div>
      )}
    </div>
  );
}

export default EmojiPickerButton;
