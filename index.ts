import { Gen, GradedPopulation, Grid, Individual, Population } from './types'

import fitness from './fitness'

//mapa
let map = Array.from(Array(12), () => {
    return Array.from(Array(10), () => {
        return '_'
    })
})
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
    return array.sort(() => (Math.random() > 0.5 ? 1 : -1)).slice(0, 28)
}

//Main function
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
    const newGeneration: GradedPopulation[] = population.map((item) => {
        return { individual: item, score: fitness(item, map) }
    })

    elitism(newGeneration)
}

solve()

function elitism(population: GradedPopulation[]) {
    const mutationChance = 0.1
    let newPopulation: Population = []

    //get top 20 best results from last generation
    let matingPool: Population = [
        ...population
            .sort((a, b) => b.score - a.score)
            .slice(0, 20)
            .map((item) => item.individual),
    ]
    //Create new generation from matingPool
    while (newPopulation.length < 100) {
        //get two random elements
        let parents = matingPool.sort(() => 0.5 - Math.random()).slice(0, 2)

        //get part where to split chromosomes
        const sliceAt = Math.floor(Math.random() * (parents[0].length - 1))

        //create 2 new children by crossing
        let child1 = parents[0]
            .slice(0, sliceAt)
            .concat(parents[1].slice(sliceAt))

        let child2 = parents[1]
            .slice(0, sliceAt)
            .concat(parents[0].slice(sliceAt))

        console.log(child1.length)
        break
    }
}
