let playerCount = 0; 

const load_players = () => {
  fetch("https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?t=Arsenal")
    .then((res) => res.json())
    .then((data) => {
      display_players(data.player);
    });
};

const display_players = (players) => {
  const container = document.getElementById("players");
  container.innerHTML = ""; // Clear previous players if needed

  players.forEach((player) => {
    const div = document.createElement("div");
    div.classList.add("div_class", "m-2", "p-2");
    div.style.width = "18rem";
    div.innerHTML = `
      <img class="c_img" src="${player.strThumb}" alt="Photo Can't Show">
      <div class="card-body">
        <h3 class="text-aqua">${player.strPlayer}</h3>
        <h4>${player.idPlayer}</h4>
        <h3>${player.strNationality}</h3>
        <h4>${player.strTeam}</h4> 
        <small class="fs-4">${player.strSport}</small><br> 
        <small>${player.strGender}</small><br>
        <small>${player.strDescriptionEN.slice(0, 50)}</small><br>
      </div>
      <button class="btn btn-primary" onclick="add_to_cart('${player.strPlayer}', this)">Add to Team</button>
      <button class="btn btn-success" onclick="get_details('${player.idPlayer}')">Details</button>
    `;
    container.appendChild(div);
  });
};

document.getElementById("searchButton").addEventListener("click", () => {
  const searchInput = document.getElementById("searchInput").value.trim();
  const container = document.getElementById("players");

  if (searchInput !== "") {
    fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${searchInput}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.player && data.player.length > 0) {
          display_players(data.player);
        } else {
          container.classList.add("hidden");
          container.innerHTML = `
            <div>
              <p class="sorry text-center ">Player Not found</p>
            </div>
          `;
          container.classList.remove("hidden");
        }
      });
  } else {
    container.classList.remove("hidden");
  }
});

const get_details = (idPlayer) => {
  fetch(`https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${idPlayer}`)
    .then((res) => res.json())
    .then((data) => {
      const player = data.players[0];
      console.log(player);
      const modalContent = document.getElementById("modalContent");
      modalContent.innerHTML = `
        <img class="c_img" src="${player.strThumb}" alt="Photo">
        <div class="card-body">
          <h3 class="text-aqua">${player.strPlayer}</h3>
          <h4>${player.idPlayer}</h4>
          <h3>${player.strNationality}</h3>
          <h4>${player.strTeam}</h4>
          <small class="fs-4">${player.strSport}</small><br>
          <small>${player.strGender}</small><br>
          <small>${player.strDescriptionEN.slice(0, 200)}</small><br>
        </div>
        <a href="${player.strFacebook}" target="_blank"><i class="fab fa-facebook-square"></i></a>
        <a href="${player.strLinkedIn}" target="_blank"><i class="fab fa-linkedin"></i></a>
        <a href="${player.strSkype}" target="_blank"><i class="fab fa-skype"></i></a>
      `;
      const playerModal = new bootstrap.Modal(document.getElementById('playerModal'));
      playerModal.show();
    })
    .catch((error) => {
      console.error('Error fetching player details: ', error);
    });
};

const add_to_cart = (name, button) => {
  if (playerCount >= 11) {
    alert("You can't add more than 11 players");
    return;
  }
  playerCount++;
  const count = document.getElementById("count").innerText;
  let converted_count = parseInt(count);
  converted_count += 1;
  document.getElementById("count").innerText = converted_count;
  console.log(converted_count);

  const container = document.getElementById("add_cart");
  const div = document.createElement("div");
  div.classList.add("div_class1", "gap-3", "m-3");
  div.innerHTML = `
    <p class="cart_name fs-5"> ${name} </p>
  `;
  container.appendChild(div);

  
  button.innerText = "Already Added";
  button.style.backgroundColor ="red";
  button.disabled = true; 
};

load_players();
