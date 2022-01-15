const { getData, createOrUpdateData, responder } = require('../utils/functions')
const { translate } = require('../utils/constants')
const userService = require('../services/user.service')
const axios = require('axios')
const xlsxPopulate = require('xlsx-populate')

module.exports = {
    async index(req, res){
        // #swagger.tags = ['Users']
        const users = getData('user.json')
        responder(res, 200, {users: users})
    },
    
    async indexOne(req, res){
        // #swagger.tags = ['Users']

        const { id } = req.params
        try {
            const response = await userService.getUserById(id)
            return res.status(200).json(response)

        } catch (error) {
            console.log(error.message)
            return res.status(400).json({error: error.message})
        }
    },

    async create(req, res){
        // #swagger.tags = ['Users']

        const { name, age, job, state } = req.body;
        const existKeyValue = Object.keys(req.body).filter((item) => !req.body[item])
        const translateOptions = existKeyValue.map((item) => translate[item])

        if(existKeyValue.length > 0){
            return res.status(400).send(
                {
                    message: `É necessário enviar o(s) seguinte(s) ${translateOptions.join(', ')}`
                })
        }
        // TODO - DOING - CODE REVIEW - TEST - DEPLOY - DONE


        //Desenvolvimento, Pre produção, Produção, Local


        const users = getData('user.json')
        const createNewUser = [
            ...users, {
                id: users.length + 1,
                name: name,
                age: age,
                job: job,
                state: state
            }
        ]
        createOrUpdateData('user.json', createNewUser)
        return res.status(201).send({message: 'Usuário salvo com sucesso.'})
    },

    async updateOne(req, res){
        // #swagger.tags = ['Users']

        const { id } = req.params
        const users = getData('user.json')
        
        const existUser = users.find((item) => item.id === Number(id))
        
        const dataForUpdate = req.body

        if(!existUser){
            return res.status(200).send({message: "Não houve mudança de dados"})
        }

        const updateUsersList = users.map((item)=>{
            if(item.id === Number(id)){
                return {...item, ...dataForUpdate}
            }
            else{
                return {...item}
            }
        })
        createOrUpdateData(updateUsersList)
        return res.status(200).send({message: "Usuário atualizado com sucesso."})
    },

    async deleteOne(req, res){
        // #swagger.tags = ['Users']

        const { id } = req.params;

        const users = getData('user.json')
        const findUser = users.find((item) => item.id === Number(id))
       
        if(!findUser){
            return res.status(400).send({message: "Usuário não pode ser deletado."})
        }

        const removeOnlyOneUserByUsers = users.filter((item) => item.id !== Number(id))
  
        createOrUpdateData(removeOnlyOneUserByUsers)
        return res.status(200).send({message: "Usuário deletado com sucesso."})
    },

    async getByFilter(req, res){
        // #swagger.tags = ['Users']

        const users = getData('user.json')
        const { job, state, ageMin, ageMax } = req.query
        
        if((ageMin && ageMax) && ageMax < ageMin){
            return res.status(400).send({message: 'O ageMax não pode ser menor que ageMin'})
        }

        let filterUsers = users

        if(ageMin || ageMax){
            filterUsers = filterUsers.filter((item) => {
                const existAgeMax = ageMax ? item.age <= Number(ageMax) : item.age >= Number(ageMin)
                const existAgeMin = ageMin ? item.age >= Number(ageMin) : item.age <= Number(ageMax)
                return existAgeMax && existAgeMin            
            })
        }
        if(state){
            filterUsers = filterUsers.filter((item) => item.state === state)
        }
        if(job){
            filterUsers = filterUsers.filter((item) => item.job === job)
        }
    
        return res.status(200).send({users: filterUsers})
    },
    async getExternalApi(req, res){
        const info = await axios.default.get('https://random-data-api.com/api/users/random_user')
        const { email, avatar, phone_number, first_name } = info.data
        const hasInfo = {
            email, avatar, phone_number, first_name 
        }
        return res.status(200).send(hasInfo)
    },
    async createUserWithExternalApi(req, res){
        const info = await axios.default.get('https://random-data-api.com/api/users/random_user/?size=30')
        const users = getData('user.json')

        info.data.map((info)=> {
          const data = {
                id: info.id,
                name: `${info.first_name} ${info.last_name}`,
                job: info.employment.title,
                state: info.address.state,
                age: new Date().getFullYear() - new Date(info.date_of_birth).getFullYear()
            }
            users.push(data)
        })

        createOrUpdateData('user.json', users)

        return res.status(200).send(users)
    },
    async importUsers(req, res){
        const xlsxBuffer = req.file.buffer
        const xlsxData = await xlsxPopulate.fromDataAsync(xlsxBuffer)
        const rows = xlsxData.sheet(0).usedRange().value()

        const [ firstRow ] = rows
        const keys = ['name', 'age', 'job', 'state'];
        const existAllKeys = firstRow.every((item, index) => {
            return keys[index] === item
        })
        
        if(!existAllKeys || firstRow.length !== 4){
            return res.status(400).send({message: 'É necessário enviar todos os campos e escritos corretamente'})
        }

        const users = getData('user.json')
        const filterRows = rows.filter((_, index) => index !== 0)

        filterRows.map((row) => {
            const result = row.map((cell, index) => {
                return {
                    [firstRow[index]]: cell ? cell : ''
                }
            })
            const objectUser = Object.assign({}, { id: users.length + 1 }, ...result)
            users.push(objectUser)
        })
        createOrUpdateData('user.json', users)

        return res.status(200).send({message: 'Usuários salvos com sucesso'})
    }
}