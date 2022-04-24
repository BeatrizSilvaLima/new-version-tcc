/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

import View from '@ioc:Adonis/Core/View'

View.global('projectName', 'Monitorages')

View.global('menu', [
  {
    url: 'dashboard',
    text: 'Home',
    icon: 'components/svg/home',
  },
  {
    text: 'Usuários',
    icon: 'components/svg/users',
    options: [
      {
        url: 'users.index',
        text: 'Consultar',
      },
      {
        url: 'applications.index',
        text: 'Aplicações',
      },
    ],
  },
])
