/* globals lottie, React */
/* eslint-disable no-unused-vars */
// For some reason, eslint is not detecting that <Variable /> means that Variable is used

this.popupView = (function() {
  const exports = {};

  const { Component, useState, useEffect, PureComponent } = React;

  exports.Popup = ({
    currentView,
    suggestions,
    feedback,
    lastIntent,
    transcript,
    displayText,
    errorMessage,
    displayAutoplay,
    searchResult,
    cardImage,
    recorderVolume,
    showSettings,
    submitTextInput,
    onClickLexicon,
    onSearchImageClick,
    onInputStarted,
    onSubmitFeedback,
    setMinPopupSize,
  }) => {
    const [inputValue, setInputValue] = useState(null);
    function savingOnInputStarted(value) {
      // When the user types in the hidden field, we need to keep that
      // first input and use it later
      setInputValue(value);
      onInputStarted();
    }
    return (
      <div id="popup" className={currentView}>
        <PopupHeader currentView={currentView} transcript={transcript} />
        <PopupContent
          currentView={currentView}
          suggestions={suggestions}
          feedback={feedback}
          lastIntent={lastIntent}
          transcript={transcript}
          displayText={displayText}
          errorMessage={errorMessage}
          displayAutoplay={displayAutoplay}
          searchResult={searchResult}
          cardImage={cardImage}
          recorderVolume={recorderVolume}
          submitTextInput={submitTextInput}
          inputValue={inputValue}
          onClickLexicon={onClickLexicon}
          onSearchImageClick={onSearchImageClick}
          onInputStarted={savingOnInputStarted}
          onSubmitFeedback={onSubmitFeedback}
          setMinPopupSize={setMinPopupSize}
        />
        <PopupFooter currentView={currentView} showSettings={showSettings} />
      </div>
    );
  };

  const PopupHeader = ({ currentView, transcript }) => {
    const getTitle = () => {
      switch (currentView) {
        case "processing":
          return "One second...";
        case "success":
          return "Got it!";
        case "error":
          return "Sorry, there was an issue";
        case "typing":
          return "Type your request";
        case "searchResults":
          return transcript;
        case "feedback":
          // FIXME: should be more dynamic, based on last intent:
          return "What went wrong?";
        case "feedbackThanks":
          return "";
        case "listening":
        default:
          return "Listening";
      }
    };

    const onClickGoBack = () => {
      location.href = `${location.pathname}?${Date.now()}`;
    };

    const onClickClose = () => {
      window.close();
    };

    const hiddenClass =
      currentView === "error" ||
      currentView === "searchResults" ||
      currentView === "typing" ||
      currentView === "feedback" ||
      currentView === "feedbackThanks"
        ? ""
        : "hidden";

    return (
      <div id="popup-header">
        <div id="left-icon" className={hiddenClass} onClick={onClickGoBack}>
          <svg
            id="back-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            role="button"
            aria-label="Back"
          >
            <path
              fill="context-fill"
              d="M6.414 8l4.293-4.293a1 1 0 0 0-1.414-1.414l-5 5a1 1 0 0 0 0 1.414l5 5a1 1 0 0 0 1.414-1.414z"
            ></path>
          </svg>
        </div>
        <div id="header-title">{getTitle()}</div>
        <div
          id="close-icon"
          role="button"
          aria-label="Close"
          onClick={onClickClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
          >
            <path
              fill="context-fill"
              d="M9.061 8l3.47-3.47a.75.75 0 0 0-1.061-1.06L8 6.939 4.53 3.47a.75.75 0 1 0-1.06 1.06L6.939 8 3.47 11.47a.75.75 0 1 0 1.06 1.06L8 9.061l3.47 3.47a.75.75 0 0 0 1.06-1.061z"
            ></path>
          </svg>
        </div>
      </div>
    );
  };

  const PopupContent = ({
    currentView,
    suggestions,
    feedback,
    lastIntent,
    transcript,
    displayText,
    errorMessage,
    displayAutoplay,
    searchResult,
    cardImage,
    recorderVolume,
    submitTextInput,
    inputValue,
    onClickLexicon,
    onSearchImageClick,
    onInputStarted,
    onSubmitFeedback,
    setMinPopupSize,
  }) => {
    const getContent = () => {
      switch (currentView) {
        case "listening":
          return (
            <ListeningContent
              displayText={displayText}
              suggestions={suggestions}
              lastIntent={lastIntent}
              onClickLexicon={onClickLexicon}
              onInputStarted={onInputStarted}
              onSubmitFeedback={onSubmitFeedback}
            />
          );
        case "typing":
          return (
            <TypingContent
              displayText={displayText}
              submitTextInput={submitTextInput}
              inputValue={inputValue}
            />
          );
        case "processing":
          return (
            <ProcessingContent
              transcript={transcript}
              displayText={displayText}
            />
          );
        case "success":
          return (
            <SuccessContent transcript={transcript} displayText={displayText} />
          );
        case "error":
          return (
            <ErrorContent
              displayText={displayText}
              errorMessage={errorMessage}
              displayAutoplay={displayAutoplay}
            />
          );
        case "searchResults":
          return (
            <SearchResultsContent
              search={searchResult}
              cardImage={cardImage}
              displayText={displayText}
              onSearchImageClick={onSearchImageClick}
              setMinPopupSize={setMinPopupSize}
            />
          );
        case "feedback":
          return (
            <Feedback
              lastIntent={lastIntent}
              feedback={feedback}
              onSubmitFeedback={onSubmitFeedback}
            />
          );
        case "feedbackThanks":
          return <FeedbackThanks />;
        default:
          return null;
      }
    };

    return (
      <div id="popup-content">
        <Zap currentView={currentView} recorderVolume={recorderVolume} />
        {getContent()}
      </div>
    );
  };

  const Feedback = ({ lastIntent, feedback, onSubmitFeedback }) => {
    const textarea = React.createRef();
    function onSubmit() {
      const text = textarea.current.value;
      onSubmitFeedback({ rating: feedback.rating, feedback: text });
    }
    useEffect(() => {
      textarea.current.focus();
    });
    return (
      <div>
        <h1>☹</h1>
        <form onSubmit={onSubmit} className="feedback-form">
          <div>
            <textarea ref={textarea} autofocus="1"></textarea>
          </div>
          <div className="feedback-controls">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    );
  };

  const FeedbackThanks = () => {
    return (
      <div className="feedback-thanks">
        <h2>Thanks for your feedback</h2>
      </div>
    );
  };

  const PopupFooter = ({ currentView, showSettings }) => {
    if (currentView === "searchResults") return null;
    return (
      <div id="popup-footer">
        <div
          id="settings-icon"
          role="button"
          aria-label="Settings"
          onClick={showSettings}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
          >
            <path
              fill="context-fill"
              d="M15 7h-2.1a4.967 4.967 0 0 0-.732-1.753l1.49-1.49a1 1 0 0 0-1.414-1.414l-1.49 1.49A4.968 4.968 0 0 0 9 3.1V1a1 1 0 0 0-2 0v2.1a4.968 4.968 0 0 0-1.753.732l-1.49-1.49a1 1 0 0 0-1.414 1.415l1.49 1.49A4.967 4.967 0 0 0 3.1 7H1a1 1 0 0 0 0 2h2.1a4.968 4.968 0 0 0 .737 1.763c-.014.013-.032.017-.045.03l-1.45 1.45a1 1 0 1 0 1.414 1.414l1.45-1.45c.013-.013.018-.031.03-.045A4.968 4.968 0 0 0 7 12.9V15a1 1 0 0 0 2 0v-2.1a4.968 4.968 0 0 0 1.753-.732l1.49 1.49a1 1 0 0 0 1.414-1.414l-1.49-1.49A4.967 4.967 0 0 0 12.9 9H15a1 1 0 0 0 0-2zM5 8a3 3 0 1 1 3 3 3 3 0 0 1-3-3z"
            ></path>
          </svg>
        </div>
        <div id="moz-voice-privacy">
          <a
            href="https://firefox-voice-feedback.herokuapp.com/"
            target="_blank"
            rel="noopener"
          >
            Feedback?
          </a>
        </div>
        <div></div>
      </div>
    );
  };

  const ListeningContent = ({
    displayText,
    suggestions,
    lastIntent,
    onClickLexicon,
    onInputStarted,
    onSubmitFeedback,
  }) => {
    return (
      <React.Fragment>
        <TextDisplay displayText={displayText} />
        <VoiceInput suggestions={suggestions} onClickLexicon={onClickLexicon} />
        <TypingInput onInputStarted={onInputStarted} />
        {lastIntent ? (
          <IntentFeedback
            lastIntent={lastIntent}
            onSubmitFeedback={onSubmitFeedback}
          />
        ) : null}
      </React.Fragment>
    );
  };

  const TypingContent = ({ displayText, submitTextInput, inputValue }) => {
    return (
      <React.Fragment>
        <TextDisplay displayText={displayText} />
        <TypingInput
          submitTextInput={submitTextInput}
          inputValue={inputValue}
        />
      </React.Fragment>
    );
  };

  const VoiceInput = ({ suggestions, onClickLexicon }) => {
    const onMoreSuggestions = event => {
      if (event) {
        event.preventDefault();
        onClickLexicon(event);
      }
    };
    return (
      <div id="voice-input">
        {suggestions ? (
          <div id="suggestions">
            <p id="prompt">You can say things like:</p>
            <div id="suggestions-list">
              {suggestions.map(suggestion => (
                <p className="suggestion" key={suggestion}>
                  {suggestion}
                </p>
              ))}
            </div>
            <div>
              <a
                target="_blank"
                rel="noopener"
                id="lexicon"
                href="../views/lexicon.html"
                onClick={onMoreSuggestions}
              >
                More things you can say
              </a>
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  const IntentFeedback = ({ lastIntent, onSubmitFeedback }) => {
    let ago = Math.max(
      1,
      Math.round((Date.now() - lastIntent.timestamp) / 60000)
    );
    if (ago > 60) {
      ago = `${Math.round(ago / 60)} hours`;
    } else {
      ago = `${ago} mins`;
    }
    function onPositive() {
      onSubmitFeedback({ rating: 1, feedback: null });
    }
    function onNegative() {
      onSubmitFeedback({ rating: -1, feedback: null });
    }
    return (
      <div id="intent-feedback">
        <div>How was your last experience?</div>
        <div className="feedback-utterance">
          {lastIntent.utterance}({ago} mins ago)
        </div>
        <div className="feedback-controls">
          <button onClick={onPositive}>☺</button>
          <button onClick={onNegative}>☹</button>
        </div>
      </div>
    );
  };

  class TypingInput extends PureComponent {
    constructor(props) {
      super(props);

      this.textInputRef = React.createRef();
      this.value = this.props.inputValue || null;
    }

    componentDidMount() {
      this.focusText();
      if (this.textInputRef.current) {
        this.textInputRef.current.addEventListener("blur", this.focusText);
      }
    }

    focusText = () => {
      if (this.textInputRef.current) {
        setTimeout(() => {
          this.textInputRef.current.focus();
        }, 0);
      }
    };

    onInputKeyPress = event => {
      if (event.key === "Enter") {
        this.submitTextInput();
      }
    };

    onInputTextChange = event => {
      this.value = event.target.value;
      if (this.value && this.props.onInputStarted) {
        this.props.onInputStarted(this.value);
      }
    };

    submitTextInput = async () => {
      const text = this.value;
      if (text) {
        this.props.submitTextInput(text);
      }
    };

    render() {
      return (
        <div id="text-input">
          <input
            type="text"
            id="text-input-field"
            autoFocus="true"
            onKeyPress={this.onInputKeyPress}
            onChange={this.onInputTextChange}
            defaultValue={this.value}
            ref={this.textInputRef}
          />
          <div id="send-btn-wrapper">
            <button id="send-text-input" onClick={this.submitTextInput}>
              GO
            </button>
          </div>
        </div>
      );
    }
  }

  const ProcessingContent = ({ transcript, displayText }) => {
    return (
      <React.Fragment>
        <Transcript transcript={transcript} />
        <TextDisplay displayText={displayText} />
      </React.Fragment>
    );
  };

  const SuccessContent = ({ transcript, displayText }) => {
    return (
      <React.Fragment>
        <Transcript transcript={transcript} />
        <TextDisplay displayText={displayText} />
      </React.Fragment>
    );
  };

  const ErrorContent = ({ displayText, errorMessage, displayAutoplay }) => {
    return (
      <div>
        <TextDisplay displayText={displayText} />
        {errorMessage ? <div id="error-message">{errorMessage}</div> : null}
        {displayAutoplay ? (
          <div id="error-autoplay">
            <img
              src="images/autoplay-instruction.png"
              alt="To enable autoplay, open the site preferences and select Allow Audio and Video"
            />
          </div>
        ) : null}
      </div>
    );
  };

  const SearchResultsContent = ({
    search,
    cardImage,
    displayText,
    onSearchImageClick,
    setMinPopupSize,
  }) => {
    if (!search) return null;

    const { searchResults, index, searchUrl } = search;
    const card = cardImage;
    const next = searchResults[index + 1];
    const cardStyles = card ? { height: card.height, width: card.width } : {};
    const imgAlt =
      card && card.alt
        ? `Click to show search results: ${card.alt}`
        : "Show search results";

    if (card) {
      setMinPopupSize(card.width);
    }

    const onSearchCardClick = () => {
      onSearchImageClick(searchUrl);
    };

    return (
      <React.Fragment>
        <TextDisplay displayText={displayText} />
        <div id="search-results">
          {card ? (
            <img
              id="search-image"
              alt={imgAlt}
              onClick={onSearchCardClick}
              style={cardStyles}
              src={card.src}
              role="button"
            />
          ) : null}
        </div>
        {next ? (
          <div id="search-show-next">
            <p>
              <strong>
                Click mic and say <i>next</i> to view
              </strong>
            </p>
            <p id="search-show-next-description">
              {new URL(next.url).hostname} | {next.title}
            </p>
          </div>
        ) : null}
      </React.Fragment>
    );
  };

  const Transcript = ({ transcript }) => {
    return transcript ? <div id="transcript">{transcript}</div> : null;
  };

  const TextDisplay = ({ displayText }) => {
    return displayText ? <div id="text-display">{displayText}</div> : null;
  };

  class Zap extends Component {
    constructor(props) {
      super(props);

      this.animation = null;

      this.animationSegmentTimes = {
        reveal: [0, 14],
        base: [14, 30],
        low: [30, 46],
        medium: [46, 62],
        high: [62, 78],
        processing: [78, 134],
        error: [134, 153],
        success: [184, 203],
      };

      this.animationConfig = {
        listening: {
          segments: [
            this.animationSegmentTimes.reveal,
            this.animationSegmentTimes.base,
          ],
          loop: true,
          interrupt: true,
        },
        processing: {
          segments: [this.animationSegmentTimes.processing],
          loop: false,
          interrupt: false,
        },
        success: {
          segments: [this.animationSegmentTimes.success],
          loop: false,
          interrupt: false,
        },
        error: {
          segments: [this.animationSegmentTimes.error],
          loop: false,
          interrupt: false,
        },
      };
    }

    componentDidMount() {
      this.loadAnimation();
    }

    componentDidUpdate() {
      const config = this.animationConfig[this.props.currentView];

      if (config) {
        this.playAnimation(config.segments, config.interrupt, config.loop);

        if (
          this.props.currentView === "listening" &&
          this.props.recorderVolume
        ) {
          this.setAnimationForVolume(this.props.recorderVolume);
        }
      }
    }

    loadAnimation = async () => {
      this.animation = await lottie.loadAnimation({
        container: document.getElementById("zap"), // the dom element that will contain the animation
        loop: false,
        renderer: "svg",
        autoplay: false,
        path: "animations/Firefox_Voice_Full.json", // the path to the animation json
      });
    };

    playAnimation = (segments, interrupt, loop) => {
      if (this.animation) {
        this.animation.loop = loop;
        this.animation.playSegments(segments, interrupt);
      }
    };

    setAnimationForVolume = avgVolume => {
      // this.animation.onLoopComplete = function() {
      if (avgVolume < 0.1) {
        this.playAnimation(this.animationSegmentTimes.base, true, true);
      } else if (avgVolume < 0.15) {
        this.playAnimation(this.animationSegmentTimes.low, true, true);
      } else if (avgVolume < 0.2) {
        this.playAnimation(this.animationSegmentTimes.medium, true, true);
      } else {
        this.playAnimation(this.animationSegmentTimes.high, true, true);
      }
      // };
    };

    render() {
      return this.props.currentView !== "typing" &&
        this.props.currentView !== "feedback" &&
        this.props.currentView !== "feedbackThanks" ? (
        <div id="zap-wrapper">
          <div id="zap"></div>
        </div>
      ) : null;
    }
  }

  return exports;
})();