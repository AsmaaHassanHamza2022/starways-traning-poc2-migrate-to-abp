import { Environment } from '@abp/ng.core';

const baseUrl = location.origin;

const oAuthConfig = {
  issuer: 'https://dev-auth-inspection.starwayseg.com/',
  redirectUri: baseUrl,
  clientId: 'Angular',
  responseType: 'code',
  scope:
    'offline_access openid profile email phone AccountService  AdministrationService SaasService ',
  requireHttps: true,
};

export const environment = {
  production: false,
  application: {
    baseUrl,
    name: 'Inspection',
  },
  oAuthConfig,
  apis: {
    default: {
      url: 'http://dev-gateway-inspection.starwayseg.com',
      rootNamespace: 'ELM.Inspection',
    },
    AbpAccountPublic: {
      url: oAuthConfig.issuer,
      rootNamespace: 'AbpAccountPublic',
    },
    ProductService: {
      url: 'http://dev-gateway-inspection.starwayseg.com/',
      rootNamespace: 'ELM.Inspection.ProductService',
    },
  },
} as Environment;
