<template>
  <div class="register-crop-page">
    <div class="header">
      <h1 class="title">{{ $t('registerCrop.title') }}</h1>
      <p class="subtitle">{{ $t('registerCrop.subtitle') }}</p>
    </div>

    <h3 class="section-title">{{ $t('registerCrop.cropInformation') }}</h3>

    <div class="form-grid">
      <div class="left">
        <InputText v-model="form.title" :placeholder="$t('registerCrop.cropTypePlaceholder')" class="w-full mb-3 soft-input" />
        <InputText v-model="form.planting_date" :placeholder="$t('registerCrop.plantingDatePlaceholder')" class="w-full mb-3 soft-input" />
        <InputText v-model="form.harvest_date" :placeholder="$t('registerCrop.harvestDatePlaceholder')" class="w-full soft-input" />
        <!-- Campo status agregado -->
        <Dropdown v-model="form.status" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Selecciona estado" class="w-full mt-3" />
      </div>

      <div class="right">
        <InputText v-model="form.soilType" :placeholder="$t('registerCrop.soilTypePlaceholder')" class="w-full mb-3 soft-input" />
        <InputText v-model="dummySunlight" :placeholder="$t('registerCrop.sunlightPlaceholder')" class="w-full mb-3 soft-input" />
        <InputText v-model="dummyWatering" :placeholder="$t('registerCrop.wateringPlaceholder')" class="w-full soft-input" />
      </div>
    </div>

    <h3 class="section-title">{{ $t('registerCrop.chooseField') }}</h3>

    <div class="fields-grid">
      <div 
        v-for="field in previewFieldsWithStatus" 
        :key="field.id" 
        class="field-card"
        :class="{ selected: form.field === field.title }"
        @click="selectField(field)"
      >
        <div class="image-wrapper">
          <img :src="field.image_url" :alt="field.title" />
          <Tag class="status-badge" :value="field.status" :severity="statusSeverity(field.status)" />
        </div>
        <div class="field-info">
          <div class="field-title">{{ field.title }}</div>
          <div class="field-details">{{ field.crop }} - {{ field.days }} Days</div>
        </div>
      </div>
      <div class="add-field-card">
        <i class="pi pi-plus"></i>
      </div>
    </div>

    <div class="actions">
      <Button :label="$t('registerCrop.cancel')" class="p-button-text" @click="goBack" />
      <Button :label="$t('registerCrop.save')" class="p-button-success" @click="save" :loading="isSubmitting" />
    </div>
  </div>
  <Toast />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useCropStore } from '../stores/crop.store';
import http from '@/services/http-common.js';

const router = useRouter();
const { t: $t } = useI18n();
const toast = useToast();
const cropStore = useCropStore();

const isSubmitting = ref(false);
const form = ref({
  title: '',
  planting_date: '',
  harvest_date: '',
  field: '',
  status: '', // <-- Campo status agregado
  days: '',
  soilType: ''
});

// UX-only placeholders (not saved)
const dummySunlight = ref('');
const dummyWatering = ref('');

const statusOptions = [
  { label: 'Saludable', value: 'Healthy' },
  { label: 'Atención', value: 'Attention' },
  { label: 'Crítico', value: 'Critical' }
];

const fieldOptions = ref([]);
const previewFieldsWithStatus = ref([]);

onMounted(async () => {
  // Options for classic dropdown (not shown, we select by card)
  const { data: fieldsData } = await http.get('/fields');
  fieldOptions.value = fieldsData.map(f => ({ id: f.id, name: f.name }));

  // Build preview cards with status and crop details
  const [{ data: previews }, { data: statuses }, { data: fields }] = await Promise.all([
    http.get('/preview_fields'),
    http.get('/crop_status'),
    http.get('/fields')
  ]);
  
  const statusById = Object.fromEntries(statuses.map(s => [s.id, s.status]));
  const fieldById = Object.fromEntries(fields.map(f => [f.id, f]));
  
  previewFieldsWithStatus.value = previews.map(p => {
    const field = fieldById[p.id];
    return {
      ...p,
      status: statusById[p.id] || 'Healthy',
      crop: field?.crop || 'Unknown',
      days: field?.days_since_planting || '0'
    };
  });
});

function selectField(field) {
  form.value.field = field.title;
}

function statusSeverity(status) {
  switch ((status || '').toLowerCase()) {
    case 'healthy': return 'success';
    case 'attention': return 'warning';
    case 'critical': return 'danger';
    default: return 'info';
  }
}

function goBack() {
  router.push({ name: 'ManageCrops' });
}

async function save() {
  isSubmitting.value = true;
  try {
    // Calcular días automáticamente
    const plantingDate = new Date(form.value.planting_date);
    const harvestDate = new Date(form.value.harvest_date);
    if (isNaN(plantingDate) || isNaN(harvestDate)) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Las fechas son inválidas.', life: 3000 });
      isSubmitting.value = false;
      return;
    }
    // Diferencia en días
    const diffTime = Math.abs(harvestDate - plantingDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    form.value.days = diffDays.toString();
    await cropStore.createCrop(form.value);
    toast.add({ severity: 'success', summary: 'Success', detail: $t('manageCrops.cropCreated'), life: 3000 });
    router.push({ name: 'ManageCrops' });
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Error', detail: $t('manageCrops.errorCreateCrop'), life: 3000 });
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.register-crop-page { padding: 1.5rem; }
.header { margin-bottom: 1.5rem; }
.title { margin: 0 0 .25rem 0; font-size: 2rem; font-weight: 700; }
.subtitle { margin: 0; color: #6c757d; }
.section-title { margin: 1.25rem 0 .75rem 0; font-size: 1.1rem; font-weight: 700; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 1rem; }
.soft-input :deep(input), .soft-input :deep(.p-dropdown-label) { color: #6c757d; }
.actions { margin-top: 2rem; display: flex; gap: .75rem; justify-content: flex-end; }
/* Fields preview */
.fields-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; margin-top: .5rem; }
.field-card { cursor: pointer; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,.08); border: 2px solid transparent; transition: border-color .2s ease; }
.field-card.selected { border-color: #2e7d32; }
.image-wrapper { position: relative; width: 100%; aspect-ratio: 4/3; overflow: hidden; border-radius: 12px 12px 0 0; }
.image-wrapper img { width: 100%; height: 100%; object-fit: cover; display: block; border-radius: 12px 12px 0 0; }
.status-badge { position: absolute; left: .5rem; top: .5rem; }
.field-info { padding: .75rem 1rem; }
.field-title { font-weight: 600; color: #2c3e50; margin-bottom: .25rem; }
.field-details { font-size: .875rem; color: #6c757d; }
.add-field-card { display: flex; align-items: center; justify-content: center; border: 2px dashed #cfd8dc; border-radius: 16px; color: #90a4ae; min-height: 200px; }
.add-field-card i { font-size: 1.5rem; }
@media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } }
</style>
