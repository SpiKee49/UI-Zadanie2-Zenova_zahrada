import { Gen, Grid } from './types'

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

    // variable representing if the monk completed his turn or if he got stuck in the mean time
    let stuckOrDone: boolean = false

    //checkout intial direction and calculate starting tile
    if (initialDirection == 'DOWN' && globalMap[gen.position - 1][0] === '_') {
        x = gen.position - 1
    } else if (
        initialDirection == 'UP' &&
        globalMap[
            globalMap.length * 2 + globalMap[0].length - 3 - (gen.position - 1)
        ][globalMap[0].length - 1] === '_'
    ) {
        x = globalMap.length * 2 + globalMap[0].length - 3 - (gen.position - 1)
        y = globalMap[0].length - 1
    } else if (
        initialDirection == 'LEFT' &&
        globalMap[globalMap.length - 1][gen.position - globalMap.length - 1] ===
            '_'
    ) {
        x = globalMap.length - 1
        y = gen.position - globalMap.length - 1
    } else if (
        initialDirection == 'RIGHT' &&
        globalMap[0][
            2 * globalMap.length +
                2 * globalMap[0].length -
                4 -
                (gen.position - 1)
        ] === '_'
    ) {
        y =
            2 * globalMap.length +
            2 * globalMap[0].length -
            4 -
            (gen.position - 1)
    } else {
        //if we cant start in occupied position we continue to the next turn
        return { stuckOrDone: false, score, move: false }
    }

    // make all the moves for current gen
    while (stuckOrDone != true) {
        if (globalMap[x][y] == '_') {
            //current tile is empty, we can put number of current gen in there
            globalMap[x][y] = index.toString()
            score += 1
        } else {
            //if the next tile isn't empty
            if (direction === 'DOWN' || direction === 'UP') {
                y = direction == 'DOWN' ? y - 1 : y + 1
                //check if he can turn in both directions
                if (
                    x - 1 >= 0 &&
                    globalMap[x - 1][y] == '_' &&
                    x + 1 < globalMap.length &&
                    globalMap[x + 1][y] == '_'
                ) {
                    direction = gen.decisions.shift() == 'L' ? 'LEFT' : 'RIGHT'
                } //if not check if left
                else if (x - 1 >= 0 && globalMap[x - 1][y] == '_') {
                    direction = 'LEFT'
                } //if not check if right
                else if (
                    x + 1 < globalMap.length &&
                    globalMap[x + 1][y] == '_'
                ) {
                    direction = 'RIGHT'
                } else {
                    //if monk gets stuck
                    stuckOrDone = true
                }
            } else {
                //same principle as with left or right but with up or down
                x = direction == 'RIGHT' ? x - 1 : x + 1
                if (
                    y - 1 >= 0 &&
                    globalMap[x][y - 1] == '_' &&
                    y + 1 < globalMap[x].length &&
                    globalMap[x][y + 1] == '_'
                ) {
                    direction = gen.decisions.shift() == 'L' ? 'DOWN' : 'UP'
                } else if (y - 1 >= 0 && globalMap[x][y - 1] == '_') {
                    direction = 'UP'
                } else if (
                    y + 1 < globalMap[x].length &&
                    globalMap[x][y + 1] == '_'
                ) {
                    direction = 'DOWN'
                } else {
                    stuckOrDone = true
                }
            }
        }

        // depending on direction we move to next tile
        if (direction === 'DOWN' && y < globalMap[0].length - 1) {
            //have to check for map limits
            y += 1
        } else if (direction === 'UP' && y > 0) {
            y -= 1
        } else if (direction === 'RIGHT' && x < globalMap.length - 1) {
            x += 1
        } else if (direction === 'LEFT' && x > 0) {
            x -= 1
        } else {
            break
        }
    }
    return { stuckOrDone, score, move: true }
}

export default movement
