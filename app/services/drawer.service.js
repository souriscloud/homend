import { Application } from '@nativescript/core'

export const showDrawer = () => {
  const drawerNativeView = Application.getRootView()
  if (drawerNativeView && drawerNativeView.showDrawer) {
    drawerNativeView.showDrawer()
  }
}

export const hideDrawer = () => {
  const drawerNativeView = Application.getRootView()
  if (drawerNativeView && drawerNativeView.closeDrawer) {
    drawerNativeView.closeDrawer()
  }
}
