// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MonitoredValidator from 'App/Validators/MonitoredValidator'
import MonitoredService from 'App/Services/MonitoredService'

export default class MonitoredsController {
  public async store({ request, response, auth, session }: HttpContextContract) {
    request.all().monitorId = auth.user?.id
    request.all().socialMedia = 'twitter'
    request.all().active = true
    await request.validate(MonitoredValidator)
    await MonitoredService.postFollow({ request, session, auth })
    return response.redirect('back')
  }

  public async forgetFollow({request, response, auth}: HttpContextContract){
    await MonitoredService.stopFollow( { request, auth})
    //console.log(request.all())
    return response.redirect('back')
  }

  public async checkMessage({request, response, auth}: HttpContextContract){
    await MonitoredService.checkMessages( { request, auth})
    //console.log(request.all())
    return response.redirect('back')
  }

}
