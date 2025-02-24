import React from 'react';
import { Settings } from 'lucide-react';
import VoiceSelector from './VoiceSelector';

interface PersonalizationProps {
  onClose: () => void;
}

const Personalization: React.FC<PersonalizationProps> = ({ onClose }) => {
  const handleVoiceSelect = async (id: string) => {
    // Send the selected voice ID to the backend
    await fetch('/api/radio/set-voice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ voiceId: id }),
    });
    onClose(); // Close the personalization modal after selection
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <div className="flex items-center mb-4">
          <Settings className="w-5 h-5 text-gray-700 mr-2" />
          <h2 className="font-bold text-lg">Personalization</h2>
        </div>
        <VoiceSelector onSelect={handleVoiceSelect} />
        <button
          onClick={onClose}
          className="mt-4 bg-black text-white rounded px-4 py-2"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Personalization; 