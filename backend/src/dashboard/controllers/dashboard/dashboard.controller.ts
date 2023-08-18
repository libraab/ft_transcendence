import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  StreamableFile,
  UseGuards,
  Request,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ClientDto } from 'src/database/dtos/dbBaseDto';
import { UpdateClientDto } from 'src/dashboard/dashboardDtos/updateClientDto';
import { Req } from '@nestjs/common';
import {
  createRelationsDto,
  createStatsDto,
  updateStatDto,
} from 'src/dashboard/dashboardDtos/createsTablesDtos';
import { FastifyRequest } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { AuthGuard } from 'src/auth/auth.guard';
import IJWT from 'src/interfaces/jwt.interface';
import { NOTFOUND } from 'dns';

@Controller('dashboard')
export class DashboardController {
  constructor(private db: DatabaseService) {}


  @UseGuards(AuthGuard)
  @Get()
  async getMyDashboard(
    @Request() req: { user: IJWT },
  ) {
    let ppp = await this.db.getClientById42Dashboard(+req.user.id);
	if (ppp == null)
		throw new NotFoundException("You're cookie is a bad cookie");
	  return ppp;
  }

  @UseGuards(AuthGuard)
  @Get('/:id42')
  async getDashboardById42(
    @Request() req: { user: IJWT },
    @Param('id42', ParseIntPipe) id: number
  ) {
    let ppp = await this.db.getClientById42Dashboard(id);
	if (ppp == null)
		throw new NotFoundException("You're cookie is a bad cookie");
	return ppp;
  }

  @UseGuards(AuthGuard)
  @Get('/history/:clientId')
  async getGameHistoric(
	@Request() req: { user: IJWT },
  	@Param('clientId', ParseIntPipe) clientId: number)
  { 
	const client = await this.db.getClientById42(clientId)
    return this.db.getGameHistoric(client.id);
  }

  @UseGuards(AuthGuard)
  @Get('/avatar/:clientId')
  async getImagePath(
	@Request() req: { user: IJWT },
  	@Param('clientId', ParseIntPipe) clientId: number)
  { 
	let client_img = await this.db.getClientImgById(clientId);
	if (!client_img)
		throw new HttpException('userNotFound', 404);
    return client_img;
  }

  @UseGuards(AuthGuard)
  @Get('/getByName/:userName')
  async getByName(
    @Request() req: { user: IJWT },
    @Param('userName') userName: string,
  ) {
    try {
      let client = await this.db.getClientById42(req.user.id);
      return this.db.getClientByName(client.id, userName);
    } catch (error) {
      throw new HttpException('userNotFound', 404);
    }
  }

  @Get('preDelCheck/:clientId')
  async preDelCheck(@Param('clientId', ParseIntPipe) clientId: number)
  {
    return this.db.preDelCheck(clientId);
  }

  @Get('/convert/:id42')
  async getIdFromId42(@Param('id42', ParseIntPipe) id42: number)
  {
    return this.db.getIdFromId42(id42);
  }

  @UseGuards(AuthGuard)
  @Get('getTargetWithRelation/:name')
  async getTarget(
    @Request() req: { user: IJWT }, 
    @Param('name') name: string,
  ) {
    try {
      return this.db.getTarget(req.user.id, name);
    } catch (error) {
      console.error(error);
      throw new HttpException('User Not Found', 404);
    }
  }

  @Get('/42/:id')
  async getByid(@Param('id', ParseIntPipe) id: number) {
    return this.db.getClientById(id);
  }

  @UseGuards(AuthGuard)
  @Get('/stats/:id')
  async getStatsbyId(
	@Request() req: {user: IJWT},
	@Param('id', ParseIntPipe) id: number
  ) {
	const client = await this.db.getClientById42(id);
    return this.db.getClientStatsById(client.id);
  }

  @UseGuards(AuthGuard)
  @Get('/fl')
  async getFlForId42(@Request() req: {user: IJWT}) {
    let client = await this.db.getClientById42(req.user.id)
    if (!client)
		return [];
    return this.db.getRelationsByClientId1(client.id);
  }

  @UseGuards(AuthGuard)
  @Get('/blockedusers')
  async getBlockedUser(@Request() req: {user: IJWT}) {
    let client = await this.db.getClientById42(req.user.id)
    if (!client)
      return [];
	return this.db.blockedMemberForClientId(client.id);
  }

  @Get('/getfile/:filename')
  getFile(@Param('filename') fileName: string): StreamableFile {
    try {
      const file = fs.createReadStream(process.cwd() + '/uploads/' + fileName);
      return new StreamableFile(file);
    } catch (error) {
      throw new HttpException(error, 404);
    }
  }

  @Post('/update/:id')
  async changePicture(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: FastifyRequest,
  ) {
    const dto: UpdateClientDto = new UpdateClientDto();
    const data = await req.file();
    const valid_mime: string[] = [
      'image/gif',
      'image/jpeg',
      'image/png',
      'image/bmp',
      'image/tiff',
    ]; // formats that we accept
    if (valid_mime.includes(data.mimetype)) {
      const tmp_name = uuidv4();
      const pump = require('pump');
      await pump(
        data.file,
        fs.createWriteStream(process.cwd() + '/uploads/' + tmp_name),
      );
      dto.img = '/api/dashboard/getfile/' + tmp_name;
      return this.db.updateClient(id, dto);
    }
    throw new BadRequestException();
  }

  @Post('/deleteUser/:id')
  async deleteUser(@Param('id', ParseIntPipe) id: number)
  {
    try{
      return this.db.deleteClientById(id);
    }
    catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('/updateName/:id')
  async changeName(
    @Param('id', ParseIntPipe) id: number,
    @Body() name: string,
  ) {
    if (name.length < 50) {
      const dto: UpdateClientDto = new UpdateClientDto();
      dto.name = name;
      return this.db.updateClient(id, dto);
    }
    throw new BadRequestException();
  }

  @Get('/ranking')
  async getRanking() {
    return this.db.getTop100Scores();
  }

  // @Get('/cookie/:cookie')
  // async getByCookie(@Param('cookie') cookie: string) {
  //   return this.db.getClientByCookie(cookie);
  // }

  @UseGuards(AuthGuard)
  @Get('/name/:name')
  async searchFor(
    @Request() req: { user: IJWT} ,
    @Param('name') name: string,
  ) {
    let client = await this.db.getClientById42(req.user.id);
    return this.db.findClientsByName(client.id, name);
  }

  @UseGuards(AuthGuard)
  @Post('/supprFriendship/:id2')
  async supprFriendship(
    @Request() req: { user: IJWT} ,
    @Param('id2', ParseIntPipe) id2: number,
  ) {
    let client = await this.db.getClientById42(req.user.id);
    if (client.id === id2)
      throw new HttpException('you so funny Larry', HttpStatus.BAD_REQUEST);

    try {
      await this.db.removeClientsFromClient(client.id, id2);
      return HttpStatus.NO_CONTENT;
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/create')
  async createClient(@Body() dto: ClientDto) {
    return this.db.createClient(dto);
  }

  @Post('/relations/create')
  async createRelations(@Body() dto: createRelationsDto) {
    return this.db.createRelation(dto);
  }

  @Post('/stats/create')
  async createStats(@Body() dto: createStatsDto) {
    return this.db.createClientStat(dto);
  }

  @Post('/stats/update/:id')
  async updateStats(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: updateStatDto,
  ) {
    return this.db.updateStat(id, dto);
  }
}
function Autorization() {
  throw new Error('Function not implemented.');
}
