// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'http://localhost:55555/api/',
  basedomain: 'http://localhost:55555/',
  defaultImageUrl: 'UploadFiles/Item/default.png',
  JSONFileUploadPath: 'http://localhost:55555/uploadfiles/common/',
  // SellerDomain: 'http://localhost:4099/Signin/',
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
