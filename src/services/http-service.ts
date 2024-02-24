import apiClient from "./api-client";

interface Entity {
    id: number;
}

class HttpService {
    endPoint: string;

    constructor(endPoint: string) {
        this.endPoint = endPoint
    }

    getAll<T>() {
        const controller = new AbortController
        const request = apiClient.get<T[]>(this.endPoint, {
            signal: controller.signal,
          });
          return { request, cancel: () => controller.abort()}
    }

    drop(id: number) {
      const repon = apiClient.delete(this.endPoint + "/" + id)
      return repon;
    }     
    
    modify<T extends Entity>(entity: T) {
      const respon = apiClient.patch(`${this.endPoint}/${entity.id}`, entity)
      return respon;
    }
    
    create<T>(entity: T){
      const respon = apiClient.post(this.endPoint, entity)
      return respon;      
    }
}

const create = (endPoint: string) => {
    return new HttpService(endPoint);
}

export default create;