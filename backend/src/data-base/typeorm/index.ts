import { Client } from "./client";
import { Messages_clients } from "./msgs_clients";
import { Messages_rooms } from "./msgs_rooms";
import { Relations } from "./relations";
import { Room } from "./room";
import { Client_Stats } from "./stats";

const entities =	[Client,
					Relations,
					Room,
					Messages_rooms,
					Messages_clients,
					Client_Stats];

export { Client, Relations, Room, Messages_rooms, Messages_clients, Client_Stats };

export default entities;
