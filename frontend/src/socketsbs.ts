import { io } from 'socket.io-client'
import { hostname } from './hostname'
import { get, writable } from 'svelte/store';
import { userId42 } from './stores';

export const rooms = writable<any>([]);
export let alertPopupOn = false;

let socketData: any;
let socket: {
  chat?: any;
  game?: any;
} = {};

export async function initializeSocket(data: any) {
  socketData = await data;
  if (!socketData)
  	return;

  socket.chat = io(hostname+':3000/chat', {path: '/chatsockets'});//, auth: {token: }});
  socket.chat.emit('whoAmI', socketData.id);
  socket.game = io(hostname+':3000/game', {path: '/gamesockets'});//, auth: {token: }});

  reloadRooms();
  defineSocketEvents();
  defineGameSocketEvents();
}

export async function reloadRooms() {
	let loadedRooms = await fetchData();
	rooms.set(loadedRooms);
	connectToRooms();
}

export function getSocket() {
  return socket;
}

export let defineSocketEvents = () =>
{
	socket.chat.on('serverAlertToChat', newMessage);
	// socket.chat.on('clientRefreshRooms', reloadRooms);
	
}

export let deleteSocketEvents = () =>
{
	socket.chat.off('serverAlertToChat', newMessage);
}

export let defineGameSocketEvents = () =>
{
	socket.game.on('testSeverToClient', (data: any) => {
		console.log(data)
	});
	socket.game.on('mvtpad', (data: any) => {

	});
}

export let newMessage = (msg: any) =>
{
	let trythis = get(rooms);
	trythis = trythis.map((item: any) => 
	{
		if (item.roomId == msg.channel)
			return { ...item, newMsgCount: item.newMsgCount + 1 };
		return (item);
	});
	rooms.set(trythis);
}

let connectToRooms = () => {
	get(rooms).forEach((room: any) => {
		socket.chat.emit('joinChannel', room.roomId);
	});
}

async function fetchData() {
	let data = socketData;
	let curr_rooms = get(rooms);
	console.log(`http://${hostname}:8080/api/chat/${get(userId42)}`);
	try {
		const response = await fetch(`http://${hostname}:8080/api/chat/${get(userId42)}`);
		if (response.ok)
		{
			let tmp_rooms = await response.json();
			tmp_rooms.forEach((el: any) =>
			{
				if (curr_rooms.find((room: any) => (room.roomId == el.roomId)) == undefined)
					curr_rooms = [...curr_rooms, { ...el, newMsgCount: 0}];
			});
			return curr_rooms;
		}
		else
			console.error(response.status, response.statusText);
		return null;
	}
	catch (error) {
		console.error(error);
	}
}
