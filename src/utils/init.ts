import { useConfigStore } from "@/stores/config";

const configStore = useConfigStore()

export const setup = async () => {
  configStore.init()
}