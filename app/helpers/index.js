
export const AsyncDelay = msToWait => {
  return new Promise(res => setTimeout(res, msToWait))
}
