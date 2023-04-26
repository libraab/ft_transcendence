import { Controller, Get } from '@nestjs/common';

@Controller('dashboard')
export class DashboardController
{
	@Get('')
	testpage()
	{
		return "this is root dashboard";
	}
	/*

	constructor(instance de bd pour request global,
				et instance de auth pour cookie)

	Get(':id')
	dashboardPage(@Param(validationPipe) id: number)
	{
		// 1 verif is authed
		// si non authed redirect login
		
		// si authed
		// 	si authification == id
		//	alors personnal page prévoir fonctionalité update dans le front

		//	si authentification != id page
		//		alors visiteur



		// si user
		// return user	infos
		//				relations
		//				rooms
		//				bool = true pour update ? 

		// sinon
		// return user public infos
	}

	Post(':id')
	updateProfil(@Param(validationPipe) id: number,
				@Body() updateClientDto : UpdatClientDto)
	{
		// verif si authed
		// sinon
		//	return login page

		// verif si auth == id user

		// si non
		// 		throw 403 Forbidden

		// si oui
		//		update bd

		// return
	}


	------------------------------------------------

	//===> Peut être mettre ces fonctions dans app.controller.
	//		pour ne pas les rendre unique à dashboard

	Post('seekU')
	seekUser()
	{}

	Post('add')
	addUserFl()
	{}

	Post('block')
	blockUser()
	{}

	Post('unblock')
	unblockUser()
	{}

	Post('seekR')
	seekRoom()
	{}

	Post('joinR')
	joinRoom()
	{}

	Posrt('leaveR')
	leaveRoom()
	{}

	------------------------------------------------

	*/

}

