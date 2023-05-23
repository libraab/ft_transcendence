import { io } from 'socket.io-client'
import { hostname } from './hostname'
import { get, writable } from 'svelte/store';

export const rooms = writable([]);

let socket = {chat: null, alert: null};
let socketData;

export async function initializeSocket(data) {
  socketData = await data;
  socket.chat = io(hostname+':3000/chat', {path: '/chatsockets'});
  reloadRooms();
  defineSocketEvents();
}

export async function reloadRooms() {
	let loadedRooms = await fetchData();
	rooms.set(loadedRooms);
	//   await setRoomsSockets();
	connectToRooms();
}

export function getSocket() {
  return socket;
}

export let defineSocketEvents = () =>
{
	socket.chat.on('serverAlertToChat', newMessage);
}

export let deleteSocketEvents = () =>
{
	socket.chat.off('serverAlertToChat', newMessage);
}

export let newMessage = (msg) =>
{
	let trythis = get(rooms);
	trythis = trythis.map((item) => 
	{
		if (item.roomId == msg.channel)
			return { ...item, newMsgCount: item.newMsgCount + 1 };
		return (item);
	});
	rooms.set(trythis);

	// rooms.update((array) => {
	// 	array.map((item) => 
	// 		{
	// 			if (item.roomId == msg.channel)
	// 			{
	// 				return { ...item, newMsgCount: item.newMsgCount + 1 };
	// 			}
	// 			return (item);
	//     	});
	// 		return array;
	// });
}

let connectToRooms = () => {
	get(rooms).forEach(room => {
		socket.chat.emit('joinChannel', room.roomId);
	});
}

async function fetchData() {
	let data = socketData;
	let curr_rooms = get(rooms);
	try {
		const response = await fetch(`http://${hostname}:3000/chat/${data.id42}`);
		// let res = (await response.json()).map((item) => {
		// 	return {
		// 	  ...item,
		// 	  newMsgCount: 0,
		// 	};
		//   });
		// return res;
		let tmp_rooms = await response.json();
		tmp_rooms.forEach((el) =>
		{
			if (curr_rooms.find((room) => (room.roomId == el.roomId)) == undefined)
				curr_rooms = [...curr_rooms, { ...el, newMsgCount: 0}];
		});
		return curr_rooms;
	}
	catch (error) {
		console.error(error);
	}
}