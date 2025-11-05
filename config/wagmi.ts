import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Pokemon DApp",
  projectId: "pokemon-dapp",
  chains: [sepolia],
  ssr: true,
});
