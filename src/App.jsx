import React from "react";
import clipboardImg from "/src/assets/Vector.png";
import SpinnerImg from "/src/assets/spinner-solid-1.png";

export default function App() {
  const [textInputData, setTextInputData] = React.useState({
    text: "",
    charactersWithoutSpace: 0,
    charactersWithSpace: 0,
    wordCount: 0,
    sentenceCount: 0,
    paragraphCount: 0,
    pageCount: 0,
  });

  const [openPopUpModal, setOpenPopUpModal] = React.useState({
    loadingModal: false,
    copyBtnModal: false,
  });

  const [copyBtnClicked, setCopyBtnClicked] = React.useState(false);

  const popupModalStyles = {
    display: "flex",
  };

  const handleTextAreaInput = (event) => {
    const textInput = event.target.value;

    setOpenPopUpModal((prev) => ({
      ...prev,
      copyBtnModal: textInput.length > 0 ? true : false,
    }));

    const numberOfCharactersNoSpace = textInput
      .trim()
      .split("")
      .filter((character) => character !== " ").length;

    const numberOfCharactersWithSpace = textInput.trim().split("").length;

    const numberOfWords = textInput
      .trim()
      .split(" ")
      .filter((word) => word !== "").length;

    const numberOfSentences = textInput
      .trim()
      .split(/[.!?]+/)
      .filter((sentence) => sentence !== "").length;

    const paragraph = textInput.trim().split("\n\n");

    const numberOfParagraphs = paragraph.filter(
      (paragraph) => paragraph.trim !== "" && /\S/.test(paragraph)
    ).length;

    const paragraphsPerPage = 3;
    const numberOfPages = Math.ceil(numberOfParagraphs / paragraphsPerPage);

    setTextInputData((prev) => ({
      ...prev,
      text: textInput,
      charactersWithoutSpace: numberOfCharactersNoSpace,
      charactersWithSpace: numberOfCharactersWithSpace,
      wordCount: numberOfWords,
      sentenceCount: numberOfSentences,
      paragraphCount: numberOfParagraphs,
      pageCount: numberOfPages,
    }));
  };

  const handleAPIRequest = () => {
    setOpenPopUpModal((prev) => ({
      ...prev,
      loadingModal: true,
    }));
    const url = "https://api.openai.com/v1/edits";
    const APIKey = "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";
    const requestData = {
      model: "text-davinci-edit-001",
      input: `${textInputData.text}`,
      instruction: "Check for grammatical and spelling errors",
      temperature: 0.2,
    };

    setTimeout(() => {
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${APIKey}`,
        },
        body: JSON.stringify(requestData),
      })
        .then((response) => response.json())
        .then((data) => {
          setTextInputData((prev) => ({
            ...prev,
            text: data.choices[0].text,
          }));
        })

        .catch((error) => {
          console.log(error);
        });

      setOpenPopUpModal((prev) => ({
        ...prev,
        loadingModal: false,
      }));
    }, [2000]);
  };

  const handleCopyBtn = (event) => {
    const textArea = document.getElementById("text-area");

    if (textArea) {
      textArea.select();
      document.execCommand("copy");
    }
    setCopyBtnClicked(true);

    setTimeout(() => {
      setCopyBtnClicked(false);
    }, [2000]);
  };

  return (
    <div className="container">
      <h1>Texterly</h1>
      <h3>World's best grammer and spell checker</h3>
      <p className="AI-sub-text">Powered by AI</p>
      <div>
        <textarea
          id="text-area"
          onChange={handleTextAreaInput}
          value={textInputData.text}
          placeholder="Paste your text here"
        ></textarea>

        <div className="character-word-count-container">
          <button onClick={handleAPIRequest} className="process-btn">
            Process
          </button>
          <div className="character-word-count-first-row character-word-count">
            <p className="top-line-text">
              Characters
              <span className="midline-text">without space</span>
            </p>
            <p className="bottom-line-text">
              {textInputData.charactersWithoutSpace}
            </p>
          </div>
          <div className="character-word-count-first-row character-word-count">
            <p className="top-line-text">Words</p>
            <p>{textInputData.wordCount}</p>
          </div>
        </div>

        <div className="character-word-count-container">
          <div className="character-word-count-second-row character-word-count">
            <p className="top-line-text">
              Characters
              <span className="midline-text">with space</span>
            </p>
            <p className="bottom-line-text">
              {textInputData.charactersWithSpace}
            </p>
          </div>
          <div className="character-word-count-second-row character-word-count">
            <p className="top-line-text">Sentences</p>
            <p>{textInputData.sentenceCount}</p>
          </div>
          <div className="character-word-count-second-row character-word-count">
            <p className="top-line-text">Paragraphs</p>
            <p>{textInputData.paragraphCount}</p>
          </div>
          <div className="character-word-count-second-row character-word-count">
            <p className="top-line-text">Pages</p>
            <p>{textInputData.pageCount}</p>
          </div>
        </div>
      </div>
      {/*********************************Popup Modal JSX***************************/}
      <div
        style={
          openPopUpModal.loadingModal ? popupModalStyles : { display: "none" }
        }
        className="loading-popup-modal"
      >
        <img
          className="loading-popup-modal-img"
          src={SpinnerImg}
          alt="spinner image"
        />
      </div>

      <div
        style={
          openPopUpModal.copyBtnModal ? popupModalStyles : { display: "none" }
        }
        className="popup-copy-btn-container"
      >
        <button
          onClick={(event) => handleCopyBtn(event)}
          className="popup-copy-btn"
        >
          <img
            className="copy-btn-clipboard-img"
            src={clipboardImg}
            alt="clipboard image"
          />
          <p className="copy-btn-text">{copyBtnClicked ? "Copied" : "Copy"}</p>
        </button>
      </div>
    </div>
  );
}
