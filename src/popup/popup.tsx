import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import '../assets/tailwind.css';
import * as html2pdf from 'html2pdf.js';

const Popup = () => {
  const [highlightColor, setHighlightColor] = useState('#ffff00');
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    chrome.storage.local.get('notes', (result) => {
      if (result.notes) {
        setNotes(result.notes.reverse());
      }
    });
  }, []);

// useEffect(() => {
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       const tabId = tabs[0].id;
//       chrome.runtime.sendMessage({ action: 'getNotes', tabId }, (response) => {
//         if (response && response.notes) {
//           setNotes(response.notes.reverse());
//         }
//       });
//     });
//   }, []);

  const handleHighlightChange = (event) => {
    const newColor = event.target.value;
    setHighlightColor(newColor);
  };

  const highlightText = () => {
    console.log('Highlight button clicked');
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'highlightText', color: highlightColor });
    });
  };

//   const addNote = () => {
//     console.log('Add Note button clicked');
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       chrome.tabs.sendMessage(tabs[0].id, { action: 'addNote', color: highlightColor});
//     });
//   };


    const addNote = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'addNote', color: highlightColor }, (response) => {
        if (response && response.notes) {
          setNotes(response.notes);
        }
      });
    });
  };



  const deleteNote = (noteToDelete) => {
    const updatedNotes = notes.filter(note => note.note !== noteToDelete);
    setNotes(updatedNotes);
    chrome.storage.local.set({ notes: updatedNotes });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'deleteNote', note: noteToDelete });
      });
  };

  const exportBtn = (() => {
   // Send a message to the content script to trigger window.print()
   chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "exportPage" });
});
  });



//   const updateNotes = (tabId) => {
//     chrome.runtime.sendMessage({ action: 'getNotes', tabId }, (response) => {
//       if (response && response.notes) {
//         setNotes(response.notes.reverse());
//       }
//     });
//   };

  return (
    <div className="w-72 p-2 bg-white shadow-lg rounded-lg flex flex-col justify-center items-center">
            <h1 className="text-xl font-bold mb-4">Annotator</h1>
            <div className="w-full mt-4">
            {notes.map((note, index) => (
                <div key={index} className="relative p-2 mb-2 border rounded">
                    <div>
                        <div>{note.text}</div>
                        <div className="text-xs text-gray-600">{note.note}</div>
                    </div>
                <button
                className="absolute top-0 right-0 bg-red-500 text-white rounded px-1 py-0.5 ml-2 text-xs"
                onClick={() => deleteNote(note.note)}
                >
                Delete
                </button>
            </div>
        ))}
      </div>
            <div className="w-full flex mb-1 items-center justify-center">
                <span className="mr-1 text-sm">Select Highlight Color:</span>
                <input
                    type="color"
                    className="w-1/4 rounded-sm"
                    id="highlightColor"
                    name="highlightColor"
                    value={highlightColor}
                    onChange={handleHighlightChange}
                />
            </div>
            <button className="w-full mb-2 px-2 py-1 bg-blue-500 text-white rounded transition-opacity hover:opacity-75 text-base" onClick={highlightText}>Highlight</button>
            <button className="w-full mb-2 px-2 py-1 bg-blue-500 text-white rounded transition-opacity hover:opacity-75 text-base" onClick={addNote}>Add Note</button>
            <button className="w-full px-2 py-1 bg-blue-500 text-white rounded transition-opacity hover:opacity-75 text-base" onClick={exportBtn}>Export</button>

        </div>
  );
};

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);
root.render(<Popup />);
