

describe('Get /characters', function () {

    const characters = [
        {
            name: 'Peter Quill',
            alias: 'Senhor das Estrelas',
            team: ['Guardiões da Galaxia'],
            active: true
        },
        {
            name: 'Marie',
            alias: 'Vampira',
            team: ['X-Men'],
            active: true
        },
        {
            name: 'Stephen Strange',
            alias: 'Doutor Estranho',
            team: ['Vingadores'],
            active: true
        }
    ]

    before(function () {
        cy.populateCharacters(characters)
    })

    it('deve retornar uma lista de personagens', function () {
        cy.getCharacters().then(function (response) {
            expect(response.status).to.eql(200)
            expect(response.body).to.be.a('array')
            expect(response.body.length).greaterThan(0)
        })
    })

    it('deve buscar personagen por nome', function(){
        cy.searchCharacters('Marie').then(function(response){
            expect(response.status).to.eql(200)
            expect(response.body.length).to.eql(1)
            expect(response.body[0].alias).to.eql('Vampira')
            expect(response.body[0].team).to.eql(['X-Men'])
            expect(response.body[0].active).to.eql(true)

        })
    })
})

describe('Get /characters/id', function(){


    const tonyStark = {
        name: 'Tony Stark',
        alias: 'Homem de Ferro',
        team: [
            'Vingadores'
        ],
        active: true
    }

    context('quando tenho um personagem cadastrado', function(){

        before(function(){

            cy.postCharacter(tonyStark).then(function(response){
                Cypress.env('characterId', response.body.character_id)
            })
        })

        it('deve buscar o personagem pelo id', function(){
            const id = Cypress.env('characterId')
            cy.getCharacterById(id).then(function(response){
                expect(response.status).to.eql(200)
                expect(response.body.alias).to.eql('Homem de Ferro')
                expect(response.body.team).to.eql(['Vingadores'])
                expect(response.body.active).to.eql(true)
            })
        })
    })  
    
    it('deve retornar 404 ao buscar por id não cadastrado', function(){
        const id = '62d9bc3fb439e88608057c91'
        cy.getCharacterById(id).then(function(response){
            expect(response.status).to.eql(404)
                
        })
    })
    
})