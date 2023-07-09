<div class="room_wrap">
	<ul class="messages">
		<p class="info">no room selected</p>
	</ul>
	<!-- Le bouton est desactivé car on est dans aucune room -->
	<form on:submit|preventDefault={() => {}} class="component_send_box">
		<input type="text" placeholder="write a message, or shut up">
		<button>send</button>
	</form>
</div>