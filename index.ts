type Grid = Array<Array<string>>

type Gen = {
    position: number
    decisions: Array<string>
}

type Individual = Array<Gen>

type Population = Array<Individual>

//mapa
let map = Array(12).fill(Array(10).fill('_'))

console.log('map keys', map.keys())
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

//fittnes function
function fitness(input: Individual) {
    const individual: Individual = input.map((gen): Gen => {
        return {
            position: gen.position,
            decisions: [...gen.decisions],
        }
    })

    let grind: Grid = map.map((item) => [...item])
    let score: number = 0

    let direction: string
    //take one gen a try to make move
    individual.forEach((gen) => {
        if (gen.position <= 12) {
            //will be going down
            direction = 'DOWN'
        } else if (gen.position > 12 && gen.position <= 20) {
            //will be going left mainly
            direction = 'LEFT'
        } else if (gen.position > 20 && gen.position <= 32) {
            //will be going up
            direction = 'UP'
        } else if (gen.position > 32 && gen.position <= 40) {
            //will be going right mainly
            direction = 'RIGHT'
        }

        movement(gen, direction, grind, score)
    })
    printMap(grind)

    return score
}

//movement function
function movement(
    gen: Gen,
    initialDirection: string,
    globalMap: Grid,
    score: number
) {
    let iter: number = 1
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
        globalMap[11][13 - (gen.position - 1)] === '_'
    ) {
        x = 11
        y = 13 - (gen.position - 1)
    } else if (
        initialDirection == 'RIGHT' &&
        globalMap[0][40 - gen.position - 1] === '_'
    ) {
        y = 40 - (gen.position - 1)
    } else {
        //if we cant start in occupied position
        return 0
    }

    console.log({
        direction,
        pos: gen.position,
        x,
        y,
    })
    console.log('globalMap[x][y]: ', globalMap[x][y])

    // make all the moves for current gen
    while (stuckOrDone != true) {
        if (globalMap[x][y] == '_') {
            //next tile is empty, we can put number of current gen in there
            globalMap[x][y] = iter.toString()

            score += 1
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
        }
        // depending on direction we move to next tile

        if (direction === 'DOWN') {
            y += 1
        } else if (direction === 'UP') {
            y -= 1
        } else if (direction === 'RIGHT') {
            x += 1
        } else if (direction === 'LEFT') {
            y -= 1
        }

        iter += 1
    }
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
