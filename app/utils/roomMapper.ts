/**
 * Mapper to transform API rooms to UI rooms with additional properties
 */

import { ApiRoom, Room, Amenity } from '@/types/room';

// Color palette for rooms
const ROOM_COLORS = [
  '#7FB068', // Green
  '#9D8D62', // Brown
  '#6B9BD1', // Blue
  '#8B7355', // Dark brown
  '#E07A5F', // Coral
  '#81B29A', // Teal
];

// Default amenities based on room type
const getDefaultAmenities = (name: string, description: string): Amenity[] => {
  const lowerName = name.toLowerCase();
  const lowerDesc = description.toLowerCase();
  const amenities: Amenity[] = ['wifi']; // All rooms have wifi

  if (
    lowerName.includes('réunion') ||
    lowerName.includes('open space') ||
    lowerDesc.includes('réunion')
  ) {
    amenities.push('monitor');
  }

  if (
    lowerName.includes('kitchen') ||
    lowerName.includes('détente') ||
    lowerDesc.includes('détente')
  ) {
    amenities.push('coffee');
  }

  return amenities;
};



// Check if room is available (could be extended with real-time availability)
const isRoomAvailable = (name: string): boolean => {
  // For now, all rooms are available except some specific ones
  // This could be extended to check real availability from another API endpoint
  return true;
};

/**
 * Transform API room to UI room
 */
export function mapApiRoomToRoom(apiRoom: ApiRoom, index: number): Room {
  return {
    id: apiRoom.id,
    name: apiRoom.name,
    description: apiRoom.description,
    available: isRoomAvailable(apiRoom.name),
    amenities: getDefaultAmenities(apiRoom.name, apiRoom.description),
    color: ROOM_COLORS[index % ROOM_COLORS.length],
  };
}

/**
 * Transform array of API rooms to UI rooms
 */
export function mapApiRoomsToRooms(apiRooms: ApiRoom[]): Room[] {
  return apiRooms.map((apiRoom, index) => mapApiRoomToRoom(apiRoom, index));
}
