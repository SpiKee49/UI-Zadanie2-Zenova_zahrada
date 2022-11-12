import { Gen, Grid, Individual } from './types'

import movement from './movement'

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
    //take one gen a try to make move
    for (let i = 0; i < individual.length; i++) {
        console.log(i)
        if (dontBotherChecking) {
            console.log('dontBotherChecking')
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
            grid,
            i + 1
        )
        dontBotherChecking = stuckOrDone
        numberOfTiles += score
    }

    return numberOfTiles
}

export default fitness
