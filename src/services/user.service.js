const { getData } = require('../utils/functions')

module.exports = {
    async getUserById(id){
        const users = getData('user.json')
        try {
            const user = users.find((item) => item.id === Number(id))

            if(!user){
                throw new Error('Não tem usuário na lista com esse id')
            }
            return user

        } catch (error) {
            console.log(error.message)
            return { error: error.message }
        }
    }
}