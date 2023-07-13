import { io } from 'socket.io-client'
import { get, writable } from 'svelte/store';
import { userId42, rooms, userId, jwt_cookie, blockedUser} from '$lib/stores';
import { hostname } from './hostname';

// Socket chat
export let socket;

// value of not readed messages
export let msgCount = 0;

// popup alert values
export let alertPopupOn = false;
export let invitationData;

export let updateCount = () =>
{
	console.log("count updated");
	let count = 0;
	get(rooms).forEach(element => {
			count += element.newMsgCount;
	});
	msgCount = count;
	console.log(count);
}

export async function initializeSocket() {
//   socketData = await data;
//   if (!socketData)
//   	return;

	socket = io(hostname+':3000/chat', {path: '/chatsockets'});//, auth: {token: }});
  	socket.emit('whoAmI', get(userId));
//   socket.game = io(hostname+':3000/game', {path: '/gamesockets'});//, auth: {token: }});

  	await reloadRooms();
	socket.on('reloadrooms', reloadRooms);
	defineSocketEvents();
	setPopupToogleEvent();
}

export async function reloadRooms() {
	console.log("reloading rooms");
	let loadedRooms = await fetchRoomData();
	rooms.set(loadedRooms);
	connectToRooms();
	fetchBlockedData();
}

export function getSocket() {
  return socket;
}

export let defineSocketEvents = () =>
{
	socket.on('serverAlertToChat', newMessage);
	// socket.on('clientRefreshRooms', reloadRooms);
	
}

export let deleteSocketEvents = () =>
{
	socket.off('serverAlertToChat', newMessage);
}

// export let defineGameSocketEvents = () =>
// {
// 	socket.game.on('testSeverToClient', (data) => {
// 		console.log(data)
// 	});
// 	socket.game.on('mvtpad', (data) => {

// 	});
// }

let newMessage = (msg) =>
{
	console.log("New Message");
	if (! isBlockedUser(msg.sender_id))
		add_alert_On(msg.channel);
}

export let isBlockedUser = (user_id) =>
{
	let blocked = false;
	get(blockedUser).forEach((el) => {
		if (el.id == user_id)
			blocked = true;
	});
	return blocked;
}

export let add_alert_On = (id) =>
{
	let trythis = get(rooms);
	trythis = trythis.map((item) => 
	{
		if (item.roomId == id)
			return { ...item, newMsgCount: item.newMsgCount + 1 };
		return (item);
	});
	rooms.set(trythis);
	updateCount()
}

// @ts-ignore
export let deleteAlertOn = (roomId) =>
{
	let roomsGet = get(rooms);
	roomsGet = roomsGet.map((item) => 
	{
		if (item.roomId == roomId)
			return { ...item, newMsgCount: 0 };
		return (item);
	});
	rooms.set(roomsGet);
	updateCount();
}

let connectToRooms = () => {
	get(rooms).forEach((room) => {
		socket.emit('joinChannel', String(room.roomId));
	});
}

async function fetchRoomData() {
	let curr_rooms = get(rooms);
	try {
		const response = await fetch(`/api/chat`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${get(jwt_cookie)}`
			}
		});
		if (response.status == 200)
		{
			let tmp_rooms = await response.json();
			tmp_rooms = tmp_rooms.map((el) => {
				let item = curr_rooms.find((room) => (room.roomId == el.roomId));
				if (item == undefined)
					return { ...el, newMsgCount: 0 };
				return (item);
			});
			return tmp_rooms;
		}
		else
			console.error(response.status, response.statusText);
		return null;
	}
	catch (error) {
		console.error(error);
	}
}

async function fetchBlockedData() {
	try {
		const response = await fetch(`/api/chat/blocked`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${get(jwt_cookie)}`
			}
		});
		if (response.status == 200)
		{
			let resjson = await response.json()
			console.log("fetched blocked user :");
			console.log(resjson);
			// blocked_users.set(resjson);
			// // or
			// return blocked_users;
		}
		else
			console.error(response.status, response.statusText);
		return null;
	}
	catch (error) {
		console.error(error);
	}
}

/**
 * Alert mechanism
 */
let setPopupToogleEvent = () =>
{
	socket.on('invitationGame', invitationHandler);
}

let invitationHandler = (invitData) =>
{
	console.log("invitation!!!");
	alertPopupOn = true;
	invitationData = invitData;
//alert("Some guy invited you to a game!");
}
