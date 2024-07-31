const searchInput = document.getElementById("searchinput");
const searchBtn = document.getElementById("searchbtn");
const searchResult = document.getElementById("searchresult");
const fontsBtn = document.getElementById("fonts");
const toggleBtn = document.getElementById("toggle");
const clearInput = document.getElementById("clearInput");

if (!isMobileDevice()) {
  searchInput.focus();
}

searchBtn.addEventListener("click", () => {
  clearInput.style.display = "none";
  if (searchInput.value !== "") {
    let word = searchInput.value;
    checkApi(word);
    searchInput.value = "";
  } else {
    alert("No word in the input field");
  }
});

searchInput.addEventListener("keydown", (e) => {
  clearInput.style.display = "none";
  if (e.key === "Enter") {
    e.preventDefault();
    if (searchInput.value !== "") {
      let word = searchInput.value;
      checkApi(word);
      searchInput.value = "";
    } else {
      alert("No word in the input field");
    }
  }
});

async function checkApi(word) {
  const URI = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  try {
    const data = await fetch(URI);
    const response = await data.json();

    searchResult.innerHTML = "";
    let meaningsWrapper = document.createElement("div");
    meaningsWrapper.className = "meanings-wrapper";
    let meaningsByPartOfSpeech = {};

    if (response.length > 0) {
      let element = response[0];

      let wordWrapper = document.createElement("div");
      let headParagWrapper = document.createElement("div");
      let header = document.createElement("h1");
      let paragraph = document.createElement("p");

      headParagWrapper.append(header);
      headParagWrapper.append(paragraph);
      wordWrapper.append(headParagWrapper);

      wordWrapper.className = "word-phonetic-wrapper";
      headParagWrapper.className = "header-wrapper";

      header.append(document.createTextNode(element.word));
      paragraph.style.color = "#ab76d2";
      paragraph.style.fontSize = "24px";
      paragraph.style.fontWeight = "700";

      searchResult.append(wordWrapper);
      searchResult.append(meaningsWrapper);

      // Create a dropdown menu to select phonetics
      let phoneticSelect = document.createElement("select");
      let phoneticsWithAudio = element.phonetics.filter(
        (phonetic) => phonetic.audio
      );

      phoneticsWithAudio.forEach((phonetic, index) => {
        let option = document.createElement("option");
        option.value = index;
        option.textContent = phonetic.text || `Phonetic ${index + 1}`;
        phoneticSelect.appendChild(option);
      });
      if (phoneticsWithAudio.length > 0) {
        headParagWrapper.append(phoneticSelect);
      }

      let audioBtn = document.createElement("button");
      let playAudio = document.createElement("audio");
      let source = document.createElement("source");
      let playIcon = document.createElement("img");
      playIcon.src = "images/icons8-play-24.png";
      audioBtn.append(playIcon);
      playAudio.controls = true;
      playAudio.append(source);
      audioBtn.append(playAudio);
      audioBtn.id = "playBtn";

      wordWrapper.append(audioBtn);

      function updateAudio(phonetic) {
        paragraph.textContent = phonetic.text;
        source.src = phonetic.audio;
      }

      if (phoneticsWithAudio.length > 0) {
        updateAudio(phoneticsWithAudio[0]);
      }

      phoneticSelect.addEventListener("change", () => {
        updateAudio(phoneticsWithAudio[phoneticSelect.value]);
      });

      audioBtn.addEventListener("click", () => {
        if (playAudio.paused) {
          playAudio.play();
        } else {
          playAudio.pause();
        }
      });

      element.meanings.forEach((meaning) => {
        if (!meaningsByPartOfSpeech[meaning.partOfSpeech]) {
          meaningsByPartOfSpeech[meaning.partOfSpeech] = [];
        }
        meaningsByPartOfSpeech[meaning.partOfSpeech].push(meaning);
      });

      for (let partOfSpeech in meaningsByPartOfSpeech) {
        let partOfSpeechElement = document.createElement("h4");
        partOfSpeechElement.textContent = partOfSpeech;
        meaningsWrapper.appendChild(partOfSpeechElement);

        let title = document.createElement("h4");
        title.textContent = "Meaning";
        meaningsWrapper.appendChild(title);

        let ul = document.createElement("ul");
        meaningsWrapper.appendChild(ul);

        meaningsByPartOfSpeech[partOfSpeech].forEach((meaning) => {
          if (meaning.antonyms.length > 0) {
            let antonymWrapper = document.createElement("div");
            antonymWrapper.className = "antonym-wrapper";
            let antonymTitle = document.createElement("span");
            antonymTitle.className = "antonym-head";
            antonymTitle.textContent = "Antonyms";
            antonymWrapper.appendChild(antonymTitle);

            let antonymArray = [];
            meaning.antonyms.forEach((ant) => {
              antonymArray.push(ant);
            });

            let antonym = document.createElement("span");
            antonym.textContent = antonymArray.join(", ");
            antonym.style.color = "#ab76d2";
            antonym.style.fontWeight = "700";
            antonymWrapper.appendChild(antonym);
            meaningsWrapper.appendChild(antonymWrapper);
          }

          if (meaning.synonyms.length > 0) {
            let synonymWrapper = document.createElement("div");
            synonymWrapper.className = "synonym-wrapper";
            let synonymTitle = document.createElement("span");
            synonymTitle.className = "synonym-head";
            synonymTitle.textContent = "Synonyms";
            synonymWrapper.appendChild(synonymTitle);

            let synonymArray = [];
            meaning.synonyms.forEach((syn) => {
              synonymArray.push(syn);
            });

            let synonym = document.createElement("span");
            synonym.textContent = synonymArray.join(", ");
            synonym.style.color = "#ab76d2";
            synonym.style.fontWeight = "700";
            synonymWrapper.appendChild(synonym);
            meaningsWrapper.appendChild(synonymWrapper);
          }

          meaning.definitions.forEach((definition) => {
            let li = document.createElement("li");
            li.textContent = definition.definition;
            ul.appendChild(li);

            if (definition.example) {
              let example = document.createElement("span");
              example.textContent = `"${definition.example}"`;
              ul.appendChild(example);
            }
          });
        });
      }

      if (element.sourceUrls.length > 0) {
        let footerWrapper = document.createElement("div");
        footerWrapper.className = "source-link-wrapper";
        let footerTitle = document.createElement("span");
        let footer = document.createElement("a");
        footerWrapper.append(footerTitle);
        footerWrapper.append(footer);
        footerTitle.textContent = "Source";
        footer.textContent = element.sourceUrls[0];
        footer.href = element.sourceUrls[0];
        footer.target = "_blank";
        footer.rel = "noopener noreferrer";
        meaningsWrapper.append(footerWrapper);
      }
    } else {
      searchResult.innerHTML = "";
      let errorWrapper = document.createElement("div");
      let errorMsg = document.createElement("p");
      errorMsg.textContent = response.message;
      errorWrapper.appendChild(errorMsg);
      errorWrapper.className = "error";
      searchResult.appendChild(errorWrapper);
      searchResult.style.height = "80%";
      document.querySelector(".error").style.alignSelf = "center";
      document.querySelector(".error").style.justifySelf = "center";
    }
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

clearInput.addEventListener("click", () => {
  searchInput.value = "";
});

searchInput.addEventListener("input", () => {
  searchInput.value !== ""
    ? (clearInput.style.display = "block")
    : (clearInput.style.display = "none");
});
