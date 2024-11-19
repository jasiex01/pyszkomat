export interface MenuItem {
  name: string;
  description: string;
  price: number;
  quantity: number;
  photoUrl: string;
}

//GET machines - list of MachineDescription - wszystkie maszyny
export interface MachineDescription {
  id: string; //np. PYSZ001
  lat: number;
  lon: number;
  address: string;
}

//GET restaurants - list of Restaurant - dostepne dla danego pyszkomatu (o konkretnym id)
export interface Restaurant {
  id: string;
  name: string;
  address: string;
  foodType: string; //np. Pizza, Kebab...
  rating: number; //0-5
  photo: string; //url
}

//GET menu - list of RestaurantMenuItem zależne od restaurantId
export interface RestaurantMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  photo: string; //url
}

export interface RestaurantMenuItemOrdered {
  restaurantMenuItemId: string;
  quantity: number;
}

//GET my orders list of MyOrder - wszystkie aktualne (o statusie "W pyszkomacie" lub "W drodze") zamówienia danego klienta (clientId) jeżeli to stosujemy
export interface MyOrder {
  id: string;
  restaurantName: string;
  status: string; //np. "W pyszkomacie", "W drodze" można zmienić na int, "Dostarczono"
  machineInfo: MachineDescription;
  //TODO ustalić format daty
  arrivalTime: string; //godzina dostawy
  expireTime: string; //godzina do odebrania
}

//GET sczegóły zamówienia - na podstawie orderId
export interface MyOrderDetails {
  //Zakomentowane nie są konieczne, można pobrać je z MyOrder
  //machineInfo: MachineDescription;
  //status: string; //np. "W pyszkomacie", "W drodze" można zmienić na int
  //arrivalTime: string; //godzina dostawy
  //expireTime: string; //godzina do odebrania
  items: RestaurantMenuItemOrdered[];
  isHeating: boolean;
}
//POST - set heating order id, można ustawić tylko jeżeli zamówienie ma status "W pyszkomacie"
export interface HeatingOrder {
  orderId: string;
  isHeating: boolean;
}

//POST - odbiór zamówienia, w bazie musi się zmienić status na "Odebrane"
export interface PickupOrder {
  orderId: string;
}
