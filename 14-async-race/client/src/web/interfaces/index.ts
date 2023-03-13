export interface ICar {
  id: number
  name: string
  color: string
}

export interface ICreateCar {
  name: string
  color: string
}

export interface IGetCars {
  cars: Array<ICar>
  count: string
}

export interface ICarEngine {
  velocity: number
  distance: number
}
