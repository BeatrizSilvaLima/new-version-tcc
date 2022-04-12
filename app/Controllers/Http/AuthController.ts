import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MonitoredService from 'App/Services/MonitoredService'
import SignUpValidator from 'App/Validators/SignUpValidator'
import User from 'App/Models/User'

export default class AuthController {
  //Para abrir a pagina inicial
  public async teste({ view }: HttpContextContract) {
    return view.render('home')
  }

  //Para abrir a pagina inicial depois de logado
  public async testeResponse({ view, auth }: HttpContextContract) {
    //let followedList = await MonitoredService.getFollow({ auth })
    const followedList = await MonitoredService.refreshTweets({auth})
    view.share({ followedList: followedList})
    return view.render('dashboard')
  }

  //para abrir o signup
  public async signUpResponse({ view }: HttpContextContract) {
    return view.render('users/create')
  }

  //para realizar o signup
  public async teste3({ request, auth, response }: HttpContextContract) {
    const validatedUser = await request.validate(SignUpValidator)
    const user = await User.create(validatedUser)
    await auth.use('web').login(user)
    return response.redirect().toRoute('dashboard')
  }

  //para abrir o login
  public async loginResponse({ view }: HttpContextContract) {
    return view.render('sessions/create')
  }

  //para realizar o login
  public async teste5({ request, auth, response, session }: HttpContextContract) {
    console.log(request.all())
    const { userName, password } = request.all()
    try {
      await auth.use('web').attempt(userName, password)
      return response.redirect().toRoute('dashboard')
    } catch (error) {
      //session.flash('message', 'Login ou senha incorretos')
      session.flash({ errors: { login: 'Login ou senha incorretos' } })
      return response.redirect('back')
    }
  }

  public async testeWindmill({view, auth}){
    const followedList = await MonitoredService.refreshTweets({auth})
    view.share({ followedList: followedList})
    return view.render('public/index')
  }
}
