import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  ParseArrayPipe,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from 'src/auth/auth.guard';
import IJWT from 'src/interfaces/jwt.interface';
import { updateRoomDto } from 'src/database/dtos/dbBaseDto';
import { ChatGateway } from 'src/chat/chat.gateway';

@Controller('rooms')
export class RoomsController {
  constructor(private db: DatabaseService, 
    private cg: ChatGateway) {}

  @UseGuards(AuthGuard)
  @Get()
  async getOwnedRooms(@Request() req: { user: IJWT }) {
    const client = await this.db.getClientById42(req.user.id);
    return this.db.getRoomsByOwnerId(client.id);
  }

  @Get('/allMemberwithStatus/:id42/:name')
  async loadAllRoomMember(
    @Param('id42', ParseIntPipe) id42: number,
    @Param('name') roomName: string,
  ) {
    return await this.db.getAllRoomMembers(id42, roomName);
  }

  @Get('/privateRoomMember/:id')
  async getPrivateRoomMembers(@Param('id', ParseIntPipe) id: number) {
    return await this.db.getMembersForPrivateRoom(id);
  }

  @Get('/allRoomMember/:idRoom/:idMember')
  async getAllRoomMember(
    @Param('idRoom', ParseIntPipe) idRoom: number,
    @Param('idMember', ParseIntPipe) idMember: number,
  ) {
    return await this.db.getMembersByRoomIdExcludingClient(idRoom, idMember);
  }

  @Get('/allRoomMemberForAdmins/:idRoom/:idMember')
  async getAllRoomMembeForAdmins(
    @Param('idRoom', ParseIntPipe) idRoom: number,
    @Param('idMember', ParseIntPipe) idMember: number,
  ) {
    return await this.db.getMembersByRoomIdExcludingClientForAdmins(idRoom, idMember);
  }

  @UseGuards(AuthGuard)
  @Get('valideRooms')
  async getAuthorizedRoomsForId(@Request() req: { user: IJWT }) {
    const client = await this.db.getClientById42(req.user.id);
	const rooms_data = await this.db.getRoomsAndMembersExcludingWhereClientIsMember(client.id);
	const response = rooms_data.map((el) => {
		return ({id: el.id, name: el.name, secu: el.secu, quantity: el.members.length});
	});
	console.log(response);
    return response;
  }

  @Get('getAdmins/:roomId')
  async getRoomAdmins(@Param('roomId', ParseIntPipe) roomId: number) {
    return this.db.getRoomAdmins(roomId);
  }

  @Get('/replacementList/:id')
  async getReplacements(@Param('id', ParseIntPipe) roomId: number) {
    try {
      return this.db.getRoomReplacementMembers(roomId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('getRoomId/:roomName')
  async getRoomId(@Param('roomName') roomName: string)
  {
    return this.db.getRoomIdByName(roomName);
  }

  @Post('/updateRoom/:roomId')
  async updateRoom(@Param('roomId', ParseIntPipe) roomId: number,
                  @Body() data: updateRoomDto)
  {
    if (data.secu === 1) {
      const saltRounds = 10;
      data.password = await bcrypt.hash(data.password, saltRounds);
    }
    try {
      return this.db.updateRoom(roomId, data);
    }
    catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Post('/join/:roomId')
  async joinRoom(
    @Request() req: { user: IJWT },
    @Param('roomId', ParseIntPipe) roomId: number,
    @Body() data: any,
  ) {
    const room = await this.db.getRoomById(roomId);
    const client = await this.db.getClientById42(req.user.id);

    //Si room n'existe pas ou client n'existe pas bad request
    if (!room || !client) {
      throw new HttpException(
        'room id or client id onvalid',
        HttpStatus.BAD_REQUEST,
      );
    }
    // si clientId déjà memebre de la room
    // on ne fait rien et NO CONTENT return.
    if (await this.db.checkRoomMember(roomId, req.user.id))
      return HttpStatus.ACCEPTED;

    // si room est protected par mot de passe
    if (room.secu === 1) {
      // check password
      const response = await bcrypt
        .compare(data.password, room.password)
        .then((passwordsMatch) => {
          if (passwordsMatch) {
            // valid case
            this.db.addMemberToRoom(room.id, client.id, 2);
			this.cg.sendServerMsg(roomId, `Welcome to a new member : ${client.name}!`);
			this.cg.emitMemberReload(roomId);
            // check password
            return HttpStatus.NO_CONTENT;
          } // error case
          else {
            throw new UnauthorizedException('Access Denied');
          }
        })
        .catch((error) => {
          throw new InternalServerErrorException(error);
        });
		return response;
    }
    // si room est publique
    else if (room.secu === 2) {
      try {
        await this.db.addMemberToRoom(roomId, client.id, 6);
		this.cg.emitMemberReload(roomId);
        return HttpStatus.NO_CONTENT;
      } catch (error) {
        throw new BadRequestException(error);
      }
    }
    // si room est one on one conversation
    else if (room.secu === 3) {
      throw new Error('Cannot join a conversation room');
    }

    // ça y était en théorie on ne passe plus ici,
    // mais la flemme de check l'ensemble des cas de figure donc ça reste
    await this.db.addMemberToRoom(roomId, client.id, 2);
	this.cg.sendServerMsg(roomId, `Welcome to a new member : ${client.name}!`);
	this.cg.emitMemberReload(roomId);
    return HttpStatus.NO_CONTENT;
  }

  @UseGuards(AuthGuard)
  @Post('/quit/:roomId')
  async quitRoom(
    @Request() req: { user: IJWT },
    @Param('roomId', ParseIntPipe) roomId: number,
  ) {
	const room = await this.db.getRoomById(roomId);
    const client = await this.db.getClientById42(req.user.id);
	const status = await this.db.roomUserCheck(roomId, client.id);
	// if (!room || !client || !status || status.status === 0) {
	// 	throw new HttpException(
	// 	  'room id or client id or client status invalid',
	// 	  HttpStatus.BAD_REQUEST,
	// 	);
	// }
	await this.db.removeClientFromRoom(roomId, client.id);
    this.cg.sendServerMsg(roomId, `${client.name} quit the room`);
	this.cg.emitMemberReload(roomId);
    return HttpStatus.NO_CONTENT;
  }

  @UseGuards(AuthGuard)
  @Post('updateStatus/:id/:client/:status')
  async updateClientStatus(
	@Request() req: { user: IJWT },
    @Param('id', ParseIntPipe) roomId: number,
    @Param('client', ParseIntPipe) clientId: number,
    @Param('status', ParseIntPipe) status: number,
  ) {
	const sender = await this.db.getClientById42(req.user.id);
	const sender_status = await this.db.roomUserCheck(roomId, sender.id);
	if (sender_status.status !== 0 && sender_status.status !== 1)
		throw new UnauthorizedException();
    const ownerCheck = await this.db.checkRoomOwner(roomId, clientId);
    if (ownerCheck) throw new UnauthorizedException();
	const old_status = await this.db.roomUserCheck(roomId, clientId);
    try {
      await this.db.changeMemberStatus(roomId, clientId, status);
      let client = await this.db.getClientById(clientId);
      if (client != null)
      {
        if (status == 3)
          this.cg.sendServerMsg(roomId, `${client.name} is muted`);
        else if (status == 5)
          this.cg.sendServerMsg(roomId, `${client.name} is banned`);
        else if (status == 1)
          this.cg.sendServerMsg(roomId, `${client.name} is now an Admin`);
		else if (status == 2 && old_status.status == 3)
			this.cg.sendServerMsg(roomId, `${client.name} is unmuted`);
		else if (status == 2 && old_status.status == 1)
			this.cg.sendServerMsg(roomId, `${client.name} is no longer an Admin`);
        this.cg.emitMemberReload(roomId);
        return HttpStatus.NO_CONTENT;
      }
      return HttpStatus.NO_CONTENT;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Post('kick/:roomId/:clientId')
  async kickClient(
	@Request() req: { user: IJWT },
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('clientId', ParseIntPipe) memberId: number,
  ) {
	const sender = await this.db.getClientById42(req.user.id);
	const sender_status = await this.db.roomUserCheck(roomId, sender.id);
	if (sender_status.status !== 0 && sender_status.status !== 1)
		throw new UnauthorizedException();
	const ownerCheck = await this.db.checkRoomOwner(roomId, memberId);
	if (ownerCheck)
	throw new HttpException("can't kick room owner", HttpStatus.BAD_REQUEST);
	const status = await this.db.roomUserCheck(roomId, memberId);
	try {
	await this.db.removeClientFromRoom(roomId, memberId);
	let client = await this.db.getClientById(memberId);
	if (client != null)
	{
		if (status.status === 5)
			this.cg.sendServerMsg(roomId, `${client.name} has been unbanned`);
		else if (status.status !== 6)
			this.cg.sendServerMsg(roomId, `${client.name} has been kicked`);
		this.cg.emitMemberReload(roomId);
		return HttpStatus.NO_CONTENT;
	}
	} catch (error) {
	console.error(error);
	throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
	}
  }

  @UseGuards(AuthGuard)
  @Post('acceptNewMember/:roomId/:clientId')
  async acceptNewMember(
	@Request() req: { user: IJWT },
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('clientId', ParseIntPipe) memberId: number,
  ) {
	const sender = await this.db.getClientById42(req.user.id);
	const sender_status = await this.db.roomUserCheck(roomId, sender.id);
	if (sender_status.status !== 0 && sender_status.status !== 1)
		throw new UnauthorizedException();
    try {
		const newMember = await this.db.getClientById(memberId);
      await this.db.addMemberToRoom(roomId, memberId);
	  this.cg.sendServerMsg(roomId, `Welcome to a new member : ${newMember.name}!`);
	  this.cg.emitMemberReload(roomId);
      return HttpStatus.NO_CONTENT;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/delete/:roomId')
  async deleteRoom(@Param('roomId', ParseIntPipe) roomId: number) {
    try {
      await this.db.deleteRoomWithMembers(roomId);
      return HttpStatus.NO_CONTENT;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/resign/:roomId/:ownerId/:adminId/:stay')
  async resign(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('ownerId', ParseIntPipe) ownerId: number,
    @Param('adminId', ParseIntPipe) adminId: number,
    @Param('stay', ParseBoolPipe) stay: boolean,
  ) {
    const ownerCheck = await this.db.checkRoomOwner(roomId, ownerId);
    const roomUserCheck = await this.db.checkRoomMember(roomId, adminId);
    if (!ownerCheck || !roomUserCheck) {
      throw new HttpException(
        'invalid client for specified room',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (ownerId === adminId) {
      throw new HttpException('you so funny Larry', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.db.changeMemberStatus(roomId, ownerId, 1); // owner becomes admin |__ > table roomMembers
      await this.db.changeMemberStatus(roomId, adminId, 0); // admin becomes owner |
      await this.db.changeRoomOwner(roomId, adminId); // pass admin as owner in table Rooms

      if (!stay)
        // is resign is decided with leaving the room
        await this.db.removeClientFromRoom(roomId, ownerId);

      return HttpStatus.NO_CONTENT;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
