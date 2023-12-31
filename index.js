const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2309-FSA-ET-WEB-FT-SF/events`

const state = {
  parties: []
};

const partiesList = document.querySelector(`#parties`);
const addPartyForm = document.querySelector(`#addParty`);

addPartyForm.addEventListener("submit", addParty);

// to both fetch & render the parties:
async function render() {
  await getParties();
  renderParties();
}
render();

// a function to fetch the list of parties from API
async function getParties() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.parties = json.data;
  } catch (error) {
    console.log(error)
  }
}

// a function to render the list of parties from state, onto the page:
function renderParties() {
  if (!state.parties.length) {
    partiesList.innerHTML = `<li>No parties found.</li>`;
    return;
  }

  const partyCards = state.parties.map((party) => {
    const li = document.createElement("li");
    li.classList.add("party");
    li.innerHTML = `
      <h2>${party.name}</h2>
      <p>${party.description}</p>
      <p>${party.date}</p>
      <p>${party.location}</p>
    `;

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete");
    deleteButton.innerHTML = `Delete Party`;
    li.append(deleteButton);
    deleteButton.addEventListener(`click`, () => deleteParty(party.id));

    return li;
  });
  partiesList.replaceChildren(...partyCards)
}

// function for event handler, to create a new party card based on new form data:
async function addParty(event) {
  event.preventDefault();
  const dateString = new Date(addPartyForm.date.value);
  const dateISOString = dateString.toISOString();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: addPartyForm.name.value,
        description: addPartyForm.description.value,
        date: dateISOString,
        location: addPartyForm.location.value
      }),
    });

    const json = await response.json();

    if (json.error) {
      throw new Error(json.message);
    }
    // clears the inputs
    addPartyForm.name.value = ``;
    addPartyForm.description.value = ``;
    addPartyForm.date.value = ``;
    addPartyForm.location.value = ``;

    render();

  } catch (error) {
    console.error(error);
  }
}

// a function to delete an existing party
async function deleteParty(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Party could not be deleted.");
    }
    render();
  } catch (error) {
    console.log(error);
  }
}







