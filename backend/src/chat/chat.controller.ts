import { Controller, Delete, Get, Post, ParseIntPipe, Put, Param, Body } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import {createRoomDto} from '../dashboard/dashboardDtos/createsTablesDtos'
import * as bcrypt from 'bcrypt'
import { UserConnectedService } from './user-connected-service.service';

@Controller('chat')
export class ChatController {
	constructor(private db: DatabaseService,
                private dto: createRoomDto, 
				private usersConnected: UserConnectedService) {}
    //----------------------------------------------------------------------//
    @Get(':id')
    async getAllUsersChat(@Param('id', ParseIntPipe) id: number)
    {
        let client = await this.db.getClientById42(id);
		let json = await this.db.getRoomIdsAndNamesByClientId(client.id);
        console.log(json);
		return json;
    }
    //----------------------------------------------------------------------//
    @Get('/messages/:id')
    async getAllMessages(@Param('id', ParseIntPipe) id: number)
    {
        let json = await this.db.getRoomMessagesById(id);
        let res = [];
        await Promise.all(json.map(async (e) => {
            res.push({ sender: e.clientName, message: e.message});
        }));
        console.log(res);
		return res;
    }

	@Get('/connected/:id')
    async getConnectedStatus(@Param('id', ParseIntPipe) id: number)
    {
        // let json = await this.db.getRoomMessagesById(id);
        let res : number;
		return this.usersConnected.checkStatus(id);
        // await Promise.all(json.map(async (e) => {
        //     res.push({ sender: e.clientName, message: e.message});
        // }));
        // console.log(res);
		return res;
    }
    //----------------------------------------------------------------------//
    @Delete()
    quitRoom(): string
    {
        return 'user quit the room';
    }
    //----------------------------------------------------------------------//
    @Post()
    async createNewRoom(@Body() data) {
        const existingRooms = await this.db.getRooms();
        const roomNames = existingRooms.map((room) => room.name);
        if (roomNames.includes(data.roomName)) {
            throw new Error('Room name already exists');
        }
        this.dto.name = data.roomName;
        this.dto.ownerid = data.iddata;
        if (data.roomType == "public")
        this.dto.secu = 0;
        if (data.roomType == "protected")
        this.dto.secu = 1;
        if (data.roomType == "private")
        this.dto.secu = 2;
        
        if (this.dto.secu === 1) {
            const saltRounds = 10;
            this.dto.password = await bcrypt.hash(data.password, saltRounds);
            console.log('a protected room has been created');
        }
        let Room = await this.db.createRooom(this.dto);
        
		this.db.addMemberToRoom(Room.id, this.dto.ownerid, 0);
    }
    //----------------------------------------------------------------------//
	/*
	0 - owner
	1 - admin
	2 - member
	3 - muted
	4 - kicked
	5 - banned
	*/
    //----------------------------------------------------------------------//
    @Get()
    async getRooms(): Promise<{ id: number; name: string }[]> {
        return this.db.getRooms();
    }
//-----------------------------------------------------------------//
@Post('/join')
async joinRoom(@Body() data) {
    const room = await this.db.getRoomById(data.roomId);
    
    if (!room) {
        throw new Error('Room does not exist');
    }
    if (room.secu === 2 || room.secu === 3 ) {
        throw new Error('Cannot join a private room');
    }
    
    await this.db.addMemberToRoom(room.id, data.iddata, 2);
    return 'User joined the room';
}
//-----------------------------------------------------------------//


  @Post('/verify-password')
  async joinProtectedRoom(@Body() data) {
    const room = await this.db.getRoomById(data.roomId);
    const member = await this.db.getRoomByClientIdAndRoomId(data.iddata, room.id);
    console.log('->', room);
    if (!room) {
        throw new Error('Room does not exist');
    }
    if (member) {
        throw new Error('Already member');
    }
    console.log('->', member);

    // if (member.status === 5) {
    //     throw new Error('You are banned');
    // }

    if (room.secu === 1) {
        console.log('->', member);
        console.log('This room is protected, password required');
        bcrypt.compare(data.password, room.password)
            .then((passwordsMatch) => {
                if (passwordsMatch) {
                    console.log("Correct password");
                    this.db.addMemberToRoom(room.id, data.iddata, 2);
                    return 'User joined the room';
                } else {
                    console.log("Wrong password");
                }
            })
            .catch((error) => {
                console.log("An error occurred during password comparison:", error);
            });
    }
  }

    @Post('/invite')
    async inviteToPrivateRoom(@Body() data) {
        const room = await this.db.getRoomById(data.roomId);
        const invited = await this.db.getClientById(data.iddata1);
        const host = await this.db.getClientById(data.iddata2);
        const member1 = await this.db.getRoomByClientIdAndRoomId(host.id, room.id);
        const member2 = await this.db.getRoomByClientIdAndRoomId(invited.id, room.id);

        if (!room) { // room exist ?
            throw new Error('Room does not exist');
        }
        if (member1) { // host not member
            throw new Error('Only members can invite into the room');
        }
        if (member2) { // invited already member
            throw new Error('Already member');
        }
        // if (member2.status === 5) { // invited is banned
        //     throw new Error('You are banned');
        // }

        await this.db.addMemberToRoom(data.roomId, invited.id, 2);
        return 'User joined the room';
    }
    
    @Post('/addFriend')
    async addFriend(@Body() data) {
        const userId = await this.db.getClientById(data.iddata);
        const newFriend = await this.db.getClientById(data.newFriendId);
        
        if (!newFriend){ 
            throw new Error('User does not exist');
        }
        
        await this.db.addClientsToClient(userId.id, newFriend.id, 0);
        return 'Users are now friends';
    }

    @Post('/sendMsg')
    async sendMsg(@Body() data) {
        const userId = await this.db.getClientById(data.iddata);
        const newFriend = await this.db.getClientById(data.newFriendId);
        
        if (!newFriend){ 
            throw new Error('User does not exist');
        }
        this.dto.name = "mp";
        this.dto.ownerid = data.iddata;

        // await this.db.sendMsg(userId.id,newFriend.id);
        return 'A private chat room has been created';
    }

    @Post('/blockUser')
    async blockUser(@Body() data) {
        const user = await this.db.getClientById(data.iddata); // actor
        const blockedUser = await this.db.getClientById(data.blockedId); // acted upon 
        
        if (!blockedUser || !user){ 
            throw new Error('User does not exist');
        }
        
        await this.db.createBlockedRelation(user.id, blockedUser.id);
        return 'Users are now ennemies';
    }

    @Post('/unblockUser')
    async unblockUser(@Body() data) {
        const user = await this.db.getClientById(data.iddata); // actor
        const unblockedUser = await this.db.getClientById(data.unblockedId); // acted upon 
        
        if (!unblockedUser || !user){ 
            throw new Error('User does not exist');
        }
        
        await this.db.unblockClient(user.id, unblockedUser.id);
        return 'Users are friends again';
    }
}