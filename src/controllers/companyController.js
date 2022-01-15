const companyService = require('../services/company.service')
const { getData, createOrUpdateData } = require('../utils/functions')
module.exports = {
    async index(req, res){
        // #swagger.tags = ['Companies']
        // #swagger.description = 'Endpoint para listar as companhias junto com os dados dos funcionários respectivos.'
        const response = await companyService.resolvePromisesForCompanies()
        return res.status(200).send({companies: response})
    },

    async indexOne(req, res){
        // #swagger.tags = ['Companies']

        const { id } = req.params

        try {
            const company = await companyService.resolvePromisesForCompanies(id)

            if(!company){
                throw new Error('Não tem companhia na lista com esse id')
            }

            return res.status(200).json({company: company})

        } catch (error) {
            console.log(error.message)
            return res.status(400).json({error: error.message})
        }
    },
    async create(req, res){
        // #swagger.auto = false
        // #swagger.tags = ['Companies']
        // #swagger.description = "Endpoint para criar uma companhia junto com os respectivos funcionários"
        /* #swagger.parameters['obj'] = { 
            in: 'body', 
            '@schema': { 
                "required": ["name"], 
                "properties": { 
                    "name": { 
                        "type": "string", 
                        "example": "Dell computadores" 
                    },
                    "age": { 
                        "type": "number", 
                        "example": 4 
                    },
                    "employees": { 
                        "type": "array", 
                        "example": [
                            {
                                "id": 1
                            },
                            {
                                "id": 2
                            }
                        ]
                    },
                    "owner": {
                        "type": "object",
                        "example": {
                            "id": 2
                        }
                    },
                    "state": {
                        "type": "string",
                        "example": "Santa Catarina"
                    }
                } 
            } 
        } */
        const {
            name, age, employees, owner, state
        } = req.body
        const companies = getData('company.json')

        if(!name || !age || !employees || !owner || !state){
            return res.status(400).send(
                {message: 'É obrigatório preencher todos os campos.'}
            )
        }
        const id = companies.length + 1

        const createNewCompany = [
            ...companies, {
                id: id,
                name: name, 
                age: age, 
                employees: employees, 
                owner: owner, 
                state: state
            }
        ]

        createOrUpdateData('company.json', createNewCompany)


        return res.status(200).send({message: 'Empresa criada com sucesso.'})
    },
    async update(req, res){
        // #swagger.tags = ['Companies']
        const { id } = req.params
        const dataForUpdate = req.body
        const companies = getData('company.json')

        try {
            const existCompany = companies.find((company) => company.id === Number(id))

            if(!existCompany){
                throw new Error('Não existe empresa com este ID')
            }

            const companyUpdate = companies.map((item)=>{
                if(item.id === Number(id)){
                    return {...item, ...dataForUpdate}
                }
                return {...item}
            })

            createOrUpdateData('company.json', companyUpdate)


            return res.status(200).send({message: 'Empresa atualizada com sucesso.'})
        } catch (error) {
            return res.status(400).send({error: error.message})
        }
    }
}