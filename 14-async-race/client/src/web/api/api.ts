import { ICar, ICreateCar, IGetCars, ICarEngine } from '../interfaces'

const url = 'http://localhost:3000'

/* ====================== GARAGE ====================== */

export const getAllCars = async (page = 1, limit = 7): Promise<IGetCars | null> => {
  try {
    const data = await fetch(`${url}/garage?_limit=${limit}&_page=${page}`)
    const res: ICar[] = await data.json()

    if (data.status === 200) {
      return {
        cars: res,
        count: data.headers.get('X-Total-Count') || '0'
      }
    }

    return null
  } catch (err) {
    const error = err as string | undefined
    throw new Error(error)
  }
}

export const createCar = async (car: ICreateCar): Promise<void> => {
  try {
    await fetch(`${url}/garage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(car)
    })
  } catch (err) {
    const error = err as string | undefined
    throw new Error(error)
  }
}

export const deleteCar = async (carId: number): Promise<void> => {
  try {
    await fetch(`${url}/garage/${carId}`, { method: 'DELETE' })
  } catch (err) {
    const error = err as string | undefined
    throw new Error(error)
  }
}

export const updateCar = async (car: ICar): Promise<void> => {
  try {
    await fetch(`${url}/garage/${car.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(car)
    })
  } catch (err) {
    const error = err as string | undefined
    throw new Error(error)
  }
}

export const startCarEngine = async (id: number): Promise<{ status: number; result: ICarEngine }> => {
  try {
    const data = await fetch(`${url}/engine?id=${id}&status=started`, { method: 'PATCH' })
    const res: ICarEngine = await data.json()

    return { status: data.status, result: res }
  } catch (err) {
    const error = err as string | undefined
    throw new Error(error)
  }
}

export const stopCarEngine = async (carId: number): Promise<{ status: number; result: ICarEngine }> => {
  try {
    const data = await fetch(`${url}/engine?id=${carId}&status=stopped`, { method: 'PATCH' })
    const res: ICarEngine = await data.json()

    return { status: data.status, result: res }
  } catch (err) {
    const error = err as string | undefined
    throw new Error(error)
  }
}

export const driveCar = async (id: number): Promise<number> => {
  try {
    const data = await fetch(`${url}/engine?id=${id}&status=drive`, { method: 'PATCH' })
    return data.status
  } catch (err) {
    const error = err as string | undefined
    throw new Error(error)
  }
}
