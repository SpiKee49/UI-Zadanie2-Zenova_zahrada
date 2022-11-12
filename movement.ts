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
    let stuckOrDone: boolean = false

    //checkout intial direction and calculate starting tile
    // console.log({
    //     genPos: gen.position - 1,
    // })
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
        return { stuckOrDone: false, score, move: false }
    }

    // make all the moves for current gen
    while (stuckOrDone != true) {
        // console.log({ direction, x, y })
        if (globalMap[x][y] == '_') {
            //next tile is empty, we can put number of current gen in there
            globalMap[x][y] = index.toString()

            score += 1
        } else {
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
                } else if (x - 1 >= 0 && globalMap[x - 1][y] == '_') {
                    //if not check if left
                    direction = 'LEFT'
                } else if (
                    x + 1 < globalMap.length && //if not check if right
                    globalMap[x + 1][y] == '_'
                ) {
                    direction = 'RIGHT'
                } else {
                    //if he gets stuck
                    // console.log('down or up cant continue')

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
                    // console.log('left or right cant continue ')
                    stuckOrDone = true
                }
            }
        }
        // depending on direction we move to next tile

        if (direction === 'DOWN' && y < 9) {
            y += 1
        } else if (direction === 'UP' && y > 0) {
            y -= 1
        } else if (direction === 'RIGHT' && x < 11) {
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
