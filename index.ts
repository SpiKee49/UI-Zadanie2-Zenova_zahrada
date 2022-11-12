import { Gen, Grid, Population } from './types'

import fitness from './fitness'

//mapa
let map = Array(12).fill(Array(10).fill('_'))
map[1][2] = 'R'
map[2][4] = 'R'
map[4][3] = 'R'
map[5][1] = 'R'
map[8][6] = 'R'
map[9][6] = 'R'
//Starting map print
export function printMap(map: Grid) {
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

//movement function

function solve() {
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

    fitness(population[0], map)
}

solve()
