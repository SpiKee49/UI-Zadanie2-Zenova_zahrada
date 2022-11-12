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

    mapToPrint.forEach((item) => {
        console.log(
            item
                .map((item) =>
                    item != '_' && +item >= 10 ? `${item} ` : ` ${item} `
                )
                .join('')
        )
    })
}

//starting positions array
const array = Array(40)
    .fill(0)
    .map((_, index) => index + 1)

//function to randomize array
function randomize(array: number[]) {
    return array.sort(() => (Math.random() > 0.5 ? 1 : -1))
}

//fittnes function
function fitness(input: Individual) {
    const individual: Individual = input.map((gen): Gen => {
        return {
            position: gen.position,
            decisions: [...gen.decisions],
        }
    })
    let dontBotherChecking: boolean = false
    let grind: Grid = map.map((item) => [...item])
    let numberOfTiles: number = 0

    let direction: string
    //take one gen a try to make move
    for (let i = 0; i < individual.length; i++) {
        if (dontBotherChecking) {
            break
        }

        if (individual[i].position <= 12) {
            //will be going down
            direction = 'DOWN'
        } else if (
            individual[i].position > 12 &&
            individual[i].position <= 20
        ) {
            //will be going left mainly
            direction = 'LEFT'
        } else if (
            individual[i].position > 20 &&
            individual[i].position <= 32
        ) {
            //will be going up
            direction = 'UP'
        } else if (
            individual[i].position > 32 &&
            individual[i].position <= 40
        ) {
            //will be going right mainly
            direction = 'RIGHT'
        }

        const { stuckOrDone, score } = movement(
            individual[i],
            direction,
            grind,
            i + 1
        )
        dontBotherChecking = stuckOrDone
        numberOfTiles += score
    }

    return numberOfTiles
}

//movement function
function movement(
    gen: Gen,
    initialDirection: string,
    globalMap: Grid,
    index: number
) {
    let score: number = 0
    let x: number = 0
    let y: number = 0
    let direction: string = initialDirection
    let stuckOrDone: boolean = false

    //checkout intial direction and calculate starting tile
    if (initialDirection == 'DOWN' && globalMap[gen.position - 1][0] === '_') {
        x = gen.position - 1
    } else if (
        initialDirection == 'UP' &&
        globalMap[31 - (gen.position - 1)][9] === '_'
    ) {
        x = 31 - (gen.position - 1)
        y = 9
    } else if (
        initialDirection == 'LEFT' &&
        globalMap[11][gen.position - 11] === '_'
    ) {
        x = 11
        y = gen.position - 11
    } else if (
        initialDirection == 'RIGHT' &&
        globalMap[0][40 - (gen.position - 1)] === '_'
    ) {
        y = 40 - (gen.position - 1)
    } else {
        //if we cant start in occupied position
        console.log('Skipped')
        console.log({
            index,
            pos: gen.position,
            direction,
            x,
            y,
        })
        return { stuckOrDone: false, score }
    }
    console.log('\n----------------\n')
    console.log({
        pos: gen.position,
        direction,
        x,
        y,
    })

    // make all the moves for current gen
    while (stuckOrDone != true) {
        if (globalMap[x][y] == '_') {
            //next tile is empty, we can put number of current gen in there
            globalMap[x][y] = index.toString()

            score += 1
        } else {
            if (direction === 'DOWN' || direction === 'UP') {
                if (
                    x - 1 >= 0 &&
                    globalMap[x - 1][y] == '_' &&
                    x + 1 < globalMap.length &&
                    globalMap[x + 1][y] == '_'
                ) {
                    direction = gen.decisions.shift() == 'L' ? 'LEFT' : 'RIGHT'
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
            } else {
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
            }
        }
        // depending on direction we move to next tile
        if (direction === 'DOWN') {
            y += 1
        } else if (direction === 'UP') {
            y -= 1
        } else if (direction === 'RIGHT') {
            x += 1
        } else if (direction === 'LEFT') {
            x -= 1
        }
    }
    printMap(globalMap)
    return { stuckOrDone, score }
}

function main() {
    //population
    let population: Population = []

    //populiation initialization
    for (let i = 0; i < 100; i++) {
        let individual: number[] = randomize(array)

        population.push(
            individual.map((genPosition): Gen => {
                let decisions: string[] = []
                for (let j = 0; j < 20; j++) {
                    decisions.push(
                        Math.floor(Math.random() * 2) == 1 ? 'L' : 'R'
                    )
                }

                return {
                    position: genPosition,
                    decisions: decisions,
                }
            })
        )
    }

    fitness(population[0])
}

main()
