import hotelsRepository from "../../repositories/hotels-repository";

async function getHotels() {
  return hotelsRepository.getHotelsDB();
}

async function getHotelById(hotelId: number) {
  return hotelsRepository.getHotelByIdDB(hotelId);
}

const hotelsService = { getHotels, getHotelById };

export default hotelsService;
