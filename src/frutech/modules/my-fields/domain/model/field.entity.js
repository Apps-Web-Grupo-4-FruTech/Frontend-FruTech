export class Field {
  constructor({
    id,
    name,
    imageUrl,
    cropName,
    location,
    fieldSize,
    status,
    soilType,
    sunlight,
    watering,
    plantingDate,
    expectingHarvest,
    daysSincePlanting,
    product,
    crop,
    field_size,
    planting_date,
    expecting_harvest,
    days_since_planting
  }) {
    if (id === undefined || id === null) {
      throw new Error('Field id is required');
    }
    if (typeof id !== 'number' || id < 0) {
      throw new Error('Field id must be a positive number');
    }
    if (!name || typeof name !== 'string' || name.trim() === '') {
      throw new Error('Field name is required and must be a non-empty string');
    }

    this.id = id;
    this.name = name.trim();
    this.imageUrl = imageUrl || '';
    this.cropName = cropName || crop || 'No Crop';
    this.crop = cropName || crop || 'No Crop';
    this.product = product || cropName || crop || 'No Crop';
    this.location = location || '';
    this.fieldSize = fieldSize || field_size || 0;
    this.field_size = fieldSize || field_size || 0;
    this.status = this.validateStatus(status);
    this.soilType = soilType || '';
    this.sunlight = sunlight || '';
    this.watering = watering || '';
    this.plantingDate = plantingDate || planting_date || '';
    this.planting_date = plantingDate || planting_date || '';
    this.expectingHarvest = expectingHarvest || expecting_harvest || '';
    this.expecting_harvest = expectingHarvest || expecting_harvest || '';
    this.daysSincePlanting = daysSincePlanting || days_since_planting || 0;
    this.days_since_planting = daysSincePlanting || days_since_planting || 0;
  }

  validateStatus(status) {
    const validStatuses = ['Healthy', 'Attention', 'Critical'];
    if (!status || typeof status !== 'string' || status.trim() === '') {
      return 'Disponible';
    }
    return validStatuses.includes(status) ? status : 'Disponible';
  }

  isHealthy() {
    return this.status === 'Healthy';
  }

  needsAttention() {
    return this.status === 'Attention';
  }

  isCritical() {
    return this.status === 'Critical';
  }
}
