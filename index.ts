type Grid = Array<Array<string>>

type Gen = {
    position: number
    decisions: Array<string>
}

type Individual = Array<Gen>

type Population = Array<Individual>

//mapa
let map = Array(12).fill(Array(10).fill('_'))

//Starting map print
function printMap(map: Grid) {
    let mapToPrint: Grid = []

    for (let index = 0; index < map[0].length; index++) {
        let row: string[] = []
        map.forEach((item) => row.push(item[index]))
        mapToPrint.push(row)
    }

    mapToPrint.forEach((item) => console.log(item.join(' ')))
}

//starting positions array
const array = Array(40)
    .fill(0)
    .map((_, index) => index + 1)

//function to randomize array
function randomize(array: number[]) {
    return array.sort(() => (Math.random() > 0.5 ? 1 : -1))
}

//population
let population: Population = []

for (let i = 0; i < 100; i++) {
    let individual: number[] = randomize(array)

    population.push(
        individual.map((genPosition): Gen => {
            let decisions: string[] = []
            for (let j = 0; j < 20; j++) {
                decisions.push(Math.floor(Math.random() * 2) == 1 ? 'L' : 'R')
            }

            return {
                position: genPosition,
                decisions: decisions,
            }
        })
    )
}

//fittnes function
function fitness(input: Individual) {
    const index = population.indexOf(input)
    const individual: Individual = input.map((gen): Gen => {
        return {
            position: gen.position,
            decisions: [...gen.decisions],
        }
    })

    let grind = map.map((item) => [...item])
    console.log(grind[0])

    let score: number = 0

    let direction: string
    individual.forEach((gen) => {
        if (gen.position < 12) {
            //will be going down
            direction = 'DOWN'
        } else if (gen.position >= 12 && gen.position < 20) {
            //will be going left mainly
            direction = 'LEFT'
        } else if (gen.position >= 20 && gen.position < 32) {
            //will be going up
            direction = 'UP'
        } else if (gen.position >= 32 && gen.position < 40) {
            //will be going right mainly
            direction = 'RIGHT'
        }

        movement(gen, direction, grind, index, score)
    })
    printMap(grind)
}

//movement function
function movement(
    gen: Gen,
    initialDirection: string,
    globalMap: Grid,
    index: number,
    score: number
) {
    let x: number = 0
    let y: number = 0
    let direction: string = initialDirection
    let stuckOrDone: boolean = false
    console.log({
        genPos: gen.position,
        direction,
    })
    switch (initialDirection) {
        case 'DOWN':
            if (globalMap[gen.position][0] != '_') return 0
            x = gen.position
            break
        case 'UP':
            if (globalMap[31 - gen.position][9] != '_') return 0
            x = 31 - gen.position
            y = 9
            break
        case 'LEFT':
            if (globalMap[11][13 - gen.position] != '_') return 0
            x = 11
            y = 13 - gen.position
            break
        case 'RIGHT':
            if (globalMap[0][40 - gen.position] != '_') return 0
            y = 40 - gen.position
            break
    }

    console.log('v mape > ' + globalMap[x].length)
    printMap(globalMap)

    while (stuckOrDone != true) {
        if (globalMap[x][y] == '_') {
            globalMap[x][y] = index.toString()
            score += 1
            switch (direction) {
                case 'DOWN':
                    y++
                    break
                case 'UP':
                    y--
                    break
                case 'RIGHT':
                    x++
                    break
                case 'LEFT':
                    x--
                    break
            }
        } else {
            switch (direction) {
                case 'DOWN':
                case 'UP':
                    if (
                        x - 1 >= 0 &&
                        globalMap[x - 1][y] == '_' &&
                        x + 1 < globalMap.length &&
                        globalMap[x + 1][y] == '_'
                    ) {
                        direction =
                            gen.decisions.shift() == 'L' ? 'LEFT' : 'RIGHT'
                    } else if (x - 1 >= 0 && globalMap[x - 1][y] == '_') {
                        direction = 'LEFT'
                    } else if (
                        x + 1 < globalMap.length &&
                        globalMap[x + 1][y] == '_'
                    ) {
                        direction = 'RIGHT'
                    } else {
                        stuckOrDone = true
                    }
                    break
                case 'RIGHT':
                case 'LEFT':
                    if (
                        y - 1 >= 0 &&
                        globalMap[x][y - 1] == '_' &&
                        y + 1 < globalMap[x].length &&
                        globalMap[x][y + 1] == '_'
                    ) {
                        direction = gen.decisions.shift() == 'L' ? 'DOWN' : 'UP'
                    } else if (y - 1 >= 0 && globalMap[x][y - 1] == '_') {
                        direction = 'DOWN'
                    } else if (
                        y + 1 < globalMap[x].length &&
                        globalMap[x][y + 1] == '_'
                    ) {
                        direction = 'UP'
                    } else {
                        stuckOrDone = true
                    }
                    break
            }
            switch (direction) {
                case 'DOWN':
                    y++
                    break
                case 'UP':
                    y--
                    break
                case 'RIGHT':
                    x++
                    break
                case 'LEFT':
                    x--
                    break
            }
        }
    }
}

fitness(population[1])
