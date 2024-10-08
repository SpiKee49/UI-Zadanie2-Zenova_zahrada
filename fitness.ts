import { Gen, Grid, Individual } from './types'

import movement from './movement'
import { printMap } from './index'

//fittnes function
function fitness(input: Individual, map: Grid) {
    const individual: Individual = input.map((gen): Gen => {
        return {
            position: gen.position,
            decisions: [...gen.decisions],
        }
    })
    let dontBotherChecking: boolean = false
    let grid: Grid = map.map((item) => [...item])
    let numberOfTiles: number = 0

    let direction: string
    let moveIndex: number = 1
    //take one gen a try to make move
    for (let i = 0; i < individual.length; i++) {
        if (dontBotherChecking) {
            break
        }
        if (individual[i].position <= grid.length) {
            //will be going down
            direction = 'DOWN'
        } else if (
            individual[i].position > grid.length &&
            individual[i].position <= grid.length + grid[0].length - 2
        ) {
            //will be going left mainly
            direction = 'LEFT'
        } else if (
            individual[i].position > grid.length + grid[0].length - 2 &&
            individual[i].position <= 2 * grid.length + grid[0].length - 2
        ) {
            //will be going up
            direction = 'UP'
        } else if (
            individual[i].position > 2 * grid.length + grid[0].length - 2 &&
            individual[i].position <= 2 * grid.length + 2 * grid[0].length - 4
        ) {
            //will be going right mainly
            direction = 'RIGHT'
        }

        const { stuckOrDone, score, move } = movement(
            individual[i],
            direction,
            grid,
            moveIndex
        )
        moveIndex += move ? 1 : 0
        dontBotherChecking = stuckOrDone
        numberOfTiles += score
    }

    // if (numberOfTiles > 110) {
    //     console.log('\n' + numberOfTiles)
    //     printMap(grid)
    // }
    return { numberOfTiles, grid }
}

export default fitness
