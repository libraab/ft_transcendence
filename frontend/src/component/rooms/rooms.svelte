<script>
    let rooms = [
      { id: 1, name: "general"},
      { id: 2, name: "Room1"},
      { id: 3, name: "Room2"},
    ];
    let isFormVisible = false;
    let roomName = '';
    let roomType = 'public';
    let password = '';
    
    const toggleForm = () => {
      isFormVisible = !isFormVisible;
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Creating room:', roomName, 'of type', roomType);
        if (roomType === 'protected') {
            console.log('Password:', password);
        }
        // push la nouvelle room
        rooms.push({ id: rooms.length + 1, name: roomName });
        // Reset les valeurs du formulaure
        roomName = '';
        roomType = 'public';
        password = '';
        // ici je gere la data avec lappel de lapi
        toggleForm();
    }
  </script>

  <div class="main_body">
    <main class="container">
      <div class="rooms-container">
        <button class="toggle-btn">List of Rooms</button>
        <div class="room-list">
          {#each rooms as room}
            <div>
              <h3>{room.name}</h3>
            </div>
          {/each}
        </div>
      </div>
      <div class="create-container">
        <button class="create-btn" on:click={toggleForm}>Create Room</button>
        {#if isFormVisible}
            <form on:submit={handleSubmit}>
            <label for="room-name">Room Name:</label>
            <input type="text" id="room-name" bind:value={roomName}>
            <br>
            <label for="room-type">Room Type:</label>
            <select id="room-type" bind:value={roomType}>
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="protected">Protected</option>
            </select>
            {#if roomType === 'protected'}
              <br>
              <label for="password">Password:</label>
              <input type="password" id="password" bind:value={password}>
            {/if}
            <br>
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
      background-color: #4CAF50;
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
      background-color: #2E8B57; 
      text-decoration: underline;
    }
  
    .toggle-btn:focus + .room-list {
      display: block;
    }
  </style>