<script>
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
  
    let code = ""; // variable to store the user's 2FA code
  
    function handleSubmit() {
      // send the code to the backend for verification
      fetch("/auth/2fa-verify", {
        method: "POST",
        body: JSON.stringify({ code }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            navigate("/homepage"); // redirect to the homepage if the code is verified
          } else {
            alert("Invalid 2FA code. Please try again.");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("An error occurred. Please try again later.");
        });
    }

    onMount(() => {
      code = "";
    });
  </script>
  
  <main>
    <h1>Welcome to the Girly DFA Homepage!</h1>
    <form on:submit|preventDefault={handleSubmit}>
      <label for="code">Enter your 2FA code:</label>
      <input type="text" id="code" bind:value={code} />
      <button type="submit">Submit</button>
    </form>
  </main>
  
  <style>
    /* Add your beautiful and girly styles here */
    main {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
  
    h1 {
      font-family: "Arial", sans-serif;
      font-size: 2rem;
      color: pink;
      text-align: center;
      margin-bottom: 1rem;
    }
  
    form {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  
    label {
      font-family: "Arial", sans-serif;
      font-size: 1rem;
      color: purple;
      margin-bottom: 0.5rem;
    }
  
    input {
      padding: 0.5rem;
      border-radius: 5px;
      border: 1px solid purple;
      margin-bottom: 1rem;
    }
  
    button {
      padding: 0.5rem 1rem;
      border-radius: 5px;
      background-color: pink;
      color: white;
      font-family: "Arial", sans-serif;
      font-size: 1rem;
      border: none;
      cursor: pointer;
    }
  </style>