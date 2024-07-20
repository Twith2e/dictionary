const searchInput = document.getElementById("searchinput");
const searchBtn = document.getElementById("searchbtn");
const searchResult = document.getElementById("searchresult");
const fontsBtn = document.getElementById("fonts");
const toggleBtn = document.getElementById("toggle");
let check = false;

searchBtn.addEventListener("click", () => {
  if (searchInput.value !== "") {
    let word = searchInput.value;

    checkApi(word);
  } else {
    alert("not happening");
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
      let meaningsWrapper = document.createElement("div");
      let header = document.createElement("h1");
      let paragraph = document.createElement("p");
      let audioBtn = document.createElement("button");
      let playAudio = document.createElement("audio");
      let source = document.createElement("source");
      let playIcon = document.createElement("img");

      headParagWrapper.appendChild(header);
      headParagWrapper.appendChild(paragraph);
      wordWrapper.appendChild(headParagWrapper);
      wordWrapper.appendChild(audioBtn);

      wordWrapper.className = "word-phonetic-wrapper";
      meaningsWrapper.className = "meanings-wrapper";
      headParagWrapper.className = "header-wrapper";

      header.appendChild(document.createTextNode(element.word));
      element.phonetics.forEach((phonetic) => {
        if (phonetic.audio) {
          paragraph.textContent = phonetic.text;
          source.src = phonetic.audio;
        }
      });
      paragraph.style.color = "#ab76d2";
      paragraph.style.fontSize = "24px";
      paragraph.style.fontWeight = "700";
      header.style.fontSize = "48px";
      playIcon.src = "images/icons8-play-24.png";
      audioBtn.appendChild(playIcon);
      source.type = "audio/mpeg";
      playAudio.controls = true;
      playAudio.appendChild(source);
      audioBtn.appendChild(playAudio);
      audioBtn.id = "playBtn";
      searchResult.appendChild(wordWrapper);
      searchResult.appendChild(meaningsWrapper);

      element.meanings.forEach((meaning) => {
        let partOfSpeech = document.createElement("h4");
        partOfSpeech.textContent = meaning.partOfSpeech;
        meaningsWrapper.appendChild(partOfSpeech);

        let title = document.createElement("h4");
        title.textContent = "Meaning";
        meaningsWrapper.appendChild(title);

        let ul = document.createElement("ul");
        meaningsWrapper.appendChild(ul);

        if (meaning.synonyms.length > 0) {
          let synonymWrapper = document.createElement("div");
          let synonymTitle = document.createElement("span");
          synonymTitle.className = "synonym-head";
          synonymWrapper.appendChild(synonymTitle);
          let synonymArray = [];
          meaning.synonyms.forEach((syn) => {
            synonymTitle.textContent = "Synonyms";
            synonymArray.push(syn);
          });
          let synonym = document.createElement("span");
          synonym.textContent = synonymArray.join(", ");
          synonym.style.color = "#ab76d2";
          synonym.style.fontWeight = "700";
          synonymWrapper.appendChild(synonym);
          meaningsWrapper.appendChild(synonymWrapper);
          synonymWrapper.className = "synonym-wrapper";
        }

        meaning.definitions.forEach((definition) => {
          let li = document.createElement("li");
          li.textContent = definition.definition;
          ul.appendChild(li);
        });
      });

      if (element.sourceUrls.length > 0) {
        let footerWrapper = document.createElement("div");
        footerWrapper.className = "source-link-wrapper";
        let footerTitle = document.createElement("span");
        let footer = document.createElement("a");
        footerWrapper.appendChild(footerTitle);
        footerWrapper.appendChild(footer);
        element.sourceUrls.forEach((url) => {
          footerTitle.textContent = "Source";
          footer.textContent = url;
          footer.href = url;
        });
        meaningsWrapper.appendChild(footerWrapper);
      }

      console.log(response);
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
