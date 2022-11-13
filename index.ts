import { CurrentlyBest, Gen, GradedPopulation, Grid, Population } from './types'

import fitness from './fitness'

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

//function to randomize array
function randomize(array: number[], maxGens: number) {
    return array.sort(() => (Math.random() > 0.5 ? 1 : -1)).slice(0, 28)
}

let map: Grid = []

//Main function
function solve() {
    const prompt = require('prompt-sync')({ sigint: true })
    const numberOfColumns: string = prompt('Pocet stlpcov (napr. 12): ')
    const numberOfRows: string = prompt('Pocet riadkov (napr. 12): ')
    const rocks: string = prompt('Suradnice kamenov (v tvare x,y|x,y...): ')
    const selection: string = prompt(
        'Metoda vyberu (1 - elitizmus, 2 - turnajovy): '
    )
    console.log('[i] Processing...')
    //mapa
    map = Array.from(Array(+numberOfColumns), () => {
        return Array.from(Array(+numberOfRows), () => {
            return '_'
        })
    })
    rocks.split('|').forEach((item) => {
        const cords = item.split(',').map((item) => Number(item))
        map[cords[0] - 1][cords[1] - 1] = 'R'
    })

    //starting positions array
    const array = Array(+numberOfColumns * 2 + +numberOfRows * 2 - 4)
        .fill(0)
        .map((_, index) => index + 1)

    //population
    let population: Population = []
    let currentlyBest: CurrentlyBest
    //populiation first initialization
    for (let i = 0; i < 100; i++) {
        let individual: number[] = randomize(
            array,
            +numberOfColumns + +numberOfRows + rocks.split('|').length
        )
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

    for (let index = 0; index < 100000; index++) {
        let stop = false
        //fitness above every individual in generation
        const newGeneration: GradedPopulation[] = population.map((item) => {
            const { numberOfTiles, grid } = fitness(item, map)

            if (
                currentlyBest == undefined ||
                currentlyBest.score < numberOfTiles
            ) {
                currentlyBest = { score: numberOfTiles, grid }
            }

            return { individual: item, score: numberOfTiles, grid }
        })
        population =
            selection == '1'
                ? elitism(newGeneration)
                : tournament(newGeneration)
        if (
            stop ||
            newGeneration.find(
                (item) =>
                    item.score >=
                    +numberOfColumns * +numberOfRows - rocks.split('|').length
            )
        )
            break
    }

    console.log('Bestest solution was:')
    console.log('Score ' + currentlyBest.score)
    printMap(currentlyBest.grid)
}

solve()

function elitism(population: GradedPopulation[]) {
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
        const parents = matingPool.sort(() => 0.5 - Math.random()).slice(0, 2)

        //get part where to split chromosomes
        const sliceAt = Math.floor(Math.random() * (parents[0].length - 1) + 1)

        //create 2 new children by crossing
        const child1 = parents[0]
            .slice(0, sliceAt)
            .concat(parents[1].slice(sliceAt))

        const child2 = parents[1]
            .slice(0, sliceAt)
            .concat(parents[0].slice(sliceAt))

        newPopulation.push(child1)
        newPopulation.push(child2)
    }

    mutation(newPopulation)
    return newPopulation
}

function tournament(population: GradedPopulation[]) {
    let newPopulation: Population = []

    while (newPopulation.length < 100) {
        const numbers = []
        const parents: Population = []
        //get 4 indexed for tournament members
        for (let index = 0; index < 4; index++) {
            let random = Math.floor(Math.random() * 99)
            while (numbers.includes(random)) {
                random = Math.floor(Math.random() * 99)
            }
            numbers.push(random)
        }
        parents.push(
            population[numbers[0]].score > population[numbers[1]].score
                ? population[numbers[0]].individual
                : population[numbers[1]].individual
        )
        parents.push(
            population[numbers[2]].score > population[numbers[3]].score
                ? population[numbers[2]].individual
                : population[numbers[3]].individual
        )

        //get part where to split chromosomes
        const sliceAt = Math.floor(Math.random() * (parents[0].length - 1) + 1)

        //create 2 new children by crossing
        const child1 = parents[0]
            .slice(0, sliceAt)
            .concat(parents[1].slice(sliceAt))

        const child2 = parents[1]
            .slice(0, sliceAt)
            .concat(parents[0].slice(sliceAt))

        newPopulation.push(child1)
        newPopulation.push(child2)
    }
    mutation(newPopulation)

    return newPopulation
}

function mutation(population: Population) {
    const mutationChance = 0.1
    for (let individual of population) {
        if (!(mutationChance - Math.random())) continue

        let mutatedPosition: number = 0

        do {
            mutatedPosition = Math.floor(
                Math.random() * (2 * map.length + 2 * map[0].length - 5) + 1
            )
        } while (
            individual.map((item) => item.position).includes(mutatedPosition)
        )
        individual[Math.floor(Math.random() * individual.length)].position =
            mutatedPosition
    }
}
