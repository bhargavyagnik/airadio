import React from 'react';

interface Voice {
  name: string;
  id: string;
}

const voices: Voice[] = [
  { name: 'Adam', id: 'pNInz6obpgDQGcFmaJgB' },
  { name: 'Antoni', id: 'ErXwobaYiN019PkySvjV' },
  { name: 'Bella', id: 'EXAVITQu4vr4xnSDxMaL' },
  { name: 'Charlie', id: 'IKne3meq5aSn9XLyUdCD' },
  { name: 'Charlotte', id: 'XB0fDUnXU5powFXDhCwa' },
  { name: 'Daniel', id: 'onwK4e9ZLuTAKqWW03F9' },
  { name: 'Emily', id: 'LcfcDJNUP1GQjkzn1xUU' },
  { name: 'Grace', id: 'oWAxZDx7w5VEj9dCyTzz' },
  { name: 'James', id: 'ZQe5CZNOzWyzPSCn5a3c' },
  { name: 'Rachel', id: '21m00Tcm4TlvDq8ikWAM' },
];

interface VoiceSelectorProps {
  onSelect: (id: string) => void;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({ onSelect }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSelect(event.target.value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="font-bold text-lg mb-2">Select Voice</h2>
      <select
        onChange={handleChange}
        className="border rounded p-2 w-full"
      >
        <option value="" disabled selected>Select a voice</option>
        {voices.map((voice) => (
          <option key={voice.id} value={voice.id}>
            {voice.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default VoiceSelector; 