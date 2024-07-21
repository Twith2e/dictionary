const searchInput = document.getElementById("searchinput");
const searchBtn = document.getElementById("searchbtn");
const searchResult = document.getElementById("searchresult");
const fontsBtn = document.getElementById("fonts");
const toggleBtn = document.getElementById("toggle");
let meaningsWrapper = document.createElement("div");
let meaningsByPartOfSpeech = {};

if (!isMobileDevice()) {
  searchInput.focus();
}

searchBtn.addEventListener("click", () => {
  if (searchInput.value !== "") {
    let word = searchInput.value;

    checkApi(word);
  } else {
    alert("no word in the input field");
  }
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    if (searchInput.value !== "") {
      let word = searchInput.value;

      checkApi(word);
    } else {
      alert("no word in the input field");
    }
  }
});

async function checkApi(word) {
  const URI = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

  try {
    const data = await fetch(URI);
    const response = await data.json();
    response.forEach((element) => {
      searchResult.innerHTML = "";
      let wordWrapper = document.createElement("div");
      let headParagWrapper = document.createElement("div");
      let header = document.createElement("h1");
      let paragraph = document.createElement("p");
      let audioBtn = document.createElement("button");
      let playAudio = document.createElement("audio");
      let source = document.createElement("source");
      let playIcon = document.createElement("img");

      headParagWrapper.append(header);
      headParagWrapper.append(paragraph);
      wordWrapper.append(headParagWrapper);
      wordWrapper.append(audioBtn);

      wordWrapper.className = "word-phonetic-wrapper";
      meaningsWrapper.className = "meanings-wrapper";
      headParagWrapper.className = "header-wrapper";

      header.append(document.createTextNode(element.word));
      element.phonetics.forEach((phonetic) => {
        if (phonetic.audio) {
          paragraph.textContent = phonetic.text;
          source.src = phonetic.audio;
        }
      });
      paragraph.style.color = "#ab76d2";
      paragraph.style.fontSize = "24px";
      paragraph.style.fontWeight = "700";
      playIcon.src = "images/icons8-play-24.png";
      audioBtn.append(playIcon);
      source.type = "audio/mpeg";
      playAudio.controls = true;
      playAudio.append(source);
      audioBtn.append(playAudio);
      audioBtn.id = "playBtn";
      searchResult.append(wordWrapper);
      searchResult.append(meaningsWrapper);

      element.meanings.forEach((meaning) => {
        if (!meaningsByPartOfSpeech[meaning.partOfSpeech]) {
          meaningsByPartOfSpeech[meaning.partOfSpeech] = [];
        }
        meaningsByPartOfSpeech[meaning.partOfSpeech].push(meaning);
      });
      for (let meaning in meaningsByPartOfSpeech) {
        if (meaning.length > 1) {
          let partOfSpeech = document.createElement("h4");
          partOfSpeech.textContent = meaning;
          meaningsWrapper.append(partOfSpeech);
        }

        let title = document.createElement("h4");
        title.textContent = "Meaning";
        meaningsWrapper.append(title);

        let ul = document.createElement("ul");
        meaningsWrapper.append(ul);

        meaningsByPartOfSpeech[meaning].forEach((meaning) => {
          if (meaning.antonyms.length > 0) {
            let antonymWrapper = document.createElement("div");
            antonymWrapper.className = "synonym-wrapper";
            let antonymTitle = document.createElement("span");
            antonymTitle.className = "synonym-head";
            antonymTitle.textContent = "Antonyms";
            antonymWrapper.append(antonymTitle);

            let antonymArray = [];
            meaning.antonyms.forEach((ant) => {
              antonymArray.push(ant);
            });

            let antonym = document.createElement("span");
            antonym.textContent = antonymArray.join(", ");
            antonym.style.color = "#ab76d2";
            antonym.style.fontWeight = "700";
            antonymWrapper.append(antonym);
            meaningsWrapper.append(antonymWrapper);
          }

          if (meaning.synonyms.length > 0) {
            let synonymWrapper = document.createElement("div");
            synonymWrapper.className = "synonym-wrapper";
            let synonymTitle = document.createElement("span");
            synonymTitle.className = "synonym-head";
            synonymTitle.textContent = "Synonyms";
            synonymWrapper.append(synonymTitle);

            let synonymArray = [];
            meaning.synonyms.forEach((syn) => {
              synonymArray.push(syn);
            });

            let synonym = document.createElement("span");
            synonym.textContent = synonymArray.join(", ");
            synonym.style.color = "#ab76d2";
            synonym.style.fontWeight = "700";
            synonymWrapper.append(synonym);
            meaningsWrapper.append(synonymWrapper);
          }

          meaning.definitions.forEach((definition) => {
            let li = document.createElement("li");
            li.textContent = definition.definition;
            ul.append(li);

            if (definition.example) {
              let example = document.createElement("span");
              example.textContent = `"${definition.example}"`;
              ul.append(example);
            }
          });
        });
      }

      console.log(response);

      // console.log(response);
      playBtn.addEventListener("click", () => {
        if (playAudio.paused) {
          playAudio.play();
          this.textContent = "Pause";
        } else {
          playAudio.pause();
          this.textContent = "Play";
        }
      });
    });
    if (response[0].sourceUrls.length > 0) {
      let footerWrapper = document.createElement("div");
      footerWrapper.className = "source-link-wrapper";
      let footerTitle = document.createElement("span");
      let footer = document.createElement("a");
      footerWrapper.append(footerTitle);
      footerWrapper.append(footer);
      footerTitle.textContent = "Source";
      footer.textContent = response[0].sourceUrls[0];
      footer.href = response[0].sourceUrls[0];
      footer.target = "_blank";
      footer.rel = "noopener noreferrer";
      meaningsWrapper.append(footerWrapper);
    }

    console.log(meaningsByPartOfSpeech);
  } catch (error) {
    console.log(error);
  }
}

fontsBtn.addEventListener("change", () => {
  if (fontsBtn.value === "Serif") {
    document.body.style.fontFamily = "serif";
  } else if (fontsBtn.value === "Poppins") {
    document.body.style.fontFamily = "Poppins";
  } else if (fontsBtn.value === "Roboto") {
    document.body.style.fontFamily = "Roboto";
  } else {
    document.body.style.fontFamily = "sans-serif";
  }
});

toggleBtn.addEventListener("click", () => {
  document.body.style.transition = "all 0.5s ease, color 0.5s ease;";
  if (checkBox.checked === true) {
    document.body.style.backgroundColor = "#000";
    document.body.style.color = "#fff";
    playBtn.style.backgroundColor = "#ab76d290";
  } else {
    document.body.style.backgroundColor = "#fff";
    document.body.style.color = "#000";
  }
});

function checkSystemTheme() {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    checkBox.checked = true;
    document.body.style.backgroundColor = "#000";
    document.body.style.color = "#fff";
    playBtn.style.backgroundColor = "#ab76d290";
  } else {
    checkBox.checked = false;
    document.body.style.backgroundColor = "#fff";
    document.body.style.color = "#000";
  }
}

checkSystemTheme();

function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}
