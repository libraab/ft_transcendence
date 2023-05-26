<script>
  import { onMount } from 'svelte';
  import { hostname } from "../../hostname"
  export let data;
  let rooms = [];
  let isFormVisible = false;
  let roomName = '';
  let roomType = 'public';
  let password = '';

  const toggleForm = () => {
    isFormVisible = !isFormVisible;
  }
  //-----------CREATE----ROOM---------------------------------//
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Creating room:', roomName, 'of type', roomType);
    if (roomType === 'protected') {
        console.log('Password:', password);
    }
    // ici je fais api call  au back
    const response = await fetch(`http://${hostname}:3000/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        roomName,
        roomType,
        password,
        iddata: data.id
      })
    });
    if (response.ok) {
      console.log('Room created successfully');
      // handle success -> make sure that room is added to the list updates etc
    } else {
      console.error('Failed to create room');
      // handle error
    }
    // Reset les valeurs du formulaure
    roomName = '';
    roomType = 'public';
    password = '';
    toggleForm();
    fetchRooms();
}
//-------------------------LIST----ROOM-----------------------------//
  const fetchRooms = async () => {
    const response = await fetch(`http://${hostname}:3000/chat`);
    if (response.ok) {
      rooms = await response.json();
    } else {
      console.error('Failed to fetch rooms');
    }
  };
//----------------------------ONMOUNT----------------------------//
onMount(fetchRooms);
//-------------------------JOIN--PRIVATE----------------------------//
const handlePasswordInput = async (room, password) => {
    const response = await fetch(`http://${hostname}:3000/chat/verify-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        roomId: room.id,
        password: password,
        iddata: data.id
      })
    });
    if (response.ok) {
      console.log('Password is correct');
    } else {
      console.error('Incorrect password or error');
    }
  };

const askForPassword = (room) => {
    const password = prompt('Enter the password:');
    if (password !== null) {
      handlePasswordInput(room, password);
    }
};
//---------------------------JOIN----------NORMAL------------------//
const join = async (room) => {
  const response = await fetch(`http://${hostname}:3000/chat/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      roomId: room.id,
      iddata: data.id
    })
  });

  if (response.ok) {
    console.log('Joined room:', room.name);
  } else {
    console.error('Failed to join room:', room.name);
  }
};


</script>

<div class="main_body">
<main class="container">
  <div class="rooms-container">
    <button class="toggle-btn">List of Rooms</button>
    <div class="room-list">
      {#each rooms as room}
        <div class="room-item">
          {#if room.secu == 1}
            <h3>🔒 {room.name}</h3>
            <button class="join-button" on:click={() => askForPassword(room)}>Join</button>
          {:else}
            <h3>{room.name}</h3>
            <button class="join-button" on:click={() => join(room)}>Join</button>
          {/if}
        </div>
      {/each}
    </div>
  </div>
  <div class="create-container">
    <button class="create-btn" on:click={toggleForm}>Create Room</button>
    {#if isFormVisible}
      <form on:submit={handleSubmit}>
        <label for="room-name">Room Name:</label>
        <input type="text" id="room-name" bind:value={roomName} />
        <br />
        <label for="room-type">Room Type:</label>
        <select id="room-type" bind:value={roomType}>
          <option value="public">Public</option>
          <option value="private">Private</option>
          <option value="protected">Protected</option>
        </select>
        {#if roomType === "protected"}
          <br />
          <label for="password">Password:</label>
          <input type="password" id="password" bind:value={password} />
        {/if}
        <br />
        <button type="submit">Create Room</button>
      </form>
    {/if}
  </div>
</main>
</div>

<style>
.container {
  height: 100%;
  display: flex;
  justify-content: space-around;
}
.create-container {
  flex: 1;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.rooms-container {
  flex: 1;
  padding: 10px;
  width: 200px;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.room-list {
  flex: 1;
  overflow-y: scroll;
  display: none;
}

.toggle-btn,
.create-btn {
  border: none;
  background-color: #4caf50;
  border-radius: 20px;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  outline: none;
  padding: 10px 20px;
  margin-bottom: 10px;
  transition: background-color 0.3s ease;
}

.toggle-btn:hover,
.create-btn:hover {
  font-size: 20px;
  padding: 15px 30px;
  background-color: #2e8b57;
  text-decoration: underline;
}

.room-list {
  display: block;
}

.room-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h3 {
  margin-right: 10px;
}

.join-button {
  margin-left: 10px;
  margin-right: 0;
  align-self: flex-end;
}

</style>