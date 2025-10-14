/**
 * Mapper to transform API rooms to UI rooms with additional properties
 */

import { ApiRoom, Room, Amenity, Equipment } from '@/types/room';

// Color palette for rooms
const ROOM_COLORS = [
  '#7FB068', // Green
  '#9D8D62', // Brown
  '#6B9BD1', // Blue
  '#8B7355', // Dark brown
  '#E07A5F', // Coral
  '#81B29A', // Teal
];

// Map equipment names to amenity types
const mapEquipmentToAmenities = (equipment: Equipment[]): Amenity[] => {
  const amenities: Amenity[] = [];

  equipment.forEach(item => {
    const lowerName = item.name.toLowerCase();

    if (lowerName.includes('wifi')) {
      amenities.push('wifi');
    }
    if (lowerName.includes('ecran') || lowerName.includes('monitor') || lowerName.includes('écran')) {
      if (!amenities.includes('monitor')) {
        amenities.push('monitor');
      }
    }
    if (lowerName.includes('café') || lowerName.includes('coffee') || lowerName.includes('machine')) {
      if (!amenities.includes('coffee')) {
        amenities.push('coffee');
      }
    }
  });

  return amenities;
};

// Default amenities based on room type (fallback if no equipment)
const getDefaultAmenities = (name: string, description: string): Amenity[] => {
  const lowerName = name.toLowerCase();
  const lowerDesc = description.toLowerCase();
  const amenities: Amenity[] = [];

  if (
    lowerName.includes('réunion') ||
    lowerName.includes('open space') ||
    lowerDesc.includes('réunion')
  ) {
    amenities.push('wifi', 'monitor');
  }

  if (
    lowerName.includes('kitchen') ||
    lowerName.includes('détente') ||
    lowerDesc.includes('détente')
  ) {
    amenities.push('coffee');
  }

  return amenities.length > 0 ? amenities : ['wifi'];
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
  // Map equipment from API
  const equipment: Equipment[] = apiRoom.equipment?.map(eq => ({
    id: eq.id,
    name: eq.name,
    capacity: eq.capacity,
  })) || [];

  // Get amenities from equipment or fallback to default
  const amenities = equipment.length > 0
    ? mapEquipmentToAmenities(equipment)
    : getDefaultAmenities(apiRoom.name, apiRoom.description);

  return {
    id: apiRoom.id,
    name: apiRoom.name,
    description: apiRoom.description,
    available: isRoomAvailable(apiRoom.name),
    amenities: amenities,
    color: ROOM_COLORS[index % ROOM_COLORS.length],
    equipment: equipment,
    createdAt: apiRoom.createdAt,
  };
}

/**
 * Transform array of API rooms to UI rooms
 */
export function mapApiRoomsToRooms(apiRooms: ApiRoom[]): Room[] {
  return apiRooms.map((apiRoom, index) => mapApiRoomToRoom(apiRoom, index));
}
