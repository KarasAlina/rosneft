<template>
  <div>
    <b-row class="mb-1">
      <b-col>
        <div class="d-flex justify-content-end">
          <!-- Экспорт в CSV -->
          <DataExport :config="forExport" />
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-table
          :items="items"
          :fields="fields"
          no-border-collapse
          style="border-spacing: 1rem 0rem; margin: 0 -1rem; width: calc(100% + 2rem);"
          class="text-nowrap"
        >
          <template #table-colgroup="scope">
            <col
              v-for="(field, i) in scope.fields"
              :key="i"
              :span="field.key === 'name' ? 1 : 3"
            >
          </template>
          <template #head()="data">
            <div class="p-1">{{ data.label }}</div>
            <div class="d-flex w-100">
              <div
                v-for="(field, i) in fieldsInner"
                :key="i"
                :style="{ flex: field.key === 'percent' || field.key === 'percent2' ? '2' : '3'}"
                class="py-75 px-1"
              >
                {{field.label}}
              </div>
            </div>
          </template>
          <template #head(name)="data">
            <span class="text-nowrap">{{ data.label }}</span>
          </template>
          <template #cell()="data">
            <!-- <b-table
              :items="data.value"
              :bordered="false"
              :fields="fieldsInner"
              thead-class="d-none"
            >
              <template #table-colgroup="scope">
                <col
                  v-for="(field, i) in scope.fields"
                  :key="i"
                  :style="{ width: field.key === 'percent' || field.key === 'percent2' ? '100px' : '40%'}"
                >
              </template>
            </b-table> -->
            <div class="d-flex w-100">
              <div
                v-for="(field, name, i) in data.value[0]"
                :key="i"
                :style="{ flex: name === 'percent' || name === 'percent2' ? '2' : '3'}"
                class="py-75 px-1 border-left"
                :class="{'border-right': (i + 1) === Object.entries(data.value[0]).length}"
              >
                {{field}}
              </div>
            </div>
          </template>
          <template #cell(name)="data">
            <span class="text-nowrap">{{ data.value }}</span>
          </template>
        </b-table>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import {
  BRow, BCol, BTable,
} from 'bootstrap-vue';

export default {
  props: ['config', 'forExport'],
  data: () => ({
    fields: [],
    fieldsInner: [],
    items: [],
  }),
  methods: {
    getData() {
      this.fields = Object.entries(this.config.groupby).map(([key, value]) => ({
        key,
        label: value,
        tdClass: 'p-0 border-left-0 border-right-0',
        thClass: 'text-center p-0',
      }));
      this.fieldsInner = Object.entries(this.config.columns).map(([key, value]) => ({
        key,
        label: value.title,
        thClass: 'border-bottom-0 px-1 py-75',
        tdClass: 'border-bottom-0 border-top-0 px-1 py-75',
      }));
      this.fields.unshift({
        key: 'name',
        label: 'Регион',
      });
      Object.values(this.config.data[0]).forEach((element) => {
        const el = element;
        Object.entries(element).forEach((entry) => {
          const [key, value] = entry;
          el[key] = value;
          if (typeof value === 'object') {
            const newVal = [];
            newVal.push(value);
            el[key] = newVal;
          }
        });
        this.items.push(el);
      });
    },
  },
  mounted() {
    this.getData();
    console.log(this.config);
  },
  components: {
    DataExport: () => import('@/components/DataExport.vue'),
    BRow,
    BCol,
    BTable,
  },
};
</script>

<style lang="scss" scoped>

</style>
