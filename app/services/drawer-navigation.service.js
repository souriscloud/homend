import { fromObject, Observable } from '@nativescript/core/data/observable'

export function DrawerNavigationService() {
  if (DrawerNavigationService._instance) {
    console.log('[DRAWER-NAVIGATION-SERVICE]', 'Using instance instead of creating new')
    return DrawerNavigationService._instance
  }

  this.drawerNavigationData = fromObject({ activePage: '' })

  this.updateActivePage = function (newActivePage) {
    this.drawerNavigationData.setProperty('activePage', newActivePage)
  }

  this.subscribe = function (handler) {
    this.drawerNavigationData.addEventListener(Observable.propertyChangeEvent, handler)
  }

  this.unsubscribe = function (handler) {
    this.drawerNavigationData.removeEventListener(Observable.propertyChangeEvent, handler)
  }
}

DrawerNavigationService.getInstance = function () {
  return DrawerNavigationService._instance
}

DrawerNavigationService._instance = new DrawerNavigationService()
