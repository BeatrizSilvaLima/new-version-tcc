/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.on('/').render('index').as('home')

Route.get('/login', 'AuthController.loginResponse').as('sessions.create')
Route.post('/login', 'AuthController.teste5').as('sessions.store')

Route.get('/register', 'AuthController.signUpResponse').as('users.create')
Route.post('/register', 'AuthController.teste3').as('users.store')

Route.get('/applications/create', 'AccountApplicationsController.create').as('applications.create')
Route.post('/applications', 'AccountApplicationsController.store').as('applications.store')

Route.group(() => {
  Route.get('/applications', 'AccountApplicationsController.index').as('applications.index')
  Route.get('/applications/:id', 'AccountApplicationsController.show').as('applications.show')
}).middleware(['auth:web'])

Route.get('/user', 'UsersController.show').as('users.show').middleware(['auth:web'])

Route.post('/user/token', 'UsersController.generateToken')
  .as('users.token')
  .middleware(['auth:web'])

Route.group(() => {
  Route.get('/logout', 'SessionsController.delete').as('sessions.delete')
}).middleware(['auth:web'])

Route.group(() => {
  Route.get('/users', 'UsersController.index').as('users.index')
}).middleware(['auth:web'])

Route.group(() => {
  Route.get('/skills', 'SkillsController.index').as('skills.index')
  Route.get('/skills/edit/:id', 'SkillsController.update').as('skills.update').where('id', /^[0-9]+$/)
  Route.get('/skills/create', 'SkillsController.create').as('skills.create')
  Route.delete('/skills/:id', 'SkillsController.destroy').as('skills.destroy')
  Route.get('/skills/:id', 'SkillsController.show').as('skills.show').where('id', /^[0-9]+$/)
  Route.post('/skills', 'SkillsController.store').as('skills.store')
}).middleware(['auth:web'])

Route.get('/dashboard', 'AuthController.testeResponse').as('dashboard').middleware('auth:web')

Route.post('/dashboard', 'MonitoredsController.store').middleware('auth:web')

Route.post('/unfollow', 'MonitoredsController.forgetFollow').as('unfollow').middleware('auth:web')

Route.post('/check', 'MonitoredsController.checkMessage').as('check').middleware('auth:web')
