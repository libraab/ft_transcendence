/**
 * Here we use load function to extract the roomId from the url parameters
 * It is usefull for dynamics root 
 */

 import { redirect } from "@sveltejs/kit";
 import { getMessageBytes } from "colyseus";
 
 /**
	  * Extract all messages from a room database
	  * blocked users are excluded
	  */
 //  async function fetchData(roomId, fetch) {
 // 	try {
 // 		const response = await fetch(`/api/chat/messages/${roomId}`, {
 // 				headers: { 'Authorization': `Bearer ${$jwt_cookie}` }
 // 			});
 // 		if (response.ok)
 // 		{
 // 			let messages = await response.json();
 // 			RoomsMessages = messages;
 // 		}
 // 		else
 // 		{
 // 			throw error(response.status, response.statusText);
 // 		}
 // 	}
 // 	catch (error) {
 // 		console.error(error);
 // 		goto("/app/chat");
 // 	}
 // }

 
 
 export async function load({ cookies, params, fetch }) {
	 const authToken = cookies.get('jwt_cookie');
	 
	//  depends("youpibla");

	 if (authToken === undefined)
		 throw redirect(307, "/");
 
	 let messages;
 
	 try {
		 const response = await fetch(`http://localhost:8080/api/chat/messages/${params.roomId}`, {
				 headers: { 'Authorization': `Bearer ${authToken}` }
			 });
		 if (response.ok)
			 messages = await response.json();
		 else
			 throw redirect(307, "/app/chat");
	 }
	 catch (error) {
		 console.error(error);
		 throw redirect(307, "/app/chat");
	 }
 
	 return {
		 roomId: params.roomId,
		 messages: messages
	 };
 }