export type Grid = Array<Array<string>>

export type Gen = {
    position: number
    decisions: Array<string>
}

export type Individual = Array<Gen>

export type Population = Array<Individual>

export type GradedPopulation = {
    individual: Individual
    score: number
}
