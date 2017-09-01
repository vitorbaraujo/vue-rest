/* eslint-disable no-unused-vars */
/* eslint-disable  no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import Vue from 'vue';
import axios from 'axios';
import mixins from './mixins';

const VueRest = {
  install: (Vue, options) => {
    if (Vue.vueRestInstalled) {
      return;
    }

    Vue.vueRestInstall = true;
    Object.keys(mixins).forEach((apiMixin) => {
      Vue.mixin(apiMixin);
    });

    if (options && options.axiosOptions) {
      const api = axios.create({
        ...options.axiosOptions,
      });
      if (options.axiosOptions.localStorageAuthorization) {
        const localStorageAuthorization = options.axiosOptions.localStorageAuthorization;
        api.interceptors.request.use((config) => {
          const token = localStorage.getItem(localStorageAuthorization.tokenItem);
          const prefix = localStorageAuthorization.prefix;
          if (!localStorageAuthorization.tokenItem || !prefix) {
            console.error('[ERR - VueRest]: Miss configuration at localStorageAuthorization.');
          }
          if (token) {
            Object.assign(config.headers, { Authorization: `${prefix} ${token}` });
          }
        });
      }
      Vue.api = api;
      Vue.prototype.$api = api;
    }
  },
};

export default VueRest;