const searchInput = document.getElementById("searchinput");
const searchBtn = document.getElementById("searchbtn");
const searchResult = document.getElementById("searchresult");

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

      headParagWrapper.appendChild(header);
      headParagWrapper.appendChild(paragraph);
      wordWrapper.appendChild(headParagWrapper);
      wordWrapper.appendChild(audioBtn);

      header.appendChild(document.createTextNode(element.word));
      element.phonetics.forEach((phonetic) => {
        if (phonetic.audio) {
          paragraph.textContent = phonetic.text;
          source.src = phonetic.audio;
        }
      });
      source.type = "audio/mpeg";
      playAudio.controls = true;
      playAudio.appendChild(source);
      audioBtn.appendChild(playAudio);
      audioBtn.textContent = "Play";
      audioBtn.id = "playBtn";
      searchResult.appendChild(wordWrapper);
      searchResult.appendChild(meaningsWrapper);

      let title = document.createElement("h4");
      title.textContent = "Meaning";
      meaningsWrapper.appendChild(title);
      element.meanings.forEach((meaning) => {
        // Create and append the partOfSpeech header
        let partOfSpeech = document.createElement("h4");
        partOfSpeech.textContent = meaning.partOfSpeech;
        meaningsWrapper.appendChild(partOfSpeech);

        let ul = document.createElement("ul");
        meaningsWrapper.appendChild(ul);

        if (meaning.synonyms.length > 0) {
          let synonymWrapper = document.createElement("div");
          let synonymTitle = document.createElement("span");
          synonymWrapper.appendChild(synonymTitle);
          let synonymArray = [];
          meaning.synonyms.forEach((syn) => {
            synonymTitle.textContent = "Synonym: ";
            synonymArray.push(syn);
          });
          console.log(synonymArray);
          let synonym = document.createElement("span");
          synonym.textContent = synonymArray.join(", ");
          synonymWrapper.appendChild(synonym);
          meaningsWrapper.appendChild(synonymWrapper);
        }

        meaning.definitions.forEach((definition) => {
          let li = document.createElement("li");
          li.textContent = definition.definition;
          ul.appendChild(li);
        });
      });

      if (element.sourceUrls.length > 0) {
        let footerWrapper = document.createElement("div");
        let footerTitle = document.createElement("span");
        let footer = document.createElement("span");
        footerWrapper.appendChild(footerTitle);
        footerWrapper.appendChild(footer);
        element.sourceUrls.forEach((url) => {
          footerTitle.textContent = "Source: ";
          footer.textContent = url;
        });
        searchResult.appendChild(footerWrapper);
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
