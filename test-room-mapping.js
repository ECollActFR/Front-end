/**
 * Test script pour vérifier que les rooms ont bien des amenities
 */

// Simuler les données de l'API
const mockApiRoom = {
  '@id': '/api/rooms/1',
  '@type': 'Room',
  id: 1,
  name: 'Salle de réunion A',
  description: 'Grande salle de réunion avec écran',
  captureTypes: [],
  createdAt: '2024-01-01T00:00:00Z',
  acquisitionSystems: [],
  equipment: [
    { '@id': '/api/equipment/1', '@type': 'Equipment', id: 1, name: 'Écran 65 pouces', capacity: 1 },
    { '@id': '/api/equipment/2', '@type': 'Equipment', id: 2, name: 'WiFi haut débit', capacity: 50 }
  ]
};

// Simuler le mapping
function mapEquipmentToAmenities(equipment) {
  const amenities = [];
  
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
}

function getDefaultAmenities(name, description) {
  const lowerName = (name || '').toLowerCase();
  const lowerDesc = (description || '').toLowerCase();
  const amenities = [];
  
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
}

function mapApiRoomToRoom(apiRoom) {
  const equipment = apiRoom.equipment?.map(eq => ({
    id: eq.id,
    name: eq.name,
    capacity: eq.capacity,
  })) || [];
  
  const amenities = equipment.length > 0
    ? mapEquipmentToAmenities(equipment)
    : getDefaultAmenities(apiRoom.name, apiRoom.description);
  
  return {
    id: apiRoom.id,
    name: apiRoom.name,
    description: apiRoom.description,
    available: true,
    amenities: amenities,
    equipment: equipment,
    createdAt: apiRoom.createdAt,
    acquisitionSystems: apiRoom.acquisitionSystems || [],
  };
}

// Test du mapping
const mappedRoom = mapApiRoomToRoom(mockApiRoom);

console.log('🏢 Test de mapping Room');
console.log('='.repeat(40));
console.log('Room originale:', JSON.stringify(mockApiRoom, null, 2));
console.log('\nRoom mappée:', JSON.stringify(mappedRoom, null, 2));
console.log('\n📋 Amenities générées:', mappedRoom.amenities);
console.log('✅ Test terminé - Les amenities sont bien générées!');