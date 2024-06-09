/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!********************************************!*\
  !*** ./src/contentScript/contentScript.ts ***!
  \********************************************/
// contentScript.ts
console.log("Content script injected and running.");
let notes = []; // Array to store notes
let note = ""; // Variable to store note text
const highlightText = (color) => {
    console.log('Highlight button clicked in content script');
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const newNode = document.createElement("span");
        newNode.style.backgroundColor = color;
        range.surroundContents(newNode);
    }
};
const addNote = (color) => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
        // Remove existing note containers
        const existingContainers = document.querySelectorAll('.note-container');
        existingContainers.forEach(container => container.remove());
        // Create a container for the note input and submit button
        const noteContainer = document.createElement("div");
        noteContainer.className = "note-container";
        noteContainer.style.position = "absolute";
        noteContainer.style.top = `${range.getBoundingClientRect().bottom}px`;
        noteContainer.style.left = `${range.getBoundingClientRect().left}px`;
        // Create an input element for entering the note
        const noteInput = document.createElement("input");
        noteInput.type = "text";
        noteInput.placeholder = "Enter your note here...";
        noteInput.style.marginRight = "5px";
        noteInput.style.borderBottom = '1px solid #3182ce';
        noteInput.style.borderRadius = '7px';
        noteInput.style.borderRadius = '15px';
        noteInput.style.padding = '10px';
        // Create a submit button
        const submitButton = document.createElement("button");
        submitButton.textContent = "Submit";
        const buttonBorderStyle = "1px solid #3182ce"; // Blue border
        const buttonBorderRadius = "10px"; // Rounded corners
        const buttonBackgroundColor = "transparent"; // Transparent background
        const buttonTextColor = "#3182ce"; // Blue text color
        const buttonCursor = "pointer"; // Pointer cursor
        const buttonTransition = "background-color 0.3s, color 0.3s"; // Smooth transition
        const buttonHoverBackgroundColor = "#3182ce"; // Blue background on hover
        const buttonHoverTextColor = "white"; // White text color on hover
        submitButton.style.border = buttonBorderStyle;
        submitButton.style.borderRadius = buttonBorderRadius;
        submitButton.style.backgroundColor = buttonBackgroundColor;
        submitButton.style.color = buttonTextColor;
        submitButton.style.cursor = buttonCursor;
        submitButton.style.transition = buttonTransition;
        submitButton.style.fontSize = '15px';
        submitButton.style.padding = '10px';
        // Add event listener for button hover effect
        submitButton.addEventListener('mouseenter', () => {
            submitButton.style.backgroundColor = buttonHoverBackgroundColor;
            submitButton.style.color = buttonHoverTextColor;
        });
        submitButton.addEventListener('mouseleave', () => {
            submitButton.style.backgroundColor = buttonBackgroundColor;
            submitButton.style.color = buttonTextColor;
        });
        // Add click event listener to the submit button
        submitButton.addEventListener("click", () => {
            const noteText = noteInput.value.trim();
            if (noteText) {
                // Create a new note object
                const newNote = {
                    text: selectedText,
                    note: noteText
                };
                // Add the note to the notes array
                notes.push(newNote);
                // Save notes to local storage
                chrome.storage.local.set({ notes });
                // Create a new div element to display the note
                const noteDiv = document.createElement("div");
                noteDiv.textContent = noteText;
                noteDiv.style.marginTop = "5px";
                noteDiv.style.backgroundColor = "black"; // Light cream background color
                noteDiv.style.color = "#FFFDD0"; // Shade of blue for text color
                noteDiv.style.padding = "2px"; // Padding
                noteDiv.style.fontFamily = "Arial, sans-serif"; // Font family
                noteDiv.style.fontSize = "12px"; // Font size
                noteDiv.style.display = "inline-block"; // Adjust width according to text length
                noteDiv.style.opacity = "0.8"; // Opacity
                noteDiv.style.position = "relative"; // Relative positioning for the delete button
                // Create a delete button for the note
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "X"; // Button text
                deleteButton.className = "delete-button"; // Add a class for styling
                deleteButton.style.position = "absolute"; // Positioning
                deleteButton.style.top = "-8px"; // Adjust position to top
                deleteButton.style.right = "-8px"; // Adjust position to right
                deleteButton.style.width = "15px"; // Width of the button
                deleteButton.style.height = "15px"; // Height of the button
                deleteButton.style.backgroundColor = "red"; // Background color
                deleteButton.style.color = "white"; // Text color
                deleteButton.style.opacity = "1"; // Opacity
                deleteButton.style.padding = "0"; // Padding
                deleteButton.style.border = "1px solid black"; // Border
                deleteButton.style.borderRadius = "30%"; // No rounded corners
                deleteButton.style.cursor = "pointer"; // Change cursor to pointer on hover
                deleteButton.style.display = "flex"; // Use flex to center the text
                deleteButton.style.alignItems = "center"; // Center vertically
                deleteButton.style.justifyContent = "center"; // Center horizontally
                deleteButton.style.fontFamily = "Arial, sans-serif"; // Set font-family explicitly
                deleteButton.style.fontSize = "10px"; // Font size of the button
                // Add click event listener to the delete button
                deleteButton.addEventListener("click", () => {
                    noteDiv.remove(); // Remove the note when delete button is clicked
                    notes = notes.filter(note => note.note !== noteText);
                    chrome.storage.local.set({ notes });
                    // Send message to popup to delete the note
                    chrome.runtime.sendMessage({ action: 'deleteNote', note: noteText });
                });
                // Append the delete button to the note div
                noteDiv.appendChild(deleteButton);
                // Insert the note div below the selected text
                const rangeRect = range.getBoundingClientRect();
                noteDiv.style.position = "absolute";
                noteDiv.style.top = `${rangeRect.bottom}px`;
                noteDiv.style.left = `${rangeRect.left}px`;
                document.body.appendChild(noteDiv);
                // Remove the note input container
                noteContainer.remove();
            }
        });
        // Append the input and submit button to the note container
        noteContainer.appendChild(noteInput);
        noteContainer.appendChild(submitButton);
        // Append the note container to the document body
        document.body.appendChild(noteContainer);
    }
};
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Message received in content script', message);
    if (message.action === "highlightText") {
        highlightText(message.color);
        sendResponse({ status: "highlighted" }); // Synchronous response
    }
    else if (message.action === "addNote") {
        addNote(message.color);
        sendResponse({ status: "note added" }); // Synchronous response
    }
    else if (message.action === "deleteNote") {
        // Handle note deletion
        notes = notes.filter(note => note.note !== message.note);
        chrome.storage.local.set({ notes });
        // Remove the note from the document
        const noteDivs = document.querySelectorAll('div');
        noteDivs.forEach((noteDiv) => {
            if (noteDiv.textContent.includes(message.note)) {
                noteDiv.remove();
            }
        });
        sendResponse({ status: "note deleted" }); // Synchronous response
    }
    else if (message.action === "exportPage") {
        window.print();
        sendResponse({ status: "page exported" }); // Synchronous response
    }
});
document.addEventListener("keydown", (event) => {
    if (event.key === "q" && event.ctrlKey) {
        highlightText("#ffff00");
    }
});
document.addEventListener("keydown", (event) => {
    if (event.key === "b" && event.ctrlKey) {
        addNote("#ffff00");
    }
});

/******/ })()
;
//# sourceMappingURL=contentScript.js.map