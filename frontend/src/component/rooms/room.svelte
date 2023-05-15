<script>
    let isFormVisible = false;
    let roomName = '';
    let roomType = 'public';
    
    const toggleForm = () => {
      isFormVisible = !isFormVisible;
    }
    
    const handleSubmit = (event) => {
      event.preventDefault();
      console.log('Creating room:', roomName, 'of type', roomType);
      // Call API or do something else with the form data
      toggleForm();
    }
  </script>
  
  <main>
    <button on:click={toggleForm}>New Room</button>
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
        <br>
        <button type="submit">Create Room</button>
      </form>
    {/if}
  </main>