import {
  Controller,
  Delete,
  Get,
  Post,
  ParseIntPipe,
  Put,
  Param,
  Body,
  HttpException,
  HttpStatus,
  BadRequestException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { createRoomDto } from '../dashboard/dashboardDtos/createsTablesDtos';
import * as bcrypt from 'bcrypt';
import { UserConnectedService } from './user-connected-service.service';
import { ChatGateway } from './chat.gateway';
import { AuthGuard } from 'src/auth/auth.guard';
import IJWT from 'src/interfaces/jwt.interface';

@Controller('chat')
export class ChatController {
  constructor(
    private db: DatabaseService,
    private dto: createRoomDto,
    private usersConnected: UserConnectedService,
    private gateway: ChatGateway,
  ) {}
  //----------------------------------------------------------------------//
  // @Get(':id')
  // async getAllUsersChatBadOne(@Param('id', ParseIntPipe) id: number) {
  //   if (id <= 0) throw new BadRequestException('invalid user');
  //   const client = await this.db.getClientById42(id);
  //   const json = await this.db.getRoomIdsAndNamesByClientId(client.id);
  //   console.log(json);
  //   return json;
  // }

   //----------------------------------------------------------------------//
  @UseGuards(AuthGuard)
  @Get()
  async getAllUsersChat(
    @Request() req: { user: IJWT },
  ) {
    //  if (id <= 0) throw new BadRequestException('invalid user');
      console.log("User Chat Request for id :", req.user);
     const client = await this.db.getClientById42(req.user.id);
     const json = await this.db.getRoomIdsAndNamesByClientId(client.id);
     console.log(json);
     return json;
   }

  //----------------------------------------------------------------------//
  @UseGuards(AuthGuard)
  @Get('/messages/:roomid')
  async getAllMessages(@Request() req: { user: IJWT }, @Param('roomid', ParseIntPipe) roomid: number) {
    const json = await this.db.getRoomMessagesById(roomid, req.user.id);
    const res = [];
    await Promise.all(
      json.map(async (e) => {
        res.push({ sender: e.clientName, message: e.message });
      }),
    );
    console.log(res);
    return res;
  }

  //----------------------------------------------------------------------//
  @UseGuards(AuthGuard)
  @Get('/blocked')
  async getBlockedUsers(@Request() req: { user: IJWT })
  {
    let banned_list = await this.db.getBannedRelationshipsForId(req.user.id);
    console.log("banned list :", banned_list);
    return banned_list;
  }
  //----------------------------------------------------------------------//

  @Get('/connected/:id')
  async getConnectedStatus(@Param('id', ParseIntPipe) id: number) {
    // let json = await this.db.getRoomMessagesById(id);
    // let res : number;
    return this.usersConnected.checkStatus(id);
    // await Promise.all(json.map(async (e) => {
    //     res.push({ sender: e.clientName, message: e.message});
    // }));
    // console.log(res);
    // return res;
  }

  @Get('/room/:id')
  async getRoomsMembers(@Param('id', ParseIntPipe) id: number) {
    const json = await this.db.getMembersByRoomId(id);
    // let res : number;
    // return this.usersConnected.checkStatus(id);
    // await Promise.all(json.map(async (e) => {
    //     res.push({ sender: e.clientName, message: e.message});
    // }));
    // console.log(res);
    return json;
  }

  //----------------------------------------------------------------------//
  @Delete()
  quitRoom(): string {
    return 'user quit the room';
  }
  //----------------------------------------------------------------------//
  @UseGuards(AuthGuard)
  @Post()
  async createNewRoom(@Request() req: { user: IJWT }, @Body() data) {
    /**
     * D'abord on verifie que l'id de iddata est bien lid de luser qui cree la room
     */
    if (req.user.id != data.iddata)
      throw new HttpException(
        'User id is not matching data id',
        HttpStatus.BAD_REQUEST,
    );
    const existingRooms = await this.db.getRooms();
    const userinfo = await this.db.getClientById42(parseInt(data.iddata)); //ici check si ok
    const roomNames = existingRooms.map((room) => room.name);
    if (roomNames.includes(data.roomName)) {
      throw new HttpException(
        'Room name already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    this.dto.name = data.roomName;
    this.dto.ownerid = userinfo.id;

    if (data.roomType == 'public') this.dto.secu = 0;
    if (data.roomType == 'protected') {
      if (!data.password || data.password === '')
        throw new HttpException(
          'no password on protected room',
          HttpStatus.BAD_REQUEST,
        );
      this.dto.secu = 1;
    }
    if (data.roomType == 'private') this.dto.secu = 2;

    if (this.dto.secu === 1) {
      const saltRounds = 10;
      this.dto.password = await bcrypt.hash(data.password, saltRounds);
    }
    const Room = await this.db.createRooom(this.dto);

    this.db.addMemberToRoom(Room.id, this.dto.ownerid, 0);
    //ICI send reloadRoom ou dna add membertoroom service?
    return HttpStatus.NO_CONTENT;
  }

  @Get('/bannedFor/:id')
  async getBannedPeople(@Param('id', ParseIntPipe) clientId: number)
  {
    return this.db.getBannedRelationshipsForId(clientId);
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
  // @Get()
  // async getRooms(): Promise<{ id: number; name: string }[]> {
  //   return this.db.getRooms();
  //   //TODO
  //   //return this.db.getRoomsWhereUserIsNotMember(id);
  // }

  @Post('/verify-password')
  async joinProtectedRoom(@Body() data) {
    const room = await this.db.getRoomById(data.roomId);
    const member = await this.db.getRoomByClientIdAndRoomId(
      data.iddata,
      room.id,
    );
    console.log('->', room);
    if (!room) {
      throw new Error('Room does not exist');
    }
    if (member) {
      throw new Error('Already member');
    }
    console.log('->', member);

    if (room.secu === 1) {
      console.log('->', member);
      console.log('This room is protected, password required');
      bcrypt
        .compare(data.password, room.password)
        .then((passwordsMatch) => {
          if (passwordsMatch) {
            console.log('Correct password');
            this.db.addMemberToRoom(room.id, data.iddata, 2);
            return 'User joined the room';
          } else {
            console.log('Wrong password');
          }
        })
        .catch((error) => {
          console.log('An error occurred during password comparison:', error);
        });
    }
  }


  /**
   * 
   * 0 - Public
   * 1 - Protected
   * 2 - Private
   * 3 - one on one
   * @returns 
   */
  @Post('/invite')
  async inviteToPrivateRoom(@Body() data) {
    const room = await this.db.getRoomById(data.roomId);
    const invited = await this.db.getClientById(data.iddata1);
    const host = await this.db.getClientById(data.iddata2);
    const member1 = await this.db.getRoomByClientIdAndRoomId(host.id, room.id);
    const member2 = await this.db.getRoomByClientIdAndRoomId(
      invited.id,
      room.id,
    );

    if (!room) {
      // room exist ?
      throw new Error('Room does not exist');
    }
    if (member1) {
      // host not member
      throw new Error('Only members can invite into the room');
    }
    if (member2) {
      // invited already member
      throw new Error('Already member');
    }

    await this.db.addMemberToRoom(data.roomId, invited.id, 2);
    return 'User joined the room';
  }

  @UseGuards(AuthGuard)
  @Post('/addFriend')
  async addFriend(@Request() req: { user: IJWT }, @Body() data) {
    const userId = await this.db.getClientById42(req.user.id);
    const newFriend = await this.db.getClientById(data.newFriendId);

    if (!newFriend) {
      throw new Error('User does not exist');
    }

    await this.db.addClientsToClient(userId.id, newFriend.id, 0);
    return 'Users are now friends';
  }

  /**
   * 
   * Creating a one-to-one room here 
   * 
   */
  @Post('/sendMsg')
  async sendMsg(@Body() data) {
    const userId = await this.db.getClientById(data.iddata);
    const newInterlocutor = await this.db.getClientById(data.newFriendId);

    if (!newInterlocutor) {
      throw new Error('Interlocutor does not exist');
    }
    if (!userId) {
      throw new Error('You do not exist');
    }
    // TODO check if user or sender is not blocked
    this.dto.ownerid = userId.id;
    this.dto.secu = 3;
    this.dto.client2Id = newInterlocutor.id;

    const Room = await this.db.createRooom(this.dto);
    if (!Room) console.log('Failed to create room');
    this.db.addMemberToRoom(Room.id, userId.id, 0);
    this.db.addMemberToRoom(Room.id, newInterlocutor.id, 1); // adding the second as an admin
    // RELOAD ROOMS
    return 'A private chat room has been created';
  }

  @UseGuards(AuthGuard)
  @Post('/blockUser')
  async blockUser(@Request() req: { user : IJWT }, @Body() data) {
    const user = await this.db.getClientById42(req.user.id); // actor
    const blockedUser = await this.db.getClientById(data.blockedId); // acted upon

    if (!blockedUser || !user) {
      throw new Error('User does not exist');
    }

    await this.db.createBlockedRelation(user.id, blockedUser.id);
    console.log("Ennemies created");
    this.gateway.sendReloadRequest(blockedUser.id); // sending a refresh request to both to refresh data on their session
    this.gateway.sendReloadRequest(user.id);
    return 'Users are now ennemies';
  }

  @UseGuards(AuthGuard)
  @Post('/unblockUser')
  async unblockUser(@Request() req: { user : IJWT }, @Body() data) {
    const user = await this.db.getClientById42(req.user.id); // actor
    const unblockedUser = await this.db.getClientById(data.unblockedId); // acted upon

    if (!unblockedUser || !user) {
      throw new Error('User does not exist');
    }

    await this.db.unblockClient(user.id, unblockedUser.id);
    console.log("Ok i forgive you");
    this.gateway.sendReloadRequest(unblockedUser.id); // sending a refresh request to both to refresh data on their session
    this.gateway.sendReloadRequest(user.id);
    return 'Users are friends again';
  }
}
